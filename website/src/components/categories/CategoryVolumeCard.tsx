import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryVolume } from '../../data/categoriesPage';

interface CategoryVolumeCardProps {
  category: CategoryVolume;
}

export const CategoryVolumeCard: React.FC<CategoryVolumeCardProps> = ({ category }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(category.link || '/categories')}
      className="group relative aspect-[3/4] overflow-hidden bg-black cursor-pointer flex flex-col justify-end"
    >
      <img
        alt={category.title}
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
        src={category.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
      <div className="relative z-20 p-8 text-white">
        <div className="flex justify-between items-center mb-3">
          <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-white/70">
            {category.volume}
          </span>
          <span className="font-label-caps text-[9px] uppercase tracking-widest bg-white/20 backdrop-blur-sm px-3 py-1 text-white">
            {category.itemCount} Items
          </span>
        </div>
        <h3 className="font-display-lg text-4xl mb-3 leading-tight">{category.title}</h3>
        <p className="font-body-md text-xs text-white/80 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {category.description}
        </p>
        <div className="inline-flex items-center gap-3 font-label-caps text-[10px] uppercase tracking-widest border-b border-white pb-1 group-hover:gap-4 transition-all">
          <span>Explore Department</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
