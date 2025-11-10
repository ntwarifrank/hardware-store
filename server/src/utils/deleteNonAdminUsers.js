import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import logger from './logger.js';

dotenv.config();

/**
 * Deletes all users except admin
 * Run: node src/utils/deleteNonAdminUsers.js
 */
const deleteNonAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Get admin user first
    const adminUser = await User.findOne({ email: 'admin@hardwarestore.com' });
    
    if (!adminUser) {
      logger.warn('⚠️  Admin user not found!');
      logger.info('💡 Create admin first: npm run create-admin');
      process.exit(1);
    }

    logger.info(`🔍 Admin found: ${adminUser.email} (${adminUser.name})`);
    logger.info('');

    // Count non-admin users
    const nonAdminCount = await User.countDocuments({ role: { $ne: 'admin' } });
    
    if (nonAdminCount === 0) {
      logger.info('ℹ️  No non-admin users found. Database is clean.');
      process.exit(0);
    }

    logger.info(`📊 Found ${nonAdminCount} non-admin user(s) to delete`);
    logger.info('');

    // List users to be deleted
    const usersToDelete = await User.find({ role: { $ne: 'admin' } }).select('name email role');
    
    logger.info('👥 Users to be deleted:');
    usersToDelete.forEach((user, index) => {
      logger.info(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    logger.info('');

    // Delete non-admin users
    const result = await User.deleteMany({ role: { $ne: 'admin' } });
    
    logger.info('✅ Deletion completed!');
    logger.info('');
    logger.info(`🗑️  Deleted: ${result.deletedCount} user(s)`);
    logger.info('');
    logger.info('👤 Remaining users:');
    logger.info(`   ✓ Admin: ${adminUser.email}`);
    logger.info('');
    logger.info('🎉 Database cleaned! Only admin user remains.');
    logger.info('');
    logger.info('💡 Tip: Users can register new accounts anytime.');

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

deleteNonAdminUsers();
