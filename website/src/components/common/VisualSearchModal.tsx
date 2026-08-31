import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanSearch,
  X,
  Upload,
  Sparkles,
  Camera,
  ArrowRight,
  AlertCircle,
  PackageOpen,
} from 'lucide-react';
import { searchByImage, VisualSearchResultItem } from '../../services/visualSearchService';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [matchedResults, setMatchedResults] = useState<VisualSearchResultItem[]>([]);
  const [detectedTags, setDetectedTags] = useState<string[]>([]);
  const [analysisMeta, setAnalysisMeta] = useState<any>(null);

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrorMessage(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Sample curated inspiration images for instant 1-click testing
  const sampleLooks = [
    {
      label: 'Noir Wool Overcoat',
      tag: 'Outerwear',
      url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Midnight Silk Gown',
      tag: 'Dresses',
      url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Architectural Tuxedo',
      tag: 'Tailoring',
      url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Artisan Watch',
      tag: 'Horology',
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const processImageRequest = async (payload: File | string, previewUrl?: string) => {
    if (previewUrl) {
      setSelectedImage(previewUrl);
    } else if (typeof payload === 'string') {
      setSelectedImage(payload);
    }
    setIsScanning(true);
    setErrorMessage(null);
    setMatchedResults([]);
    setDetectedTags([]);
    setAnalysisMeta(null);

    try {
      const response = await searchByImage(payload);
      if (response && response.success) {
        setMatchedResults(response.products || []);
        setDetectedTags(response.analysis?.detectedTags || []);
        setAnalysisMeta(response.analysis || null);
      } else {
        setErrorMessage(response?.message || 'Visual search could not complete analysis.');
      }
    } catch (err: any) {
      console.error('[AI Lens] Visual search error:', err);
      setErrorMessage(
        err.message || 'Unable to analyze image. Please try another outfit photo.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setSelectedImage(localPreviewUrl);
      processImageRequest(file, localPreviewUrl);
    }
  };

  const handleSampleClick = (url: string) => {
    processImageRequest(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Window */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#131416] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#17181a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <ScanSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Monolith AI Visual Lens
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini Vision
                </span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Drop any photo, screenshot, or runway outfit to discover visually matching garments.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {!selectedImage ? (
            <div className="space-y-6">
              {/* Dropzone */}
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-500 rounded-3xl p-8 sm:p-12 text-center bg-neutral-50/70 dark:bg-[#17181a]/50 transition-all space-y-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  id="visual-lens-file-input"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="w-16 h-16 rounded-full bg-neutral-900 dark:bg-neutral-800 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold">
                    Upload an Outfit Photo or Drag & Drop Here
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
                    Take a photo on your camera or upload from Pinterest, Instagram, or gallery (JPG, PNG, WEBP).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('visual-lens-file-input')?.click()}
                  className="px-6 py-3 bg-neutral-900 dark:bg-amber-500 hover:bg-black dark:hover:bg-amber-400 text-white dark:text-black rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Browse Photo / Open Camera
                </button>
              </div>

              {/* Sample Looks */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Or test with sample luxury looks:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sampleLooks.map((look, i) => (
                    <div
                      key={i}
                      onClick={() => handleSampleClick(look.url)}
                      className="group cursor-pointer rounded-2xl border border-neutral-200 dark:border-neutral-800 p-2 bg-white dark:bg-[#17181a] hover:border-amber-500 transition-all shadow-xs"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-2 relative">
                        <img
                          src={look.url}
                          alt={look.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1.5 left-1.5 bg-black/75 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {look.tag}
                        </span>
                      </div>
                      <p className="text-xs font-bold truncate">{look.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6">
              {/* Scan Banner with Animation */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-neutral-950 text-white rounded-2xl shadow-md relative overflow-hidden">
                <div className="relative w-28 h-36 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-neutral-900">
                  <img src={selectedImage} alt="Scanned Target" className="w-full h-full object-cover" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-400/0 via-amber-400/50 to-amber-400/0 animate-pulse h-full w-full" />
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className={`w-4 h-4 text-amber-400 ${isScanning ? 'animate-spin' : ''}`} />
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                      {isScanning ? 'Gemini Multimodal Analysis...' : 'Visual AI Match Complete'}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold">
                    {isScanning
                      ? 'Analyzing garment silhouette, cut, weave & colors...'
                      : matchedResults.length > 0
                      ? `Found ${matchedResults.length} Visually Matching Atelier Pieces`
                      : 'Visual Analysis Complete'}
                  </h4>

                  {/* Detected Tags from Gemini */}
                  {detectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
                      {detectedTags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white/10 text-neutral-200 px-2.5 py-1 rounded-md uppercase tracking-wider font-semibold"
                        >
                          ✓ {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setMatchedResults([]);
                    setDetectedTags([]);
                    setErrorMessage(null);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs rounded-xl font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Scan Another Look
                </button>
              </div>

              {/* Error Message if Any */}
              {errorMessage && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Matched Products Grid */}
              {!isScanning && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Live Catalogue Matches
                    </h4>
                    {analysisMeta?.category && (
                      <span className="text-xs text-neutral-400">
                        Category: <strong className="text-neutral-700 dark:text-neutral-200">{analysisMeta.category}</strong>
                      </span>
                    )}
                  </div>

                  {matchedResults.length === 0 && !errorMessage ? (
                    <div className="py-12 text-center space-y-3 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30">
                      <PackageOpen className="w-10 h-10 mx-auto text-neutral-400" />
                      <h5 className="font-bold text-base">No Direct Visual Matches in Atelier</h5>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        No close matches found in our current catalogue for this specific garment style. Try scanning another luxury look.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {matchedResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            onClose();
                            navigate(product.productUrl || `/product/${product.id}`);
                          }}
                          className="group border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3 bg-white dark:bg-[#17181a] hover:border-amber-500 transition-all cursor-pointer shadow-xs flex flex-col"
                        >
                          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-3 relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              {product.matchScore}% Match ({product.matchQuality})
                            </span>
                          </div>
                          <h5 className="font-bold text-sm truncate">{product.name}</h5>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                            {product.category}
                          </p>
                          <div className="mt-auto pt-3 flex items-center justify-between">
                            <span className="font-bold text-sm text-primary font-mono">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-amber-500 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                              View <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualSearchModal;
