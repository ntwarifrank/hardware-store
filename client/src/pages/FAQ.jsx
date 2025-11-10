import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, Package, CreditCard, Truck, RefreshCw, Shield, User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      icon: Package,
      title: 'Orders & Products',
      faqs: [
        {
          question: 'How do I place an order?',
          answer: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in. Fill in your delivery details, select your payment method, and confirm your order.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can cancel or modify your order within 1 hour of placing it. Contact us immediately at ugwanezav@gmail.com or +250 725 382 459. Once the order is processed, modifications may not be possible.'
        },
        {
          question: 'How do I track my order?',
          answer: 'Log into your account and go to "My Orders". Click on the order you want to track to see real-time status updates. You\'ll also receive SMS notifications at each delivery stage.'
        },
        {
          question: 'What if an item is out of stock?',
          answer: 'Out of stock items are marked on the product page. You can sign up for stock alerts to be notified when the item is available. Alternatively, contact us for similar product recommendations or expected restock dates.'
        },
        {
          question: 'Are the product images accurate?',
          answer: 'We strive to provide accurate product images, but actual products may vary slightly in color or appearance. All products include detailed descriptions and specifications to help you make informed decisions.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept MTN Mobile Money, Airtel Money, Bank Transfer, Cash on Delivery, and Credit/Debit Cards (Visa, Mastercard). All payments are processed securely.'
        },
        {
          question: 'Is it safe to pay online?',
          answer: 'Yes, absolutely. We use SSL encryption and secure payment gateways. Your payment information is never stored on our servers. Mobile money payments are processed directly through MTN and Airtel\'s secure systems.'
        },
        {
          question: 'How long do I have to complete mobile money payment?',
          answer: 'For MTN Mobile Money and Airtel Money, you have 3 minutes to complete the payment after placing your order. You\'ll receive a prompt on your phone to enter your PIN. If the time expires, your order will be cancelled.'
        },
        {
          question: 'What if my payment fails?',
          answer: 'If your payment fails, you can try again or choose a different payment method. Common reasons for payment failure include insufficient funds, incorrect PIN, or network issues. Contact us if you continue to experience problems.'
        },
        {
          question: 'Do you charge VAT?',
          answer: 'Yes, all prices include 18% VAT as required by Rwanda tax law. The VAT amount is clearly shown on your invoice and order confirmation.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      faqs: [
        {
          question: 'What are your delivery charges?',
          answer: 'Standard Delivery: 5,000 RWF (3-5 business days). Express Delivery: 10,000 RWF (1-2 business days). Same-Day Delivery: 15,000 RWF (Kigali only, order before 12 PM). Free standard delivery on orders over 200,000 RWF.'
        },
        {
          question: 'Do you deliver nationwide?',
          answer: 'Yes, we deliver across all provinces of Rwanda. Same-day delivery is only available in Kigali. Express delivery is available in major cities. Standard delivery covers all areas.'
        },
        {
          question: 'Can I change my delivery address?',
          answer: 'Yes, but only before your order is dispatched. Contact us immediately at ugwanezav@gmail.com or +250 725 382 459 to change your delivery address.'
        },
        {
          question: 'What if I\'m not home for delivery?',
          answer: 'Our delivery driver will call you before arrival. If you\'re not available, we\'ll attempt delivery the next business day. After 2 failed attempts, additional delivery fees may apply.'
        },
        {
          question: 'How do I know when my order will arrive?',
          answer: 'You\'ll receive an estimated delivery date when you place your order. We\'ll send SMS updates when your order is dispatched and when it\'s out for delivery. You can also track your order in your account dashboard.'
        }
      ]
    },
    {
      icon: RefreshCw,
      title: 'Returns & Refunds',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: '30-day money-back guarantee. Items must be unused, in original packaging with all accessories. Contact us to initiate a return. Refunds are processed within 5-7 business days after we receive and inspect the returned items.'
        },
        {
          question: 'How do I return a defective product?',
          answer: 'Report defective products within 48 hours of delivery. Email us photos of the defect to ugwanezav@gmail.com. We\'ll provide a return authorization and arrange pickup. You\'ll get a full refund or replacement at no extra cost.'
        },
        {
          question: 'Who pays for return shipping?',
          answer: 'We cover return shipping for defective items or wrong items sent. For change of mind returns, the customer pays return shipping costs.'
        },
        {
          question: 'Can I exchange an item?',
          answer: 'Yes! Exchanges are processed faster than returns. Contact us at ugwanezav@gmail.com to request an exchange for a different size, color, or model.'
        },
        {
          question: 'What items cannot be returned?',
          answer: 'Custom orders, clearance items, opened electrical products (for safety), items without original packaging, and products damaged by misuse cannot be returned.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Warranty',
      faqs: [
        {
          question: 'Do all products come with a warranty?',
          answer: 'Yes, all products come with manufacturer warranties. Warranty periods vary by product and brand (typically 6 months to 2 years). Check individual product pages for specific warranty information.'
        },
        {
          question: 'How do I make a warranty claim?',
          answer: 'Contact us with your order number, product serial number, and description of the issue. Include photos if possible. We\'ll review your claim within 1-2 business days and arrange repair, replacement, or refund based on warranty terms.'
        },
        {
          question: 'What does the warranty cover?',
          answer: 'Warranties cover defects in materials and workmanship. They do not cover normal wear and tear, accidental damage, misuse, or unauthorized repairs.'
        },
        {
          question: 'Can I extend my warranty?',
          answer: 'Yes, extended warranty options are available for select products. Extended warranties can add up to 5 years of additional protection. Contact us for details and pricing.'
        }
      ]
    },
    {
      icon: User,
      title: 'Account & Security',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Register" in the top right corner. Fill in your name, email, phone number, and create a password. You\'ll receive a verification code via email. Enter the code to activate your account.'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click "Forgot Password" on the login page. Enter your email address. You\'ll receive a password reset link. Click the link and create a new password.'
        },
        {
          question: 'How do I update my account information?',
          answer: 'Log into your account and go to "Profile" or "My Account". You can update your name, email, phone number, delivery addresses, and password from there.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes, we take security seriously. We use SSL encryption, secure authentication, and follow data protection best practices. We never share your personal information with third parties without your consent. Read our Privacy Policy for details.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, contact us at ugwanezav@gmail.com to request account deletion. We\'ll permanently delete your data within 7 business days. Note that order history may be retained for legal and accounting purposes.'
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
            <HelpCircle className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-center text-primary-100">
            Find answers to common questions about our services
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              30+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              FAQs
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Support
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              &lt;1hr
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Response Time
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
              4.9/5
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Customer Rating
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <category.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={faqIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''
                            }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-700/30">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Still Need Help?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
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

        {/* Related Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            More Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/shipping"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Shipping & Delivery
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Delivery options and coverage
              </p>
            </Link>
            <Link
              to="/returns"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Returns & Refunds
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                30-day return policy details
              </p>
            </Link>
            <Link
              to="/warranty"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Warranty Information
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Product warranties and claims
              </p>
            </Link>
            <Link
              to="/privacy"
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Privacy Policy
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How we protect your data
              </p>
            </Link>
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

export default FAQ;
