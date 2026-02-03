import { motion } from 'framer-motion';
import posterImage from '@/assets/competition-2026-poster.jpg';

const PosterSection = () => {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img
            src={posterImage}
            alt="Sumi Jo International Singing Competition 2026 - Affiche officielle"
            className="max-w-full md:max-w-2xl lg:max-w-3xl h-auto shadow-2xl rounded-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PosterSection;
