import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Contact from '../models/Contact.js';
import logger from '../utils/logger.js';

/**
 * @desc    Create new contact message
 * @route   POST /api/contacts
 * @access  Public
 */
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone: phone || '',
    subject,
    message,
    user: req.user?._id || null,
  });

  logger.info(`New contact message from: ${email}`);

  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully! We will get back to you within 24 hours.',
    data: {
      contact,
    },
  });
});

/**
 * @desc    Get all contact messages (Admin only)
 * @route   GET /api/contacts
 * @access  Private/Admin
 */
export const getContacts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    sort = '-createdAt',
  } = req.query;

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Execute query
  const contacts = await Contact.find(query)
    .populate('user', 'name email')
    .sort(sort)
    .limit(Number(limit))
    .skip(skip);

  // Get total count
  const total = await Contact.countDocuments(query);

  // Get counts by status
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts = {
    new: 0,
    read: 0,
    replied: 0,
    resolved: 0,
  };

  stats.forEach((stat) => {
    statusCounts[stat._id] = stat.count;
  });

  res.status(200).json({
    success: true,
    data: {
      contacts,
      stats: statusCounts,
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
 * @desc    Get single contact message
 * @route   GET /api/contacts/:id
 * @access  Private/Admin
 */
export const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id).populate('user', 'name email phone');

  if (!contact) {
    throw new AppError('Contact message not found', 404);
  }

  // Mark as read if status is new
  if (contact.status === 'new') {
    contact.status = 'read';
    await contact.save();
  }

  res.status(200).json({
    success: true,
    data: {
      contact,
    },
  });
});

/**
 * @desc    Update contact message status
 * @route   PUT /api/contacts/:id
 * @access  Private/Admin
 */
export const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, priority, adminNotes, adminReply } = req.body;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new AppError('Contact message not found', 404);
  }

  if (status) contact.status = status;
  if (priority) contact.priority = priority;
  if (adminNotes !== undefined) contact.adminNotes = adminNotes;
  if (adminReply !== undefined) {
    contact.adminReply = adminReply;
    contact.repliedBy = req.user._id;
  }

  if ((status === 'replied' || adminReply) && !contact.repliedAt) {
    contact.repliedAt = new Date();
  }

  await contact.save();

  res.status(200).json({
    success: true,
    message: 'Contact message updated successfully',
    data: {
      contact,
    },
  });
});

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contacts/:id
 * @access  Private/Admin
 */
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    throw new AppError('Contact message not found', 404);
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Contact message deleted successfully',
  });
});

/**
 * @desc    Get contact statistics
 * @route   GET /api/contacts/stats
 * @access  Private/Admin
 */
/**
 * @desc    Get user's own contact messages
 * @route   GET /api/contacts/my-messages
 * @access  Private (authenticated users)
 */
export const getMyMessages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  logger.info(`Fetching messages for user: ${req.user.email} (ID: ${req.user._id})`);

  // Get messages by email (for non-logged-in submissions) or user ID
  const query = {
    $or: [
      { email: req.user.email },
      { user: req.user._id }
    ]
  };

  logger.info(`Query: ${JSON.stringify(query)}`);

  const messages = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('repliedBy', 'name');

  logger.info(`Found ${messages.length} messages for user`);

  const total = await Contact.countDocuments(query);
  const unreadReplies = await Contact.countDocuments({
    ...query,
    adminReply: { $ne: '' },
    status: { $ne: 'resolved' }
  });

  res.status(200).json({
    success: true,
    data: {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadReplies,
    },
  });
});

export const getContactStats = asyncHandler(async (req, res) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalMessages = await Contact.countDocuments();
  const newMessages = await Contact.countDocuments({ status: 'new' });

  res.status(200).json({
    success: true,
    data: {
      total: totalMessages,
      new: newMessages,
      byStatus: stats,
    },
  });
});
