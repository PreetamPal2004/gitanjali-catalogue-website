import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { staggerContainer, staggerItem, pageTransition } from '../utils/animations';

function GalleryCardSkeleton() {
  return (
    <div className="lumina-card overflow-hidden animate-pulse border border-stone-200/60 dark:border-stone-800/60 rounded-3xl p-3 space-y-3">
      <div className="w-full h-48 bg-stone-200/80 dark:bg-stone-800/80 rounded-2xl" />
      <div className="p-1 space-y-2">
        <div className="w-3/4 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
        <div className="w-1/2 h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { data, loading } = useCMS();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const ELECTRONICS_SHOWROOM_IMAGE = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80';
  const rawList = data?.gallery && data.gallery.length > 0 ? data.gallery : [];
  
  const galleryList = rawList.map(g => ({
    ...g,
    image: (!g.image || g.image.includes('photo-1441986')) ? ELECTRONICS_SHOWROOM_IMAGE : g.image,
    title: g.title || g.details || 'Showroom Display'
  }));

  const categories = ['All', ...new Set(galleryList.map(g => g.category).filter(Boolean))];
  const filtered = filter === 'All' ? galleryList : galleryList.filter(g => g.category === filter);

  return (
    <motion.div variants={pageTransition} initial={isMobile ? false : "initial"} animate="animate" exit="exit" className="px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t('gallery_title')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Explore our Kolkata showroom, product display counters, and happy customer memories.
          </p>
        </div>

        {/* Filter tabs */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const isSelected = filter === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs px-4 py-2 rounded-full font-bold transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-md'
                      : 'bg-stone-200/70 dark:bg-stone-800/70 text-stone-700 dark:text-stone-300 hover:bg-stone-300/70 dark:hover:bg-stone-700/70'
                  }`}
                  whileHover={isMobile ? undefined : { scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {cat === 'All' ? t('gallery_all') : cat}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Skeletons while loading */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <GalleryCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="lumina-card p-12 text-center text-stone-900 dark:text-white font-bold text-sm">
            No images to be found
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial={isMobile ? false : "hidden"} animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" layout={!isMobile}>
            <AnimatePresence>
              {filtered.map(item => (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  layout={!isMobile}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setLightbox(item.image)}
                  className="cursor-pointer"
                >
                  <motion.div className="lumina-card p-3 overflow-hidden group hover:translate-y-[-4px] transition-all duration-300 border border-stone-200/80 dark:border-stone-800" whileHover={isMobile ? undefined : { scale: 1.01 }}>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="px-1 space-y-1">
                      <h3 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1">{item.title}</h3>
                      <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{item.category}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox} alt="Gallery" decoding="async" className="w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl" />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
