import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { saleItemsData } from '../../data/saleItems';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';

export const PrivateSaleSection: React.FC = () => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [items, setItems] = useState(saleItemsData);

  useEffect(() => {
    let isMounted = true;
    const fetchSaleItems = async () => {
      try {
        const res = await productService.getProducts({
          isSale: true,
          limit: 4,
        });

        if (res.products && res.products.length > 0 && isMounted) {
          const mapped = res.products.slice(0, 4).map((bp) => ({
            id: bp._id || bp.id || bp.slug,
            name: bp.name,
            category:
              typeof bp.category === 'object' && bp.category
                ? bp.category.name
                : 'SALE ARCHIVE',
            originalPrice: bp.compareAtPrice || Math.round(bp.price * 1.25),
            salePrice: bp.price,
            discountPercentage:
              bp.discountPercentage ||
              (bp.compareAtPrice && bp.compareAtPrice > bp.price
                ? Math.round(((bp.compareAtPrice - bp.price) / bp.compareAtPrice) * 100)
                : 20),
            image: bp.images?.[0] || bp.thumbnail || saleItemsData[0].image,
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.warn('Failed to load private sale items from API:', err);
      }
    };

    fetchSaleItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleWishlist = (item: typeof items[0], e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: item.id,
      name: item.name,
      category: item.category || 'SALE',
      price: item.salePrice,
      image: item.image,
    });
  };

  const handleAddToBag = (item: typeof items[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: item.id,
      name: item.name,
      price: item.salePrice,
      image: item.image,
      categoryTag: item.category || 'SALE',
      size: 'M',
      color: 'Standard',
      quantity: 1,
    });
  };

  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="sale">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
        <div>
          <span className="font-label-caps text-[10px] tracking-[0.5em] uppercase text-secondary mb-3 block">
            Special Pricing
          </span>
          <Link to="/sale" className="font-display-lg text-4xl md:text-5xl italic hover:opacity-80 transition-opacity">
            Sale Archive
          </Link>
        </div>
        <Link
          to="/sale"
          className="font-label-caps text-[10px] tracking-[0.25em] uppercase text-primary border-b border-primary pb-1 hover:opacity-75 transition-opacity"
        >
          View All Sale Items →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {items.map((item) => {
          const isFavorite = isInWishlist(item.id);
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[3/4] bg-surface-container-low overflow-hidden relative mb-6 border border-outline-variant">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={item.image}
                />
                <span className="absolute top-4 left-4 bg-primary text-on-primary font-label-caps text-[9px] px-2.5 py-1 tracking-widest uppercase">
                  -{item.discountPercentage}%
                </span>
                <button
                  onClick={(e) => handleToggleWishlist(item, e)}
                  aria-label={`Save ${item.name} to Wishlist`}
                  className={`absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center transition-all duration-300 rounded-full ${
                    isFavorite
                      ? 'bg-primary text-white'
                      : 'bg-white/80 backdrop-blur-md text-primary hover:bg-black hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => handleAddToBag(item, e)}
                    className="w-full bg-primary text-on-primary py-3 font-button text-[11px] uppercase tracking-widest hover:bg-black/90 transition-all font-semibold shadow-md cursor-pointer"
                  >
                    + Add to Bag
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-headline-md text-base text-primary font-bold line-clamp-1">{item.name}</h4>
                </div>
                <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">
                  {item.category}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="font-body-md text-sm text-primary font-bold">
                    ₹{item.salePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-body-md text-xs text-secondary line-through">
                    ₹{item.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
