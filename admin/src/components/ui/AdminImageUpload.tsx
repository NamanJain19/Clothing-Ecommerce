import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Link2, Loader2, Cloud } from 'lucide-react';
import { adminService } from '../../services/adminService';

interface AdminImageUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'banner';
  helperText?: string;
  required?: boolean;
  folder?: string;
}

export const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'banner',
  helperText = 'PNG, JPG, WEBP up to 10MB (Cloudinary Storage)',
  required = false,
  folder = 'luxury_fashion/products',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const aspectClasses = {
    banner: 'aspect-[21/9]',
    video: 'aspect-[16/9]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadResult = await adminService.uploadImage(file, folder);
      if (uploadResult?.secure_url) {
        onChange(uploadResult.secure_url);
      }
    } catch (err: any) {
      console.error('[Cloudinary Upload Error]', err);
      setUploadError(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset file input so re-selecting same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
    }
  };

  const handleRemove = async () => {
    if (value && value.includes('cloudinary.com')) {
      try {
        await adminService.deleteImage(value);
      } catch (e) {
        // Silently ignore or log
      }
    }
    onChange('');
  };

  const isCloudinary = value && value.includes('cloudinary.com');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
          {label} {required && <span className="text-red-500">*</span>}
          {isCloudinary && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">
              <Cloud className="w-2.5 h-2.5" /> Cloudinary
            </span>
          )}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
        >
          <Link2 className="w-3 h-3" />
          {showUrlInput ? 'Switch to Cloudinary File Upload' : 'Paste Web Link'}
        </button>
      </div>

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200">
          {uploadError}
        </p>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="Paste direct https:// image link..."
            className="flex-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          {!value ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-outline-variant bg-surface hover:bg-surface-container-low hover:border-primary/50'
              } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-primary">
                {isUploading ? 'Uploading to Cloudinary...' : 'Click to browse photo or drag & drop file here'}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1">{helperText}</p>
            </div>
          ) : (
            <div className="relative rounded-xl border border-outline-variant overflow-hidden bg-surface-container shadow-xs group">
              <div className={`w-full ${aspectClasses[aspectRatio]} overflow-hidden bg-neutral-900/10 relative`}>
                <img src={value} alt="Uploaded asset" className="w-full h-full object-cover" />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span>Uploading new image to Cloudinary...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons overlay */}
              {!isUploading && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-primary text-xs font-bold rounded-lg shadow cursor-pointer hover:bg-neutral-100 flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Replace via Cloudinary
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1.5 bg-red-600 text-white rounded-lg shadow cursor-pointer hover:bg-red-700"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-white flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                {isCloudinary ? 'Cloudinary Hosted' : 'Image Ready'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminImageUpload;
