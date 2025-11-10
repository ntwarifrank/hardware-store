import nodemailer from 'nodemailer';
import logger from './logger.js';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    throw error;
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email, name) => {
  const subject = '🎉 Welcome to BuildMart Hardware!';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <span style="font-size: 40px;">🎉</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome to BuildMart!</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
            Hi <strong style="color: #f97316;">${name}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Thank you for joining <strong>BuildMart Hardware Store</strong>. We're excited to have you as part of our community!
          </p>
          
          <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border-left: 4px solid #f97316; padding: 20px; border-radius: 8px; margin: 0 0 30px 0;">
            <h2 style="color: #f97316; font-size: 18px; margin: 0 0 10px 0; font-weight: 700;">🛠️ What's Next?</h2>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Browse our wide selection of quality hardware products</li>
              <li>Discover professional tools for your projects</li>
              <li>Enjoy exclusive member discounts</li>
              <li>Get expert advice from our support team</li>
            </ul>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" 
               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
              🛒 Start Shopping
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            If you have any questions, feel free to reach out to our support team.
          </p>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center;">
            <p style="color: #374151; margin: 0; font-size: 15px;">
              Best regards,<br>
              <strong style="color: #f97316;">The BuildMart Hardware Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Brand Footer -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 13px; opacity: 0.9;">
            © 2024 BuildMart Hardware Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  const text = `Welcome to BuildMart Hardware Store! Hi ${name}, Thank you for joining us.`;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send OTP verification email
 */
export const sendOTPEmail = async (email, name, otp) => {
  const subject = '🔐 Verify Your Email - BuildMart Hardware';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <span style="font-size: 40px;">🔐</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Email Verification</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi <strong>${name}</strong>,</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Thank you for registering with <strong>BuildMart Hardware Store</strong>. To complete your registration, please use the verification code below:
          </p>
          
          <!-- OTP Code Box -->
          <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 3px solid #f97316; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.15);">
            <p style="color: #9a3412; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Your Verification Code</p>
            <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; border-radius: 8px; margin: 10px 0;">
              <h2 style="color: white; font-size: 42px; letter-spacing: 12px; margin: 0; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${otp}</h2>
            </div>
          </div>
          
          <!-- Important Notice -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
            If you didn't create an account with BuildMart Hardware Store, please ignore this email.
          </p>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
            <p style="color: #374151; margin: 0; font-size: 15px;">
              Best regards,<br>
              <strong style="color: #f97316;">The BuildMart Hardware Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Brand Footer -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 13px; opacity: 0.9;">
            © 2024 BuildMart Hardware Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  const text = `Hi ${name}, Your verification code is: ${otp}. This code will expire in 10 minutes.`;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const subject = '🔑 Password Reset Request - BuildMart Hardware';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <span style="font-size: 40px;">🔑</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Password Reset Request</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello,</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            You requested to reset your password for your <strong>BuildMart Hardware Store</strong> account.
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Click the button below to create a new password:
          </p>
          
          <!-- Reset Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 18px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
              🔐 Reset My Password
            </a>
          </div>
          
          <!-- Alternative Link -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">Or copy and paste this link in your browser:</p>
            <p style="color: #f97316; font-size: 13px; word-break: break-all; margin: 0;">${resetUrl}</p>
          </div>
          
          <!-- Important Notice -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #92400e; font-weight: 600; font-size: 15px; margin: 0 0 12px 0;">⚠️ Important:</p>
            <ul style="color: #92400e; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will not change until you create a new one</li>
            </ul>
          </div>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
            <p style="color: #374151; margin: 0; font-size: 15px;">
              Best regards,<br>
              <strong style="color: #f97316;">The BuildMart Hardware Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Brand Footer -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 13px; opacity: 0.9;">
            © 2024 BuildMart Hardware Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  const text = `Password reset request. Click this link to reset your password: ${resetUrl}. This link expires in 1 hour.`;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (email, orderDetails) => {
  const { orderId, items, total, shippingAddress } = orderDetails;
  const subject = `✅ Order Confirmation - #${orderId}`;
  
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #374151; font-size: 15px; font-weight: 600;">${item.name || 'Product'}</p>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 13px;">Quantity: ${item.quantity}</p>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <p style="margin: 0; color: #f97316; font-size: 16px; font-weight: 700;">${(item.price * item.quantity).toLocaleString()} RWF</p>
      </td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <span style="font-size: 40px;">✅</span>
          </div>
          <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Order Confirmed!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">Thank you for your order</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Your order has been confirmed and will be shipped soon.
          </p>
          
          <!-- Order ID Box -->
          <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #f97316; padding: 20px; border-radius: 12px; margin: 0 0 30px 0; text-align: center;">
            <p style="color: #9a3412; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order ID</p>
            <p style="color: #ea580c; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px;">${orderId}</p>
          </div>
          
          <!-- Order Details Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #111827; font-size: 22px; margin: 0 0 20px 0; font-weight: 700; border-bottom: 3px solid #f97316; padding-bottom: 10px;">📦 Order Details</h2>
            
            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px 0;">
              <thead>
                <tr style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);">
                  <th style="padding: 15px; text-align: left; color: white; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
                  <th style="padding: 15px; text-align: right; color: white; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <!-- Total -->
            <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; border-radius: 8px; text-align: right;">
              <p style="color: rgba(255,255,255,0.9); margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Total Amount</p>
              <p style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${total.toLocaleString()} RWF</p>
            </div>
          </div>
          
          <!-- Shipping Address Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #111827; font-size: 22px; margin: 0 0 20px 0; font-weight: 700; border-bottom: 3px solid #f97316; padding-bottom: 10px;">🚚 Shipping Address</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316;">
              <p style="color: #374151; margin: 0; line-height: 1.8; font-size: 15px;">
                <strong style="color: #111827;">${shippingAddress.street}</strong><br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                <strong>${shippingAddress.country}</strong>
              </p>
            </div>
          </div>
          
          <!-- Track Order CTA -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${orderId}" 
               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
              📍 Track Your Order
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            You can track your order status anytime in your account.
          </p>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center;">
            <p style="color: #374151; margin: 0; font-size: 15px;">
              Best regards,<br>
              <strong style="color: #f97316;">The BuildMart Hardware Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Brand Footer -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 13px; opacity: 0.9;">
            © 2024 BuildMart Hardware Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  const text = `Order confirmed! Order ID: ${orderId}. Total: ${total.toLocaleString()} RWF. You can track your order in your account.`;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send order status update email
 */
export const sendOrderStatusEmail = async (email, orderId, status) => {
  const subject = `📦 Order Status Update - #${orderId}`;
  
  const statusConfig = {
    processing: {
      emoji: '⚙️',
      title: 'Order is Being Processed',
      message: 'Your order is being processed and will be shipped soon.',
      color: '#f59e0b'
    },
    shipped: {
      emoji: '🚚',
      title: 'Order Has Been Shipped',
      message: 'Great news! Your order is on its way to you.',
      color: '#f97316'
    },
    delivered: {
      emoji: '✅',
      title: 'Order Delivered',
      message: 'Your order has been successfully delivered. Enjoy your purchase!',
      color: '#10b981'
    },
    cancelled: {
      emoji: '❌',
      title: 'Order Cancelled',
      message: 'Your order has been cancelled. If you have questions, please contact us.',
      color: '#ef4444'
    }
  };

  const config = statusConfig[status] || {
    emoji: '📋',
    title: 'Order Status Updated',
    message: 'Your order status has been updated.',
    color: '#6b7280'
  };

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05); overflow: hidden;">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%); padding: 40px 30px; text-align: center;">
          <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <span style="font-size: 40px;">${config.emoji}</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Order Status Update</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Order ID Box -->
          <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); border: 2px solid #f97316; padding: 20px; border-radius: 12px; margin: 0 0 30px 0; text-align: center;">
            <p style="color: #9a3412; font-size: 13px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order ID</p>
            <p style="color: #ea580c; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px;">${orderId}</p>
          </div>
          
          <!-- Status Box -->
          <div style="background-color: #f9fafb; border-left: 4px solid ${config.color}; padding: 25px; border-radius: 8px; margin: 0 0 30px 0;">
            <h2 style="color: #111827; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">${config.emoji} ${config.title}</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">${config.message}</p>
          </div>
          
          <!-- View Order CTA -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/orders/${orderId}" 
               style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
              📋 View Order Details
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            You can view your complete order details and tracking information in your account.
          </p>
          
          <!-- Footer -->
          <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center;">
            <p style="color: #374151; margin: 0; font-size: 15px;">
              Best regards,<br>
              <strong style="color: #f97316;">The BuildMart Hardware Team</strong>
            </p>
          </div>
        </div>
        
        <!-- Brand Footer -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 13px; opacity: 0.9;">
            © 2024 BuildMart Hardware Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
  const text = `Order ${orderId} status: ${status}. ${config.message}`;

  await sendEmail({ to: email, subject, text, html });
};

/**
 * Send discount notification email to all users
 */
export const sendDiscountNotificationEmail = async (email, name, discountDetails) => {
  const { code, discountName, description, type, value, minimumPurchase, endDate } = discountDetails;
  
  // Format discount value display
  const discountValue = type === 'percentage' ? `${value}% OFF` : `${value} RWF OFF`;
  
  // Format end date
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subject = `🎉 New Discount Alert - ${code}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Header with emoji -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ea580c; font-size: 32px; margin: 0;">🎉 Exclusive Discount!</h1>
        </div>

        <!-- Greeting -->
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Great news! We have a special discount just for you!</p>

        <!-- Discount Code Box -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.3);">
          <p style="color: white; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">Your Discount Code</p>
          <h2 style="color: white; font-size: 36px; margin: 0; letter-spacing: 4px; font-weight: bold;">${code}</h2>
        </div>

        <!-- Discount Details -->
        <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0;">
          <h3 style="color: #c2410c; margin: 0 0 15px 0; font-size: 20px;">${discountName}</h3>
          ${description ? `<p style="color: #7c2d12; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">${description}</p>` : ''}
          
          <div style="margin-top: 15px;">
            <p style="color: #9a3412; margin: 5px 0; font-size: 16px;">
              <strong>💰 Discount:</strong> <span style="color: #ea580c; font-weight: bold; font-size: 18px;">${discountValue}</span>
            </p>
            ${minimumPurchase ? `
              <p style="color: #9a3412; margin: 5px 0; font-size: 14px;">
                <strong>📦 Minimum Purchase:</strong> ${minimumPurchase.toLocaleString()} RWF
              </p>
            ` : ''}
            <p style="color: #9a3412; margin: 5px 0; font-size: 14px;">
              <strong>⏰ Valid Until:</strong> ${formattedEndDate}
            </p>
          </div>
        </div>

        <!-- How to Use -->
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">How to Use:</h4>
          <ol style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 14px;">
            <li>Browse and add items to your cart</li>
            <li>Go to checkout</li>
            <li>Enter code <strong style="color: #ea580c;">${code}</strong> in the discount field</li>
            <li>Enjoy your savings! 🎊</li>
          </ol>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" 
             style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.3);">
            🛍️ Shop Now
          </a>
        </div>

        <!-- Footer Note -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #ef4444; font-size: 13px; margin: 0;">
            ⚠️ <strong>Hurry!</strong> This offer is valid until ${formattedEndDate}. Don't miss out!
          </p>
        </div>

        <p style="color: #374151; margin-top: 30px; font-size: 14px;">
          Happy Shopping!<br>
          <strong>The BuildMart Hardware Team</strong>
        </p>
      </div>
      
      <!-- Footer -->
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
        © 2024 BuildMart Hardware Store. All rights reserved.
      </p>
    </div>
  `;

  const text = `
New Discount Available!

Code: ${code}
Discount: ${discountValue}
${minimumPurchase ? `Minimum Purchase: ${minimumPurchase.toLocaleString()} RWF` : ''}
Valid Until: ${formattedEndDate}

${description || ''}

Visit ${process.env.CLIENT_URL || 'http://localhost:5173'}/products to start shopping!
  `;

  await sendEmail({ to: email, subject, text, html });
};

export default sendEmail;
