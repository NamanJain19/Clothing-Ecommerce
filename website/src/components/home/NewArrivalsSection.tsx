import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../product/ProductCard';
import { newArrivalsData } from '../../data/products';
import { productService, toUIProduct } from '../../services/productService';
import { Product } from '../../types';

interface NewArrivalsSectionProps {
  onQuickView?: (product: Product) => void;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ onQuickView }) => {
  const [products, setProducts] = useState<Product[]>(newArrivalsData);

  useEffect(() => {
    let isMounted = true;
    const fetchNewArrivals = async () => {
      try {
        const res = await productService.getProducts({
          isNewArrival: true,
          limit: 3,
        });

        if (res.products && res.products.length > 0 && isMounted) {
          const mapped = res.products.map((bp) => toUIProduct(bp));
          setProducts(mapped);
        }
      } catch (err) {
        console.warn('Failed to load home new arrivals from API:', err);
      }
    };

    fetchNewArrivals();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-section-gap bg-white" id="new-arrivals">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-xl">
            <span className="font-label-caps text-[10px] tracking-[0.5em] uppercase text-secondary mb-4 block">
              The New Season
            </span>
            <h2 className="font-display-lg text-5xl md:text-6xl italic">
              New Arrivals
            </h2>
          </div>
          <div className="hidden md:block">
            <Link
              className="font-label-caps text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity"
              to="/new-arrivals"
            >
              View All Pieces
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-gutter gap-y-24">
          {products.map((product, idx) => {
            const offsetClass = idx === 1 ? 'md:col-span-4 md:mt-32' : 'md:col-span-4';
            return (
              <ProductCard
                key={product.id}
                product={product}
                offsetClass={offsetClass}
                onQuickView={onQuickView}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
