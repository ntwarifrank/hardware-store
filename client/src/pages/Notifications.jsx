import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { formatDate } from '../utils/formatCurrency';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Notifications = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch all notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['user-notifications', filter],
    queryFn: async () => {
      const response = await axiosClient.get('/notifications?limit=50');
      return response.data.data.notifications;
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-notifications']);
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notification-count']);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notificationsData?.filter(n => !n.isRead) || [];
      await Promise.all(
        unreadNotifications.map(notification => 
          axiosClient.put(`/notifications/${notification._id}/read`)
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-notifications']);
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notification-count']);
    },
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
      success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      promotion: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      announcement: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    };
    return colors[type] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  };

  const getTypeBorderColor = (type) => {
    const colors = {
      info: 'border-primary-200 dark:border-primary-800',
      success: 'border-green-200 dark:border-green-800',
      warning: 'border-yellow-200 dark:border-yellow-800',
      promotion: 'border-purple-200 dark:border-purple-800',
      announcement: 'border-gray-200 dark:border-gray-700',
    };
    return colors[type] || 'border-gray-200 dark:border-gray-700';
  };

  const filteredNotifications = notificationsData?.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notificationsData?.filter(n => !n.isRead).length || 0;

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <CheckCheck size={18} />
                Mark All as Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                filter === 'all'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              All ({notificationsData?.length || 0})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                filter === 'unread'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                filter === 'read'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Read ({(notificationsData?.length || 0) - unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 ${getTypeBorderColor(notification.type)} transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  !notification.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10 shadow-md' : ''
                }`}
              >
                <div className="p-6">
                  <NotificationContent notification={notification} getTypeColor={getTypeColor} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Bell size={64} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? "You'll see important updates and announcements here" 
                : filter === 'unread'
                ? 'All caught up! No new notifications at the moment'
                : 'You haven\'t read any notifications yet'}
            </p>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getTypeColor(selectedNotification.type)}`}>
                  {selectedNotification.type}
                </div>
                {!selectedNotification.isRead && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">New</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedNotification.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                {selectedNotification.message}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Bell size={16} />
                <span>{formatDate(selectedNotification.createdAt)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {selectedNotification.link && (
                  <Link
                    to={selectedNotification.link}
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors text-center"
                  >
                    View Details
                  </Link>
                )}
                <button
                  onClick={handleCloseModal}
                  className={`${selectedNotification.link ? 'flex-1' : 'w-full'} px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Notification Content Component
const NotificationContent = ({ notification, getTypeColor }) => (
  <div className="flex items-start gap-4">
    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getTypeColor(notification.type)} shrink-0`}>
      {notification.type}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {notification.title}
        </h3>
        {!notification.isRead && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">New</span>
          </div>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {notification.message}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Bell size={14} />
        <span>{formatDate(notification.createdAt)}</span>
        {notification.link && (
          <>
            <span>•</span>
            <span className="text-primary-600 dark:text-primary-400 font-medium">Click to view</span>
          </>
        )}
      </div>
    </div>
  </div>
);

export default Notifications;
