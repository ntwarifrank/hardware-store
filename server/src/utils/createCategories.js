import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import logger from './logger.js';

dotenv.config();

/**
 * Creates default hardware store categories
 * Run: node src/utils/createCategories.js
 */
const createCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    
    if (existingCount > 0) {
      logger.info(`ℹ️  ${existingCount} categories already exist`);
      logger.info('💡 To reset categories, delete them first from the database');
      process.exit(0);
    }

    // Hardware store categories
    const categories = [
      {
        name: 'Power Tools',
        slug: 'power-tools',
        description: 'Electric and battery-powered tools including drills, saws, grinders, and sanders',
        isActive: true,
      },
      {
        name: 'Hand Tools',
        slug: 'hand-tools',
        description: 'Manual tools like hammers, screwdrivers, wrenches, pliers, and measuring tools',
        isActive: true,
      },
      {
        name: 'Building Materials',
        slug: 'building-materials',
        description: 'Lumber, concrete, bricks, drywall, and other construction materials',
        isActive: true,
      },
      {
        name: 'Plumbing',
        slug: 'plumbing',
        description: 'Pipes, fittings, faucets, valves, and plumbing supplies',
        isActive: true,
      },
      {
        name: 'Electrical',
        slug: 'electrical',
        description: 'Wiring, switches, outlets, circuit breakers, and electrical supplies',
        isActive: true,
      },
      {
        name: 'Paint & Supplies',
        slug: 'paint-supplies',
        description: 'Interior and exterior paints, brushes, rollers, and painting accessories',
        isActive: true,
      },
      {
        name: 'Hardware & Fasteners',
        slug: 'hardware-fasteners',
        description: 'Nails, screws, bolts, nuts, anchors, and general hardware',
        isActive: true,
      },
      {
        name: 'Safety Equipment',
        slug: 'safety-equipment',
        description: 'Protective gear, gloves, safety glasses, hard hats, and work wear',
        isActive: true,
      },
      {
        name: 'Gardening & Outdoor',
        slug: 'gardening-outdoor',
        description: 'Garden tools, lawn equipment, outdoor power equipment, and landscaping supplies',
        isActive: true,
      },
      {
        name: 'Lighting',
        slug: 'lighting',
        description: 'Light fixtures, bulbs, LED lights, and outdoor lighting',
        isActive: true,
      },
      {
        name: 'Storage & Organization',
        slug: 'storage-organization',
        description: 'Tool boxes, storage bins, shelving, and organization systems',
        isActive: true,
      },
      {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Auto parts, tools, fluids, and automotive accessories',
        isActive: true,
      },
      {
        name: 'HVAC',
        slug: 'hvac',
        description: 'Heating, ventilation, and air conditioning equipment and supplies',
        isActive: true,
      },
      {
        name: 'Doors & Windows',
        slug: 'doors-windows',
        description: 'Entry doors, interior doors, windows, and related hardware',
        isActive: true,
      },
      {
        name: 'Flooring',
        slug: 'flooring',
        description: 'Hardwood, laminate, tile, carpet, and flooring installation supplies',
        isActive: true,
      },
      {
        name: 'Welding & Metalworking',
        slug: 'welding-metalworking',
        description: 'Welding equipment, metal cutting tools, and metalworking supplies',
        isActive: true,
      },
      {
        name: 'Cleaning Supplies',
        slug: 'cleaning-supplies',
        description: 'Cleaning products, equipment, and janitorial supplies',
        isActive: true,
      },
      {
        name: 'Outdoor Power Equipment',
        slug: 'outdoor-power-equipment',
        description: 'Lawn mowers, trimmers, chainsaws, and outdoor power tools',
        isActive: true,
      },
      {
        name: 'Generators & Pumps',
        slug: 'generators-pumps',
        description: 'Portable generators, water pumps, and power equipment',
        isActive: true,
      },
      {
        name: 'Adhesives & Sealants',
        slug: 'adhesives-sealants',
        description: 'Glues, epoxies, caulks, sealants, and bonding materials',
        isActive: true,
      },
    ];

    // Create all categories
    const createdCategories = await Category.insertMany(categories);
    
    logger.info('✅ Categories created successfully!');
    logger.info('');
    logger.info('📦 Created Categories:');
    createdCategories.forEach((cat, index) => {
      logger.info(`${index + 1}. ${cat.name} (${cat.slug})`);
    });
    logger.info('');
    logger.info(`✨ Total: ${createdCategories.length} categories created`);
    logger.info('');
    logger.info('🚀 You can now select categories when creating products!');

    process.exit(0);
  } catch (error) {
    logger.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

createCategories();
