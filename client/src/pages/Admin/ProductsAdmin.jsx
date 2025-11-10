import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import { Package, Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import Loader from '../../components/Loader';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';

const ProductsAdmin = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', currentPage, searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
      });
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axiosClient.get(`/products?${params}`);
      return response.data.data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosClient.get('/categories');
      return response.data.data.categories;
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: (error) => {
      console.error('Failed to delete product:', error.response?.data?.message || error);
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) 
      return <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold">Out of Stock</span>;
    if (stock < 10) 
      return <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-bold">Low Stock ({stock})</span>;
    return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold">In Stock ({stock})</span>;
  };

  if (isLoading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
                placeholder="Search products..."
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsData?.products?.map((product) => (
          <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 overflow-hidden">
            {/* Image Section */}
            <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700/30 rounded-t-xl h-48 flex items-center justify-center">
              <img
                src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
              />
              
              {/* Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                {product.isFeatured && (
                  <span className="px-2.5 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold shadow-lg">
                    ★ Featured
                  </span>
                )}
                <div className="ml-auto">
                  {getStockBadge(product.stock)}
                </div>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-4">
              {/* Category Badge */}
              {product.category?.name && (
                <span className="inline-block px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold mb-2">
                  {product.category.name}
                </span>
              )}
              
              {/* Product Name */}
              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-3 text-base leading-tight min-h-[2.5rem]">
                {product.name}
              </h3>
              
              {/* Price and Stock Section */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(product.price)}
                  </div>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {formatCurrency(product.comparePrice)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Stock</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {product.stock}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/products/${product._id}`}
                  className="flex-1 py-2.5 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm"
                  target="_blank"
                >
                  <Eye size={16} />
                  View
                </Link>
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="flex-1 py-2.5 px-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm hover:shadow-md"
                >
                  <Edit size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id, product.name)}
                  className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {productsData?.pagination && productsData.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-outline"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {productsData.pagination.pages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === productsData.pagination.pages}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {productsData?.products?.length === 0 && (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory
              ? 'Try adjusting your filters'
              : 'Get started by adding your first product'}
          </p>
          <Link to="/admin/products/new" className="btn btn-primary">
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
