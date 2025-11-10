import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Discount from '../models/Discount.js';

dotenv.config();

/**
 * Fix duplicate indexes in Discount collection
 * Run with: npm run fix-indexes
 */
const fixIndexes = async () => {
  try {
    console.log('🔧 Fixing Discount collection indexes...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected\n');

    // Drop all indexes except _id
    console.log('📦 Dropping existing indexes...');
    await Discount.collection.dropIndexes();
    console.log('✅ All indexes dropped\n');

    // Recreate indexes defined in schema
    console.log('📦 Creating new indexes...');
    await Discount.init(); // This recreates indexes from schema
    console.log('✅ Indexes recreated\n');

    // List current indexes
    const indexes = await Discount.collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      const keys = Object.keys(index.key).map(k => `${k}: ${index.key[k]}`).join(', ');
      console.log(`   - ${index.name}: { ${keys} }${index.unique ? ' [UNIQUE]' : ''}`);
    });

    console.log('\n✅ Indexes fixed successfully!');
    console.log('   You can now restart your server.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed.');
  }
};

fixIndexes();
