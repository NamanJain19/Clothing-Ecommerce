import React from 'react';
import { instagramData } from '../../data/instagram';

export const InstagramGallerySection: React.FC = () => {
  return (
    <section className="py-section-gap bg-surface" id="instagram">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-16">
        <h2 className="font-display-lg text-4xl mb-2">#MONOLITH_WORLD</h2>
        <p className="font-label-caps text-[11px] tracking-widest uppercase opacity-60">
          Curated Moments from Our Community
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 px-1 max-w-[1920px] mx-auto">
        {instagramData.map((post) => (
          <div key={post.id} className="aspect-square overflow-hidden cursor-pointer">
            <img
              alt={post.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              src={post.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
