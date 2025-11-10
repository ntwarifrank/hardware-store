import { Link } from 'react-router-dom';
import { FileText, ShoppingCart, CreditCard, Truck, RefreshCw, AlertTriangle, Shield, Scale } from 'lucide-react';

const TermsConditions = () => {
  const lastUpdated = 'November 8, 2024';

  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using BuildMart Hardware Store\'s website and services, you accept and agree to be bound by these Terms and Conditions.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to update these terms at any time, and your continued use constitutes acceptance of any changes.'
      ]
    },
    {
      icon: ShoppingCart,
      title: 'Product Information & Availability',
      content: [
        'We strive to provide accurate product descriptions, images, and pricing information.',
        'All products are subject to availability. We reserve the right to limit quantities or discontinue products.',
        'Prices are listed in US Dollars (USD) and are subject to change without notice.',
        'Product images are for illustration purposes and actual products may vary slightly.',
        'We do not guarantee that product descriptions or other content are error-free.',
        'In case of errors, we reserve the right to cancel or refuse orders.'
      ]
    },
    {
      icon: CreditCard,
      title: 'Pricing & Payment',
      content: [
        'All prices include 18% VAT as required by Rwanda tax law.',
        'Payment must be made at the time of order placement unless otherwise arranged.',
        'We accept the following payment methods: MTN Mobile Money, Airtel Money, Bank Transfer, Cash on Delivery, and Credit/Debit Cards.',
        'For mobile money payments, you must complete the transaction within 3 minutes.',
        'Failed or cancelled payments will result in order cancellation.',
        'We reserve the right to verify payment information before processing orders.',
        'Promotional prices and discounts are subject to terms and conditions specific to each offer.'
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      content: [
        'We offer delivery services throughout Rwanda with varying shipping costs and timeframes.',
        'Standard Delivery: $50 (3-5 business days)',
        'Express Delivery: $100 (1-2 business days)',
        'Same-Day Delivery: $150 (same day within Kigali)',
        'Delivery times are estimates and not guaranteed.',
        'We are not responsible for delays caused by weather, traffic, or other unforeseen circumstances.',
        'You must provide accurate delivery information. We are not liable for failed deliveries due to incorrect addresses.',
        'Someone must be available to receive the delivery. Additional delivery fees may apply for re-delivery attempts.'
      ]
    },
    {
      icon: RefreshCw,
      title: 'Returns & Refunds',
      content: [
        'You have 30 days from the date of delivery to return products for a full refund.',
        'Products must be unused, in original packaging, and in resalable condition.',
        'To initiate a return, contact our customer service team at ugwanezav@gmail.com.',
        'Shipping costs are non-refundable unless the return is due to our error.',
        'Refunds will be processed within 5-7 business days after we receive and inspect the returned items.',
        'Certain items may not be eligible for return (custom orders, clearance items, opened electrical products).',
        'Damaged or defective items must be reported within 48 hours of delivery.'
      ]
    },
    {
      icon: Shield,
      title: 'Warranty',
      content: [
        'All products come with manufacturer warranties as specified in product descriptions.',
        'Warranty periods vary by product and manufacturer (typically 6-24 months).',
        'Warranty claims must be made during the warranty period with proof of purchase.',
        'Warranties do not cover damage caused by misuse, accidents, or normal wear and tear.',
        'For warranty service, contact us with your order number and description of the issue.',
        'We will repair, replace, or refund defective products at our discretion.',
        'Extended warranty options may be available for certain products.'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'User Responsibilities',
      content: [
        'You must be at least 18 years old to make purchases on our platform.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration and checkout.',
        'You are responsible for all activities that occur under your account.',
        'Notify us immediately of any unauthorized use of your account.',
        'You agree not to use our platform for any illegal or unauthorized purposes.',
        'You agree not to attempt to interfere with the proper functioning of our platform.'
      ]
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      content: [
        'We provide our services "as is" without warranties of any kind, express or implied.',
        'We are not liable for any indirect, incidental, special, or consequential damages.',
        'Our total liability for any claim shall not exceed the amount paid for the product in question.',
        'We are not responsible for delays or failures in performance caused by circumstances beyond our control.',
        'We do not warrant that our website will be uninterrupted, secure, or error-free.',
        'You use our platform at your own risk.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-center text-primary-100">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-center text-primary-200 mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Welcome to BuildMart Hardware Store. These Terms and Conditions ("Terms") govern your use of our website, mobile application, and services. By accessing or using our platform, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            These Terms constitute a legally binding agreement between you and BuildMart Hardware Store Ltd, a company registered in Rwanda. Please read them carefully.
          </p>
        </div>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <section.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>

            <ul className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Intellectual Property */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Intellectual Property
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content on this platform, including text, graphics, logos, images, and software, is the property of BuildMart Hardware Store or its content suppliers and is protected by Rwanda and international copyright laws.
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  You may not reproduce, distribute, or create derivative works without written permission.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Product images and descriptions are for personal, non-commercial use only.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Dispute Resolution & Governing Law
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Rwanda.
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Any disputes shall first be resolved through good faith negotiations.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  If negotiations fail, disputes shall be resolved in the competent courts of Kigali, Rwanda.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Account Termination
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Violation of these Terms and Conditions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Fraudulent or illegal activity
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  Abuse of our services or staff
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Questions About These Terms?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:ugwanezav@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+250725382459"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>

        {/* Related Policies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Related Policies
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/privacy"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1">
                Privacy Policy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn how we protect your data
              </p>
            </Link>
            <Link
              to="/cookies"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1">
                Cookie Policy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How we use cookies
              </p>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
