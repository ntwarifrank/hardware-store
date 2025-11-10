import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../middleware/errorMiddleware.js';

// Configure Cloudinary (if using Cloudinary)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload single image
 * @route POST /api/upload/image
 * @access Private (Admin)
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    // If Cloudinary is configured, upload to Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // Convert buffer to base64
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: 'hardware-store/products',
        resource_type: 'image',
      });

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        url: result.secure_url,
        public_id: result.public_id,
      });
    } else {
      // Fallback: Save to local storage (for development)
      // In production, you should use a cloud storage service
      const fs = require('fs');
      const path = require('path');
      
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads', 'products');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(req.file.originalname)}`;
      const filepath = path.join(uploadDir, filename);

      // Save file
      fs.writeFileSync(filepath, req.file.buffer);

      // Return local URL
      const url = `/uploads/products/${filename}`;
      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        url: `${process.env.BASE_URL || 'http://localhost:5000'}${url}`,
        public_id: filename,
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    next(new AppError('Failed to upload image', 500));
  }
};

/**
 * Delete image from Cloudinary
 * @route DELETE /api/upload/image/:publicId
 * @access Private (Admin)
 */
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return next(new AppError('Public ID is required', 400));
    }

    // If Cloudinary is configured, delete from Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    next(new AppError('Failed to delete image', 500));
  }
};
