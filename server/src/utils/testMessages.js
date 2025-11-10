import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../models/Contact.js';
import logger from './logger.js';

// Load environment variables
dotenv.config({ path: '.env' });

const testMessages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Get all contacts
    const allContacts = await Contact.find({});
    logger.info(`\n📊 Total contacts in database: ${allContacts.length}`);

    if (allContacts.length > 0) {
      logger.info('\n📝 Sample contacts:');
      allContacts.slice(0, 5).forEach((contact, index) => {
        logger.info(`\n${index + 1}. Contact ID: ${contact._id}`);
        logger.info(`   Email: ${contact.email}`);
        logger.info(`   Name: ${contact.name}`);
        logger.info(`   Subject: ${contact.subject}`);
        logger.info(`   User ID: ${contact.user || 'No user linked'}`);
        logger.info(`   Status: ${contact.status}`);
        logger.info(`   Admin Reply: ${contact.adminReply || 'None'}`);
        logger.info(`   Created: ${contact.createdAt}`);
      });
    } else {
      logger.info('❌ No contacts found in database!');
      logger.info('💡 Try sending a message from the Help page first.');
    }

    process.exit(0);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

testMessages();
