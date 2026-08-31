import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FeaturedCollectionBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="my-section-gap w-full relative group overflow-hidden border border-outline/10">
      <div className="aspect-[21/9] w-full overflow-hidden">
        <img
          alt="The Daily Dialogue Casual Collection"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvuwN6WJWgSVJznhqLckf_x1qf-4k__Ipd0zovX4YnLTDu-QTvCQ5vkkeIgeU0_gzQJKxw42QkqbFbPKDD8MY8zr6BMLkLA_4F58BKstLlfa-dhdUffweKxtS4jUgaWOLlDKMQeMQuR7kg5t6OBJPwUu663MBnPg-wDLxeFkm0nKIsgPZzfRoEdq_xTdFKPL4Ol0euORWfht5ufv-dUIcDuFc0rTJlpE7IYi44A7tuPz88fE8wmTbDJw"
        />
      </div>
      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-8">
        <span className="font-label-caps text-label-caps uppercase mb-4 tracking-[0.3em]">
          Featured Campaign
        </span>
        <h2 className="font-display-lg text-4xl md:text-6xl mb-8 uppercase tracking-tight">
          Casual Elegance
        </h2>
        <button
          onClick={() => navigate('/collections')}
          className="font-label-caps text-button uppercase bg-white text-black px-12 py-4 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer font-semibold"
        >
          Explore Featured Collection
        </button>
      </div>
    </section>
  );
};
