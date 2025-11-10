/**
 * Payment Gateway Configuration
 * Supports MTN Mobile Money, Airtel Money, and Card payments for Rwanda
 */

export const paymentConfig = {
  // MTN Mobile Money Configuration
  mtn: {
    apiUrl: process.env.MTN_MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com',
    subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY,
    apiUser: process.env.MTN_API_USER,
    apiKey: process.env.MTN_API_KEY,
    environment: process.env.MTN_ENVIRONMENT || 'sandbox', // sandbox or production
    currency: 'RWF',
    callbackUrl: `${process.env.SERVER_URL}/api/payments/mtn/callback`,
  },

  // Airtel Money Configuration
  airtel: {
    apiUrl: process.env.AIRTEL_API_URL || 'https://openapi.airtel.africa',
    clientId: process.env.AIRTEL_CLIENT_ID,
    clientSecret: process.env.AIRTEL_CLIENT_SECRET,
    environment: process.env.AIRTEL_ENVIRONMENT || 'sandbox',
    currency: 'RWF',
    callbackUrl: `${process.env.SERVER_URL}/api/payments/airtel/callback`,
  },

  // Card Payment Configuration (Flutterwave)
  flutterwave: {
    publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
    secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY,
    environment: process.env.FLUTTERWAVE_ENVIRONMENT || 'test',
    callbackUrl: `${process.env.SERVER_URL}/api/payments/flutterwave/callback`,
  },

  // Payment settings
  settings: {
    timeout: 180000, // 3 minutes timeout for payment
    retryAttempts: 3,
    statusCheckInterval: 5000, // Check status every 5 seconds
  },
};

/**
 * Validate payment configuration
 */
export const validatePaymentConfig = () => {
  const errors = [];

  // Validate MTN config
  if (!paymentConfig.mtn.subscriptionKey) {
    errors.push('MTN_SUBSCRIPTION_KEY is missing');
  }
  if (!paymentConfig.mtn.apiUser) {
    errors.push('MTN_API_USER is missing');
  }
  if (!paymentConfig.mtn.apiKey) {
    errors.push('MTN_API_KEY is missing');
  }

  // Validate Airtel config
  if (!paymentConfig.airtel.clientId) {
    errors.push('AIRTEL_CLIENT_ID is missing');
  }
  if (!paymentConfig.airtel.clientSecret) {
    errors.push('AIRTEL_CLIENT_SECRET is missing');
  }

  if (errors.length > 0) {
    console.warn('⚠️  Payment configuration warnings:', errors);
    console.warn('Some payment methods may not work correctly.');
  }

  return errors.length === 0;
};

export default paymentConfig;
