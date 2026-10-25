import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'Your collection is empty',
  description = 'Explore our handcrafted leather goods to discover timeless pieces.',
  actionLabel = 'Explore Collection',
  actionLink = '/shop'
}) => {
  return (
    <div className="py-20 px-4 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-atelier-150 flex items-center justify-center text-atelier-700 mb-6">
        <Icon className="w-8 h-8 stroke-[1.2]" />
      </div>
      <h3 className="font-serif text-2xl text-atelier-950 mb-2">{title}</h3>
      <p className="text-sm text-atelier-600 mb-8 leading-relaxed">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};
