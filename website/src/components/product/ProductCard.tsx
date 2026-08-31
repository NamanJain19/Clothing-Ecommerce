import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  offsetClass?: string;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, offsetClass = '', onQuickView }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFavorite = isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleAddToBagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      categoryTag: product.category,
      size: 'M',
      color: 'Standard',
      quantity: 1,
    });
  };

  const aspectClass = product.aspectRatio === '4/5' ? 'aspect-[4/5]' : 'aspect-[3/4]';

  return (
    <div onClick={handleCardClick} className={`group cursor-pointer ${offsetClass}`}>
      <div className={`relative ${aspectClass} overflow-hidden rounded-lg mb-8 bg-surface-container-low`}>
        <img
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          src={product.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Nfjeq46m2xJ4GymhY-CWVY9EVjOojA372rE-6bRT6KWYPqn6NPSyYDtDgR_WS3i6DV8xJUf6iqw7lMT59PNsRlHn2hMwtSINciz2CaydrVqGxBArBq1Vj7l1Jk_rZQ292u5GgHodW_XB8RBw9r8AXCeL9ou5-aIyL8_-gFaH6rwBXLI5AErv7DWmcfuhABNuNi3CiNvpCSluBUrdj0pj3h6pHh0bh65f5GsPFj7oPPUYJI2C9OqaEw';
          }}
        />
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-6 right-6 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-black text-black' : ''}`} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/5">
          <button
            onClick={handleQuickViewClick}
            className="bg-white text-black font-button text-[10px] uppercase tracking-widest px-8 py-3 hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-label-caps text-[9px] tracking-widest uppercase text-secondary">
          {product.category}
        </p>
        <h4 className="font-body-md text-[16px] text-primary">{product.name}</h4>
        <p className="font-body-md text-primary pt-2 font-medium">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        <button
          onClick={handleAddToBagClick}
          className="mt-4 font-label-caps text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          + Add to Bag
        </button>
      </div>
    </div>
  );
};
