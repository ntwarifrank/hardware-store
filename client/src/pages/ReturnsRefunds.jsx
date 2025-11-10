import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle, XCircle, Package, CreditCard, Clock, AlertTriangle, Mail, Phone } from 'lucide-react';

const ReturnsRefunds = () => {
  const returnReasons = [
    {
      icon: Package,
      title: 'Defective Product',
      description: 'Product arrived damaged or not working',
      eligible: true,
      timeframe: '48 hours',
      refundType: 'Full refund or replacement'
    },
    {
      icon: XCircle,
      title: 'Wrong Item',
      description: 'Received different product than ordered',
      eligible: true,
      timeframe: '7 days',
      refundType: 'Full refund + free return shipping'
    },
    {
      icon: AlertTriangle,
      title: 'Changed Mind',
      description: 'No longer need the product',
      eligible: true,
      timeframe: '30 days',
      refundType: 'Full refund (minus shipping)'
    },
    {
      icon: CheckCircle,
      title: 'Not as Described',
      description: 'Product doesn\'t match description',
      eligible: true,
      timeframe: '14 days',
      refundType: 'Full refund or replacement'
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: 'Contact Us',
      description: 'Email ugwanezav@gmail.com or call +250 725 382 459 with your order number and reason for return',
      icon: Mail
    },
    {
      step: 2,
      title: 'Get Approval',
      description: 'We\'ll review your request and provide return authorization within 24 hours',
      icon: CheckCircle
    },
    {
      step: 3,
      title: 'Pack Items',
      description: 'Pack items securely in original packaging with all accessories and documentation',
      icon: Package
    },
    {
      step: 4,
      title: 'Ship Back',
      description: 'Ship items to our returns center. We\'ll provide the address and instructions',
      icon: RefreshCw
    },
    {
      step: 5,
      title: 'Inspection',
      description: 'We inspect returned items within 2-3 business days',
      icon: Clock
    },
    {
      step: 6,
      title: 'Refund',
      description: 'Refund processed within 5-7 business days after inspection',
      icon: CreditCard
    }
  ];

  const nonReturnableItems = [
    'Custom or personalized products',
    'Opened electrical items (safety reasons)',
    'Clearance or final sale items',
    'Products without original packaging',
    'Items damaged by customer misuse',
    'Products purchased more than 30 days ago'
  ];

  const refundMethods = [
    {
      method: 'MTN Mobile Money',
      time: '1-2 business days',
      note: 'Fastest refund option'
    },
    {
      method: 'Airtel Money',
      time: '1-2 business days',
      note: 'Quick mobile money refund'
    },
    {
      method: 'Bank Transfer',
      time: '3-5 business days',
      note: 'Direct to bank account'
    },
    {
      method: 'Original Payment Method',
      time: '5-7 business days',
      note: 'Refund to card used for purchase'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <RefreshCw className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Returns & Refunds
          </h1>
          <p className="text-xl text-center text-primary-100">
            Hassle-free 30-day return policy
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 30-Day Money Back Guarantee */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 mb-12 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            30-Day Money Back Guarantee
          </h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Not satisfied with your purchase? Return it within 30 days for a full refund. No questions asked.
          </p>
        </div>

        {/* Return Reasons */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Valid Return Reasons
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {returnReasons.map((reason, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <reason.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reason.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Report Within:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{reason.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Refund Type:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{reason.refundType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Return an Item
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <div className="space-y-8">
              {returnProcess.map((process, index) => (
                <div key={index}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                          {process.step}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <process.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {process.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300">
                            {process.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < returnProcess.length - 1 && (
                    <div className="ml-6 mt-4 h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">
                Non-Returnable Items
              </h2>
              <p className="text-red-800 dark:text-red-200 mb-4">
                The following items cannot be returned for safety, hygiene, or policy reasons:
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {nonReturnableItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-900 dark:text-red-200">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Refund Methods & Timeline
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <div className="space-y-4">
              {refundMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {method.method}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.note}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {method.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Important Return Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Original Condition:</strong> Items must be unused, in original packaging with all tags, accessories, and documentation.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Proof of Purchase:</strong> Order number or receipt required for all returns.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Return Shipping:</strong> Customer pays return shipping except for defective/wrong items.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Inspection:</strong> All returns are inspected. Items not meeting return criteria will be sent back to customer.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Partial Refunds:</strong> Items not in original condition may receive partial refund at our discretion.
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Option */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">
                Prefer an Exchange?
              </h2>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                If you'd prefer to exchange your item for a different size, color, or model, we can help with that! Exchanges are processed faster than returns and refunds.
              </p>
              <a
                href="mailto:ugwanezav@gmail.com?subject=Exchange Request"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Request an Exchange
              </a>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Need Help with a Return?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
            Our customer service team is ready to assist you with your return
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Email Us</div>
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
                <div className="text-sm text-gray-500 dark:text-gray-400">Call Us</div>
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

export default ReturnsRefunds;
