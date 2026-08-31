import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = '5xl',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-[94vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white border border-neutral-300 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]`}
          >
            {/* Header - Large, Airy, No Clipping */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-200 bg-neutral-50/80 shrink-0">
              <div className="pr-4">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight leading-snug">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-normal font-normal">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                title="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body - Expansive Padding & Clean Breathing Space */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 sm:px-8 py-4.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminModal;
