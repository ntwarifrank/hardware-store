import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

const ShippingDelivery = () => {
  const shippingOptions = [
    {
      icon: Truck,
      name: 'Standard Delivery',
      price: '$50',
      duration: '3-5 Business Days',
      description: 'Reliable delivery across Rwanda',
      features: [
        'Tracking available',
        'Signature required',
        'Free for orders over $2,000',
        'Available nationwide'
      ],
      color: 'blue'
    },
    {
      icon: Clock,
      name: 'Express Delivery',
      price: '$100',
      duration: '1-2 Business Days',
      description: 'Fast delivery for urgent orders',
      features: [
        'Priority handling',
        'Real-time tracking',
        'SMS notifications',
        'Available in major cities'
      ],
      color: 'orange'
    },
    {
      icon: Package,
      name: 'Same-Day Delivery',
      price: '$150',
      duration: 'Same Day',
      description: 'Ultra-fast delivery within Kigali',
      features: [
        'Order before 12 PM',
        'Deliver same day',
        'Live tracking',
        'Kigali only'
      ],
      color: 'green'
    }
  ];

  const deliveryZones = [
    {
      zone: 'Kigali City',
      areas: ['Gasabo', 'Kicukiro', 'Nyarugenge'],
      allOptions: true,
      note: 'All delivery options available'
    },
    {
      zone: 'Eastern Province',
      areas: ['Rwamagana', 'Kayonza', 'Ngoma', 'Kirehe', 'Bugesera', 'Gatsibo', 'Nyagatare'],
      standardOnly: true,
      note: 'Standard and Express delivery available'
    },
    {
      zone: 'Southern Province',
      areas: ['Muhanga', 'Kamonyi', 'Ruhango', 'Nyanza', 'Huye', 'Gisagara', 'Nyaruguru', 'Nyamagabe'],
      standardOnly: true,
      note: 'Standard and Express delivery available'
    },
    {
      zone: 'Western Province',
      areas: ['Karongi', 'Rutsiro', 'Rubavu', 'Nyabihu', 'Ngororero', 'Rusizi', 'Nyamasheke'],
      standardOnly: true,
      note: 'Standard delivery available'
    },
    {
      zone: 'Northern Province',
      areas: ['Rulindo', 'Gakenke', 'Musanze', 'Burera', 'Gicumbi'],
      standardOnly: true,
      note: 'Standard delivery available'
    }
  ];

  const deliveryProcess = [
    {
      step: 1,
      title: 'Order Confirmation',
      description: 'You receive an order confirmation email with order details',
      icon: CheckCircle
    },
    {
      step: 2,
      title: 'Order Processing',
      description: 'We prepare and pack your items (1-24 hours)',
      icon: Package
    },
    {
      step: 3,
      title: 'Dispatch',
      description: 'Your order is handed to our delivery partner',
      icon: Truck
    },
    {
      step: 4,
      title: 'Out for Delivery',
      description: 'Delivery driver is on the way to your location',
      icon: MapPin
    },
    {
      step: 5,
      title: 'Delivered',
      description: 'Package delivered and signature obtained',
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Truck className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-xl text-center text-primary-100">
            Fast, reliable delivery across Rwanda
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Delivery Options
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 hover:shadow-lg transition-shadow border-t-4 border-primary-500">
                <div className={`p-4 bg-${option.color}-100 dark:bg-${option.color}-900/30 rounded-lg w-fit mb-4`}>
                  <option.icon className={`h-8 w-8 text-${option.color}-600 dark:text-${option.color}-400`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {option.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {option.price}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {option.duration}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {option.description}
                </p>
                <ul className="space-y-3">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 mb-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            Free Standard Delivery
          </h3>
          <p className="text-lg text-green-100">
            On all orders over <span className="font-bold">$2,000</span>
          </p>
        </div>

        {/* Delivery Zones */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Delivery Coverage
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              {deliveryZones.map((zone, index) => (
                <div key={index} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {zone.zone}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {zone.areas.join(', ')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${zone.allOptions
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                      {zone.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How Delivery Works
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <div className="space-y-8">
              {deliveryProcess.map((process, index) => (
                <div key={index} className="flex items-start gap-6">
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
                  {index < deliveryProcess.length - 1 && (
                    <div className="ml-6 mt-4 h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  Order Tracking
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Track your order in real-time from your account dashboard. You'll receive SMS notifications at each stage of delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-orange-900 dark:text-orange-300 mb-2">
                  Delivery Hours
                </h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  Monday - Saturday: 8:00 AM - 6:00 PM<br />
                  Sunday & Public Holidays: 9:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Important Delivery Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Signature Required:</strong> Someone must be present to sign for and receive the delivery.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Failed Delivery:</strong> If no one is available, we'll attempt delivery again the next business day. Additional fees may apply after 2 failed attempts.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Inspect on Delivery:</strong> Please inspect your items upon delivery. Report any damage or missing items immediately.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Heavy Items:</strong> Large or heavy items may require ground-floor delivery only. Contact us if you need assistance.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Remote Areas:</strong> Delivery to remote locations may take additional time. We'll contact you with estimated delivery dates.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Delivery Questions?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
            Our customer service team is here to help with any delivery inquiries
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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

export default ShippingDelivery;
