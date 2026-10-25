import React from 'react';
import { ProductCard } from './ProductCard.jsx';
import { SkeletonCard } from '../common/SkeletonCard.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export const ProductGrid = ({
  products = [],
  loading = false,
  skeletonCount = 8,
  emptyTitle = 'No Purses Found',
  emptyDescription = 'Try adjusting your search keywords, category filters, or price range.'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="View All Purses"
        actionLink="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
