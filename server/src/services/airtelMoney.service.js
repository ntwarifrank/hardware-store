import axios from 'axios';
import paymentConfig from '../config/payment.config.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

/**
 * Airtel Money Payment Service
 * Handles real-time payment processing with Airtel Money API
 */
class AirtelMoneyService {
  constructor() {
    this.config = paymentConfig.airtel;
    this.baseURL = this.config.apiUrl;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Get access token for Airtel Money API with retry logic
   */
  async getAccessToken(retryCount = 0) {
    try {
      // Check if token is still valid (with 5 min buffer)
      if (this.token && this.tokenExpiry && Date.now() < (this.tokenExpiry - 300000)) {
        return this.token;
      }

      const response = await axios.post(
        `${this.baseURL}/auth/oauth2/token`,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      logger.info('Airtel Money access token obtained successfully');
      return this.token;
    } catch (error) {
      logger.error('Failed to get Airtel Money access token:', {
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
      
      throw new Error('Failed to authenticate with Airtel Money after multiple attempts');
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
      const { amount, phoneNumber, orderId, customerName } = paymentData;

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
      const transactionId = `BLDMRT-${Date.now()}-${orderId}`;

      const requestBody = {
        reference: transactionId,
        subscriber: {
          country: 'RW',
          currency: this.config.currency,
          msisdn: formattedPhone,
        },
        transaction: {
          amount: amount,
          country: 'RW',
          currency: this.config.currency,
          id: transactionId,
        },
      };

      logger.info(`Requesting Airtel Money payment: ${transactionId}`, {
        orderId,
        amount,
        phone: this.maskPhoneNumber(formattedPhone),
        attempt: retryCount + 1
      });

      const response = await axios.post(
        `${this.baseURL}/merchant/v1/payments/`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Country': 'RW',
            'X-Currency': this.config.currency,
          },
          timeout: 30000,
        }
      );

      const { status, data } = response.data;

      logger.info(`Airtel Money payment request sent successfully: ${transactionId}`);

      return {
        success: status.success,
        transactionId: data?.transaction?.id || transactionId,
        airtelMoneyId: data?.transaction?.airtel_money_id,
        status: status.success ? 'PENDING' : 'FAILED',
        message: status.message || 'Payment request sent to customer phone. Please check your phone and authorize the payment.',
        expiresAt: Date.now() + 180000, // 3 minutes
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      logger.error('Airtel Money payment request failed:', {
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
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Payment status
   */
  async checkPaymentStatus(transactionId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/standard/v1/payments/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Country': 'RW',
            'X-Currency': this.config.currency,
          },
        }
      );

      const { status, data } = response.data;

      logger.info(`Airtel Money payment status: ${transactionId} - ${data?.transaction?.status}`);

      // Map Airtel status to our standard status
      let mappedStatus = 'PENDING';
      if (data?.transaction?.status === 'TS') {
        mappedStatus = 'COMPLETED';
      } else if (data?.transaction?.status === 'TF') {
        mappedStatus = 'FAILED';
      }

      return {
        status: mappedStatus,
        transactionId: data?.transaction?.id,
        airtelMoneyId: data?.transaction?.airtel_money_id,
        amount: data?.transaction?.amount,
        success: status.success,
      };
    } catch (error) {
      logger.error('Failed to check Airtel Money payment status:', error.response?.data || error.message);
      
      return {
        status: 'UNKNOWN',
        error: error.response?.data?.message || 'Failed to check payment status',
      };
    }
  }

  /**
   * Poll payment status until completion or timeout
   * @param {string} transactionId - Transaction ID
   * @param {number} maxAttempts - Maximum polling attempts
   * @returns {Promise<Object>} Final payment status
   */
  async pollPaymentStatus(transactionId, maxAttempts = 36) {
    let attempts = 0;
    const interval = 5000; // 5 seconds

    while (attempts < maxAttempts) {
      const status = await this.checkPaymentStatus(transactionId);

      if (status.status === 'COMPLETED') {
        logger.info(`Airtel Money payment successful: ${transactionId}`);
        return {
          success: true,
          status: 'COMPLETED',
          transactionId: status.transactionId,
          airtelMoneyId: status.airtelMoneyId,
        };
      }

      if (status.status === 'FAILED') {
        logger.info(`Airtel Money payment failed: ${transactionId}`);
        return {
          success: false,
          status: 'FAILED',
          transactionId,
        };
      }

      // Still pending, wait and try again
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    // Timeout reached
    logger.warn(`Airtel Money payment timeout: ${transactionId}`);
    return {
      success: false,
      status: 'TIMEOUT',
      message: 'Payment request timed out',
      transactionId,
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
   * Format phone number to Airtel Money format
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
      .createHmac('sha256', this.config.clientSecret)
      .update(JSON.stringify(payload))
      .digest('hex');
    return hash === signature;
  }

  /**
   * Refund payment (if supported)
   * @param {string} transactionId - Original transaction ID
   * @param {number} amount - Amount to refund
   */
  async refundPayment(transactionId, amount, retryCount = 0) {
    try {
      const token = await this.getAccessToken();
      const refundId = `REFUND-${Date.now()}-${transactionId}`;

      const requestBody = {
        transaction: {
          amount: amount,
          country: 'RW',
          currency: this.config.currency,
          id: refundId,
        },
        reference: {
          transaction: {
            id: transactionId,
          },
        },
      };

      const response = await axios.post(
        `${this.baseURL}/standard/v1/payments/refund`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Country': 'RW',
            'X-Currency': this.config.currency,
          },
          timeout: 30000,
        }
      );

      logger.info(`Airtel Money refund initiated successfully: ${refundId}`);

      return {
        success: response.data.status.success,
        refundId,
        message: response.data.status.message,
      };
    } catch (error) {
      logger.error('Airtel Money refund failed:', {
        error: error.response?.data || error.message,
        attempt: retryCount + 1
      });
      
      // Retry on network errors
      if ((!error.response || error.response.status >= 500) && retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000;
        logger.info(`Retrying refund in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.refundPayment(transactionId, amount, retryCount + 1);
      }
      
      throw new Error('Refund failed after multiple attempts');
    }
  }

  /**
   * Validate payer account before payment
   */
  async validateAccount(phoneNumber) {
    try {
      const token = await this.getAccessToken();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // Airtel's KYC check endpoint
      const response = await axios.get(
        `${this.baseURL}/standard/v1/users/${formattedPhone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Country': 'RW',
            'X-Currency': this.config.currency,
          },
          timeout: 10000,
        }
      );

      return response.data.status.success === true;
    } catch (error) {
      logger.warn('Failed to validate Airtel Money account:', error.message);
      return false; // Don't block payment if validation fails
    }
  }
}

export default new AirtelMoneyService();
