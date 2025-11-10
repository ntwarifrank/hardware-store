import { useState } from 'react';
import { Mail, MessageCircle, Phone, Send, MapPin, Clock, HelpCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../hooks/useAuth';

const Help = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const whatsappNumber = '+250725382459';
  const supportEmail = 'ugwanezav@gmail.com';

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axiosClient.post('/contacts', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I need help with Hardware Store.');
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Hardware Store - Support Request');
    const body = encodeURIComponent(
      'Hello Hardware Store Team,\n\n' +
      'I need assistance with:\n\n' +
      '[Please describe your issue here]\n\n' +
      'Thank you for your support!\n\n' +
      'Best regards'
    );
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Orders" section. Each order has a tracking number that you can use to monitor your delivery status.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept MTN Mobile Money, Airtel Money, and Cash on Delivery for your convenience.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for most items. Products must be unused and in original packaging. Please contact our support team to initiate a return.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 1-3 business days within Kigali and 3-5 business days for other regions in Rwanda.'
    },
    {
      question: 'Do you offer warranty on products?',
      answer: 'Yes, most of our products come with manufacturer warranty. The warranty period varies by product and is specified on each product page.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How Can We Help You?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get in touch with us. We're here to assist you!
          </p>
        </div>

        {/* My Messages Banner for authenticated users */}
        {isAuthenticated && (
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <MessageSquare size={32} className="text-white" />
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-1">Check Your Support Messages</h3>
                  <p className="text-purple-100 text-sm">
                    View your conversations with our support team and get instant replies
                  </p>
                </div>
              </div>
              <Link
                to="/my-messages"
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <MessageSquare size={20} />
                View My Messages
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact via WhatsApp */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 mx-auto">
              <MessageCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              WhatsApp Help
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Chat with us instantly on WhatsApp for quick support
            </p>
            <div className="text-center mb-4">
              <a href={`tel:${whatsappNumber}`} className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {whatsappNumber}
              </a>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </button>
          </div>

          {/* Contact via Email */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 mx-auto">
              <Mail className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Email Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Need help? Send us an email and we'll respond within 24 hours
            </p>
            <div className="text-center mb-4">
              <a href={`mailto:${supportEmail}`} className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {supportEmail}
              </a>
            </div>
            <button
              onClick={handleEmailClick}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Send Email
            </button>
          </div>

          {/* Phone Support */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4 mx-auto">
              <Phone className="text-orange-600 dark:text-orange-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Call Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Need help? Give us a call and we'll assist you right away
            </p>
            <div className="text-center mb-4">
              <a href={`tel:${whatsappNumber}`} className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {whatsappNumber}
              </a>
            </div>
            <button
              onClick={() => window.location.href = `tel:${whatsappNumber}`}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call Us
            </button>
          </div>
        </div>

        {/* Business Hours & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-primary-600 dark:text-primary-400" size={24} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Business Hours</h3>
            </div>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-semibold text-gray-900 dark:text-white">8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-semibold text-gray-900 dark:text-white">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-semibold text-gray-900 dark:text-white">10:00 AM - 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-primary-600 dark:text-primary-400" size={24} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Our Location</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              KG 11 Ave, Kigali, Rwanda
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Visit our physical store for in-person assistance
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact-section" className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium mb-2">
                ✅ Message sent successfully!
              </p>
              <p className="text-green-600 dark:text-green-300 text-sm">
                Thank you for contacting us! Our support team will reply within 24 hours.
              </p>
              {isAuthenticated && (
                <Link
                  to="/my-messages"
                  className="mt-3 inline-flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline font-medium"
                >
                  <MessageSquare size={18} />
                  View your messages and replies
                </Link>
              )}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250 XXX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">For WhatsApp replies from our support team</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-primary-600 dark:text-primary-400" size={32} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-gray-600 dark:text-gray-400 p-4 pt-2">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Still Have Questions Section */}
        <div className="card text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Still have questions?
            </h3>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact-section');
                contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-lg font-semibold transition-colors group"
            >
              <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
              Contact our support team
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
