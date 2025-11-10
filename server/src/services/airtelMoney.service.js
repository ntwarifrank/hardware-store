import axios from 'axios';
import paymentConfig from '../config/payment.config.js';
import logger from '../utils/logger.js';

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
   * Get access token for Airtel Money API
   */
  async getAccessToken() {
    try {
      // Check if token is still valid
      if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
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
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      logger.info('Airtel Money access token obtained');
      return this.token;
    } catch (error) {
      logger.error('Failed to get Airtel Money access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Airtel Money');
    }
  }

  /**
   * Request payment from customer
   * @param {Object} paymentData - Payment request data
   * @returns {Promise<Object>} Payment response
   */
  async requestPayment(paymentData) {
    try {
      const { amount, phoneNumber, orderId, customerName } = paymentData;

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
        phone: formattedPhone,
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
        }
      );

      const { status, data } = response.data;

      logger.info(`Airtel Money payment request sent: ${transactionId}`);

      return {
        success: status.success,
        transactionId: data?.transaction?.id || transactionId,
        airtelMoneyId: data?.transaction?.airtel_money_id,
        status: status.success ? 'PENDING' : 'FAILED',
        message: status.message || 'Payment request sent to customer phone',
      };
    } catch (error) {
      logger.error('Airtel Money payment request failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || 'Payment request failed',
        status: 'FAILED',
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
   * Refund payment (if supported)
   * @param {string} transactionId - Original transaction ID
   * @param {number} amount - Amount to refund
   */
  async refundPayment(transactionId, amount) {
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
        }
      );

      logger.info(`Airtel Money refund initiated: ${refundId}`);

      return {
        success: response.data.status.success,
        refundId,
        message: response.data.status.message,
      };
    } catch (error) {
      logger.error('Airtel Money refund failed:', error.response?.data || error.message);
      throw new Error('Refund failed');
    }
  }
}

export default new AirtelMoneyService();
