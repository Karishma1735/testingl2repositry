import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const Wishlist = () => {
  const { wishlistItems, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save your favorite handcrafted leather handbags to curate your personal atelier collection."
          actionLabel="Explore Catalog"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="pb-6 border-b border-atelier-200">
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          Saved Creations
        </span>
        <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
          Your Wishlist ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {wishlistItems.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
