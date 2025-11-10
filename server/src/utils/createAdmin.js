import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import logger from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env.locals first, then .env
dotenv.config({ path: path.resolve(__dirname, '../../.env.locals') });
dotenv.config(); // Fallback to .env if exists

/**
 * Creates admin user if it doesn't exist
 * Run: node src/utils/createAdmin.js
 */
const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@hardwarestore.com' });
    
    if (adminExists) {
      logger.info('ℹ️  Admin user already exists');
      logger.info('📧 Email: admin@hardwarestore.com');
      logger.info('🔑 Password: Admin@123');
      logger.info('');
      logger.info('💡 To reset password, delete the user and run this script again');
    } else {
      // Create admin user
      await User.create({
        name: 'Admin User',
        email: 'admin@hardwarestore.com',
        password: 'Admin@123', // Strong password: uppercase, lowercase, number, special char
        role: 'admin',
        isEmailVerified: true,
      });
      
      logger.info('✅ Admin user created successfully!');
      logger.info('');
      logger.info('📝 Login Credentials:');
      logger.info('📧 Email: admin@hardwarestore.com');
      logger.info('🔑 Password: Admin@123');
      logger.info('');
      logger.info('🚀 You can now login to the admin panel');
    }

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

createAdminUser();
