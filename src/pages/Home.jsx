import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Award, Clock } from 'lucide-react';
import { productApi } from '../api/productApi.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { SkeletonCard } from '../components/common/SkeletonCard.jsx';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const res = await productApi.getFeatured();
        if (res.success) {
          setFeaturedProducts(res.featured || []);
          setBestSellers(res.bestSellers || []);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const collections = [
    {
      title: 'Tote Bags',
      subtitle: 'The Grand Carryall',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Tote%20Bags'
    },
    {
      title: 'Crossbody Bags',
      subtitle: 'Architectural Ease',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Crossbody%20Bags'
    },
    {
      title: 'Shoulder Bags',
      subtitle: '90s Sculptural Lines',
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Shoulder%20Bags'
    },
    {
      title: 'Evening Clutches',
      subtitle: 'Champagne Nights',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      link: '/shop?category=Clutches%20%26%20Evening'
    }
  ];

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Editorial Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-4">
        <div className="grid overflow-hidden rounded-[2rem] border border-atelier-200 bg-atelier-100 lg:min-h-[620px] lg:grid-cols-[0.94fr_1.06fr]">
          <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-super-wide text-accent">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Autumn / Winter · 2026
            </span>

            <h1 className="mt-7 max-w-xl font-serif text-5xl font-normal leading-[1.04] tracking-tight text-atelier-950 sm:text-6xl lg:text-7xl">
              Handmade for
              <br className="hidden sm:block" />
              <span className="italic text-accent">the long way home.</span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-atelier-600 sm:text-base">
              Thoughtfully crafted leather bags for the places you go, the things you carry, and the years you keep them.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-xs font-semibold uppercase tracking-luxury text-accent-foreground shadow-lg transition-colors hover:bg-accent-hover sm:w-auto"
              >
                <span>Discover the collection</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                to="/shop?sort=bestseller"
                className="inline-flex w-full items-center justify-center rounded-full border border-atelier-300 px-7 py-3.5 text-xs font-medium uppercase tracking-luxury text-atelier-900 transition-colors hover:bg-surface sm:w-auto"
              >
                Shop best sellers
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-atelier-200 pt-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Award className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-atelier-900">Made slowly. Made to last.</p>
                <p className="mt-1 text-xs text-atelier-500">Small-batch Italian leatherwork</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-atelier-200 sm:min-h-[520px] lg:min-h-[620px]">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2000&q=85"
              alt="A handcrafted leather handbag from the Élégance Atelier collection"
              className="absolute inset-0 size-full object-cover object-center transition-transform duration-1000 hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/5" />
            <div className="absolute right-5 top-5 rounded-full border border-atelier-200/70 bg-surface/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-luxury text-atelier-900 shadow-sm backdrop-blur-sm sm:right-8 sm:top-8">
              30+ hours of craft
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-9">
              <p className="text-[10px] uppercase tracking-super-wide text-white/75">A study in considered details</p>
              <p className="mt-2 font-serif text-2xl sm:text-3xl">Made in Tuscany, kept for years.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 px-8 bg-atelier-100/60 border border-atelier-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-atelier-200/70 flex items-center justify-center text-atelier-gold-dark shrink-0">
              <Award className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-atelier-950">
                Full-Grain Italian Calfskin
              </h4>
              <p className="text-xs text-atelier-600 mt-0.5">
                Sourced exclusively from certified Tuscan tanneries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-atelier-200/70 flex items-center justify-center text-atelier-gold-dark shrink-0">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-atelier-950">
                30+ Hours of Artisanship
              </h4>
              <p className="text-xs text-atelier-600 mt-0.5">
                Every purse is hand-cut, stitched, and edge-painted.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-atelier-200/70 flex items-center justify-center text-atelier-gold-dark shrink-0">
              <Shield className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-atelier-950">
                Lifetime Atelier Warranty
              </h4>
              <p className="text-xs text-atelier-600 mt-0.5">
                Complimentary repairs & conditioning for life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-atelier-950 font-normal">
            Discover Our Silhouettes
          </h2>
          <p className="text-xs text-atelier-600">
            From expansive weekday carryalls to jewel-like evening minaudières.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <Link
              key={col.title}
              to={col.link}
              className="group relative aspect-[3/4] overflow-hidden bg-atelier-200 block border border-atelier-200"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-atelier-gold font-medium">
                  {col.subtitle}
                </p>
                <h3 className="font-serif text-xl font-normal group-hover:translate-x-1 transition-transform">
                  {col.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-atelier-200 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 text-atelier-gold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-atelier-200 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
              Maison Classics
            </span>
            <h2 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
              Best-Selling Creations
            </h2>
          </div>
          <Link
            to="/shop?sort=bestseller"
            className="text-xs uppercase tracking-luxury text-atelier-950 hover:text-atelier-gold-dark font-medium flex items-center gap-1.5"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Brand Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-atelier-100/40 p-8 sm:p-14 border border-atelier-200">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
              The Art of Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-atelier-950 font-normal leading-tight">
              Honoring Heritage Leathercraft in a Fast-Fashion World.
            </h2>
            <p className="text-xs sm:text-sm text-atelier-600 leading-relaxed">
              Every handbag created in our atelier begins with the careful inspection of individual hides. We select only the top five percent of vegetable-tanned calfskin, preserving the organic grain patterns that make every single creation distinctly unique.
            </p>
            <p className="text-xs sm:text-sm text-atelier-600 leading-relaxed">
              Equipped with saddler's needles, waxed French linen threads, and custom brass hardware cast in Florence, our artisans build bags engineered to withstand generations of loving wear.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800 transition-colors"
              >
                <span>Discover The Workshop</span>
                <ArrowRight className="w-4 h-4 text-atelier-gold" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80"
              alt="Artisan leatherworking atelier"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm p-4 text-center border border-atelier-200">
              <p className="font-serif text-xs text-atelier-950 uppercase tracking-widest font-medium">
                Ponte a Ema Atelier — Florence, Italy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-atelier-200 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
              Signature Releases
            </span>
            <h2 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
              Curated Handbags
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-luxury text-atelier-950 hover:text-atelier-gold-dark font-medium flex items-center gap-1.5"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
