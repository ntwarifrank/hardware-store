import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Discount from '../models/Discount.js';
import User from '../models/User.js';
import { sendDiscountNotificationEmail } from '../utils/sendEmail.js';
import logger from '../utils/logger.js';

/**
 * Helper function to send discount emails to all users
 * Runs asynchronously in the background
 */
const sendDiscountEmailsToAllUsers = async (discount) => {
  try {
    // Get all active users (exclude admins if you want)
    const users = await User.find({ 
      isEmailVerified: true,
      // role: { $ne: 'admin' } // Uncomment to exclude admins
    }).select('email name');

    if (users.length === 0) {
      logger.info('No users found to send discount emails');
      return;
    }

    logger.info(`Sending discount notification emails to ${users.length} users`);

    // Prepare discount details for email
    const discountDetails = {
      code: discount.code,
      discountName: discount.name,
      description: discount.description,
      type: discount.type,
      value: discount.value,
      minimumPurchase: discount.minimumPurchase,
      endDate: discount.endDate,
    };

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      // Send emails in parallel for this batch
      const emailPromises = batch.map(async (user) => {
        try {
          await sendDiscountNotificationEmail(user.email, user.name, discountDetails);
          successCount++;
        } catch (error) {
          errorCount++;
          logger.error(`Failed to send discount email to ${user.email}: ${error.message}`);
        }
      });

      // Wait for current batch to complete before moving to next
      await Promise.allSettled(emailPromises);
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    logger.info(`Discount emails sent: ${successCount} successful, ${errorCount} failed`);
  } catch (error) {
    logger.error(`Error in sendDiscountEmailsToAllUsers: ${error.message}`);
    throw error;
  }
};

/**
 * @desc    Create discount (Admin only)
 * @route   POST /api/discounts
 * @access  Private/Admin
 */
export const createDiscount = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    type,
    value,
    minimumPurchase,
    maxDiscount,
    usageLimit,
    userUsageLimit,
    applicableProducts,
    applicableCategories,
    startDate,
    endDate,
  } = req.body;

  // Validate required fields
  if (!code || !name || !type || !value || !startDate || !endDate) {
    throw new AppError('Please provide all required fields', 400);
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError('Invalid date format', 400);
  }

  if (end <= start) {
    throw new AppError('End date must be after start date', 400);
  }

  // Validate discount value
  if (value <= 0) {
    throw new AppError('Discount value must be greater than 0', 400);
  }

  if (type === 'percentage' && value > 100) {
    throw new AppError('Percentage discount cannot exceed 100%', 400);
  }

  // Validate minimum purchase
  if (minimumPurchase < 0) {
    throw new AppError('Minimum purchase cannot be negative', 400);
  }

  // Check if code already exists
  const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
  if (existingDiscount) {
    throw new AppError('Discount code already exists', 400);
  }

  const discount = await Discount.create({
    code: code.toUpperCase(),
    name,
    description,
    type,
    value,
    minimumPurchase,
    maxDiscount,
    usageLimit,
    userUsageLimit,
    applicableProducts,
    applicableCategories,
    startDate,
    endDate,
    createdBy: req.user._id,
  });

  // Send email notifications to all users (async, don't wait for completion)
  logger.info(`Triggering discount email notifications for code: ${discount.code}`);
  sendDiscountEmailsToAllUsers(discount).catch(error => {
    logger.error(`Failed to send discount emails: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
  });

  res.status(201).json({
    success: true,
    message: 'Discount created successfully. Email notifications are being sent to all users.',
    data: {
      discount,
    },
  });
});

/**
 * @desc    Get all discounts (Admin)
 * @route   GET /api/discounts/admin
 * @access  Private/Admin
 */
export const getAllDiscounts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive, type } = req.query;

  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }
  if (type) {
    query.type = type;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const discounts = await Discount.find(query)
    .populate('createdBy', 'name email')
    .populate('applicableProducts', 'name price')
    .populate('applicableCategories', 'name')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip);

  const total = await Discount.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      discounts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

/**
 * @desc    Get active discounts (Public)
 * @route   GET /api/discounts
 * @access  Public
 */
export const getActiveDiscounts = asyncHandler(async (req, res) => {
  const now = new Date();

  const discounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .select('-usedBy -createdBy')
    .populate('applicableProducts', 'name price images')
    .populate('applicableCategories', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: {
      discounts,
    },
  });
});

/**
 * @desc    Validate discount code
 * @route   POST /api/discounts/validate
 * @access  Private
 */
export const validateDiscount = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;

  const discount = await Discount.findOne({ code: code.toUpperCase() });

  if (!discount) {
    throw new AppError('Invalid discount code', 404);
  }

  if (!discount.isValid()) {
    throw new AppError('Discount code is not valid or has expired', 400);
  }

  // Check if user has exceeded usage limit
  const userUsageCount = discount.usedBy.filter(
    (usage) => usage.user.toString() === req.user._id.toString()
  ).length;

  if (userUsageCount >= discount.userUsageLimit) {
    throw new AppError('You have already used this discount code', 400);
  }

  const discountAmount = discount.calculateDiscount(orderAmount);

  res.status(200).json({
    success: true,
    data: {
      discount: {
        code: discount.code,
        name: discount.name,
        type: discount.type,
        value: discount.value,
        discountAmount,
      },
    },
  });
});

/**
 * @desc    Apply discount to order
 * @route   POST /api/discounts/apply
 * @access  Private
 */
export const applyDiscount = asyncHandler(async (req, res) => {
  const { code, orderAmount, orderId } = req.body;

  const discount = await Discount.findOne({ code: code.toUpperCase() });

  if (!discount) {
    throw new AppError('Invalid discount code', 404);
  }

  if (!discount.isValid()) {
    throw new AppError('Discount code is not valid or has expired', 400);
  }

  // Check user usage limit
  const userUsageCount = discount.usedBy.filter(
    (usage) => usage.user.toString() === req.user._id.toString()
  ).length;

  if (userUsageCount >= discount.userUsageLimit) {
    throw new AppError('You have already used this discount code', 400);
  }

  const discountAmount = discount.calculateDiscount(orderAmount);

  // Record usage
  discount.usedBy.push({
    user: req.user._id,
    usedAt: new Date(),
    orderAmount,
    discountAmount,
  });
  discount.usageCount += 1;
  await discount.save();

  res.status(200).json({
    success: true,
    message: 'Discount applied successfully',
    data: {
      discountAmount,
      finalAmount: orderAmount - discountAmount,
    },
  });
});

/**
 * @desc    Update discount (Admin)
 * @route   PUT /api/discounts/:id
 * @access  Private/Admin
 */
export const updateDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, value, minimumPurchase, startDate, endDate } = req.body;

  // Validate dates if provided
  if (startDate || endDate) {
    const existingDiscount = await Discount.findById(id);
    if (!existingDiscount) {
      throw new AppError('Discount not found', 404);
    }

    const start = new Date(startDate || existingDiscount.startDate);
    const end = new Date(endDate || existingDiscount.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError('Invalid date format', 400);
    }

    if (end <= start) {
      throw new AppError('End date must be after start date', 400);
    }
  }

  // Validate discount value if provided
  if (value !== undefined) {
    if (value <= 0) {
      throw new AppError('Discount value must be greater than 0', 400);
    }

    const discountType = type || (await Discount.findById(id)).type;
    if (discountType === 'percentage' && value > 100) {
      throw new AppError('Percentage discount cannot exceed 100%', 400);
    }
  }

  // Validate minimum purchase if provided
  if (minimumPurchase !== undefined && minimumPurchase < 0) {
    throw new AppError('Minimum purchase cannot be negative', 400);
  }

  const discount = await Discount.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!discount) {
    throw new AppError('Discount not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Discount updated successfully',
    data: {
      discount,
    },
  });
});

/**
 * @desc    Delete discount (Admin)
 * @route   DELETE /api/discounts/:id
 * @access  Private/Admin
 */
export const deleteDiscount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discount = await Discount.findByIdAndDelete(id);

  if (!discount) {
    throw new AppError('Discount not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Discount deleted successfully',
  });
});

/**
 * @desc    Get discount statistics (Admin)
 * @route   GET /api/discounts/:id/stats
 * @access  Private/Admin
 */
export const getDiscountStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discount = await Discount.findById(id).populate('usedBy.user', 'name email');

  if (!discount) {
    throw new AppError('Discount not found', 404);
  }

  const totalDiscountGiven = discount.usedBy.reduce(
    (sum, usage) => sum + usage.discountAmount,
    0
  );

  const totalRevenue = discount.usedBy.reduce((sum, usage) => sum + usage.orderAmount, 0);

  res.status(200).json({
    success: true,
    data: {
      discount: {
        code: discount.code,
        name: discount.name,
        usageCount: discount.usageCount,
        usageLimit: discount.usageLimit,
        totalDiscountGiven,
        totalRevenue,
        usageHistory: discount.usedBy,
      },
    },
  });
});
