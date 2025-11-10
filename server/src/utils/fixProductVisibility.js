import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import logger from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env.locals first, then .env
dotenv.config({ path: path.resolve(__dirname, '../../.env.locals') });
dotenv.config(); // Fallback to .env if exists

/**
 * Fix product visibility by setting isActive to true for all products
 * This helps resolve issues where products are not visible due to missing isActive field
 */
const fixProductVisibility = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Count products before update
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveOrMissing = totalProducts - activeProducts;

    logger.info(`Total products: ${totalProducts}`);
    logger.info(`Active products: ${activeProducts}`);
    logger.info(`Inactive or missing isActive field: ${inactiveOrMissing}`);

    if (inactiveOrMissing > 0) {
      // Update all products to have isActive: true
      const result = await Product.updateMany(
        { $or: [{ isActive: { $exists: false } }, { isActive: false }] },
        { $set: { isActive: true } }
      );

      logger.info(`✅ Updated ${result.modifiedCount} products to be active`);
    } else {
      logger.info('✅ All products are already active');
    }

    // Show final count
    const finalActiveProducts = await Product.countDocuments({ isActive: true });
    logger.info(`Final active products count: ${finalActiveProducts}`);

    process.exit(0);
  } catch (error) {
    logger.error('Error fixing product visibility:', error);
    process.exit(1);
  }
};

fixProductVisibility();
