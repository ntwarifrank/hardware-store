import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import logger from './logger.js';

// Load environment variables
dotenv.config({ path: '.env' });

const createTestMessage = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Find a user (not admin)
    const user = await User.findOne({ role: 'user' });
    
    if (!user) {
      logger.error('❌ No regular user found! Please register a user first.');
      process.exit(1);
    }

    logger.info(`\n✅ Found user: ${user.name} (${user.email})`);

    // Create a test contact message
    const contact = await Contact.create({
      name: user.name,
      email: user.email,
      phone: user.phone || '+250725382459',
      subject: 'Test Support Message',
      message: 'This is a test message to verify the My Messages page is working correctly. The admin should be able to reply to this message.',
      user: user._id,
      status: 'new',
      priority: 'medium',
    });

    logger.info(`\n✅ Test message created!`);
    logger.info(`   ID: ${contact._id}`);
    logger.info(`   Email: ${contact.email}`);
    logger.info(`   User ID: ${contact.user}`);
    logger.info(`\n💡 Now login as this user and visit /my-messages to see the message!`);
    logger.info(`   User email: ${user.email}`);

    process.exit(0);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createTestMessage();
