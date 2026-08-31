import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  Sparkles,
  Camera,
  Upload,
  ShoppingBag,
  Check,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  Eye,
  Layers,
  Wand2,
} from 'lucide-react';
import { productService, toUIProduct } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { requestVirtualTryOn } from '../services/virtualTryOnService';

export const VirtualTryOnPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'accessories'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | null>(null);
  const [userUploadedFile, setUserUploadedFile] = useState<File | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [tryOnResultImage, setTryOnResultImage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'tryon' | 'original'>('tryon');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // High fashion runway body archetypes
  const modelArchetypes = [
    {
      id: 'model-1',
      name: 'Elena Vance (Athletic Silhouette / 5\'10")',
      gender: 'women',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'model-2',
      name: 'Alexander Cross (Tailored Build / 6\'1")',
      gender: 'men',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'model-3',
      name: 'Aria Sterling (Petite Silhouette / 5\'6")',
      gender: 'women',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'model-4',
      name: 'Devraj Oberoi (Classic Structured / 6\'0")',
      gender: 'men',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const [selectedModel, setSelectedModel] = useState(modelArchetypes[0]);

  useEffect(() => {
    productService.getProducts({ limit: 40 }).then((res) => {
      if (res && res.products && res.products.length > 0) {
        const mapped = res.products.map(toUIProduct);
        setCatalog(mapped);
        setSelectedProduct(mapped[0]);
      }
    });
  }, []);

  const handleUserUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUserUploadedPhoto(ev.target.result as string);
          setTryOnResultImage(null);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setTryOnResultImage(null);
    setErrorMessage(null);
  };

  const handleRunRealTryOn = async () => {
    if (!selectedProduct) {
      setErrorMessage('Please select a garment from the catalogue to try on.');
      return;
    }

    if (isProcessing) return; // Duplicate request prevention

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const photoPayload = userUploadedFile || userUploadedPhoto || selectedModel.image;
      const response = await requestVirtualTryOn(photoPayload, selectedProduct.id);

      if (response && response.success && response.resultImageUrl) {
        setTryOnResultImage(response.resultImageUrl);
        setActiveView('tryon');
      } else {
        setErrorMessage(response?.message || 'Unable to generate virtual try-on.');
      }
    } catch (err: any) {
      console.error('[Virtual Try-On Error]:', err);
      setErrorMessage(err.message || 'Virtual Try-On request failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.images?.[0] || selectedProduct.image || '',
      price: selectedProduct.price,
      size: selectedSize,
      color: 'Default',
      quantity: 1,
      categoryTag: selectedProduct.category,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const filteredCatalog = catalog.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'men') return p.name.toLowerCase().includes('men') || p.category?.toLowerCase().includes('men') || p.category?.toLowerCase().includes('tailor');
    if (activeCategory === 'women') return p.name.toLowerCase().includes('women') || p.category?.toLowerCase().includes('women') || p.name.toLowerCase().includes('dress');
    if (activeCategory === 'accessories') return p.name.toLowerCase().includes('watch') || p.category?.toLowerCase().includes('leather') || p.category?.toLowerCase().includes('accessories');
    return true;
  });

  const currentOriginalPhoto = userUploadedPhoto || selectedModel.image;
  const displayedCanvasImage = tryOnResultImage && activeView === 'tryon' ? tryOnResultImage : currentOriginalPhoto;

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white selection:bg-amber-400 selection:text-black">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Replicate IDM-VTON Neural Atelier
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white font-normal">
            AI Virtual Try-On Experience
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Upload your photo or choose an archetype. Select a luxury garment and generate a photorealistic neural virtual try-on powered by IDM-VTON.
          </p>
        </div>

        {/* Main Split-Screen Dressing Room Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive AI Fitting Mirror Canvas */}
          <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center relative">
            {/* Mirror Canvas */}
            <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-neutral-700 bg-neutral-950 flex items-center justify-center group shadow-2xl">
              {/* Displayed Image (Original Photo or Real Generated Try-On Result) */}
              <img
                src={displayedCanvasImage}
                alt="Fitting Canvas Silhouette"
                className={`w-full h-full object-cover transition-all duration-500 ${
                  isProcessing ? 'blur-xs scale-102 opacity-60' : 'opacity-100 scale-100'
                }`}
              />

              {/* Neural Synthesis Animation during processing */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-4 z-30 p-6 text-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold tracking-widest uppercase text-amber-300">
                      Generating Neural Try-On...
                    </p>
                    <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                      IDM-VTON diffusion model is fitting {selectedProduct?.name || 'garment'} onto your silhouette.
                    </p>
                  </div>
                </div>
              )}

              {/* Active Silhouette Badge */}
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-2 z-20">
                <span className={`w-2 h-2 rounded-full ${tryOnResultImage ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-[10px] uppercase tracking-wider text-neutral-200 font-bold">
                  {tryOnResultImage && activeView === 'tryon'
                    ? 'AI Try-On Result'
                    : userUploadedPhoto
                    ? 'Your Custom Photo'
                    : selectedModel.name.split(' ')[0]}
                </span>
                {userUploadedPhoto && (
                  <button
                    onClick={() => {
                      setUserUploadedPhoto(null);
                      setUserUploadedFile(null);
                      setTryOnResultImage(null);
                    }}
                    className="text-[10px] text-amber-400 hover:underline ml-1 cursor-pointer"
                  >
                    (Reset)
                  </button>
                )}
              </div>

              {/* View Toggle (Original vs AI Result) */}
              {tryOnResultImage && !isProcessing && (
                <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md p-1 rounded-xl border border-white/15 flex items-center gap-1 z-20">
                  <button
                    onClick={() => setActiveView('tryon')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                      activeView === 'tryon'
                        ? 'bg-amber-400 text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    AI Result
                  </button>
                  <button
                    onClick={() => setActiveView('original')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                      activeView === 'original'
                        ? 'bg-amber-400 text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Original
                  </button>
                </div>
              )}

              {/* Bottom HUD info bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/15 flex items-center justify-between shadow-xl z-20">
                <div>
                  <span className="text-amber-400 text-[11px] font-bold uppercase tracking-wider block">
                    {tryOnResultImage ? '✨ Photorealistic Try-On Generated' : 'Ready for AI Try-On'}
                  </span>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Selected: <strong>{selectedProduct?.name || 'Garment'}</strong> (Size {selectedSize})
                  </p>
                </div>
                {tryOnResultImage && (
                  <button
                    onClick={handleRunRealTryOn}
                    disabled={isProcessing}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white cursor-pointer"
                    title="Regenerate Try-On"
                  >
                    <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="w-full max-w-md mt-4 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="leading-snug">{errorMessage}</p>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="w-full max-w-md mt-5">
              <button
                onClick={handleRunRealTryOn}
                disabled={isProcessing || !selectedProduct}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Neural Try-On...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    {tryOnResultImage ? 'Regenerate Virtual Try-On' : 'Try On This Garment with AI'}
                  </>
                )}
              </button>
            </div>

            {/* Model Archetypes & Upload Button */}
            <div className="w-full max-w-md mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Silhouette Archetypes:
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  id="tryon-upload-btn"
                  className="hidden"
                  onChange={handleUserUpload}
                />
                <button
                  onClick={() => document.getElementById('tryon-upload-btn')?.click()}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload My Photo
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modelArchetypes.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m);
                      setUserUploadedPhoto(null);
                      setUserUploadedFile(null);
                      setTryOnResultImage(null);
                      setErrorMessage(null);
                    }}
                    className={`p-1.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      selectedModel.id === m.id && !userUploadedPhoto
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20'
                        : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-600'
                    }`}
                  >
                    <img src={m.image} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[11px] font-bold text-neutral-200 truncate">
                      {m.name.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Garment Selection & Atelier Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Garment Product Card */}
            {selectedProduct && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl">
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0">
                    <img
                      src={selectedProduct.images?.[0] || selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Selected Garment
                    </span>
                    <h3 className="text-lg font-bold text-white">{selectedProduct.name}</h3>
                    <p className="text-xs text-neutral-400 capitalize">{selectedProduct.category}</p>
                    <p className="text-xl font-bold text-amber-400 font-mono pt-1">
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-neutral-400">
                    Select Atelier Size:
                  </label>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-amber-400 text-black font-extrabold shadow-md'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add Fitted Garment to Bag
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/product/${selectedProduct.id}`)}
                    className="px-4 py-3.5 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            )}

            {/* Catalog Selector Strip */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                  Select Garment to Try:
                </h4>
                <div className="flex gap-1 text-[11px]">
                  {(['all', 'men', 'women', 'accessories'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg uppercase font-bold cursor-pointer transition-colors ${
                        activeCategory === cat
                          ? 'bg-amber-400 text-black'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                {filteredCatalog.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`p-2 rounded-2xl border transition-all cursor-pointer flex flex-col ${
                      selectedProduct?.id === prod.id
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20'
                        : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-600'
                    }`}
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-800 mb-1.5 relative">
                      <img
                        src={prod.images?.[0] || prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedProduct?.id === prod.id && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-neutral-200 truncate">{prod.name}</p>
                    <p className="text-[10px] text-amber-400 font-mono">₹{prod.price.toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VirtualTryOnPage;
