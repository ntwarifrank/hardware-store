import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Loader from '../../components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/stats');
      return response.data.data;
    },
  });

  // Fetch recent orders
  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/orders?limit=5&sort=-createdAt');
      return response.data.data.orders;
    },
  });

  // Fetch low stock products
  const { data: lowStockProducts } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: async () => {
      const response = await axiosClient.get('/admin/products/low-stock');
      return response.data.data.products;
    },
  });

  if (isLoading) return <Loader fullScreen />;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: <DollarSign size={24} />,
      change: stats?.revenueChange || 0,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart size={24} />,
      change: stats?.ordersChange || 0,
      bgColor: 'bg-primary-500',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Package size={24} />,
      change: stats?.productsChange || 0,
      bgColor: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users size={24} />,
      change: stats?.usersChange || 0,
      bgColor: 'bg-orange-500',
    },
  ];

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
    };
    return colors[status] || 'badge-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.change >= 0 ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <ShoppingCart size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.user?.name || 'Guest'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(order.totalPrice)}
                    </p>
                    <span className={`badge ${getOrderStatusColor(order.orderStatus)} text-xs`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Low Stock Alert
            </h2>
            <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/products/${product._id}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-danger">
                      {product.stock} left
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
                <p>All products are well stocked!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-center"
          >
            <Package size={32} className="mx-auto mb-2 text-primary-600" />
            <p className="font-semibold text-gray-900 dark:text-white">Add Product</p>
          </Link>
          <Link
            to="/admin/categories"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-center"
          >
            <Package size={32} className="mx-auto mb-2 text-primary-600" />
            <p className="font-semibold text-gray-900 dark:text-white">Add Category</p>
          </Link>
          <Link
            to="/admin/discounts"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-center"
          >
            <DollarSign size={32} className="mx-auto mb-2 text-primary-600" />
            <p className="font-semibold text-gray-900 dark:text-white">Create Discount</p>
          </Link>
          <Link
            to="/admin/notifications"
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-center"
          >
            <AlertCircle size={32} className="mx-auto mb-2 text-primary-600" />
            <p className="font-semibold text-gray-900 dark:text-white">Send Notification</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
