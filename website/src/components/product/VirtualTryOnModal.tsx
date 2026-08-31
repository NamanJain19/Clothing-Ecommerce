import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Upload,
  Camera,
  Check,
  ShoppingBag,
  Sliders,
  Maximize2,
  RefreshCw,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeColor, setActiveColor] = useState('Default');
  const [isProcessing, setIsProcessing] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Model Archetypes
  const modelArchetypes = [
    {
      id: 'model-1',
      name: 'Elena (Athletic / 5\'10")',
      gender: 'women',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'model-2',
      name: 'Alexander (Tailored / 6\'1")',
      gender: 'men',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'model-3',
      name: 'Aria (Petite / 5\'6")',
      gender: 'women',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'model-4',
      name: 'Devraj (Classic / 6\'0")',
      gender: 'men',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const [selectedModel, setSelectedModel] = useState(
    product.category?.toLowerCase().includes('women') || product.name?.toLowerCase().includes('dress')
      ? modelArchetypes[0]
      : modelArchetypes[1]
  );
  const [userUploadedPhoto, setUserUploadedPhoto] = useState<string | null>(null);

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUserUploadedPhoto(ev.target.result as string);
          simulateFitting();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateFitting = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 900);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.images?.[0] || product.image || '',
      price: product.price,
      size: selectedSize,
      color: activeColor,
      quantity: 1,
      categoryTag: product.category,
    });
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2500);
  };

  if (!isOpen) return null;

  const currentPersonPhoto = userUploadedPhoto || selectedModel.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white border border-neutral-300 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4.5 border-b border-neutral-200 bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Monolith AI Virtual Dressing Room
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase">
                  Live Fit Mirror
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Preview how <strong>{product.name}</strong> drapes on your silhouette in real-time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Split Screen Mirror */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left / Center: Interactive AI Mirror Simulation Canvas */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-neutral-950 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[500px]">
            {/* Mirror Canvas Container */}
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-2xl bg-neutral-900 flex items-center justify-center group">
              {/* Customer / Model Base Photo */}
              <img
                src={currentPersonPhoto}
                alt="Fitting Silhouette"
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isProcessing ? 'blur-xs scale-102 opacity-70' : 'opacity-100 scale-100'
                }`}
              />

              {/* AI Garment Blend Layer Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none transition-opacity ${
                  isProcessing ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Garment Preview Thumbnail Badge */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white p-1.5 rounded-xl border border-white/20 flex items-center gap-2 max-w-[200px]">
                <img
                  src={product.images?.[0] || product.image}
                  alt="Garment"
                  className="w-8 h-10 object-cover rounded-lg"
                />
                <div className="truncate">
                  <p className="text-[10px] font-bold truncate">{product.name}</p>
                  <p className="text-[9px] text-amber-300 font-mono">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* AI Fit Intelligence Floating HUD */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md text-white p-3 rounded-xl border border-white/15 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>AI Silhouette Fit: 96% Match</span>
                  </div>
                  <p className="text-[10px] text-neutral-300 mt-0.5">
                    Tailored drape for Size <strong>{selectedSize}</strong> ({selectedModel.name.split(' ')[0]})
                  </p>
                </div>
                <button
                  onClick={simulateFitting}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white cursor-pointer"
                  title="Re-calculate Draping"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 z-20">
                  <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                  <p className="text-xs font-bold tracking-wider uppercase text-amber-200">
                    Draping Luxury Fabrics...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls, Model Picker & Add to Bag */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-white flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Option 1: Upload Your Own Photo / Camera */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    1. Try on Your Own Photo
                  </h4>
                  {userUploadedPhoto && (
                    <button
                      onClick={() => {
                        setUserUploadedPhoto(null);
                        simulateFitting();
                      }}
                      className="text-[10px] text-red-600 hover:underline cursor-pointer"
                    >
                      Reset to Model
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="try-on-user-selfie"
                  className="hidden"
                  onChange={handleUserPhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('try-on-user-selfie')?.click()}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {userUploadedPhoto ? 'Upload Different Photo' : 'Upload Selfie / Full-Body Photo'}
                </button>
              </div>

              {/* Option 2: Pre-Set Atelier Body Archetypes */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Or Pick a Runway Body Archetype:
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {modelArchetypes.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setUserUploadedPhoto(null);
                        simulateFitting();
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        selectedModel.id === m.id && !userUploadedPhoto
                          ? 'border-neutral-900 bg-neutral-100 ring-2 ring-neutral-900/10'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-neutral-900 truncate">{m.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{m.name.split('(')[1]?.replace(')', '')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizing Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-neutral-900 uppercase tracking-wider">
                    Select Fit Size:
                  </span>
                  <span className="text-emerald-700 font-bold">Recommended: {selectedSize}</span>
                </div>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        simulateFitting();
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-neutral-900 text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              {addedToast && (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Outfit Added to Bag with Your Fitting Preferences!
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-neutral-900 hover:bg-black text-white rounded-2xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2.5"
              >
                <ShoppingBag className="w-4 h-4" />
                Add Fitted Outfit to Bag — ₹{product.price.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnModal;
