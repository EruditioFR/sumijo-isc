import { motion } from 'framer-motion';
import { GalleryImage } from '@/types/gallery.types';
import { GalleryImageCard } from './GalleryImageCard';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
}

export const GalleryGrid = ({ images, onImageClick }: GalleryGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <GalleryImageCard
            image={image}
            onClick={() => onImageClick(image, index)}
          />
        </motion.div>
      ))}
    </div>
  );
};
