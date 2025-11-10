import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import { Package, ChevronRight, ShoppingBag, RefreshCw } from 'lucide-react';
import Loader from '../components/Loader';

const Orders = () => {
  const { data: ordersData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axiosClient.get('/orders');
      return response.data.data.orders;
    },
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount
    staleTime: 0, // Consider data stale immediately
  });

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

  if (!ordersData || ordersData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start shopping to see your orders here!
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Orders
          </h1>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn-outline flex items-center gap-2"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {ordersData.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card hover:shadow-lg transition-shadow block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package className="text-primary-600" size={24} />
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={24} />
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400 ml-auto">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>

              {/* Order Items Preview */}
              <div className="flex gap-2 overflow-x-auto">
                {order.items.slice(0, 4).map((item, index) => (
                  <img
                    key={index}
                    src={item.product?.images?.[0]?.url || item.image || '/placeholder-product.jpg'}
                    alt={item.product?.name || item.name || 'Product'}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
                {order.items.length > 4 && (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-sm font-semibold">+{order.items.length - 4}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
