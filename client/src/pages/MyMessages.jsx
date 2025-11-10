import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { Mail, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const MyMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch user's messages
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-messages'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/contacts/my-messages');
        console.log('My messages response:', response.data);
        return response.data.data;
      } catch (err) {
        console.error('Error fetching messages:', err);
        throw err;
      }
    },
  });

  console.log('My messages data:', data);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const getStatusBadge = (status) => {
    const badges = {
      new: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Pending', icon: Clock },
      read: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Progress', icon: AlertCircle },
      replied: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Replied', icon: MessageSquare },
      resolved: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', label: 'Resolved', icon: CheckCircle }
    };
    const badge = badges[status] || badges.new;
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text} flex items-center gap-1`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Messages
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {error.message || 'Failed to load your messages. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/help" 
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-4"
        >
          <ArrowLeft size={20} />
          Back to Help Center
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Support Messages</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View your support requests and admin replies
        </p>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.pagination.total}
                </p>
              </div>
              <Mail size={32} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Replies</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {data.unreadReplies}
                </p>
              </div>
              <MessageSquare size={32} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div>
              <Link
                to="/help"
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Send New Message
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {data?.messages?.length === 0 ? (
          <div className="text-center py-12">
            <Mail size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No messages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't sent any support messages yet.
            </p>
            <Link to="/help" className="btn btn-primary inline-flex items-center gap-2">
              <Mail size={20} />
              Send Your First Message
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.messages?.map((message) => (
              <div
                key={message._id}
                onClick={() => setSelectedMessage(message)}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {message.subject}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sent: {formatDate(message.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(message.status)}
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                  {message.message}
                </p>

                {message.adminReply && message.adminReply.trim() !== '' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-4 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-green-600 dark:text-green-400" />
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                        Admin Reply:
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      {message.adminReply}
                    </p>
                  </div>
                )}

                {message.repliedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Replied: {formatDate(message.repliedAt)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Sent: {formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedMessage.status)}
              </div>
            </div>

            <div className="p-6">
              {/* Original Message */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Your Message:</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Admin Reply */}
              {selectedMessage.adminReply && selectedMessage.adminReply.trim() !== '' ? (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="text-green-500" />
                    Support Team Reply:
                  </h4>
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.adminReply}
                    </p>
                    {selectedMessage.repliedBy && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        Reply by: {selectedMessage.repliedBy.name}
                      </p>
                    )}
                    {selectedMessage.repliedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Replied: {formatDate(selectedMessage.repliedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg p-4">
                  <p className="text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                    <Clock size={18} />
                    Our support team is reviewing your message. You will receive a reply soon!
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Need immediate assistance?
                </p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>📧 Email: ugwanezav@gmail.com</p>
                  <p>📱 WhatsApp: +250725382459</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="mt-6 w-full btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMessages;
