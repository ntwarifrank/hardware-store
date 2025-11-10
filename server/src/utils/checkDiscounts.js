import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Discount from '../models/Discount.js';

dotenv.config();

/**
 * Check discount status and fix dates if needed
 * Run with: npm run check-discounts
 */
const checkDiscounts = async () => {
  try {
    console.log('🔍 Checking Discount Status...\n');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected\n');

    const discounts = await Discount.find({}).sort({ createdAt: -1 });
    
    if (discounts.length === 0) {
      console.log('❌ No discounts found in database\n');
      return;
    }

    console.log(`Found ${discounts.length} discount(s):\n`);
    console.log('═'.repeat(80));

    const now = new Date();

    discounts.forEach((discount, index) => {
      console.log(`\n${index + 1}. ${discount.code} - ${discount.name}`);
      console.log('─'.repeat(80));
      
      // Check isActive flag
      console.log(`   Database isActive: ${discount.isActive ? '✅ TRUE' : '❌ FALSE'}`);
      
      // Check start date
      const startDate = new Date(discount.startDate);
      const startStatus = startDate <= now ? '✅ Started' : '❌ Future';
      console.log(`   Start Date: ${startDate.toLocaleDateString()} ${startStatus}`);
      
      // Check end date
      const endDate = new Date(discount.endDate);
      const endStatus = endDate >= now ? '✅ Valid' : '❌ Expired';
      console.log(`   End Date: ${endDate.toLocaleDateString()} ${endStatus}`);
      
      // Calculate status
      const isActive = discount.isActive && startDate <= now && endDate >= now;
      console.log(`\n   📊 Status: ${isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
      
      // Show why inactive
      if (!isActive) {
        console.log('   ⚠️  Reasons for Inactive:');
        if (!discount.isActive) {
          console.log('      • isActive flag is FALSE in database');
        }
        if (startDate > now) {
          console.log(`      • Start date is in the FUTURE (${startDate.toLocaleDateString()})`);
        }
        if (endDate < now) {
          console.log(`      • End date is in the PAST (expired on ${endDate.toLocaleDateString()})`);
        }
      }
      
      // Additional info
      console.log(`\n   📋 Details:`);
      console.log(`      • Type: ${discount.type}`);
      console.log(`      • Value: ${discount.value}${discount.type === 'percentage' ? '%' : ' RWF'}`);
      console.log(`      • Min Purchase: ${discount.minimumPurchase} RWF`);
      console.log(`      • Usage: ${discount.usageCount}${discount.usageLimit ? ` / ${discount.usageLimit}` : ' / Unlimited'}`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n💡 To Make Discount Active:');
    console.log('   1. Edit the discount in admin panel');
    console.log('   2. Set Start Date to today or earlier');
    console.log('   3. Set End Date to future date');
    console.log('   4. Ensure it\'s enabled (isActive = true)');
    console.log('\n' + '═'.repeat(80));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed.');
  }
};

checkDiscounts();
