import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { CategoryProduct } from '../../data/womenProducts';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl } from '../../utils/imageUtils';

interface CategoryProductCardProps {
  product: CategoryProduct;
  onQuickView?: (product: Product) => void;
}

export const CategoryProductCard: React.FC<CategoryProductCardProps> = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isFavorite = isInWishlist(product.id);
  const mainImage = normalizeImageUrl(product.image);
  const hoverImage = normalizeImageUrl(product.hoverImage || product.image);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.({
      id: product.id,
      name: product.name,
      category: product.specs,
      price: product.price,
      image: mainImage,
    });
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      categoryTag: product.specs,
      price: product.price,
      image: mainImage,
      size: 'M',
      color: 'Standard',
      quantity: 1,
    });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      specs: product.specs,
      price: product.price,
      image: mainImage,
      hoverImage: hoverImage,
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="product-card-container group flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
        {/* Main Image */}
        <img
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
          src={mainImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
          }}
        />
        {/* Hover Detail Image */}
        <img
          alt={`${product.name} Detail`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
          src={hoverImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-4 right-4 z-10 p-2 hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          <Heart className={`w-5 h-5 text-primary drop-shadow-sm ${isFavorite ? 'fill-black text-black' : ''}`} />
        </button>

        {/* Hover Action Layer */}
        <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity duration-500 flex flex-col justify-end p-4">
          <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex gap-2 items-center">
            <button
              onClick={handleAddToCartClick}
              className="flex-grow flex items-center justify-center gap-1.5 bg-white text-primary py-2.5 px-3 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 font-button text-[11px] uppercase tracking-wider cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button
              onClick={handleQuickViewClick}
              aria-label="Quick View"
              className="w-10 h-10 flex items-center justify-center bg-white text-primary rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer flex-shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-6 flex flex-col gap-2">
        <h3 className="font-headline-md text-body-lg tracking-tight text-primary">
          {product.name}
        </h3>
        <div className="flex justify-between items-baseline">
          <p className="font-label-caps text-[10px] text-secondary tracking-widest uppercase">
            {product.specs}
          </p>
          <p className="font-body-md text-primary font-medium">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};
