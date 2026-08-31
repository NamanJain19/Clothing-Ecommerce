import React from 'react';

export const CategoriesHero: React.FC = () => {
  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden h-[50vh] min-h-[420px] max-h-[480px]">
      <div className="absolute inset-0 z-0 scale-105 transition-transform duration-1000 ease-out hover:scale-100">
        <img
          alt="The Categories Hero"
          className="w-full h-full object-cover grayscale brightness-75"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPGh3NLXUeJtgdP7GK6kUSOeBYQRcBq4xUTKy6-3uHZvXggmyGfsqGyrXbc7naneJ0NtRcsHq_lVeqx7Kf4P8NiY8ZHOqR_wjqcGEihHaVJRWlce7lpmajlMPi38arVHDJ4o9R_KL9VlhyyOSifFY7hASsSEz6sCOFHvKKLHD_a9GrceeKzOaEuGHrTLVtZOIYDKi4wmKpWWzX4SZMPe6A5gpcpkq5dcMi4eLAzh_Ff-prOjbrtPclLg"
        />
      </div>
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      <div className="relative z-20 text-center px-margin-mobile">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4 uppercase tracking-tighter">
          Categories
        </h1>
        <p className="font-body-lg text-body-lg text-white max-w-xl mx-auto opacity-90">
          Identity in volumes. Discover our structured departments and curated acts.
        </p>
      </div>
    </section>
  );
};
