import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { Mail, Eye, Trash2, CheckCircle, Clock, AlertCircle, MessageSquare, Save } from 'lucide-react';
import Loader from '../../components/Loader';

const MessagesAdmin = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [platformReply, setPlatformReply] = useState('');

  // Initialize form when a message is selected
  useEffect(() => {
    if (selectedMessage) {
      setAdminNotes(selectedMessage.adminNotes || '');
      setPlatformReply(selectedMessage.adminReply || '');
    } else {
      setAdminNotes('');
      setPlatformReply('');
    }
  }, [selectedMessage]);

  // Fetch contacts
  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['admin-contacts', currentPage, selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
      });
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await axiosClient.get(`/contacts?${params}`);
      return response.data.data;
    },
  });

  // Update contact mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosClient.put(`/contacts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-contacts']);
      setSelectedMessage(null);
    },
  });

  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.delete(`/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-contacts']);
      setSelectedMessage(null);
    },
  });

  const handleStatusChange = (contactId, newStatus) => {
    updateMutation.mutate({
      id: contactId,
      data: { status: newStatus }
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete message from "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleEmailReply = (contact) => {
    const subject = encodeURIComponent(`Re: ${contact.subject}`);
    const body = encodeURIComponent(
      `Dear ${contact.name},\n\nThank you for contacting Hardware Store.\n\n` +
      `Regarding your message: "${contact.subject}"\n\n` +
      `[Your response here]\n\n` +
      `Best regards,\nHardware Store Support Team\n` +
      `Email: ugwanezav@gmail.com\n` +
      `Phone: +250725382459`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    // Auto-update status to replied
    handleStatusChange(contact._id, 'replied');
  };

  const handleWhatsAppReply = (contact) => {
    // Check if phone number is available
    if (!contact.phone) {
      alert('No phone number provided by customer. Cannot send WhatsApp message.');
      return;
    }

    const message = encodeURIComponent(
      `Hello ${contact.name}!\n\n` +
      `Thank you for contacting Hardware Store regarding: "${contact.subject}"\n\n` +
      `We received your message and would be happy to assist you.\n\n` +
      `Best regards,\nHardware Store Support`
    );
    // Use phone from contact form
    const whatsappNumber = contact.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    // Auto-update status to replied
    handleStatusChange(contact._id, 'replied');
  };

  const handleUpdateNotes = () => {
    updateMutation.mutate({
      id: selectedMessage._id,
      data: { adminNotes }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-contacts']);
        // Keep notes visible after saving
      }
    });
  };

  const handleSendPlatformReply = () => {
    if (!platformReply.trim()) return;
    
    updateMutation.mutate({
      id: selectedMessage._id,
      data: { 
        adminReply: platformReply,
        status: 'replied'
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-contacts']);
        setPlatformReply('');
        setSelectedMessage(null);
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'New' },
      read: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Read' },
      replied: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Replied' },
      resolved: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', label: 'Resolved' }
    };
    const badge = badges[status] || badges.new;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <AlertCircle size={16} className="text-red-500" />;
    if (priority === 'medium') return <Clock size={16} className="text-yellow-500" />;
    return <CheckCircle size={16} className="text-green-500" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer inquiries and support requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {contactsData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New Messages</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {contactsData.stats.new || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  {contactsData.stats.read || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Eye className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {contactsData.stats.replied || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                  {contactsData.stats.resolved || 0}
                </p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <MessageSquare className="text-gray-600 dark:text-gray-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {contactsData?.contacts?.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{contact.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(contact.priority)}
                      <span className="text-gray-900 dark:text-white line-clamp-1">{contact.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(contact.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMessage(contact)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEmailReply(contact.email, contact.subject)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Reply via Email"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id, contact.name)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {contactsData?.pagination && contactsData.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-outline"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {contactsData.pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === contactsData.pagination.pages}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {contactsData?.contacts?.length === 0 && (
        <div className="text-center py-12">
          <Mail size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No messages found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedStatus ? 'Try adjusting your filter' : 'No customer messages yet'}
          </p>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{selectedMessage.name}</span>
                    <span>{selectedMessage.email}</span>
                    {selectedMessage.phone && (
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} />
                        {selectedMessage.phone}
                      </span>
                    )}
                    <span>{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedMessage.status)}
                {getPriorityIcon(selectedMessage.priority)}
              </div>
            </div>

            <div className="p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Message:</h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Admin Notes */}
              {selectedMessage.adminNotes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Previous Admin Notes:</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.adminNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Add Admin Notes */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Add Admin Notes:</h4>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this message or customer interaction..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows="3"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={!adminNotes.trim() || updateMutation.isPending}
                  className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  {updateMutation.isPending ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              {/* Platform Reply Section */}
              <div className="mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  📨 Reply on Platform (Customer will see this when they check their messages)
                </h4>
                
                {/* Show existing reply if any */}
                {selectedMessage.adminReply && (
                  <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Previous Reply:</p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.adminReply}
                    </p>
                  </div>
                )}

                <textarea
                  value={platformReply}
                  onChange={(e) => setPlatformReply(e.target.value)}
                  placeholder="Type your reply here. The customer will see this message when they check their support messages in the platform..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows="4"
                />
                <button
                  onClick={handleSendPlatformReply}
                  disabled={!platformReply.trim() || updateMutation.isPending}
                  className="mt-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  {updateMutation.isPending ? 'Sending...' : 'Send Platform Reply'}
                </button>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  💡 This reply will be saved and the customer can view it in their Messages section
                </p>
              </div>

              {/* OR separator */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">OR REPLY VIA</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Email & WhatsApp Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => handleEmailReply(selectedMessage)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Reply via Email
                </button>
                <button
                  onClick={() => handleWhatsAppReply(selectedMessage)}
                  disabled={!selectedMessage.phone}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    selectedMessage.phone
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  title={!selectedMessage.phone ? 'Customer did not provide phone number' : ''}
                >
                  <MessageSquare size={20} />
                  {selectedMessage.phone ? 'Reply via WhatsApp' : 'No Phone Number'}
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Update Status:</h4>
                <div className="flex gap-2">
                  {['new', 'read', 'replied', 'resolved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedMessage._id, status)}
                      disabled={selectedMessage.status === status}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedMessage.status === status
                          ? 'bg-primary-500 text-white cursor-not-allowed'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesAdmin;
