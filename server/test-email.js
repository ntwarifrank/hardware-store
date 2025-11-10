import dotenv from 'dotenv';
import { sendOTPEmail } from './src/utils/sendEmail.js';

// Load environment variables
dotenv.config();

// Test email configuration
console.log('Testing email configuration...');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// Test sending OTP email
const testEmail = async () => {
  try {
    console.log('\nSending test OTP email...');
    await sendOTPEmail(
      'ugwanezav@gmail.com', // Replace with your test email
      'Test User',
      '123456'
    );
    console.log('✓ Test email sent successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error sending test email:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

testEmail();
