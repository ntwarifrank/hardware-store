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
 * Deletes existing admin and creates a new one
 * Run: node src/utils/resetAdmin.js
 */
const resetAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Delete existing admin
    const deleted = await User.deleteOne({ email: 'admin@hardwarestore.com' });
    
    if (deleted.deletedCount > 0) {
      logger.info('🗑️  Old admin user deleted');
    }

    // Create new admin user with strong password
    await User.create({
      name: 'Admin User',
      email: 'admin@hardwarestore.com',
      password: 'Admin@123', // Strong password: uppercase, lowercase, number, special char
      role: 'admin',
      isEmailVerified: true,
    });
    
    logger.info('✅ Admin user created successfully!');
    logger.info('');
    logger.info('📝 NEW Login Credentials:');
    logger.info('📧 Email: admin@hardwarestore.com');
    logger.info('🔑 Password: Admin@123');
    logger.info('');
    logger.info('✨ Password now meets all requirements:');
    logger.info('   ✓ Uppercase letter (A)');
    logger.info('   ✓ Lowercase letters (dmin)');
    logger.info('   ✓ Numbers (123)');
    logger.info('   ✓ Special character (@)');
    logger.info('');
    logger.info('🚀 You can now login to the admin panel!');

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

resetAdminUser();
