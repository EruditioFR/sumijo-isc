import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "announce_24_semifinalists_2026_seen";

const AnnouncementLightbox = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] aspect-[9/16] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src="/videos/annonce-24-demi-finalistes-2026.mp4"
              autoPlay
              playsInline
              controls
              className="w-full h-full object-cover bg-black"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementLightbox;
