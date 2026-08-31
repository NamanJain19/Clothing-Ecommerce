import React from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl } from '../../utils/imageUtils';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorite = isInWishlist(product.id);
  const displayImage = normalizeImageUrl(product.image);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
      categoryTag: product.category,
      size: 'M',
      color: 'Standard',
      quantity: 1,
    });
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: displayImage,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-3xl bg-white border border-outline/20 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[3/4] bg-surface-container-low overflow-hidden">
            <img
              src={displayImage}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
              }}
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 block">
                {product.category}
              </span>
              <h2 className="font-headline-md text-3xl text-primary mb-4">
                {product.name}
              </h2>
              <p className="font-body-md text-2xl text-primary mb-6">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              <p className="font-body-md text-sm text-secondary leading-relaxed mb-8">
                Masterfully tailored from premium materials, embodying architectural minimalism and timeless luxury.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-black text-white font-button text-[12px] uppercase tracking-[0.2em] hover:bg-secondary transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                onClick={handleToggleWishlist}
                className="w-full py-4 border border-black text-black font-button text-[12px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-black text-black' : ''}`} />
                {isFavorite ? 'Remove from Wishlist' : 'Save to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
