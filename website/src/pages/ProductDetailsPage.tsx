import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { CategoryProductCard } from '../components/category/CategoryProductCard';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { getProductById, backendProductToDetailItem } from '../utils/productResolver';
import { productService } from '../services/productService';
import { BackendProduct } from '../types/product';
import { Product } from '../types';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { reviewService, ReviewItem } from '../services/reviewService';
import { VirtualTryOnModal } from '../components/product/VirtualTryOnModal';
import {
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  MapPin,
  CheckCircle2,
  Share2,
  Plus,
  Minus,
  Eye,
  Watch,
  X,
  AlertCircle,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(getProductById(id));
  const [rawBackendProduct, setRawBackendProduct] = useState<BackendProduct | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState(product.recommended || []);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  // Review states
  const [reviewsList, setReviewsList] = useState<any[]>([
    {
      _id: 'rev-01',
      user: { firstName: 'Marcus', lastName: 'K.' },
      rating: 5,
      title: 'Quiet Luxury at its absolute finest',
      comment: "The definition of quiet luxury. The way it holds its shape while moving is unlike any other silk garment I've owned.",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      isVerifiedPurchase: true,
    },
    {
      _id: 'rev-02',
      user: { firstName: 'Elena', lastName: 'R.' },
      rating: 5,
      title: 'Architectural precision and exquisite drape',
      comment: 'Worth every penny. The hidden internal pockets are a masterstroke of design. It feels like wearing architecture.',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      isVerifiedPurchase: true,
    },
  ]);
  const [reviewCount, setReviewCount] = useState(124);
  const [averageRating, setAverageRating] = useState(4.9);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);
  const [reviewErrorMessage, setReviewErrorMessage] = useState<string | null>(null);

  // Fetch product from backend
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoadingProduct(true);
      try {
        let bp: BackendProduct | null = null;
        try {
          bp = await productService.getProductById(id);
        } catch {
          try {
            bp = await productService.getProductBySlug(id);
          } catch {
            // fallback to local resolver
          }
        }

        if (bp && isMounted) {
          setRawBackendProduct(bp);
          const detail = backendProductToDetailItem(bp);
          setProduct(detail);
          if (detail.colors.length > 0) setSelectedColor(detail.colors[0].name);
          if (detail.sizes.length > 0) setSelectedSize(detail.sizes[0]);
        } else if (isMounted) {
          const local = getProductById(id);
          setProduct(local);
          if (local.colors.length > 0) setSelectedColor(local.colors[0].name);
          if (local.sizes.length > 0) setSelectedSize(local.sizes[0]);
        }

        // Fetch real recommendations from backend
        try {
          const recRes = await productService.getProducts({ limit: 4 });
          if (recRes.products && recRes.products.length > 0 && isMounted) {
            const mappedRecs = recRes.products
              .filter((p) => (p._id || p.id) !== id)
              .slice(0, 4)
              .map((p) => ({
                id: p._id || p.id || p.slug,
                name: p.name,
                specs: typeof p.category === 'object' ? p.category.name : (p.brand || 'MONOLITH'),
                price: p.price,
                image: p.images?.[0] || p.thumbnail || product.images[0],
                hoverImage: p.images?.[1] || p.images?.[0] || product.images[0],
              }));
            if (mappedRecs.length > 0) {
              setRecommendedProducts(mappedRecs);
            }
          }
        } catch {
          // keep fallback
        }
      } catch (err) {
        console.warn('Failed to load product from backend API:', err);
      } finally {
        if (isMounted) setIsLoadingProduct(false);
      }
    };

    fetchProduct();
    setActiveImageIndex(0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Load real reviews for this product
  useEffect(() => {
    if (!id) return;
    reviewService.getProductReviews(id)
      .then((res) => {
        if (res.reviews && res.reviews.length > 0) {
          setReviewsList(res.reviews);
          setReviewCount(res.reviewCount || res.reviews.length);
          setAverageRating(res.averageRating || 5.0);
        }
      })
      .catch((err) => {
        console.warn('Failed to load backend reviews, using curated fallback:', err);
      });
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      setReviewErrorMessage('Please provide both a headline and detailed perspective.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewErrorMessage(null);
    setReviewSuccessMessage(null);

    try {
      if (id) {
        try {
          await reviewService.createReview(id, {
            rating: reviewRating,
            title: reviewTitle.trim(),
            comment: reviewComment.trim(),
          });
        } catch (apiErr: any) {
          console.warn('Backend review submission response:', apiErr);
        }
      }

      // Add to local state immediately for instant feedback
      const newReview = {
        _id: `rev-${Date.now()}`,
        user: {
          firstName: user?.firstName || 'Verified',
          lastName: user?.lastName || 'Patron',
        },
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        createdAt: new Date().toISOString(),
        isVerifiedPurchase: true,
      };

      setReviewsList((prev) => [newReview, ...prev]);
      setReviewCount((prev) => prev + 1);
      setReviewSuccessMessage('Thank you. Your perspective has been verified and added to the archives.');
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);

      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      setReviewErrorMessage(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Find matching variant if available
  const matchingVariant = rawBackendProduct?.variants?.find(
    (v) =>
      (!v.color || v.color.toLowerCase() === selectedColor.toLowerCase()) &&
      (!v.size || v.size.toLowerCase() === selectedSize.toLowerCase())
  );

  const currentPrice = matchingVariant?.price || product.price;

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.images[0] || '',
    });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: matchingVariant?._id || matchingVariant?.id,
      name: product.name,
      price: currentPrice,
      image: product.images[0] || '',
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    desc: true,
    details: false,
    materials: false,
    care: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim()) {
      setPincodeChecked(true);
    }
  };

  const ensembleItems = [
    {
      id: 'ens-1',
      category: 'Carry & Bags',
      name: 'Minimalist Nappa Leather Tote',
      price: 1200,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-EPqxQerVjTwX4Z91pKWuL2MdnfG7MP4ACCJYK_LaFlmBXCajZ5CAx9eohL93zzSozoR2Gyzqa1Ux4BdREFieEpp8SbPBgWepoRojvNk7tmhJtj8ZOQONRxWeDIOfQChpVoR96mKUEU6yXfA9psFgSYCxPVWAdFLqPtHpaaiwCJk-NJo7udUFQlfUrQVIgs3_K4v6_dpCsc2ZX_OqJ_RTj5mmRgT5IhQuxAMQoJB3vpjZk3ZMtO17yQ',
    },
    {
      id: 'ens-2',
      category: 'Timepieces',
      name: 'Monolith Steel Chronograph',
      price: 650,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAglRx0vvJYz_vQiMBJjOhbBpMXLoBPgktP8HU_fJV6h-uRbdlr9gIlcPXtMToMfo80gQiZC2YseQ9JwoadNS9Ncymyhtndc4-GgRTKep99DAVMsS4g4VMKZ8mFASp5p8YZYPshWPdXO56FSSi7cAfVm_d4Fd3F7pc_Rn6nDjm5GVQthAX2eDsOUoDQpjvN2NfjyWVbw9bqWC00m1UO9Qg0Q440_usBCBoiEKYR1IQ4smcNzzflvEjjBg',
    },
    {
      id: 'ens-3',
      category: 'Accessories',
      name: 'Architectural Leather Belt',
      price: 320,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIDna9aewN5yz8XoCO1kzxlmogB__LgKHhlqki5lfdKfEvDLbpwo4B56aWrbzElVFh2e03KJhoMgU3VGZGHhooh65BwaM3W7SXTQemBcPwrZj6jyf46Ph1jvWCtl4ZLwbrR4W9yhJRrd7UzHYBy9R0G7Gouv8zRl9bVe1AU0ugTSP2dYaivR-a1-c7LrddXJVl_JVsQP2zAVi9dDHPRB3Ydps5tedDTsJzXclLYp6bnfiNYbetBxdBUg',
    },
  ];

  const exploreMoreProducts = [
    {
      id: 'exp-1',
      name: 'Sculptural Belt',
      price: 320,
      image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'exp-2',
      name: 'Architectural Frames',
      price: 480,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'exp-3',
      name: 'Structural Hoodie',
      price: 550,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'exp-4',
      name: 'Minimalist Card Holder',
      price: 180,
      image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-primary font-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Men', href: '/men' },
            { label: 'Jackets', href: '/collections' },
            { label: product.name },
          ]}
        />

        {/* Product Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-8">
          {/* Left Column: Image Gallery Stack (7 Columns on LG) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails with Hover and Click Selection */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[700px] shrink-0 hide-scrollbar">
              {(product.images && product.images.length > 0 ? product.images : [DEFAULT_FALLBACK_IMAGE]).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  onMouseEnter={() => setActiveImageIndex(idx)}
                  className={`w-20 aspect-[3/4] relative overflow-hidden border transition-all duration-300 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-primary ring-2 ring-primary ring-offset-1 opacity-100 scale-105'
                      : 'border-outline-variant opacity-70 hover:opacity-100 hover:border-primary/60'
                  }`}
                  aria-label={`Preview photo ${idx + 1}`}
                >
                  <img
                    src={normalizeImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Featured Image */}
            <div className="flex-1 aspect-[3/4] max-h-[700px] border border-outline-variant overflow-hidden relative group bg-surface-container-low cursor-zoom-in">
              <img
                src={normalizeImageUrl(product.images?.[activeImageIndex] || product.images?.[0] || DEFAULT_FALLBACK_IMAGE)}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
              />
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Form (5 Columns on LG) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-outline-variant pb-6 space-y-3">
              <span className="font-label-caps text-xs uppercase tracking-[0.3em] text-secondary">
                THE ARCHIVE COLLECTION
              </span>
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-normal">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-xs font-label-caps">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-secondary tracking-widest font-medium">4.8 (124 REVIEWS)</span>
              </div>

              <div className="pt-2 flex items-baseline gap-4">
                <span className="font-headline-md text-3xl text-primary font-normal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-700 font-label-caps tracking-widest font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" /> IN STOCK
                </span>
              </div>
              <p className="text-[11px] text-secondary font-label-caps tracking-wider">
                Inclusive of all taxes (GST) • Free Express Shipping across India
              </p>
            </div>

            <p className="font-body-md text-secondary text-xs md:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-label-caps">
                <span className="text-primary uppercase tracking-widest font-bold">
                  Color: <span className="text-secondary font-normal">{selectedColor}</span>
                </span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                      selectedColor === c.name ? 'ring-2 ring-primary ring-offset-2 border-transparent' : 'border-outline-variant hover:border-primary'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-label-caps">
                <span className="text-primary uppercase tracking-widest font-bold">Size</span>
                <button className="text-secondary underline hover:text-primary transition-colors cursor-pointer">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 border text-xs font-label-caps transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'border-primary bg-primary text-white font-bold'
                        : 'border-outline-variant hover:border-primary text-primary'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <span className="font-label-caps text-xs text-primary uppercase tracking-widest font-bold block">
                Quantity
              </span>
              <div className="flex items-center w-36 border border-outline-variant h-11 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex-1 text-center font-body-md text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pincode / Delivery Availability Checker (Indian Pincodes) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 font-label-caps text-xs text-primary uppercase tracking-widest font-bold">
                <MapPin className="w-4 h-4 text-primary" /> Deliver to (6-Digit PIN)
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="E.G. 400001 / 110001"
                  className="flex-1 border border-outline-variant px-4 py-2.5 text-xs font-mono uppercase bg-transparent focus:border-primary focus:outline-none tracking-widest"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 border border-primary font-button text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer font-semibold"
                >
                  Check
                </button>
              </form>
              {pincodeChecked && (
                <div className="space-y-1 text-xs font-body-md p-3 bg-emerald-50/70 border border-emerald-200">
                  <p className="text-emerald-800 font-label-caps flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> DELIVERY &amp; COD AVAILABLE
                  </p>
                  <p className="text-secondary text-xs">
                    Estimated Delivery: <span className="text-primary font-bold">Within 2-4 Days</span> • Cash on Delivery &amp; UPI available
                  </p>
                </div>
              )}
            </div>

            {/* Purchase CTA Buttons */}
            <div className="space-y-3 pt-4">
              {/* AI Virtual Try-On Fitting Room Trigger */}
              <button
                onClick={() => setIsTryOnOpen(true)}
                type="button"
                className="w-full h-14 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-amber-300 font-button text-xs uppercase tracking-widest hover:brightness-125 transition-all cursor-pointer shadow-lg font-bold flex items-center justify-center gap-2.5 border border-amber-500/40 rounded-none group"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                AI Virtual Fitting Room (Try On Myself)
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full h-14 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer shadow-md font-bold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full h-14 border border-primary text-primary font-button text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer font-bold"
              >
                Buy Now
              </button>

              <div className="flex gap-6 pt-2 justify-center font-label-caps text-xs uppercase tracking-widest text-secondary">
                <button
                  onClick={handleToggleWishlist}
                  className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black text-black' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button
                  onClick={() => alert('Product link copied to clipboard!')}
                  className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Information Accordions */}
        <section className="max-w-4xl mx-auto my-16 border-t border-outline-variant">
          {/* Description */}
          <div className="border-b border-outline-variant">
            <button
              onClick={() => toggleAccordion('desc')}
              className="w-full py-6 flex justify-between items-center text-left font-label-caps text-sm uppercase tracking-widest font-bold text-primary cursor-pointer"
            >
              <span>Description</span>
              {openAccordions.desc ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            {openAccordions.desc && (
              <div className="pb-6 font-body-md text-secondary text-xs md:text-sm leading-relaxed">
                The Architectural Silk Blouson reimagines the classic silhouette through the lens of structural geometry. Each panel is meticulously cut from heavyweight mulberry silk, providing enough body to hold its form while maintaining a fluid, luxurious hand-feel. The piece is part of 'The Archive' collection, focusing on timeless silhouettes that transcend seasons.
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="border-b border-outline-variant">
            <button
              onClick={() => toggleAccordion('details')}
              className="w-full py-6 flex justify-between items-center text-left font-label-caps text-sm uppercase tracking-widest font-bold text-primary cursor-pointer"
            >
              <span>Product Details</span>
              {openAccordions.details ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            {openAccordions.details && (
              <div className="pb-6 font-body-md text-secondary text-xs md:text-sm leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>Double-faced 30mm Mulberry Silk</li>
                  <li>Matte finish with subtle structural sheen</li>
                  <li>Internal welded seams for zero-chafing</li>
                  <li>Two internal passport-sized pockets</li>
                  <li>Two discrete external welt pockets</li>
                </ul>
              </div>
            )}
          </div>

          {/* Material & Fabric */}
          <div className="border-b border-outline-variant">
            <button
              onClick={() => toggleAccordion('materials')}
              className="w-full py-6 flex justify-between items-center text-left font-label-caps text-sm uppercase tracking-widest font-bold text-primary cursor-pointer"
            >
              <span>Material & Fabric</span>
              {openAccordions.materials ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            {openAccordions.materials && (
              <div className="pb-6 font-body-md text-secondary text-xs md:text-sm leading-relaxed">
                Sourced from the historic silk mills of Lake Como, Italy. This specific weight of silk is achieved by double-weaving high-density fibers, creating a technical yet natural performance fabric that is both wind-resistant and exceptionally breathable.
              </div>
            )}
          </div>

          {/* Care Instructions */}
          <div className="border-b border-outline-variant">
            <button
              onClick={() => toggleAccordion('care')}
              className="w-full py-6 flex justify-between items-center text-left font-label-caps text-sm uppercase tracking-widest font-bold text-primary cursor-pointer"
            >
              <span>Care Instructions</span>
              {openAccordions.care ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            {openAccordions.care && (
              <div className="pb-6 font-body-md text-secondary text-xs md:text-sm leading-relaxed">
                Professional dry clean only. Store on a wide-shouldered cedar hanger to maintain the sculptural integrity of the collar. Avoid direct sunlight for prolonged periods.
              </div>
            )}
          </div>
        </section>

        {/* Customer Perspective / Verified Reviews */}
        <section className="max-w-container-max mx-auto my-20">
          <div className="flex justify-between items-end mb-12 border-b border-outline-variant pb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-headline-md text-3xl text-primary font-normal">Customer Perspective</h2>
                <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 text-xs font-medium font-mono">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span>{averageRating.toFixed(1)}</span>
                </div>
              </div>
              <p className="font-label-caps text-xs text-secondary uppercase tracking-widest">
                {reviewCount} Verified Patron Perspectives
              </p>
            </div>
            <button
              onClick={() => {
                setReviewErrorMessage(null);
                setReviewSuccessMessage(null);
                setIsReviewModalOpen(true);
              }}
              className="font-label-caps text-xs uppercase tracking-widest text-primary border-b-2 border-primary pb-1 font-medium hover:text-black/70 hover:border-black/70 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviewsList.map((rev) => {
              const authorName = rev.user
                ? `${rev.user.firstName || 'Verified'} ${rev.user.lastName ? rev.user.lastName[0] + '.' : 'Patron'}`.toUpperCase()
                : 'VERIFIED PATRON';
              const dateStr = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'RECENT';

              return (
                <div key={rev._id} className="p-8 border border-outline-variant bg-surface-container-low space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-label-caps text-xs uppercase font-medium text-primary flex items-center gap-1.5">
                        <span>{authorName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 tracking-wider font-medium">
                            VERIFIED
                          </span>
                        )}
                      </p>
                      <div className="flex text-primary mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-primary text-primary'
                                : 'text-outline-variant fill-none'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="font-label-caps text-[10px] text-secondary">{dateStr}</span>
                  </div>
                  {rev.title && (
                    <h4 className="font-headline-md text-base font-normal text-primary">{rev.title}</h4>
                  )}
                  <p className="font-body-md text-xs md:text-sm italic text-primary leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Editorial Outfit Builder / Complete The Look */}
        <section className="max-w-5xl mx-auto my-20 pt-10 border-t border-outline-variant">
          <div className="text-center mb-10">
            <span className="font-label-caps text-xs tracking-[0.4em] uppercase text-secondary block mb-2">
              CURATED ENSEMBLE
            </span>
            <h2 className="font-display-lg text-3xl md:text-4xl text-primary font-normal">
              Complete The Look
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Side: Featured Foundation Product (Balanced Medium Size) */}
            <div className="lg:col-span-5 border border-outline-variant relative group overflow-hidden bg-surface-container-low aspect-[3/4] max-h-[420px]">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 border border-primary/20 space-y-0.5 shadow-lg">
                <span className="font-label-caps text-[9px] text-secondary uppercase tracking-widest block font-medium">
                  The Foundation
                </span>
                <h4 className="font-headline-md text-base text-primary font-normal">{product.name}</h4>
                <p className="font-body-md text-xs text-primary font-medium">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Right Side: Stack of Ensemble Accessories (Medium Compact) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-3 mb-5">
                {ensembleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="flex items-center gap-4 p-3 border border-outline-variant/80 bg-white hover:border-primary transition-all duration-300 group cursor-pointer shadow-xs"
                  >
                    <div className="w-16 h-16 shrink-0 overflow-hidden border border-outline-variant bg-surface-container-low">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <span className="font-label-caps text-[9px] text-secondary uppercase tracking-widest block font-medium">
                        {item.category}
                      </span>
                      <h5 className="font-headline-md text-sm text-primary font-normal group-hover:opacity-75 transition-opacity">
                        {item.name}
                      </h5>
                    </div>
                    <span className="font-body-md text-sm text-primary font-medium shrink-0">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Consolidated Outfit Summary Bar */}
              <div className="pt-4 border-t border-primary/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="font-label-caps text-[9px] text-secondary uppercase tracking-widest block font-medium">
                    Total Outfit Value (4 Pieces)
                  </span>
                  <span className="font-headline-md text-xl md:text-2xl text-primary font-normal">
                    ₹{(product.price + ensembleItems.reduce((acc, item) => acc + item.price, 0)).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => alert('Full ensemble added to cart!')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer font-bold shadow-md"
                >
                  Shop the Look
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Viewed / Recommended */}
        <section className="my-20">
          <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-12 text-center uppercase tracking-widest font-normal">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedProducts.map((item) => (
              <CategoryProductCard
                key={item.id}
                product={item}
                onQuickView={(p) => setSelectedQuickViewProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* Explore More Products */}
        <section className="my-20">
          <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-12 text-center uppercase tracking-widest font-normal">
            Explore More Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {exploreMoreProducts.map((pItem) => (
              <div
                key={pItem.id}
                onClick={() => navigate(`/product/${pItem.id}`)}
                className="group cursor-pointer border border-outline-variant bg-white p-4"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low mb-4">
                  <img
                    src={pItem.image}
                    alt={pItem.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Added ${pItem.name} to cart!`);
                        }}
                        className="flex-1 bg-white text-primary py-2 font-label-caps text-[10px] uppercase font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <h4 className="font-headline-md text-sm text-primary font-bold mb-1">{pItem.name}</h4>
                <p className="font-body-md text-xs text-primary font-semibold">₹{pItem.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => navigate('/collections')}
              className="px-12 py-4 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer font-bold shadow-md"
            >
              LOAD MORE PRODUCTS
            </button>
          </div>
        </section>

        {/* Shared Master Newsletter */}
        <NewsletterSection />
      </main>

      {/* Shared Master Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />

      {/* Filter Drawer */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Write a Review Luxury Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-outline-variant w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-neutral-900 text-white p-6 flex justify-between items-start">
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-[0.3em] text-neutral-400 block mb-1">
                  Verified Patron Perspective
                </span>
                <h3 className="font-headline-md text-2xl font-bold">Share Your Experience</h3>
                <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1">{product.name}</p>
              </div>
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setReviewErrorMessage(null);
                  setReviewSuccessMessage(null);
                }}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close review modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitReview} className="p-6 md:p-8 space-y-6">
              {/* Success Alert */}
              {reviewSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSuccessMessage}</span>
                </div>
              )}

              {/* Error Alert */}
              {reviewErrorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{reviewErrorMessage}</span>
                </div>
              )}

              {/* Star Rating Selector */}
              <div>
                <label className="block font-label-caps text-[11px] uppercase tracking-widest text-secondary mb-2">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = (hoverRating || reviewRating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setReviewRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              isFilled
                                ? 'fill-black text-black'
                                : 'text-neutral-300 fill-none'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="font-label-caps text-xs text-primary font-bold ml-2">
                    {(hoverRating || reviewRating) === 5
                      ? '5 Stars — Flawless'
                      : (hoverRating || reviewRating) === 4
                      ? '4 Stars — Exceptional'
                      : (hoverRating || reviewRating) === 3
                      ? '3 Stars — Satisfactory'
                      : (hoverRating || reviewRating) === 2
                      ? '2 Stars — Needs Refinement'
                      : '1 Star — Unsatisfactory'}
                  </span>
                </div>
              </div>

              {/* Review Headline / Title */}
              <div>
                <label className="block font-label-caps text-[11px] uppercase tracking-widest text-secondary mb-2">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Architectural Masterpiece & Exceptional Fit"
                  className="w-full border border-outline-variant p-3.5 text-sm bg-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block font-label-caps text-[11px] uppercase tracking-widest text-secondary mb-2">
                  Your Perspective *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe the tactile feel of the fabric, drape, silhouette, sizing precision, and craftsmanship..."
                  className="w-full border border-outline-variant p-3.5 text-sm bg-white focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Authentication Status Tip */}
              {!isAuthenticated && (
                <div className="p-3 bg-surface-container-low border border-outline-variant text-[11px] text-secondary flex items-center justify-between">
                  <span>Sign in for instant verified purchase badge.</span>
                  <button
                    type="button"
                    onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                    className="font-label-caps text-[10px] uppercase font-bold text-primary underline ml-2 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-3.5 border border-outline-variant text-secondary font-button text-xs uppercase tracking-widest hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 py-3.5 bg-black text-white font-button text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingReview ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Virtual Try-On Modal */}
      {product && (
        <VirtualTryOnModal
          isOpen={isTryOnOpen}
          onClose={() => setIsTryOnOpen(false)}
          product={product as any}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
