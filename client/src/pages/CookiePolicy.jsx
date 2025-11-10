import { Link } from 'react-router-dom';
import { Cookie, Settings, Eye, Shield, Info, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const CookiePolicy = () => {
  const lastUpdated = 'November 8, 2024';
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled
    functional: true,
    analytics: true,
    advertising: false
  });

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved successfully!');
  };

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      required: true,
      key: 'essential',
      description: 'These cookies are necessary for the website to function and cannot be disabled.',
      examples: [
        'Authentication cookies (keeping you logged in)',
        'Security cookies (preventing fraudulent activity)',
        'Shopping cart cookies (remembering your cart items)',
        'Session cookies (maintaining your session state)'
      ],
      duration: 'Session or up to 30 days'
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      required: false,
      key: 'functional',
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: [
        'Language preferences',
        'Region settings',
        'Theme preferences (dark/light mode)',
        'Currency display preferences',
        'Recently viewed products'
      ],
      duration: 'Up to 1 year'
    },
    {
      icon: Eye,
      title: 'Analytics Cookies',
      required: false,
      key: 'analytics',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        'Google Analytics (visitor statistics)',
        'Page views and bounce rates',
        'Time spent on pages',
        'Navigation patterns',
        'Device and browser information'
      ],
      duration: 'Up to 2 years'
    },
    {
      icon: Info,
      title: 'Advertising Cookies',
      required: false,
      key: 'advertising',
      description: 'These cookies are used to deliver personalized advertisements.',
      examples: [
        'Targeted advertising based on browsing history',
        'Remarketing cookies',
        'Social media advertising pixels',
        'Third-party advertising networks'
      ],
      duration: 'Up to 1 year'
    }
  ];

  const specificCookies = [
    {
      name: 'auth_token',
      purpose: 'Authentication',
      type: 'Essential',
      duration: '30 days',
      party: 'First-party'
    },
    {
      name: 'cart_items',
      purpose: 'Shopping cart',
      type: 'Essential',
      duration: '7 days',
      party: 'First-party'
    },
    {
      name: 'theme_preference',
      purpose: 'UI preferences',
      type: 'Functional',
      duration: '1 year',
      party: 'First-party'
    },
    {
      name: '_ga',
      purpose: 'Google Analytics',
      type: 'Analytics',
      duration: '2 years',
      party: 'Third-party'
    },
    {
      name: '_gid',
      purpose: 'Google Analytics',
      type: 'Analytics',
      duration: '24 hours',
      party: 'Third-party'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Cookie className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-center text-primary-100">
            Understanding how we use cookies on our platform
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What Are Cookies?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            BuildMart Hardware Store uses cookies to enhance your browsing experience, remember your preferences, and analyze how our platform is used. This Cookie Policy explains what cookies we use and why.
          </p>
        </div>

        {/* Types of Cookies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Types of Cookies We Use
          </h2>
          {cookieTypes.map((type, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <type.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {type.title}
                    </h3>
                    {type.required && (
                      <span className="inline-block mt-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
                        Always Active
                      </span>
                    )}
                  </div>
                </div>
                {!type.required && (
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookiePreferences[type.key]}
                      onChange={(e) => setCookiePreferences({
                        ...cookiePreferences,
                        [type.key]: e.target.checked
                      })}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {type.description}
              </p>

              <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Examples:
                </h4>
                <ul className="space-y-2">
                  {type.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {example}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Duration:</strong> {type.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Save Preferences Button */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Cookie Preferences
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize your cookie settings above and save your preferences
              </p>
            </div>
            <button
              onClick={handleSavePreferences}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Specific Cookies Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Specific Cookies We Use
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Cookie Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Purpose
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {specificCookies.map((cookie, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-primary-600 dark:text-primary-400">
                        {cookie.name}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {cookie.purpose}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded">
                        {cookie.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {cookie.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Third-Party Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Google Analytics
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                We use Google Analytics to understand how visitors use our website.
              </p>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Google Privacy Policy →
              </a>
            </div>
          </div>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Manage Cookies
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                View what cookies are stored and delete them individually
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Block third-party cookies
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Block cookies from specific websites
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Block all cookies
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                Delete all cookies when you close your browser
              </span>
            </li>
          </ul>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                  Important Note
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Blocking all cookies may affect your experience on our website. Some features may not work properly without cookies enabled.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            For more information on managing cookies in different browsers:
          </p>
          <div className="mt-3 space-y-2">
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm">
              Google Chrome →
            </a>
            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm">
              Mozilla Firefox →
            </a>
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm">
              Safari →
            </a>
            <a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm">
              Microsoft Edge →
            </a>
          </div>
        </div>

        {/* Updates to Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Questions About Cookies?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
            If you have questions about our use of cookies, please contact us:
          </p>
          <div className="flex justify-center">
            <a
              href="mailto:ugwanezav@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Contact Support
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
                How we handle your personal data
              </p>
            </Link>
            <Link
              to="/terms"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1">
                Terms & Conditions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rules for using our platform
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

export default CookiePolicy;
