import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

/**
 * Remove admin role from specific user
 * Changes UGWANEZA Vedaste from admin to user
 */
const removeAdminRole = async () => {
  try {
    console.log('🔧 Removing admin privileges...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected\n');

    // Find the user by email
    const userEmail = 'inzunini1@gmail.com';
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log(`❌ User not found: ${userEmail}\n`);
      return;
    }

    console.log('📋 User found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Current Role: ${user.role}`);
    console.log('');

    if (user.role !== 'admin') {
      console.log(`ℹ️  User is already a regular user (role: ${user.role})\n`);
      return;
    }

    // Change role from admin to user
    user.role = 'user';
    await user.save();

    console.log('✅ Admin privileges removed successfully!');
    console.log(`   ${user.name} is now a regular user\n`);

    // Show remaining admins
    const admins = await User.find({ role: 'admin' }).select('name email');
    console.log('📊 Remaining admin users:');
    if (admins.length === 0) {
      console.log('   ⚠️  WARNING: No admin users left!\n');
    } else {
      admins.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed.');
  }
};

removeAdminRole();
