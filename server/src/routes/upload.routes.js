import express from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload single image
router.post('/image', protect, authorize('admin'), uploadSingle, uploadImage);

// Delete image
router.delete('/image/:publicId', protect, authorize('admin'), deleteImage);

export default router;
