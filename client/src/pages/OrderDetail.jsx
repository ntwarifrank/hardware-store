import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { Package, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Loader from '../components/Loader';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/orders/${id}`);
      return response.data.data.order;
    },
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 0, // Consider data stale immediately
  });

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="text-yellow-500" size={24} />,
      processing: <Package className="text-primary-500" size={24} />,
      shipped: <Truck className="text-purple-500" size={24} />,
      delivered: <CheckCircle className="text-green-500" size={24} />,
      cancelled: <XCircle className="text-red-500" size={24} />,
    };
    return icons[status] || <Package size={24} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
    };
    return colors[status] || 'badge-secondary';
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <button onClick={() => navigate('/orders')} className="btn btn-primary">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span className={`badge ${getStatusColor(order.orderStatus)} text-lg px-4 py-2`}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="text-primary-600" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {item.product ? (
                      <Link to={`/products/${item.product._id}`}>
                        <img
                          src={item.product.images?.[0]?.url || item.image || '/placeholder-product.jpg'}
                          alt={item.product.name || item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      </Link>
                    ) : (
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      {item.product ? (
                        <Link
                          to={`/products/${item.product._id}`}
                          className="font-semibold hover:text-primary-600"
                        >
                          {item.name || item.product.name || 'Product'}
                        </Link>
                      ) : (
                        <p className="font-semibold">{item.name || 'Product'}</p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Price: {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-primary-600" />
                Shipping Address
              </h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="text-primary-600" />
                Payment Method
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {order.paymentInfo.method === 'paddle' ? 'Paddle Payment' : 
                 order.paymentInfo.method === 'cod' ? 'Cash on Delivery' : 
                 order.paymentInfo.method.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Payment Status:{' '}
                <span className={`font-semibold ${order.paymentInfo.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentInfo.status === 'completed' ? 'Paid' : order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}
                </span>
              </p>
              {order.paymentInfo.paidAt && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Paid on: {formatDate(order.paymentInfo.paidAt)}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold">{formatCurrency(order.shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-semibold">{formatCurrency(order.taxPrice)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">Order Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.orderStatus)}
                    <div>
                      <p className="font-medium capitalize">{order.orderStatus}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.orderStatus === 'pending' && (
                <button className="w-full btn btn-outline text-red-600 hover:bg-red-50 mt-6">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
