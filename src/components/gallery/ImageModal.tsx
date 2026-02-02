import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';
import { GalleryImage } from '@/types/gallery.types';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  isOpen: boolean;
  image: GalleryImage | null;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const ImageModal = ({
  isOpen,
  image,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext
}: ImageModalProps) => {
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        if (currentIndex > 0) onPrevious();
        break;
      case 'ArrowRight':
        if (currentIndex < images.length - 1) onNext();
        break;
    }
  }, [isOpen, currentIndex, images.length, onClose, onPrevious, onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!image) return null;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95"
            onClick={onClose}
          />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation buttons */}
          {hasPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/10 h-12 w-12"
              onClick={onPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
          )}

          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/10 h-12 w-12"
              onClick={onNext}
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          )}

          {/* Image container */}
          <motion.div
            key={image.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={image.url}
              alt={image.alt_text}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Image info */}
            <div className="mt-4 text-center text-white max-w-2xl px-4">
              <h3 className="text-xl font-display mb-2">{image.title}</h3>
              {image.description && (
                <p className="text-white/70 text-sm mb-2">{image.description}</p>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-white/50">
                {image.photographer && (
                  <span>📷 {image.photographer}</span>
                )}
                <span>{currentIndex + 1} / {images.length}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
