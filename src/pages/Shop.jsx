import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Search } from 'lucide-react';
import { productApi } from '../api/productApi.js';
import { ProductGrid } from '../components/product/ProductGrid.jsx';
import { ProductFilters } from '../components/product/ProductFilters.jsx';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Extract query filters from URL
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          category: currentCategory !== 'All' ? currentCategory : undefined,
          sort: currentSort,
          search: currentSearch || undefined,
          minPrice: currentMinPrice || undefined,
          maxPrice: currentMaxPrice || undefined,
          inStock: currentInStock ? 'true' : undefined
        };

        const res = await productApi.getProducts(params);
        if (res.success) {
          setProducts(res.products || []);
          setTotal(res.total || 0);
          setPage(res.page || 1);
          setPages(res.pages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, currentPage]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    // Reset to page 1 whenever filters change
    if (!newParams.page) {
      updated.delete('page');
    }
    setSearchParams(updated);
  };

  const handleCategoryChange = (cat) => {
    updateFilters({ category: cat === 'All' ? '' : cat });
  };

  const handleSortChange = (sortVal) => {
    updateFilters({ sort: sortVal });
  };

  const handlePriceRangeChange = (min, max) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  const handleInStockToggle = () => {
    updateFilters({ inStock: currentInStock ? '' : 'true' });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters =
    currentCategory !== 'All' ||
    currentMinPrice !== '' ||
    currentMaxPrice !== '' ||
    currentInStock ||
    currentSearch !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          The Full Atelier Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-atelier-950 font-normal">
          {currentCategory !== 'All' ? currentCategory : 'Handcrafted Handbags'}
        </h1>
        <p className="text-xs text-atelier-600 leading-relaxed">
          Explore our collection of Italian calfskin carryalls, structured shoulder bags, and evening minaudières.
        </p>
      </div>

      {/* Active Search Notification */}
      {currentSearch && (
        <div className="bg-atelier-100 p-3.5 border border-atelier-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-atelier-800">
            <Search className="w-3.5 h-3.5 text-atelier-gold" />
            <span>
              Search results for: <strong className="font-medium text-atelier-950">"{currentSearch}"</strong>
            </span>
          </div>
          <button
            onClick={() => updateFilters({ search: '' })}
            className="text-xs text-atelier-600 hover:text-atelier-950 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear search</span>
          </button>
        </div>
      )}

      {/* Filters component */}
      <ProductFilters
        category={currentCategory}
        onCategoryChange={handleCategoryChange}
        sort={currentSort}
        onSortChange={handleSortChange}
        priceRange={{ min: currentMinPrice, max: currentMaxPrice }}
        onPriceRangeChange={handlePriceRangeChange}
        inStockOnly={currentInStock}
        onInStockToggle={handleInStockToggle}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Count Header */}
      <div className="flex justify-between items-center text-xs text-atelier-500 pb-2">
        <span>
          Showing <strong className="text-atelier-950 font-medium">{products.length}</strong> of{' '}
          <strong className="text-atelier-950 font-medium">{total}</strong> creations
        </span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} loading={loading} />

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="pt-12 flex justify-center items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => updateFilters({ page: page - 1 })}
            className="p-2.5 border border-atelier-200 bg-surface text-atelier-700 hover:text-atelier-950 hover:border-atelier-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: pages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => updateFilters({ page: pageNum })}
                className={`w-9 h-9 text-xs font-medium border transition-colors ${
                  pageNum === page
                    ? 'bg-atelier-950 text-white border-atelier-950'
                    : 'bg-surface text-atelier-700 border-atelier-200 hover:border-atelier-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page >= pages}
            onClick={() => updateFilters({ page: page + 1 })}
            className="p-2.5 border border-atelier-200 bg-surface text-atelier-700 hover:text-atelier-950 hover:border-atelier-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
