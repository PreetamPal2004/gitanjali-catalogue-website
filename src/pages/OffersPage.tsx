import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '../hooks/useIsMobile';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function OfferCardSkeleton() {
  return (
    <div className="lumina-card overflow-hidden animate-pulse border border-stone-200/60 dark:border-stone-800/60 rounded-3xl p-4 space-y-4">
      <div className="aspect-[16/9] rounded-2xl bg-stone-200/80 dark:bg-stone-800/80" />
      <div className="space-y-2">
        <div className="w-2/3 h-5 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
        <div className="w-full h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
        <div className="w-1/3 h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
      </div>
    </div>
  );
}

export default function OffersPage() {
  const { data, loading } = useCMS();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const offersList = (data?.offers || []).filter(o => o.active !== false);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Keyboard navigation & escape close for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedIndex === null) return;
      if (e.key === 'Escape') {
        setExpandedIndex(null);
      } else if (e.key === 'ArrowRight' && offersList.length > 1) {
        setExpandedIndex((expandedIndex + 1) % offersList.length);
      } else if (e.key === 'ArrowLeft' && offersList.length > 1) {
        setExpandedIndex((expandedIndex - 1 + offersList.length) % offersList.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex, offersList.length]);

  const activeExpanded = expandedIndex !== null ? offersList[expandedIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display font-extrabold text-3xl text-stone-900 dark:text-white tracking-tight">
          {t('offers_title')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Exclusive showroom deals and festive discounts. Click any banner to expand.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <OfferCardSkeleton key={i} />
          ))}
        </div>
      ) : offersList.length === 0 ? (
        <div className="lumina-card p-12 text-center text-stone-400 text-xs">
          No current active offers in the catalogue. Check back soon for new deals!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offersList.map((offer, idx) => (
            <motion.div key={offer.id || idx} variants={fadeUp} initial={isMobile ? false : "hidden"} animate="visible">
              <div className="lumina-card overflow-hidden group hover:shadow-lg transition-all">
                {/* Clickable image section */}
                <div
                  onClick={() => setExpandedIndex(idx)}
                  className="relative aspect-[16/9] overflow-hidden cursor-pointer group/img"
                  title="Click to expand image"
                >
                  <img
                    src={offer.image}
                    alt={offer.title}
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Expand hover indicator */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                      <ZoomIn size={14} className="text-amber-500" /> Expand Banner
                    </div>
                  </div>

                  <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10 z-10">
                    {offer.badge}
                  </span>
                  <span className="absolute bottom-3 right-3 text-white font-display font-extrabold text-2xl z-10">
                    {offer.discount}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">{offer.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{offer.description}</p>
                  <p className="text-[10px] text-stone-400 pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
                    {t('offers_valid_until')} {offer.validUntil}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Expanded Image Lightbox Modal */}
      <AnimatePresence>
        {activeExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setExpandedIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setExpandedIndex(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>

            {/* Prev/Next Navigation Buttons */}
            {offersList.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIndex((expandedIndex! - 1 + offersList.length) % offersList.length);
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
                  title="Previous offer"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedIndex((expandedIndex! + 1) % offersList.length);
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
                  title="Next offer"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={activeExpanded.image}
                alt={activeExpanded.title}
                decoding="async"
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              <div className="text-center text-white space-y-1 max-w-xl px-4">
                <div className="flex items-center justify-center gap-2">
                  {activeExpanded.badge && (
                    <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {activeExpanded.badge}
                    </span>
                  )}
                  {activeExpanded.discount && (
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      {activeExpanded.discount}
                    </span>
                  )}
                </div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                  {activeExpanded.title}
                </h2>
                <p className="text-xs text-stone-300">
                  {activeExpanded.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
