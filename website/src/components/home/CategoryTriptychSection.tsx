import React from 'react';
import { CategoryCard } from '../category/CategoryCard';
import { categoriesData } from '../../data/categories';

export const CategoryTriptychSection: React.FC = () => {
  return (
    <section className="bg-black py-section-gap" id="categories">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-20 text-white">
          <h2 className="font-display-lg text-5xl mb-4 italic">The Triptych</h2>
          <p className="font-label-caps text-[11px] tracking-[0.4em] uppercase opacity-60">
            Identity in Three Acts
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
