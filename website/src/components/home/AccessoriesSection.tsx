import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { accessoriesData } from '../../data/accessories';
import { productService } from '../../services/productService';

export const AccessoriesSection: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(accessoriesData);

  useEffect(() => {
    let isMounted = true;
    const fetchAccessories = async () => {
      try {
        const res = await productService.getProducts({
          category: 'accessories',
          limit: 4,
        });

        if (res.products && res.products.length > 0 && isMounted) {
          const mapped = res.products.slice(0, 4).map((bp) => ({
            id: bp._id || bp.id || bp.slug,
            name: bp.name,
            collectionName:
              typeof bp.collection === 'object' && bp.collection
                ? bp.collection.name
                : 'ATELIER COLLECTION',
            price: bp.price,
            image: bp.images?.[0] || bp.thumbnail || accessoriesData[0].image,
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn('Failed to load home accessories from API:', err);
      }
    };

    fetchAccessories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low" id="accessories">
      <div className="max-w-container-max mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 block">
              Curation
            </span>
            <h2 className="font-display-lg text-5xl">Accessories</h2>
          </div>
          <Link
            className="font-label-caps text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity"
            to="/accessories"
          >
            View Gallery
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] bg-white overflow-hidden mb-6 shadow-sm border border-outline-variant">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={item.image}
                />
              </div>
              <h5 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase mb-1">
                {item.collectionName}
              </h5>
              <p className="font-headline-md text-base mb-2 text-primary font-bold">{item.name}</p>
              <p className="font-body-md text-primary font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
