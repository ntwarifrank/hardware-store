import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import paymentConfig from '../config/payment.config.js';
import logger from '../utils/logger.js';

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
   * Get access token for MTN MoMo API
   */
  async getAccessToken() {
    try {
      // Check if token is still valid
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
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
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

      logger.info('MTN MoMo access token obtained');
      return this.token;
    } catch (error) {
      logger.error('Failed to get MTN MoMo access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with MTN MoMo');
    }
  }

  /**
   * Request payment from customer
   * @param {Object} paymentData - Payment request data
   * @returns {Promise<Object>} Payment response
   */
  async requestPayment(paymentData) {
    try {
      const { amount, phoneNumber, orderId, customerName, customerEmail } = paymentData;

      // Format phone number (remove spaces, ensure Rwanda format)
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
        phone: formattedPhone,
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
        }
      );

      logger.info(`MTN MoMo payment request sent: ${referenceId}`);

      return {
        success: true,
        referenceId,
        status: 'PENDING',
        message: 'Payment request sent to customer phone',
      };
    } catch (error) {
      logger.error('MTN MoMo payment request failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Payment request failed',
        status: 'FAILED',
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
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to get MTN MoMo account balance:', error.response?.data || error.message);
      throw new Error('Failed to get account balance');
    }
  }
}

export default new MTNMomoService();
