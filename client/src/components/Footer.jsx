import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setSubscribing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store subscription in localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }

    setSubscribed(true);
    setSubscribing(false);
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setSubscribed(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePhoneClick = () => {
    // Track phone click
    console.log('Phone number clicked');
  };

  const handleEmailClick = () => {
    // Track email click
    console.log('Email clicked');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-white">Hardware Store</span>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              Rwanda's #1 hardware store. Quality tools, real-time mobile money payments, fast delivery.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary-500 mt-1 flex-shrink-0" />
                <p className="text-sm">
                  KN 4 Ave, Kigali<br />
                  Kigali, Rwanda
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary-500 flex-shrink-0" />
                <a
                  href="tel:+250725382459"
                  onClick={handlePhoneClick}
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  +250 725 382 459
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary-500 flex-shrink-0" />
                <a
                  href="mailto:ugwanezav@gmail.com"
                  onClick={handleEmailClick}
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  ugwanezav@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-base">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=tools" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Power Tools
                </Link>
              </li>
              <li>
                <Link to="/products?category=hardware" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Hardware
                </Link>
              </li>
              <li>
                <Link to="/products?sale=true" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Sale Items
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-base">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  Warranty Info
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-base">Newsletter</h3>
            <p className="text-sm mb-3">
              Get special offers & deals.
            </p>

            {subscribed ? (
              <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                <p className="text-sm text-green-500 font-medium">Successfully subscribed!</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary-500 text-white placeholder-gray-500"
                    required
                    disabled={subscribing}
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribing ? (
                      <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </form>
            )}

            <h4 className="text-white font-medium mb-3 text-sm">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:ugwanezav@gmail.com"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Hardware Store. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>We Accept:</span>
              <div className="flex gap-1">
                <div className="px-2 py-1 bg-gray-800 rounded text-[10px] font-medium">VISA</div>
                <div className="px-2 py-1 bg-gray-800 rounded text-[10px] font-medium">MTN</div>
                <div className="px-2 py-1 bg-gray-800 rounded text-[10px] font-medium">AIRTEL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;
