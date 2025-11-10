import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { Tag, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import Loader from '../../components/Loader';
import { formatDate, formatCurrency } from '../../utils/formatCurrency';

const DiscountsAdmin = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minimumPurchase: '0',
    maxDiscount: '',
    usageLimit: '',
    userUsageLimit: '1',
    startDate: '',
    endDate: '',
  });

  // Fetch discounts
  const { data, isLoading } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: async () => {
      const response = await axiosClient.get('/discounts/admin');
      return response.data.data.discounts;
    },
  });

  // Create discount mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await axiosClient.post('/discounts/create', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-discounts']);
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to create discount:', error.response?.data?.message || error);
    },
  });

  // Update discount mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosClient.put(`/discounts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-discounts']);
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to update discount:', error.response?.data?.message || error);
    },
  });

  // Delete discount mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.delete(`/discounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-discounts']);
    },
    onError: (error) => {
      console.error('Failed to delete discount:', error.response?.data?.message || error);
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minimumPurchase: '0',
      maxDiscount: '',
      usageLimit: '',
      userUsageLimit: '1',
      startDate: '',
      endDate: '',
    });
    setEditingDiscount(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();
    
    // Check if end date is before start date
    if (endDate <= startDate) {
      alert('❌ End date must be after start date!');
      return;
    }
    
    // Warn if start date is in the future
    if (startDate > now) {
      const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      if (!window.confirm(
        `⚠️ Warning: Start date is ${daysUntilStart} day(s) in the future.\n\n` +
        `This discount will be INACTIVE until ${startDate.toLocaleDateString()}.\n\n` +
        `Do you want to continue?`
      )) {
        return;
      }
    }
    
    // Warn if end date is in the past
    if (endDate < now) {
      if (!window.confirm(
        `⚠️ Warning: End date is in the past.\n\n` +
        `This discount will be INACTIVE (expired).\n\n` +
        `Do you want to continue?`
      )) {
        return;
      }
    }
    
    // Validate percentage value
    if (formData.type === 'percentage' && Number(formData.value) > 100) {
      alert('❌ Percentage discount cannot exceed 100%!');
      return;
    }
    
    // Validate value is positive
    if (Number(formData.value) <= 0) {
      alert('❌ Discount value must be greater than 0!');
      return;
    }
    
    const submitData = {
      ...formData,
      value: Number(formData.value),
      minimumPurchase: Number(formData.minimumPurchase),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      userUsageLimit: Number(formData.userUsageLimit),
    };

    if (editingDiscount) {
      updateMutation.mutate({ id: editingDiscount._id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      name: discount.name,
      description: discount.description || '',
      type: discount.type,
      value: discount.value.toString(),
      minimumPurchase: discount.minimumPurchase.toString(),
      maxDiscount: discount.maxDiscount?.toString() || '',
      usageLimit: discount.usageLimit?.toString() || '',
      userUsageLimit: discount.userUsageLimit.toString(),
      startDate: new Date(discount.startDate).toISOString().slice(0, 16),
      endDate: new Date(discount.endDate).toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      deleteMutation.mutate(id);
    }
  };

  const getTypeDisplay = (type, value) => {
    if (type === 'percentage') return `${value}%`;
    if (type === 'fixed') return formatCurrency(value);
    return 'Free Shipping';
  };

  const isActive = (discount) => {
    const now = new Date();
    return (
      discount.isActive &&
      new Date(discount.startDate) <= now &&
      new Date(discount.endDate) >= now
    );
  };

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Discount Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage discount codes and promotions
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Create Discount
          </button>
        </div>

        {/* Discounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((discount) => (
            <div key={discount._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-bold text-lg">{discount.code}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{discount.name}</p>
                  </div>
                </div>
                <span className={`badge ${isActive(discount) ? 'badge-success' : 'badge-danger'}`}>
                  {isActive(discount) ? 'Active' : 'Inactive'}
                </span>
              </div>

              {discount.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {discount.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="font-semibold text-primary-600">
                    {getTypeDisplay(discount.type, discount.value)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Min Purchase:</span>
                  <span className="font-semibold">{formatCurrency(discount.minimumPurchase)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                  <span className="font-semibold">
                    {discount.usageCount} / {discount.usageLimit || '∞'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                  <span className="font-semibold">{formatDate(discount.endDate)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(discount)}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(discount._id)}
                  className="btn btn-outline text-red-600 hover:bg-red-50 flex-1 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Discount Code *</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="input"
                        placeholder="SUMMER2024"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Discount Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                        placeholder="Summer Sale"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input"
                      rows={2}
                      placeholder="Special summer discount for all products"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="input"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                        <option value="free_shipping">Free Shipping</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Value * {formData.type === 'percentage' && '(%)'}
                      </label>
                      <input
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="input"
                        min="0"
                        step="0.01"
                        required
                        disabled={formData.type === 'free_shipping'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Minimum Purchase</label>
                      <input
                        type="number"
                        value={formData.minimumPurchase}
                        onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
                        className="input"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Max Discount</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                        className="input"
                        min="0"
                        step="0.01"
                        placeholder="No limit"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Total Usage Limit</label>
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        className="input"
                        min="1"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Per User Limit *</label>
                      <input
                        type="number"
                        value={formData.userUsageLimit}
                        onChange={(e) => setFormData({ ...formData, userUsageLimit: e.target.value })}
                        className="input"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date *</label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">End Date *</label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                      {editingDiscount ? 'Update' : 'Create'} Discount
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsAdmin;
