import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/**
 * @desc    Get product reviews
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({ product: productId, isApproved: true })
    .populate('user', 'name avatar')
    .sort(sort)
    .limit(Number(limit))
    .skip(skip);

  const total = await Review.countDocuments({ product: productId, isApproved: true });

  res.status(200).json({
    success: true,
    data: {
      reviews,
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
 * @desc    Create product review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;

  // Check if product exists
  const productExists = await Product.findById(product);
  if (!productExists) {
    throw new AppError('Product not found', 404);
  }

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({ user: req.user._id, product });
  if (existingReview) {
    throw new AppError('You have already reviewed this product', 400);
  }

  // Check if user has purchased this product
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': product,
    'paymentInfo.status': 'completed',
  });

  // Create review
  const review = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate('user', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: {
      review,
    },
  });
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  let review = await Review.findById(id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Check if user owns the review
  if (review.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this review', 403);
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  await review.save();

  await review.populate('user', 'name avatar');

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: {
      review,
    },
  });
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this review', 403);
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

/**
 * @desc    Mark review as helpful
 * @route   PUT /api/reviews/:id/helpful
 * @access  Private
 */
export const markHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  review.helpfulCount += 1;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review marked as helpful',
    data: {
      review,
    },
  });
});
