import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Collection } from '../../types';

interface CollectionCardProps {
  collection: Collection;
  showArrowIcon?: boolean;
  titleSizeClass?: string;
  paddingClass?: string;
  textSizeClass?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  showArrowIcon = false,
  titleSizeClass = 'text-3xl md:text-4xl',
  paddingClass = 'p-10',
  textSizeClass = 'text-xs md:text-sm max-w-xs',
}) => {
  const navigate = useNavigate();

  const targetLink = collection.link && collection.link !== '#' ? collection.link : '/collections';

  return (
    <div
      onClick={() => navigate(targetLink)}
      className={`group relative ${collection.height} overflow-hidden cursor-pointer`}
    >
      <img
        alt={collection.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        src={collection.image}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
      <div className={`absolute inset-0 ${paddingClass} flex flex-col justify-end text-white z-20`}>
        <span className="font-label-caps text-[10px] tracking-[0.5em] uppercase mb-4 opacity-80">
          {collection.number}
        </span>
        <h3 className={`font-display-lg ${titleSizeClass} mb-4 italic leading-tight`}>
          {collection.title}
        </h3>
        <p className={`font-body-md ${textSizeClass} mb-6 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0`}>
          {collection.description}
        </p>
        <div className="inline-flex items-center gap-4 group/btn self-start">
          <span className="font-label-caps text-[10px] md:text-[11px] uppercase tracking-widest border-b border-white pb-1">
            Explore Collection
          </span>
          {showArrowIcon && (
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
          )}
        </div>
      </div>
    </div>
  );
};
