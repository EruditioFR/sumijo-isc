import { useState } from 'react';
import { motion } from 'framer-motion';
import { GalleryImage } from '@/types/gallery.types';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryImageCardProps {
  image: GalleryImage;
  onClick: () => void;
}

export const GalleryImageCard = ({ image, onClick }: GalleryImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageUrl = image.thumbnail_url || image.url;

  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full aspect-square overflow-hidden rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Image */}
      <img
        src={imageUrl}
        alt={image.alt_text}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } group-hover:scale-110`}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h4 className="text-white font-medium text-sm line-clamp-2">
          {image.title}
        </h4>
        {image.photographer && (
          <p className="text-white/70 text-xs mt-1">
            © {image.photographer}
          </p>
        )}
      </div>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Image unavailable</span>
        </div>
      )}
    </motion.button>
  );
};
