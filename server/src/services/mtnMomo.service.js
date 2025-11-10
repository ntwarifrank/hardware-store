import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import paymentConfig from '../config/payment.config.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

/**
 * MTN Mobile Money Payment Service
 * Handles real-time payment processing with MTN MoMo API
 */
class MTNMomoService {
  constructor() {
    this.config = paymentConfig.mtn;
    this.baseURL = this.config.apiUrl;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Get access token for MTN MoMo API with retry logic
   */
  async getAccessToken(retryCount = 0) {
    try {
      // Check if token is still valid (with 5 min buffer)
      if (this.token && this.tokenExpiry && Date.now() < (this.tokenExpiry - 300000)) {
        return this.token;
      }

      const auth = Buffer.from(
        `${this.config.apiUser}:${this.config.apiKey}`
      ).toString('base64');

      const response = await axios.post(
        `${this.baseURL}/collection/token/`,
        {},
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000 || 3600000);

      logger.info('MTN MoMo access token obtained successfully');
      return this.token;
    } catch (error) {
      logger.error('Failed to get MTN MoMo access token:', {
        error: error.response?.data || error.message,
        attempt: retryCount + 1
      });
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        logger.info(`Retrying token request in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getAccessToken(retryCount + 1);
      }
      
      throw new Error('Failed to authenticate with MTN MoMo after multiple attempts');
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const rwandaPattern = /^(\+?250|0)?7[238]\d{7}$/;
    return rwandaPattern.test(cleaned);
  }

  /**
   * Request payment from customer with validation and retry
   * @param {Object} paymentData - Payment request data
   * @returns {Promise<Object>} Payment response
   */
  async requestPayment(paymentData, retryCount = 0) {
    try {
      const { amount, phoneNumber, orderId, customerName, customerEmail } = paymentData;

      // Validate inputs
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid Rwanda phone number format. Use format: 078XXXXXXX or 073XXXXXXX or 072XXXXXXX');
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const token = await this.getAccessToken();
      const referenceId = uuidv4();

      const requestBody = {
        amount: amount.toString(),
        currency: this.config.currency,
        externalId: orderId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage: `Payment for BuildMart Order ${orderId}`,
        payeeNote: `Order ${orderId} - ${customerName}`,
      };

      logger.info(`Requesting MTN MoMo payment: ${referenceId}`, {
        orderId,
        amount,
        phone: this.maskPhoneNumber(formattedPhone),
        attempt: retryCount + 1
      });

      const response = await axios.post(
        `${this.baseURL}/collection/v1_0/requesttopay`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      logger.info(`MTN MoMo payment request sent successfully: ${referenceId}`);

      return {
        success: true,
        referenceId,
        status: 'PENDING',
        message: 'Payment request sent to customer phone. Please check your phone and authorize the payment.',
        expiresAt: Date.now() + 180000, // 3 minutes
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      logger.error('MTN MoMo payment request failed:', {
        error: errorMessage,
        orderId: paymentData.orderId,
        attempt: retryCount + 1,
        statusCode: error.response?.status
      });
      
      // Retry on network errors or 5xx errors
      const shouldRetry = (
        (!error.response || error.response.status >= 500) && 
        retryCount < 2 &&
        !error.message.includes('Invalid')
      );
      
      if (shouldRetry) {
        const delay = Math.pow(2, retryCount) * 1000;
        logger.info(`Retrying payment request in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.requestPayment(paymentData, retryCount + 1);
      }
      
      return {
        success: false,
        error: errorMessage,
        status: 'FAILED',
        errorCode: error.response?.status
      };
    }
  }

  /**
   * Check payment status
   * @param {string} referenceId - Payment reference ID
   * @returns {Promise<Object>} Payment status
   */
  async checkPaymentStatus(referenceId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
        }
      );

      const { status, financialTransactionId, reason } = response.data;

      logger.info(`MTN MoMo payment status: ${referenceId} - ${status}`);

      return {
        status: status, // PENDING, SUCCESSFUL, FAILED
        transactionId: financialTransactionId,
        referenceId,
        reason,
      };
    } catch (error) {
      logger.error('Failed to check MTN MoMo payment status:', error.response?.data || error.message);
      
      return {
        status: 'UNKNOWN',
        error: error.response?.data?.message || 'Failed to check payment status',
      };
    }
  }

  /**
   * Poll payment status until completion or timeout
   * @param {string} referenceId - Payment reference ID
   * @param {number} maxAttempts - Maximum polling attempts
   * @returns {Promise<Object>} Final payment status
   */
  async pollPaymentStatus(referenceId, maxAttempts = 36) {
    let attempts = 0;
    const interval = 5000; // 5 seconds

    while (attempts < maxAttempts) {
      const status = await this.checkPaymentStatus(referenceId);

      if (status.status === 'SUCCESSFUL') {
        logger.info(`MTN MoMo payment successful: ${referenceId}`);
        return {
          success: true,
          status: 'COMPLETED',
          transactionId: status.transactionId,
          referenceId,
        };
      }

      if (status.status === 'FAILED') {
        logger.info(`MTN MoMo payment failed: ${referenceId}`);
        return {
          success: false,
          status: 'FAILED',
          reason: status.reason,
          referenceId,
        };
      }

      // Still pending, wait and try again
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    // Timeout reached
    logger.warn(`MTN MoMo payment timeout: ${referenceId}`);
    return {
      success: false,
      status: 'TIMEOUT',
      message: 'Payment request timed out',
      referenceId,
    };
  }

  /**
   * Mask phone number for logging (security)
   */
  maskPhoneNumber(phone) {
    if (!phone || phone.length < 8) return '***';
    return phone.substring(0, 6) + 'XXX' + phone.substring(phone.length - 2);
  }

  /**
   * Format phone number to MTN MoMo format
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all spaces and special characters
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // If starts with +250, remove it
    if (cleaned.startsWith('+250')) {
      cleaned = cleaned.substring(4);
    }
    // If starts with 250, remove it
    else if (cleaned.startsWith('250')) {
      cleaned = cleaned.substring(3);
    }
    // If starts with 0, remove it
    else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Add Rwanda country code
    return `250${cleaned}`;
  }

  /**
   * Verify payment signature (webhook security)
   */
  verifyWebhookSignature(payload, signature) {
    const hash = crypto
      .createHmac('sha256', this.config.apiKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    return hash === signature;
  }

  /**
   * Get account balance (for testing/admin)
   */
  async getAccountBalance() {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/collection/v1_0/account/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
          timeout: 15000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get MTN MoMo account balance:', error.response?.data || error.message);
      throw new Error('Failed to get account balance');
    }
  }

  /**
   * Validate payer account before payment
   */
  async validateAccount(phoneNumber) {
    try {
      const token = await this.getAccessToken();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const response = await axios.get(
        `${this.baseURL}/collection/v1_0/accountholder/msisdn/${formattedPhone}/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Target-Environment': this.config.environment,
            'Ocp-Apim-Subscription-Key': this.config.subscriptionKey,
          },
          timeout: 10000,
        }
      );

      return response.data.result === true;
    } catch (error) {
      logger.warn('Failed to validate MTN MoMo account:', error.message);
      return false; // Don't block payment if validation fails
    }
  }
}

export default new MTNMomoService();
