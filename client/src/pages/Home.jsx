import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowRight, 
  Package, 
  Truck, 
  Shield, 
  Headphones, 
  Search,
  Wrench,
  Hammer,
  Zap,
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  BadgeCheck,
  Clock,
  Heart,
  Users,
  DollarSign,
  ShoppingBag,
  Target,
  Sparkles,
  Mail,
  Send,
  Quote,
  ThumbsUp,
  MapPin,
  Phone,
  Percent,
  Timer,
  Gift,
  X,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Redirect logged-in users to products page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await axiosClient.get('/products/featured');
      return response.data.data.products;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosClient.get('/categories');
      return response.data.data.categories;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/products');
    }
  };

  // Testimonials data - Rwanda customers
  const testimonials = [
    {
      id: 1,
      name: "Jean Pierre Uwimana",
      role: "Construction Manager",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=12",
      text: "BuildMart has the best quality tools in Kigali! Mobile money payment is super convenient and delivery is always on time.",
      location: "Kigali, Rwanda"
    },
    {
      id: 2,
      name: "Grace Mukamana",
      role: "Interior Designer",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
      text: "Amazing selection and the MTN Mobile Money payment works perfectly! Best hardware store in Rwanda.",
      location: "Kicukiro, Kigali"
    },
    {
      id: 3,
      name: "Emmanuel Nshimiyimana",
      role: "Professional Contractor",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=33",
      text: "Real-time payment confirmation is brilliant! No more waiting. Fast delivery across Kigali and competitive prices.",
      location: "Nyarugenge, Kigali"
    },
    {
      id: 4,
      name: "Aline Uwera",
      role: "Home Renovator",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=9",
      text: "I love how easy it is to pay with Airtel Money! Same-day delivery in Kigali is a game changer for my projects.",
      location: "Remera, Kigali"
    },
    {
      id: 5,
      name: "Claude Habimana",
      role: "Builder",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=15",
      text: "Professional service and authentic products. Mobile money makes payment so simple. Highly recommended!",
      location: "Musanze, Rwanda"
    },
    {
      id: 6,
      name: "Marie Uwase",
      role: "Architect",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=20",
      text: "BuildMart is my go-to for all construction materials. Real-time payment and instant order confirmation is perfect!",
      location: "Gisenyi, Rwanda"
    }
  ];

  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Promo Banner */}
      {showPromoBanner && (
        <div className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-3 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-3 text-sm md:text-base">
              <Gift size={20} className="animate-bounce" />
              <span className="font-bold">Limited Time Offer!</span>
              <span className="hidden sm:inline">Get 25% OFF on all power tools</span>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Timer size={16} />
                <span className="font-mono font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
              <Link to="/products?sale=true" className="hidden md:inline-flex items-center gap-1 bg-white text-orange-600 hover:bg-gray-100 font-bold px-4 py-1 rounded-full transition-all">
                Shop Now
                <ChevronRight size={16} />
              </Link>
            </div>
            <button
              onClick={() => setShowPromoBanner(false)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              aria-label="Close banner"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Animated Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Wrench size={48} className="text-white/10" strokeWidth={1} />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <Hammer size={56} className="text-white/10" strokeWidth={1} />
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float">
          <Zap size={40} className="text-white/10" strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Award size={20} className="text-yellow-400" />
              <span className="text-sm font-semibold">Trusted by 10,000+ Customers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
              Quality Hardware Tools<br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                & Equipment
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Rwanda's #1 Hardware Store - Kigali & Nationwide Delivery<br />
              <span className="text-yellow-400 font-semibold">Pay with MTN/Airtel Money • Real-Time Confirmation</span>
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tools, equipment, materials..."
                  className="w-full py-4 px-6 pr-32 rounded-full text-gray-900 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-full shadow-2xl transition-all transform hover:scale-105"
              >
                Shop Now
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/products?category=featured" 
                className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 font-semibold text-lg px-8 py-4 rounded-full transition-all"
              >
                <Star size={20} />
                Featured Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-6 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full animate-bounce">
                <Percent size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Flash Sale Alert!</h3>
                <p className="text-orange-100">Up to 50% OFF on selected items - Don't miss out!</p>
              </div>
            </div>
            <Link
              to="/products?sale=true"
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-3 rounded-full shadow-xl transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <TrendingDown size={20} />
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up">
            <div className="group text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Package className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Quality Products</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Premium hardware from trusted brands worldwide
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Truck className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Same-day delivery in Kigali • 1-3 days nationwide
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Mobile Money Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pay with MTN/Airtel Money • Instant confirmation
              </p>
            </div>

            <div className="group text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                <Headphones className="text-white" size={36} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Expert support team always ready to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Money Payment Feature */}
      <section className="py-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="text-sm font-semibold">NEW FEATURE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Pay with Mobile Money
            </h2>
            <p className="text-xl text-orange-50 max-w-3xl mx-auto">
              Rwanda's first hardware store with real-time mobile money payment confirmation!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={40} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">MTN Mobile Money</h3>
              <p className="text-orange-50">
                Pay instantly with MTN MoMo. Get real-time payment confirmation on your phone in seconds.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Airtel Money</h3>
              <p className="text-orange-50">
                Use Airtel Money for seamless payments. Instant order confirmation with no delays.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Confirmation</h3>
              <p className="text-orange-50">
                See your payment status instantly. No waiting, no calling support. Automatic order processing.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <Clock size={24} />
                <span className="font-semibold">3-Minute Payment Window</span>
              </div>
              <div className="w-px h-6 bg-white/30 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <Shield size={24} />
                <span className="font-semibold">100% Secure</span>
              </div>
              <div className="w-px h-6 bg-white/30 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <Zap size={24} />
                <span className="font-semibold">Instant Order Processing</span>
              </div>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-8 py-4 rounded-full shadow-2xl transition-all transform hover:scale-105"
            >
              Try It Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-sm mb-3">
                <Star size={16} fill="currentColor" />
                LIMITED OFFER
              </div>
              <h3 className="text-3xl font-bold mb-2">New Customer Special!</h3>
              <p className="text-orange-100 text-lg">Sign up today and get 15% off your first order + Free Shipping</p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold text-lg px-8 py-4 rounded-full shadow-2xl transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <Gift size={20} />
              Claim Offer
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our extensive range of hardware categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((category, index) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-700 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 p-6 flex items-center justify-center">
                  <div className="text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    {index === 0 && <Wrench size={48} strokeWidth={1.5} />}
                    {index === 1 && <Hammer size={48} strokeWidth={1.5} />}
                    {index === 2 && <Zap size={48} strokeWidth={1.5} />}
                    {index === 3 && <Package size={48} strokeWidth={1.5} />}
                    {index === 4 && <TrendingUp size={48} strokeWidth={1.5} />}
                    {index === 5 && <Star size={48} strokeWidth={1.5} />}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-lg"
            >
              View All Categories
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
              <Star size={20} className="text-yellow-600 dark:text-yellow-400" fill="currentColor" />
              <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Top Rated Products</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Handpicked selection of our most popular and highly-rated products
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl transition-all transform hover:scale-105"
                >
                  View All Products
                  <ArrowRight size={20} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No featured products available yet</p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold mt-4"
              >
                Browse All Products
                <ArrowRight size={20} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in-up">
            <div className="group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">10,000+</div>
              <div className="text-orange-100 text-sm md:text-base">Happy Customers</div>
            </div>
            <div className="group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">5,000+</div>
              <div className="text-orange-100 text-sm md:text-base">Quality Products</div>
            </div>
            <div className="group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-orange-100 text-sm md:text-base">Product Categories</div>
            </div>
            <div className="group cursor-default">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">99%</div>
              <div className="text-orange-100 text-sm md:text-base">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4">
              <ThumbsUp size={20} className="text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Customer Reviews</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Don't just take our word for it. See what our satisfied customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-primary-200 dark:text-primary-900/30">
                  <Quote size={32} fill="currentColor" />
                </div>
                
                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 relative z-10 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                      <MapPin size={10} />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                  <BadgeCheck size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">Verified Reviews</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">100% Authentic</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
                  <Star size={32} className="text-yellow-500" fill="currentColor" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">4.9/5 Rating</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">From 2,500+ Reviews</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
                  <Heart size={32} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">99% Satisfied</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
                  <Target size={32} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">On-Time Delivery</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">98% Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4">
              <Sparkles size={20} className="text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Simple Process</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get your hardware tools in just four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative text-center group">
              <div className="mb-6 inline-block">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    <Search size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    1
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Browse Products</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Search through our extensive catalog of quality tools and equipment
              </p>
            </div>

            <div className="relative text-center group">
              <div className="mb-6 inline-block">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    <ShoppingBag size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    2
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Add to Cart</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select your items and add them to your shopping cart
              </p>
            </div>

            <div className="relative text-center group">
              <div className="mb-6 inline-block">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    <DollarSign size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    3
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Secure Checkout</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your purchase with our secure payment system
              </p>
            </div>

            <div className="relative text-center group">
              <div className="mb-6 inline-block">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    <Truck size={32} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900 shadow-lg">
                    4
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive your order quickly at your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4">
              <BadgeCheck size={20} className="text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Why Choose BuildMart</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Trusted Hardware Partner
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We're committed to providing the best tools, service, and support for all your projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Image/Visual */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Award size={64} className="text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">10+ Years</h3>
                  <p className="text-white/90 text-lg">Industry Experience</p>
                </div>
              </div>
            </div>

            {/* Right Column - Benefits Grid */}
            <div className="grid gap-4">
              <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover-lift">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Authentic Products Only</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Every product is 100% genuine and sourced directly from authorized manufacturers</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover-lift">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Best Price Guarantee</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Found a lower price? We'll match it plus give you an extra 5% off!</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover-lift">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Shield size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Lifetime Warranty Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Extended warranty options available on all power tools and equipment</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover-lift">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Users size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Expert Consultation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Free advice from our team of hardware experts for your projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Money-Back Guarantee Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 p-8 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Shield size={32} className="text-white" />
                  <h3 className="text-2xl font-bold">30-Day Money-Back Guarantee</h3>
                </div>
                <p className="text-green-50 text-lg">
                  Not satisfied? Return any item within 30 days for a full refund. No questions asked.
                </p>
              </div>
              <Link
                to="/products"
                className="bg-white text-green-600 hover:bg-green-50 font-bold px-8 py-3 rounded-full shadow-xl transition-all whitespace-nowrap flex items-center gap-2"
              >
                Shop Risk-Free
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4">
              <Headphones size={20} className="text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">Got Questions?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to common questions about our products and services
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Where do you deliver in Rwanda?",
                a: "We deliver across all Rwanda! Same-day delivery in Kigali (order before 2 PM), 1-2 days to major cities (Huye, Musanze, Gisenyi), and 2-3 days nationwide. Free delivery on orders over 50,000 RWF in Kigali."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept MTN Mobile Money, Airtel Money, Cash on Delivery, Bank Transfer, and Credit/Debit Cards. Mobile money payments are confirmed instantly with real-time order updates!"
              },
              {
                q: "How long is the warranty on tools?",
                a: "All power tools come with a minimum 1-year manufacturer warranty. Many premium brands offer extended warranties up to 3-5 years. Extended warranty options are available at checkout."
              },
              {
                q: "Can I return a product if I'm not satisfied?",
                a: "Absolutely! We offer a 30-day money-back guarantee on all products. Items must be in original condition with packaging. Return shipping is free for defective items."
              },
              {
                q: "Do you provide bulk discounts for contractors?",
                a: "Absolutely! We offer special pricing for contractors, builders, and construction companies. Contact +250 788 XXX XXX or email sales@buildmart.rw for bulk quotes and exclusive contractor benefits."
              },
              {
                q: "How can I track my order?",
                a: "Once your order ships, you'll receive a tracking number via email. You can also track your order anytime by logging into your account and viewing order history."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-gray-900 dark:text-white text-lg">
                  <span>{faq.q}</span>
                  <ChevronRight size={20} className="transform group-open:rotate-90 transition-transform text-primary-600 dark:text-primary-400" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold"
            >
              <Headphones size={20} />
              Contact our support team
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges / Partners */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-8">
              Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-center h-16 text-3xl font-bold text-gray-400 dark:text-gray-600">
                DeWalt
              </div>
              <div className="flex items-center justify-center h-16 text-3xl font-bold text-gray-400 dark:text-gray-600">
                Bosch
              </div>
              <div className="flex items-center justify-center h-16 text-3xl font-bold text-gray-400 dark:text-gray-600">
                Makita
              </div>
              <div className="flex items-center justify-center h-16 text-3xl font-bold text-gray-400 dark:text-gray-600">
                Milwaukee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Mail size={40} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Get exclusive deals, new product alerts, and expert tips delivered straight to your inbox.
            </p>

            <form onSubmit={handleNewsletter} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-full shadow-xl transition-all transform hover:scale-105"
                >
                  <Send size={20} />
                  Subscribe
                </button>
              </div>
              {newsletterStatus === 'success' && (
                <p className="mt-4 text-green-300 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  Successfully subscribed! Thank you.
                </p>
              )}
            </form>

            <p className="mt-6 text-sm text-orange-200">
              Join 50,000+ subscribers. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto">
              Get started with professional-grade tools and equipment. Join thousands of satisfied customers today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-orange-700 hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded-full shadow-2xl transition-all transform hover:scale-105"
              >
                <Package size={24} />
                Explore Products
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl transition-all transform hover:scale-105"
              >
                <CheckCircle size={24} />
                Sign Up Free
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Free Shipping on Orders $100+</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
