import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, ArrowRight, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { formatDate } from '../utils/formatCurrency';
import { Link, useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch unread count
  const { data: countData } = useQuery({
    queryKey: ['notification-count'],
    queryFn: async () => {
      const response = await axiosClient.get('/notifications/unread/count');
      return response.data.data.count;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axiosClient.get('/notifications?limit=5');
      return response.data.data.notifications;
    },
    enabled: showDropdown,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notification-count']);
    },
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
    setShowDropdown(false);
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-primary-100 text-primary-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      promotion: 'bg-purple-100 text-purple-600',
      announcement: 'bg-gray-100 text-gray-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 relative transition-all hover:shadow-lg hover:scale-110"
        title="Notifications"
      >
        <Bell size={22} strokeWidth={2} />
        {countData > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
            {countData > 9 ? '9+' : countData}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
            </div>

            {notificationsData && notificationsData.length > 0 ? (
              <>
                <div className="divide-y dark:divide-gray-700">
                  {notificationsData.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(notification.type)}`}>
                          {notification.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <Link
                    to="/notifications"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    View All Notifications
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell size={48} className="mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

export default NotificationBell;
