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
 * Verify admin user and test password
 * Run: node src/utils/verifyAdmin.js
 */
const verifyAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Find admin with password field
    const admin = await User.findOne({ email: 'admin@hardwarestore.com' }).select('+password');
    
    if (!admin) {
      logger.error('❌ Admin user not found!');
      process.exit(1);
    }

    logger.info('✅ Admin user found!');
    logger.info('');
    logger.info('📋 Admin Details:');
    logger.info(`   Name: ${admin.name}`);
    logger.info(`   Email: ${admin.email}`);
    logger.info(`   Role: ${admin.role}`);
    logger.info(`   Email Verified: ${admin.isEmailVerified}`);
    logger.info(`   Is Blocked: ${admin.isBlocked}`);
    logger.info(`   Password Hash: ${admin.password.substring(0, 20)}...`);
    logger.info('');

    // Test password
    const testPassword = 'Admin@123';
    logger.info(`🔍 Testing password: ${testPassword}`);
    
    const isMatch = await admin.comparePassword(testPassword);
    
    if (isMatch) {
      logger.info('✅ Password is CORRECT! ✨');
      logger.info('');
      logger.info('🎉 Admin login should work with:');
      logger.info('   Email: admin@hardwarestore.com');
      logger.info('   Password: Admin@123');
    } else {
      logger.error('❌ Password does NOT match!');
      logger.info('');
      logger.info('💡 Solution: Run npm run reset-admin to fix this');
    }

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

verifyAdmin();
