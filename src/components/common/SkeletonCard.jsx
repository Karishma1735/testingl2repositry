import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-atelier-200/60 w-full mb-4"></div>
      <div className="h-3 bg-atelier-200/60 w-1/3 mb-2"></div>
      <div className="h-4 bg-atelier-200/80 w-3/4 mb-3"></div>
      <div className="h-4 bg-atelier-200/60 w-1/4"></div>
    </div>
  );
};
