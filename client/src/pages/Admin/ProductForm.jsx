import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Save, X, Plus, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Loader from '../../components/Loader';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    stock: '',
    brand: '',
    sku: '',
    isFeatured: false,
    isActive: true,
    specifications: [],
  });

  const [imageUrls, setImageUrls] = useState(['']);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosClient.get('/categories');
      return response.data.data.categories;
    },
  });

  // Fetch product if editing
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data.data.product;
    },
    enabled: isEditMode,
  });

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category?._id || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        stock: product.stock || '',
        brand: product.brand || '',
        sku: product.sku || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== false,
        specifications: product.specifications || [],
      });
      setImageUrls(product.images?.map(img => img.url) || ['']);
    }
  }, [product]);

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isEditMode) {
        return await axiosClient.put(`/products/${id}`, data);
      } else {
        return await axiosClient.post('/products', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['products']);
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} product:`, error.response?.data?.message || error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.description || !formData.category || !formData.price || formData.stock === '') {
      console.error('Please fill in all required fields');
      return;
    }

    // Prepare images array from URLs or uploaded files
    let images = [];
    
    if (uploadMode === 'url') {
      images = imageUrls
        .filter(url => url.trim())
        .map(url => ({
          public_id: `product_${Date.now()}`,
          url: url.trim(),
        }));
    } else {
      images = uploadedFiles.map(file => ({
        public_id: file.public_id || `product_${Date.now()}`,
        url: file.url || file.preview,
      }));
    }

    if (images.length === 0) {
      console.error('Please add at least one product image');
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
      stock: Number(formData.stock),
      images,
    };

    saveMutation.mutate(productData);
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleRemoveImageUrl = (index) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const handleAddSpecification = () => {
    if (newSpec.key && newSpec.value) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, { ...newSpec }],
      });
      setNewSpec({ key: '', value: '' });
    }
  };

  const handleRemoveSpecification = (index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    });
  };

  // File upload handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select only image files');
      return;
    }

    // Check file size (max 5MB per file)
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files are too large. Maximum size is 5MB per image.');
      return;
    }

    setUploading(true);

    try {
      // Create preview URLs for immediate display
      const newFiles = imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        uploading: true,
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Upload files to backend
      const uploadPromises = imageFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await axiosClient.post('/upload/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Update the file with the server response
          return {
            preview: response.data.url,
            url: response.data.url,
            public_id: response.data.public_id,
            name: file.name,
            size: file.size,
            uploading: false,
          };
        } catch (error) {
          console.error('Upload failed for', file.name, error);
          // Keep preview but mark as failed
          return {
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            uploading: false,
            error: true,
          };
        }
      });

      const uploadedResults = await Promise.all(uploadPromises);
      
      // Replace uploading files with uploaded results
      setUploadedFiles(prev => {
        const existing = prev.filter(f => !f.uploading);
        return [...existing, ...uploadedResults];
      });

    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload some images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveUploadedFile = (index) => {
    setUploadedFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Revoke object URL to free memory
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview);
      }
      return updated;
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  if (isEditMode && loadingProduct) return <Loader fullScreen />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="btn btn-outline flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="e.g., Cordless Drill Driver Kit"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={4}
                placeholder="Detailed product description..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="input"
                  placeholder="e.g., DeWalt"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Pricing & Inventory</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Compare at Price</label>
              <input
                type="number"
                value={formData.comparePrice}
                onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                className="input"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Original price for discount display</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input"
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="input"
                placeholder="PROD-001"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Product Images *</h2>
            
            {/* Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadMode === 'file'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Upload size={16} />
                Upload Files
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadMode === 'url'
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <LinkIcon size={16} />
                Enter URLs
              </button>
            </div>
          </div>

          {/* Upload Mode - Drag and Drop */}
          {uploadMode === 'file' && (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    ) : (
                      <Upload size={32} className="text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {uploading ? 'Uploading...' : 'Drop images here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Supports: JPG, PNG, GIF, WebP (Max 5MB per file)
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative group bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600"
                    >
                      <div className="aspect-square">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Overlay with info */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedFile(index)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Upload status badge */}
                      {file.uploading && (
                        <div className="absolute top-2 right-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                      )}
                      {file.error && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Failed
                        </div>
                      )}

                      {/* File name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white truncate">{file.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* URL Mode */}
          {uploadMode === 'url' && (
            <div className="space-y-4">
              {/* Image URL Instructions */}
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <h3 className="font-semibold text-primary-800 dark:text-primary-300 mb-2 flex items-center gap-2">
                  <ImageIcon size={18} />
                  How to Add Product Images
                </h3>
                <div className="text-sm text-primary-700 dark:text-primary-400 space-y-2">
                  <p><strong>Free Stock Images:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Unsplash:</strong> <a href="https://unsplash.com/s/photos/tools" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">unsplash.com/s/photos/tools</a></li>
                    <li><strong>Pexels:</strong> <a href="https://www.pexels.com/search/hardware-tools/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">pexels.com</a></li>
                    <li><strong>Pixabay:</strong> <a href="https://pixabay.com/images/search/tools/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-600">pixabay.com</a></li>
                  </ul>
                  <p className="mt-2"><strong>How to get image URL:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Find your image on Unsplash/Pexels</li>
                    <li>Right-click on the image → "Copy image address"</li>
                    <li>Paste the URL below</li>
                  </ol>
                </div>
              </div>

              {imageUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      className="input flex-1"
                      placeholder="https://images.unsplash.com/photo-xxxxx"
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(index)}
                        className="btn btn-outline text-red-600"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  {/* Image Preview */}
                  {url && (
                    <div className="relative w-32 h-32 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 hidden items-center justify-center text-xs text-red-600 bg-red-50 dark:bg-red-900/20">
                        <div className="text-center p-2">
                          <X size={24} className="mx-auto mb-1" />
                          <p>Invalid URL</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="btn btn-outline flex items-center gap-2"
              >
                <Plus size={20} />
                Add Image URL
              </button>
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>

          {formData.specifications.length > 0 && (
            <div className="space-y-2 mb-4">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <span className="font-medium">{spec.key}:</span> {spec.value}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSpec.key}
              onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
              className="input flex-1"
              placeholder="Key (e.g., Power)"
            />
            <input
              type="text"
              value={newSpec.value}
              onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
              className="input flex-1"
              placeholder="Value (e.g., 20V)"
            />
            <button
              type="button"
              onClick={handleAddSpecification}
              className="btn btn-outline"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Settings</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Featured Product</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Active (visible to customers)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saveMutation.isLoading}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saveMutation.isLoading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
