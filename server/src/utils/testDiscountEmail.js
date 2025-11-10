import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { sendDiscountNotificationEmail } from './sendEmail.js';

dotenv.config();

/**
 * Test script to diagnose discount email issues
 * Run with: node src/utils/testDiscountEmail.js
 */
const testDiscountEmail = async () => {
  try {
    console.log('🔍 Starting Discount Email Diagnostic Test...\n');

    // 1. Check database connection
    console.log('1️⃣ Checking database connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected\n');

    // 2. Check email configuration
    console.log('2️⃣ Checking email configuration...');
    const emailConfig = {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '***SET***' : '❌ NOT SET',
      EMAIL_FROM: process.env.EMAIL_FROM,
      CLIENT_URL: process.env.CLIENT_URL,
    };
    console.log(emailConfig);
    
    const missingConfig = Object.entries(emailConfig)
      .filter(([key, value]) => !value || value === '❌ NOT SET')
      .map(([key]) => key);
    
    if (missingConfig.length > 0) {
      console.log(`\n❌ Missing email configuration: ${missingConfig.join(', ')}`);
      console.log('Please set these in your .env file\n');
    } else {
      console.log('✅ Email configuration complete\n');
    }

    // 3. Check for verified users
    console.log('3️⃣ Checking for verified users...');
    const allUsers = await User.find({}).select('email name isEmailVerified role');
    console.log(`   Total users in database: ${allUsers.length}`);
    
    const verifiedUsers = await User.find({ isEmailVerified: true }).select('email name role');
    console.log(`   Verified users: ${verifiedUsers.length}`);
    
    if (verifiedUsers.length === 0) {
      console.log('\n❌ No verified users found!');
      console.log('Users must verify their email before receiving discount notifications.\n');
      
      if (allUsers.length > 0) {
        console.log('Users in database:');
        allUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.role}) - Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
        });
      }
    } else {
      console.log('✅ Verified users found:');
      verifiedUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }
    console.log('');

    // 4. Test sending email to first verified user
    if (verifiedUsers.length > 0 && !missingConfig.length) {
      console.log('4️⃣ Testing email send...');
      const testUser = verifiedUsers[0];
      
      const testDiscount = {
        code: 'TEST20',
        discountName: 'Test Discount',
        description: 'This is a test discount notification',
        type: 'percentage',
        value: 20,
        minimumPurchase: 10000,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      console.log(`   Sending test email to: ${testUser.email}`);
      
      try {
        await sendDiscountNotificationEmail(testUser.email, testUser.name, testDiscount);
        console.log('✅ Test email sent successfully!');
        console.log('   Check the inbox for the test discount email.\n');
      } catch (error) {
        console.log('❌ Failed to send test email');
        console.log(`   Error: ${error.message}\n`);
        
        if (error.message.includes('EAUTH')) {
          console.log('💡 Tip: Authentication failed. Check your EMAIL_USER and EMAIL_PASSWORD');
        } else if (error.message.includes('ECONNREFUSED')) {
          console.log('💡 Tip: Connection refused. Check EMAIL_HOST and EMAIL_PORT');
        } else if (error.message.includes('Invalid login')) {
          console.log('💡 Tip: Invalid credentials. For Gmail, use App Password instead of regular password');
          console.log('   How to generate App Password:');
          console.log('   1. Enable 2-Factor Authentication on Google Account');
          console.log('   2. Go to: https://myaccount.google.com/apppasswords');
          console.log('   3. Generate password for "Mail"');
          console.log('   4. Use that password in EMAIL_PASSWORD\n');
        }
      }
    } else if (missingConfig.length) {
      console.log('⏭️  Skipping email test due to missing configuration\n');
    } else {
      console.log('⏭️  Skipping email test - no verified users\n');
    }

    // Summary
    console.log('📊 Summary:');
    console.log('─'.repeat(50));
    
    if (missingConfig.length > 0) {
      console.log('❌ Issue: Email configuration incomplete');
      console.log(`   Action: Set ${missingConfig.join(', ')} in .env file`);
    } else if (verifiedUsers.length === 0) {
      console.log('❌ Issue: No verified users in database');
      console.log('   Action: Register users and verify their emails');
    } else {
      console.log('✅ Configuration looks good!');
      console.log('   If emails still not working, check server logs when creating discount');
    }
    
    console.log('─'.repeat(50));

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Test completed. Database connection closed.');
  }
};

// Run the test
testDiscountEmail();
