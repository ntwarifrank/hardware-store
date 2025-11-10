import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
      maxlength: [500, 'Message cannot be more than 500 characters'],
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'promotion', 'announcement'],
      default: 'info',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'users', 'admins'],
      default: 'all',
    },
    link: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: 'bell',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isActive: 1 });
notificationSchema.index({ targetAudience: 1 });
notificationSchema.index({ expiresAt: 1 });

// Automatically deactivate expired notifications
notificationSchema.pre('find', function () {
  this.where({ $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] });
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
