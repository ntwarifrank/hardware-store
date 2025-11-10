import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../features/cart/cartSlice';
import axiosClient from '../api/axiosClient';
import { formatCurrency } from '../utils/formatCurrency';
import { MapPin, User, Mail, Phone, Package, Truck, Smartphone, Banknote } from 'lucide-react';
import Loader from '../components/Loader';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, isLoading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Rwanda',
    },
    paymentMethod: 'cod',
    paymentDetails: {
      provider: 'cash',
      phoneNumber: '',
      transactionId: '',
    },
  });

  // Shipping method options
  const shippingOptions = [
    {
      method: 'standard',
      name: 'Standard Delivery',
      cost: 5000,
      estimatedDays: '3-5 business days',
      description: 'Regular delivery within Kigali and major cities',
    },
    {
      method: 'express',
      name: 'Express Delivery',
      cost: 10000,
      estimatedDays: '1-2 business days',
      description: 'Fast delivery to your doorstep',
    },
    {
      method: 'sameday',
      name: 'Same-Day Delivery',
      cost: 15000,
      estimatedDays: 'Same day (Order before 2 PM)',
      description: 'Get your order today within Kigali',
    },
  ];

  const selectedShipping = shippingOptions.find(opt => opt.method === shippingMethod) || shippingOptions[0];

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!items || items.length === 0) {
      console.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: formData.shippingAddress,
        shippingMethod: {
          method: selectedShipping.method,
          name: selectedShipping.name,
          cost: selectedShipping.cost,
          estimatedDays: selectedShipping.estimatedDays,
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentDetails,
      };

      const response = await axiosClient.post('/orders', orderData);
      const order = response.data.data.order;

      // Clear cart
      await dispatch(clearCart()).unwrap();
      
      // Handle redirect based on payment method
      if (formData.paymentMethod === 'mobile_money') {
        // Redirect to real-time payment processing page
        navigate(`/payment/processing/${order._id}`);
      } else {
        // For other payment methods (COD, bank transfer, card), go to order details
        setTimeout(() => {
          navigate(`/orders/${order._id}`);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to place order:', error.response?.data?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartLoading) {
    return <Loader fullScreen />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add some products before checking out
          </p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = selectedShipping.cost;
  const tax = totalPrice * 0.18; // 18% VAT for Rwanda
  const finalTotal = totalPrice + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      <User className="inline mr-2" size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.shippingAddress.fullName}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Mail className="inline mr-2" size={16} />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.shippingAddress.email}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="inline mr-2" size={16} />
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.shippingAddress.street}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">State/Province *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.shippingAddress.state}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold">Shipping Method</h2>
                </div>

                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.method}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        shippingMethod === option.method
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={option.method}
                        checked={shippingMethod === option.method}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{option.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </p>
                            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                              Estimated: {option.estimatedDays}
                            </p>
                          </div>
                          <p className="font-bold text-primary-600">
                            {formatCurrency(option.cost)}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <Smartphone className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* Mobile Money - MTN */}
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'mobile_money' && formData.paymentDetails.provider === 'mtn_mobile_money'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-600'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money_mtn"
                      checked={formData.paymentMethod === 'mobile_money' && formData.paymentDetails.provider === 'mtn_mobile_money'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        paymentMethod: 'mobile_money',
                        paymentDetails: { ...formData.paymentDetails, provider: 'mtn_mobile_money' }
                      })}
                      className="mt-1 mr-3"
                    />
                    <div className="flex items-start gap-3 flex-1">
                      <Smartphone className="text-yellow-500 flex-shrink-0" size={24} />
                      <div className="flex-1">
                        <p className="font-semibold">MTN Mobile Money</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pay securely with MTN MoMo
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Mobile Money - Airtel */}
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'mobile_money' && formData.paymentDetails.provider === 'airtel_money'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-600'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money_airtel"
                      checked={formData.paymentMethod === 'mobile_money' && formData.paymentDetails.provider === 'airtel_money'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        paymentMethod: 'mobile_money',
                        paymentDetails: { ...formData.paymentDetails, provider: 'airtel_money' }
                      })}
                      className="mt-1 mr-3"
                    />
                    <div className="flex items-start gap-3 flex-1">
                      <Smartphone className="text-red-500 flex-shrink-0" size={24} />
                      <div className="flex-1">
                        <p className="font-semibold">Airtel Money</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pay securely with Airtel Money
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-600'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        paymentMethod: e.target.value,
                        paymentDetails: { ...formData.paymentDetails, provider: 'cash' }
                      })}
                      className="mt-1 mr-3"
                    />
                    <div className="flex items-start gap-3 flex-1">
                      <Banknote className="text-green-500 flex-shrink-0" size={24} />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pay with cash when you receive your order
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Payment Details for Mobile Money */}
                {formData.paymentMethod === 'mobile_money' && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <label className="block text-sm font-medium mb-2">
                      Mobile Money Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="078 XXX XXXX"
                      value={formData.paymentDetails.phoneNumber}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentDetails: { ...formData.paymentDetails, phoneNumber: e.target.value }
                      })}
                      required={formData.paymentMethod === 'mobile_money'}
                      className="input"
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      You will receive a payment prompt on this number
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3">
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary-600">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping ({selectedShipping.name})</span>
                    <span className="font-semibold">{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">VAT (18%)</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="mt-6 mb-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      By placing your order, you agree to our{' '}
                      <a href="/terms" className="text-orange-500 hover:text-orange-600 underline" target="_blank" rel="noopener noreferrer">
                        terms and conditions
                      </a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-orange-500 hover:text-orange-600 underline" target="_blank" rel="noopener noreferrer">
                        privacy policy
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !termsAccepted}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
