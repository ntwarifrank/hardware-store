import PaddleSDK from 'paddle-sdk';
import logger from '../utils/logger.js';

let paddleClient = null;

const configurePaddle = () => {
  try {
    paddleClient = new PaddleSDK(
      process.env.PADDLE_VENDOR_ID,
      process.env.PADDLE_API_KEY,
      process.env.PADDLE_PUBLIC_KEY,
      {
        environment: process.env.PADDLE_ENVIRONMENT || 'sandbox',
      }
    );

    logger.info(`Paddle configured successfully (${process.env.PADDLE_ENVIRONMENT || 'sandbox'} mode)`);
  } catch (error) {
    logger.error(`Paddle configuration error: ${error.message}`);
  }
};

const getPaddleClient = () => {
  if (!paddleClient) {
    throw new Error('Paddle client not initialized. Call configurePaddle() first.');
  }
  return paddleClient;
};

export { paddleClient, configurePaddle, getPaddleClient };
