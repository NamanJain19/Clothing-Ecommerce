import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (category.link && category.link !== '#') {
      navigate(category.link);
    } else {
      navigate('/categories');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
    >
      <img
        alt={category.title}
        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
        src={category.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-8 left-8 text-white">
        <h3 className="font-headline-md text-3xl mb-1">{category.title}</h3>
        <p className="font-label-caps text-[9px] tracking-widest uppercase opacity-60">
          {category.volume}
        </p>
      </div>
    </div>
  );
};
