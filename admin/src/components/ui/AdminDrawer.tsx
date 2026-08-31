import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'right' | 'left';
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  width = '2xl',
}) => {
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'w-full sm:w-[620px] md:w-[700px]',
    '2xl': 'w-full sm:w-[720px] md:w-[820px]',
    '3xl': 'w-full sm:w-[850px] md:w-[960px]',
  };

  const initialX = position === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: initialX }}
            animate={{ x: 0 }}
            exit={{ x: initialX }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className={`relative ${widthClasses[width]} bg-white border-l border-neutral-300 shadow-2xl z-10 flex flex-col h-full ${
              position === 'right' ? 'ml-auto' : 'mr-auto'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-200 bg-neutral-50 shrink-0">
              <div className="pr-4">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">{title}</h3>
                {description && (
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 font-normal">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
                title="Close drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 sm:px-8 py-4.5 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminDrawer;
