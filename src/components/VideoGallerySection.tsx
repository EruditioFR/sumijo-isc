import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type VideoCategory = "all" | "demi-finale" | "finale" | "gala";

interface Video {
  id: string;
  youtubeId: string;
  startTime?: number; // Start time in seconds (e.g., 65 = 1:05)
  singer: string;
  description: string;
  duration: string;
  category: VideoCategory;
}

// Sample video data - replace youtubeId with actual YouTube video IDs
// startTime is in seconds (e.g., 90 = 1m30s, 125 = 2m05s)
const videos: Video[] = [
  {
    id: "1",
    youtubeId: "DaHrBeXB9H0",
    startTime: 19,
    singer: "Zihao Li, Baryton, Chine",
    description: 'Finale - "Mein Sehnen, Mein Wähnen - Die Tote Stadt, E. W. Korngold',
    duration: "5:46",
    category: "finale",
  },
  {
    id: "2",
    youtubeId: "NGxaFNhrVdw",
    startTime: 34,
    singer: "George Virban, Tenor, Roumanie",
    description: "Finale - Love, too frequently betrayed - The Rake's Progress, I. Stravinsky",
    duration: "3:39",
    category: "finale",
  },
  {
    id: "3",
    youtubeId: "WksxeGPBZuM",
    startTime: 16,
    singer: "Kiup Lee, Tenor, République de Corée",
    description: "Gala des lauréats - Au Mont Ida, trois déesses - La belle Hélène, J. Offenbach",
    duration: "4:20",
    category: "gala",
  },
  {
    id: "4",
    youtubeId: "GdNriy9P1bQ",
    startTime: 0,
    singer: "Fanny Valentin, Soprano, France",
    description: "Demi-Finale - Où va la jeune hindoue - Lakmé, L. Delibes",
    duration: "9:05",
    category: "demi-finale",
  },
  {
    id: "5",
    youtubeId: "aUvdg50ZR-Y",
    startTime: 21,
    singer: "Milan Perišić, Baritone, Serbie",
    description: "Finale - Look through the port - Billy Budd, B. Britten",
    duration: "6:17",
    category: "finale",
  },
  {
    id: "6",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Maria Rossi",
    description: "Finale - Air de Bellini",
    duration: "2:30",
    category: "finale",
  },
  {
    id: "7",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Sophie Dubois",
    description: "Demi-finale - Air de Mozart",
    duration: "4:12",
    category: "demi-finale",
  },
  {
    id: "8",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Maria Rossi",
    description: "Finale - Air de Bellini",
    duration: "2:30",
    category: "finale",
  },
  {
    id: "9",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Elena Petrova",
    description: "Demi-finale - Air de Verdi",
    duration: "3:55",
    category: "demi-finale",
  },
  {
    id: "10",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Li Wei",
    description: "Finale - Air de Donizetti",
    duration: "4:30",
    category: "finale",
  },
  {
    id: "11",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Anna Schmidt",
    description: "Demi-finale - Air de Rossini",
    duration: "3:20",
    category: "demi-finale",
  },
  {
    id: "12",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Park Ji-young",
    description: "Finale - Air de Mozart",
    duration: "4:45",
    category: "finale",
  },
  {
    id: "13",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Claire Martin",
    description: "Demi-finale - Air de Handel",
    duration: "3:10",
    category: "demi-finale",
  },
  {
    id: "14",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Yuki Tanaka",
    description: "Finale - Air de Puccini",
    duration: "4:05",
    category: "finale",
  },
  {
    id: "15",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Isabella Romano",
    description: "Demi-finale - Air de Bellini",
    duration: "3:35",
    category: "demi-finale",
  },
  {
    id: "16",
    youtubeId: "dQw4w9WgXcQ",
    startTime: 0,
    singer: "Chen Mei",
    description: "Finale - Air de Verdi",
    duration: "4:20",
    category: "finale",
  },
];

const filterOptions: { value: VideoCategory; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "demi-finale", label: "Demi-finale" },
  { value: "finale", label: "Finale" },
  { value: "gala", label: "Gala" },
];

const VideoGallerySection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState<VideoCategory>("all");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = activeFilter === "all" ? videos : videos.filter((v) => v.category === activeFilter);

  const getYoutubeThumbnail = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;

  return (
    <section className="py-12 md:py-20 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground italic mb-3">Édition 2024</h2>
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl text-foreground mb-2 md:mb-4">
              Découvrez les <span className="text-rose-dark">performances</span> de nos candidats
            </h2>
            <div className="h-0.5 w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-rose to-transparent mt-6" />
          </div>

          {/* Mobile Filter Pills */}
          <div className="flex md:hidden justify-center gap-2 mb-6">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.value
                    ? "bg-rose text-white shadow-md"
                    : "bg-white text-muted-foreground border border-rose/20 hover:border-rose/40"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Desktop Grid - 4 columns, thumbnails only */}
          <div className="hidden md:grid grid-cols-4 gap-4 lg:gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <img
                    src={getYoutubeThumbnail(video.youtubeId)}
                    alt={`${video.singer} - ${video.description}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Singer and description */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-semibold text-sm leading-tight text-rose-light">{video.singer}</h3>
                    <p className="text-xs text-white/80 leading-tight mt-0.5 line-clamp-2">{video.description}</p>
                  </div>
                  {/* Play button overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-rose/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Grid - 2 columns with details */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                className="cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <img
                    src={getYoutubeThumbnail(video.youtubeId)}
                    alt={`${video.singer} - ${video.description}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-rose/90 flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                {/* Video info */}
                <div className="mt-2">
                  <h3 className="text-rose-dark font-semibold text-sm">{video.singer}</h3>
                  <p className="text-muted-foreground text-xs leading-tight">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black overflow-hidden">
          {selectedVideo && (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1${selectedVideo.startTime ? `&start=${selectedVideo.startTime}` : ""}`}
                title={`${selectedVideo.singer} - ${selectedVideo.description}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideoGallerySection;
