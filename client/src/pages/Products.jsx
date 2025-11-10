import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import axiosClient from '../api/axiosClient';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/formatCurrency';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get filter params from URL
  const categoryFromUrl = searchParams.get('category') || '';
  const sortFromUrl = searchParams.get('sort') || '';
  const searchFromUrl = searchParams.get('search') || '';

  // Fetch categories from database
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosClient.get('/categories');
      return response.data.data.categories;
    },
  });

  // Fetch products with all URL params
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', categoryFromUrl, sortFromUrl, searchFromUrl, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchFromUrl) params.append('search', searchFromUrl);
      if (categoryFromUrl) params.append('category', categoryFromUrl);
      if (sortFromUrl) params.append('sort', sortFromUrl);
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);

      const response = await axiosClient.get(`/products?${params.toString()}`);
      return response.data.data;
    },
  });

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="text-gray-700 dark:text-gray-300">Discover</span> / {categoryFromUrl || 'Electronics'}
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Best Selling {categoryFromUrl ? categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1) : 'Electronics'} Products - Weekly Updated
        </h1>
      </div>

      {/* Category Tabs - Wrap on overflow */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-[11px] sm:text-xs font-medium transition-all ${!categoryFromUrl
                ? 'bg-gray-900 dark:bg-gray-700 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            All
          </button>
          {categoriesData?.slice(0, 9).map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full whitespace-nowrap text-[11px] sm:text-xs font-medium transition-all ${categoryFromUrl === category.slug
                  ? 'bg-gray-900 dark:bg-gray-700 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Count */}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        Showing {productsData?.products?.length || 0} of {productsData?.pagination?.total || 0} products
      </p>

      {/* Products Grid */}
      {productsData?.products?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 dark:text-gray-400">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {productsData?.products?.map((product) => {
            const discountAmount = product.comparePrice && product.price < product.comparePrice
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : product.discount || 0;

            return (
              <div
                key={product._id}
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative w-full"
              >
                {/* Product Image */}
                <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
                  {/* Discount Badge - Top Left */}
                  {discountAmount > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
                      -{discountAmount}% OFF
                    </div>
                  )}

                  {/* Cart Button - Top Right */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute top-2 right-2 z-10 p-2 sm:p-2.5 bg-gray-900 dark:bg-gray-600 text-white rounded-full shadow-lg hover:bg-orange-500 transition-colors"
                  >
                    <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>

                  <img
                    src={product.images?.[0]?.url || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Product Info */}
                <Link to={`/products/${product._id}`} className="block p-2 sm:p-3 lg:p-4 border-t border-gray-100 dark:border-gray-700">
                  {/* Category */}
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                    {product.category?.name || 'Product'}
                  </p>

                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 line-clamp-2 text-xs sm:text-sm">
                    {product.name}
                  </h3>

                  {/* Price & Rating Row */}
                  <div className="flex items-center justify-between">
                    {/* Price */}
                    <div>
                      {discountAmount > 0 ? (
                        <div>
                          <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                            {formatCurrency(product.comparePrice || product.price * (1 + discountAmount / 100))}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </div>

                    {/* Rating Stars - Real from Database */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`sm:w-[14px] sm:h-[14px] ${i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {currentPage < (productsData?.pagination?.pages || 0) && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="btn btn-primary"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;