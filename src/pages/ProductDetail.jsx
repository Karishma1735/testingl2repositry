import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  Check
} from 'lucide-react';
import { productApi } from '../api/productApi.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';

export const ProductDetail = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productApi.getProduct(idOrSlug);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelated(res.related || []);
          setSelectedImage(0);
          setQuantity(1);
        } else {
          setError('Purse not found in our catalog.');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 aspect-[4/5] bg-atelier-200"></div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-atelier-200 w-1/4"></div>
            <div className="h-8 bg-atelier-200 w-3/4"></div>
            <div className="h-6 bg-atelier-200 w-1/3"></div>
            <div className="h-24 bg-atelier-200 w-full"></div>
            <div className="h-12 bg-atelier-200 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl text-atelier-950 mb-2">Item Not Found</h2>
        <p className="text-xs text-atelier-600 mb-8">{error || 'This creation does not exist or has been archived.'}</p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 3;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] text-atelier-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-atelier-950 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-atelier-950 transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-atelier-950 transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-atelier-950 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 bg-atelier-150 overflow-hidden border transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-atelier-950 ring-1 ring-atelier-950'
                      : 'border-atelier-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Image */}
          <div className="flex-1 aspect-[4/5] bg-atelier-150 overflow-hidden border border-atelier-200 relative group">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-atelier-950 text-white text-[10px] uppercase tracking-luxury px-3 py-1 font-medium">
                Best Seller
              </span>
            )}
          </div>
        </div>

        {/* Product Purchase Column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center justify-between text-xs text-atelier-500 uppercase tracking-widest mb-1.5">
              <span>{product.category}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-atelier-950 font-normal leading-tight mb-3">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-atelier-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-atelier-gold text-atelier-gold'
                        : 'text-atelier-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-atelier-600 font-medium">
                {product.rating || 4.9} ({product.numReviews || 24} Atelier Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-atelier-200">
              <span className="font-serif text-3xl font-semibold text-atelier-950">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-atelier-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 uppercase tracking-wider font-semibold">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Narrative Description */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-atelier-700 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="bg-atelier-100/70 p-4 border border-atelier-200 divide-y divide-atelier-200 text-xs">
            <div className="flex justify-between py-2">
              <span className="text-atelier-500 uppercase tracking-wider">Material</span>
              <span className="font-medium text-atelier-950">{product.material}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-atelier-500 uppercase tracking-wider">Dimensions</span>
              <span className="font-medium text-atelier-950">{product.dimensions}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-atelier-500 uppercase tracking-wider">Color</span>
              <span className="font-medium text-atelier-950">{product.color}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-atelier-500 uppercase tracking-wider">Hardware</span>
              <span className="font-medium text-atelier-950">{product.hardware}</span>
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="text-xs flex items-center gap-2">
            {isOutOfStock ? (
              <span className="text-red-700 font-medium">
                Sold Out — Currently Crafting Next Batch
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-medium">
                Low Inventory — Only {product.countInStock} items remaining
              </span>
            ) : (
              <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                In Stock & Hand-Inspected in Atelier
              </span>
            )}
          </div>

          {/* Add to Bag Controls */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                {/* Quantity picker */}
                <div className="inline-flex items-center border border-atelier-300 bg-white">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-atelier-600 hover:text-atelier-950 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.countInStock, prev + 1)
                      )
                    }
                    disabled={quantity >= product.countInStock}
                    className="p-3 text-atelier-600 hover:text-atelier-950 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-atelier-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-atelier-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border transition-colors ${
                    wishlisted
                      ? 'bg-atelier-950 text-red-500 border-atelier-950'
                      : 'border-atelier-300 bg-white text-atelier-700 hover:border-atelier-950'
                  }`}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart
                    className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Value Badges */}
          <div className="pt-6 border-t border-atelier-200 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-atelier-gold mb-1.5" />
              <span className="text-[10px] uppercase tracking-wider text-atelier-600 font-medium">
                Complimentary Delivery
              </span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-atelier-gold mb-1.5" />
              <span className="text-[10px] uppercase tracking-wider text-atelier-600 font-medium">
                30-Day Returns
              </span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-atelier-gold mb-1.5" />
              <span className="text-[10px] uppercase tracking-wider text-atelier-600 font-medium">
                Lifetime Warranty
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="pt-16 border-t border-atelier-200 space-y-8">
          <div className="text-center max-w-lg mx-auto">
            <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
              Complementary Pieces
            </span>
            <h2 className="font-serif text-2xl text-atelier-950 font-normal mt-1">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
