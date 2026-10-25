import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const hasSecondaryImage = product.images && product.images.length > 1;
  const currentImage = isHovered && hasSecondaryImage ? product.images[1] : product.images[0];
  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 3;

  return (
    <div
      className="group flex flex-col relative bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-atelier-150 mb-4 border border-atelier-200/50">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={currentImage}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-atelier-950 text-white text-[9px] uppercase tracking-luxury px-2 py-0.5 font-medium">
              Best Seller
            </span>
          )}
          {product.isFeatured && !product.isBestSeller && (
            <span className="bg-accent text-accent-foreground text-[9px] uppercase tracking-luxury px-2 py-0.5 font-semibold">
              Signature
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-800 text-white text-[9px] uppercase tracking-wider px-2 py-0.5">
              Only {product.countInStock} Left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-neutral-800 text-white text-[9px] uppercase tracking-wider px-2 py-0.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            wishlisted
              ? 'bg-atelier-950 text-red-500 shadow-md'
              : 'bg-surface/90 text-atelier-800 hover:text-atelier-950 hover:bg-surface shadow-sm'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              wishlisted ? 'fill-red-500 scale-110' : ''
            }`}
          />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full py-2.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-atelier-500 mb-1">
          <span>{product.category}</span>
          <div className="flex items-center gap-1 text-atelier-700">
            <Star className="w-3 h-3 fill-atelier-gold text-atelier-gold" />
            <span>{product.rating || 4.8}</span>
          </div>
        </div>

        <Link
          to={`/product/${product.slug || product._id}`}
          className="text-sm font-medium text-atelier-950 hover:text-atelier-gold-dark transition-colors line-clamp-1 mb-1 font-sans"
        >
          {product.name}
        </Link>

        <p className="text-xs text-atelier-500 line-clamp-1 mb-2">
          {product.material}
        </p>

        {/* Pricing */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-serif text-base font-semibold text-atelier-950">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-atelier-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        {!isOutOfStock && (
          <button
            onClick={() => addToCart(product, 1)}
            className="sm:hidden mt-3 w-full py-2 bg-atelier-150 text-atelier-900 hover:bg-atelier-950 hover:text-white text-xs uppercase tracking-luxury transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add to Bag</span>
          </button>
        )}
      </div>
    </div>
  );
};
