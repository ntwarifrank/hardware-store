import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    minPrice,
    maxPrice,
    rating,
    search,
    featured,
    inStock,
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Rating filter
  if (rating) {
    query.averageRating = { $gte: Number(rating) };
  }

  // Featured filter
  if (featured === 'true') {
    query.isFeatured = true;
  }

  // In stock filter
  if (inStock === 'true') {
    query.stock = { $gt: 0 };
  }

  // Search filter - enhanced with regex for better matching
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { 'specifications.key': searchRegex },
      { 'specifications.value': searchRegex },
    ];
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Execute query
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(Number(limit))
    .skip(skip);

  // Get total count
  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      products,
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
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Try to find by ID first, then by slug
  let product = await Product.findById(id).populate('category', 'name slug');
  
  if (!product) {
    product = await Product.findOne({ slug: id }).populate('category', 'name slug');
  }

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      product,
    },
  });
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };

  // Convert specifications array to Map if it's an array
  if (Array.isArray(productData.specifications)) {
    const specsMap = new Map();
    productData.specifications.forEach(spec => {
      if (spec.key && spec.value) {
        specsMap.set(spec.key, spec.value);
      }
    });
    productData.specifications = Object.fromEntries(specsMap);
  }

  // Convert features array to proper format if needed
  if (productData.features && !Array.isArray(productData.features)) {
    productData.features = [];
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: {
      product,
    },
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const updateData = { ...req.body };

  // Convert specifications array to Map if it's an array
  if (Array.isArray(updateData.specifications)) {
    const specsMap = new Map();
    updateData.specifications.forEach(spec => {
      if (spec.key && spec.value) {
        specsMap.set(spec.key, spec.value);
      }
    });
    updateData.specifications = Object.fromEntries(specsMap);
  }

  // Convert features array to proper format if needed
  if (updateData.features && !Array.isArray(updateData.features)) {
    updateData.features = [];
  }

  product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: {
      product,
    },
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (error) {
        logger.error(`Failed to delete image from Cloudinary: ${error.message}`);
      }
    }
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * @desc    Upload product images
 * @route   POST /api/products/:id/images
 * @access  Private/Admin
 */
export const uploadProductImages = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (!req.files || req.files.length === 0) {
    throw new AppError('Please upload at least one image', 400);
  }

  const uploadedImages = [];

  // Upload images to Cloudinary from memory buffer
  for (const file of req.files) {
    try {
      // Convert buffer to base64 for Cloudinary upload
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'hardware-store/products',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      logger.error(`Failed to upload image to Cloudinary: ${error.message}`);
      throw new AppError('Failed to upload images', 500);
    }
  }

  // Add images to product
  product.images.push(...uploadedImages);
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: {
      images: uploadedImages,
    },
  });
});

/**
 * @desc    Delete product image
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private/Admin
 */
export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const image = product.images.id(imageId);

  if (!image) {
    throw new AppError('Image not found', 404);
  }

  // Delete from Cloudinary
  try {
    await cloudinary.uploader.destroy(image.public_id);
  } catch (error) {
    logger.error(`Failed to delete image from Cloudinary: ${error.message}`);
  }

  // Remove from product
  product.images.pull(imageId);
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Image deleted successfully',
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: {
      products,
    },
  });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: {
      products: relatedProducts,
    },
  });
});
