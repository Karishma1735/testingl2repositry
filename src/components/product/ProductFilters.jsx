import React from 'react';
import { Filter, X, Check } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Tote Bags',
  'Crossbody Bags',
  'Shoulder Bags',
  'Clutches & Evening',
  'Satchels',
  'Backpacks'
];

export const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Best Sellers', value: 'bestseller' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Customer Rating', value: 'rating' }
];

export const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under $350', min: '0', max: '350' },
  { label: '$350 — $500', min: '350', max: '500' },
  { label: '$500 & Above', min: '500', max: '' }
];

export const ProductFilters = ({
  category,
  onCategoryChange,
  sort,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockToggle,
  onResetFilters,
  hasActiveFilters
}) => {
  return (
    <div className="bg-surface p-6 border border-atelier-200/80 mb-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-atelier-150">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-atelier-gold" />
          <span className="font-serif text-sm tracking-wide uppercase text-atelier-950 font-medium">
            Filter & Refine
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-atelier-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-atelier-500 uppercase tracking-wider hidden sm:inline">
              Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-atelier-50 border border-atelier-300 text-xs text-atelier-900 py-1.5 px-3 focus:outline-none focus:border-atelier-950 font-sans"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-atelier-500 font-semibold mb-2.5">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`text-xs px-3 py-1.5 border transition-all ${
                  category === cat
                    ? 'bg-atelier-950 text-white border-atelier-950 font-medium'
                    : 'bg-atelier-50 text-atelier-700 border-atelier-200 hover:border-atelier-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-[11px] uppercase tracking-luxury text-atelier-500 font-semibold mb-2.5">
            Price Range
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRICE_RANGES.map((range, index) => {
              const isSelected =
                priceRange.min === range.min && priceRange.max === range.max;
              return (
                <button
                  key={index}
                  onClick={() => onPriceRangeChange(range.min, range.max)}
                  className={`text-xs px-3 py-1.5 border transition-all ${
                    isSelected
                      ? 'bg-atelier-950 text-white border-atelier-950 font-medium'
                      : 'bg-atelier-50 text-atelier-700 border-atelier-200 hover:border-atelier-400'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inventory Stock Toggle */}
        <div className="flex flex-col justify-end">
          <label
            onClick={onInStockToggle}
            className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-atelier-800 hover:text-atelier-950 py-1.5"
          >
            <div
              className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                inStockOnly
                  ? 'bg-atelier-950 border-atelier-950 text-white'
                  : 'bg-surface border-atelier-300'
              }`}
            >
              {inStockOnly && <Check className="w-3 h-3 stroke-[2.5]" />}
            </div>
            <span>In-Stock Items Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};
