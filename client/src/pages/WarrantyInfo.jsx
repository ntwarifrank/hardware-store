import { Link } from 'react-router-dom';
import { Shield, Award, Clock, CheckCircle, XCircle, FileText, Mail, Phone, Wrench } from 'lucide-react';

const WarrantyInfo = () => {
  const warrantyTypes = [
    {
      icon: Shield,
      title: 'Manufacturer Warranty',
      duration: '6-24 months',
      coverage: 'Defects in materials and workmanship',
      color: 'blue',
      features: [
        'Free repairs or replacement',
        'Original manufacturer service',
        'Covers manufacturing defects',
        'Includes parts and labor'
      ]
    },
    {
      icon: Award,
      title: 'Extended Warranty',
      duration: 'Up to 5 years',
      coverage: 'Additional protection beyond manufacturer warranty',
      color: 'purple',
      features: [
        'Extends original warranty',
        'Covers accidental damage (optional)',
        'Priority service',
        'Replacement unit during repairs'
      ]
    },
    {
      icon: Wrench,
      title: 'Lifetime Warranty',
      duration: 'Lifetime',
      coverage: 'Select hand tools and equipment',
      color: 'green',
      features: [
        'Covers entire product lifetime',
        'Free replacement for defects',
        'No questions asked',
        'Limited to specific brands'
      ]
    }
  ];

  const warrantyByCategory = [
    {
      category: 'Power Tools',
      brands: ['DeWalt', 'Bosch', 'Makita', 'Milwaukee'],
      warranty: '1-3 years manufacturer warranty',
      extendedAvailable: true,
      notes: 'Covers motor, gears, and electronics'
    },
    {
      category: 'Hand Tools',
      brands: ['Stanley', 'Craftsman', 'Klein Tools'],
      warranty: 'Lifetime warranty',
      extendedAvailable: false,
      notes: 'Covers defects in materials and workmanship'
    },
    {
      category: 'Garden Equipment',
      brands: ['Honda', 'Stihl', 'Husqvarna'],
      warranty: '2 years manufacturer warranty',
      extendedAvailable: true,
      notes: 'Covers engine and mechanical parts'
    },
    {
      category: 'Paint & Supplies',
      brands: ['Dulux', 'Crown', 'Sadolin'],
      warranty: '6 months quality guarantee',
      extendedAvailable: false,
      notes: 'Covers product quality issues only'
    },
    {
      category: 'Electrical Items',
      brands: 'All brands',
      warranty: '1 year manufacturer warranty',
      extendedAvailable: true,
      notes: 'Covers electrical and mechanical failures'
    },
    {
      category: 'Hardware & Fasteners',
      brands: 'All brands',
      warranty: '30 days quality guarantee',
      extendedAvailable: false,
      notes: 'Covers defects only'
    }
  ];

  const claimProcess = [
    {
      step: 1,
      title: 'Gather Information',
      description: 'Collect your order number, receipt, and product serial number',
      icon: FileText
    },
    {
      step: 2,
      title: 'Contact Us',
      description: 'Email or call us with warranty claim details and photos of the issue',
      icon: Mail
    },
    {
      step: 3,
      title: 'Assessment',
      description: 'We review your claim and determine warranty coverage (1-2 business days)',
      icon: CheckCircle
    },
    {
      step: 4,
      title: 'Resolution',
      description: 'Repair, replacement, or refund based on warranty terms',
      icon: Wrench
    }
  ];

  const notCovered = [
    'Normal wear and tear',
    'Damage from misuse or abuse',
    'Accidental damage (unless extended warranty)',
    'Damage from unauthorized repairs',
    'Cosmetic damage not affecting function',
    'Batteries and consumable items',
    'Products purchased second-hand',
    'Damage from improper storage'
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
            Warranty Information
          </h1>
          <p className="text-xl text-center text-primary-100">
            Your products are protected with comprehensive warranties
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warranty Guarantee Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-8 mb-12 text-center">
          <Award className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            Quality Guarantee
          </h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            All products come with manufacturer warranties. We stand behind every item we sell.
          </p>
        </div>

        {/* Warranty Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Types of Warranty
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {warrantyTypes.map((type, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border-t-4 border-primary-500 hover:shadow-lg transition-shadow">
                <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-lg w-fit mb-4">
                  <type.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {type.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {type.duration}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {type.coverage}
                </p>
                <ul className="space-y-3">
                  {type.features.map((feature, idx) => (
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

        {/* Warranty by Category */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Warranty by Product Category
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Brands
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Standard Warranty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Extended
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {warrantyByCategory.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {item.category}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.notes}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {Array.isArray(item.brands) ? item.brands.join(', ') : item.brands}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                          <Shield className="h-4 w-4" />
                          {item.warranty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.extendedAvailable ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Warranty Claim Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Make a Warranty Claim
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
            <div className="space-y-8">
              {claimProcess.map((process, index) => (
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
                  {index < claimProcess.length - 1 && (
                    <div className="ml-6 mt-4 h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Not Covered */}
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">
                What's Not Covered
              </h2>
              <p className="text-red-800 dark:text-red-200 mb-4">
                Warranties do not cover the following:
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {notCovered.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-900 dark:text-red-200">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  Keep Your Receipt
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Always keep your receipt or order confirmation. It's required for all warranty claims and serves as proof of purchase.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-orange-900 dark:text-orange-300 mb-2">
                  Register Your Product
                </h3>
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  Register your product with the manufacturer for extended warranty benefits and faster claim processing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Warranty */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">
              Extended Warranty Available
            </h2>
            <p className="text-lg text-purple-100 mb-6">
              Protect your investment with extended warranty coverage. Add up to 5 years of additional protection to select products.
            </p>
            <a
              href="mailto:ugwanezav@gmail.com?subject=Extended Warranty Inquiry"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Learn More About Extended Warranty
            </a>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Warranty Questions?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
            Our team is here to help with warranty inquiries and claims
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

export default WarrantyInfo;
