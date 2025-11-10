import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = 'November 8, 2024';

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Personal Information',
          items: [
            'Name, email address, and phone number when you register',
            'Delivery address for order fulfillment',
            'Payment information (processed securely through third-party providers)',
            'Order history and preferences'
          ]
        },
        {
          subtitle: 'Technical Information',
          items: [
            'IP address and browser type',
            'Device information and operating system',
            'Cookies and usage data',
            'Pages visited and time spent on our platform'
          ]
        }
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Primary Uses',
          items: [
            'Process and fulfill your orders',
            'Send order confirmations and shipping updates',
            'Respond to customer service inquiries',
            'Improve our products and services',
            'Send promotional emails (with your consent)',
            'Detect and prevent fraudulent transactions',
            'Comply with legal obligations in Rwanda'
          ]
        }
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Security Measures',
          items: [
            'SSL encryption for all data transmission',
            'Secure payment processing through MTN Mobile Money and Airtel Money',
            'Regular security audits and updates',
            'Restricted access to personal information',
            'Password hashing and secure authentication',
            'Compliance with Rwanda data protection regulations'
          ]
        }
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Under Rwanda Law',
          items: [
            'Access your personal data',
            'Request correction of inaccurate data',
            'Request deletion of your data',
            'Opt-out of marketing communications',
            'Export your data in a portable format',
            'Lodge a complaint with regulatory authorities'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-center text-primary-100">
            Your privacy is important to us
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
            Welcome to BuildMart Hardware Store ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If you have any questions or concerns about this policy or our practices with regards to your personal information, please contact us at ugwanezav@gmail.com.
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

            {section.content.map((subsection, subIndex) => (
              <div key={subIndex} className="mb-6 last:mb-0">
                {subsection.subtitle && (
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {subsection.subtitle}
                  </h3>
                )}
                <ul className="space-y-2">
                  {subsection.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {/* Third-Party Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Third-Party Services
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Payment Processors
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                We use the following third-party payment services:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>MTN Mobile Money:</strong> Processes mobile payments in Rwanda
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Airtel Money:</strong> Processes mobile payments in Rwanda
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cookies and Tracking
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          <Link
            to="/cookies"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Read our Cookie Policy
            <span className="ml-1">→</span>
          </Link>
        </div>

        {/* Data Retention */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Data Retention
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="mailto:ugwanezav@gmail.com"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                <div className="font-medium text-gray-900 dark:text-white">ugwanezav@gmail.com</div>
              </div>
            </a>
            <a
              href="tel:+250725382459"
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                <div className="font-medium text-gray-900 dark:text-white">+250 725 382 459</div>
              </div>
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
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

export default PrivacyPolicy;
