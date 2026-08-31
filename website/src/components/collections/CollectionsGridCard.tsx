import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CollectionGridItem } from '../../data/collectionsPage';

interface CollectionsGridCardProps {
  collection: CollectionGridItem;
}

export const CollectionsGridCard: React.FC<CollectionsGridCardProps> = ({ collection }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (collection.link && collection.link !== '#') {
      navigate(collection.link);
    } else {
      navigate('/women');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative overflow-hidden border border-outline/10 bg-white flex flex-col cursor-pointer"
    >
      <div className="aspect-[16/10] w-full overflow-hidden relative bg-surface-container-low">
        <img
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={collection.image}
        />
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 font-label-caps text-[9px] uppercase tracking-widest">
          {collection.productCount} Products
        </div>
      </div>
      <div className="p-8 flex flex-col justify-between flex-grow">
        <div>
          <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 block">
            {collection.category}
          </span>
          <h3 className="font-headline-md text-2xl text-primary mb-3 leading-tight">
            {collection.name}
          </h3>
          <p className="font-body-md text-sm text-secondary leading-relaxed mb-8">
            {collection.description}
          </p>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-full inline-flex items-center justify-center font-label-caps text-[11px] uppercase tracking-widest border border-primary py-3 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
          >
            Shop Collection
          </button>
        </div>
      </div>
    </div>
  );
};
