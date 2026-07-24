import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, GitCompareArrows, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { formatPrice } from '../../utils/formatters';

export default function CompareModal() {
  const { compareList, removeFromCompare, clearCompare, isCompareOpen, setCompareOpen } = useCompare();

  if (compareList.length === 0) return null;

  // Extract all unique spec keys from the products in comparison
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specifications || {})))
  );

  return (
    <>
      {/* Floating Bottom Bar when compare items exist */}
      {!isCompareOpen && compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900/90 dark:bg-stone-100/95 backdrop-blur-xl text-white dark:text-stone-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/20 dark:border-stone-800"
        >
          <div className="flex items-center gap-2">
            <GitCompareArrows size={16} className="text-amber-400 dark:text-amber-600 animate-pulse" />
            <span className="text-xs font-bold">
              {compareList.length} Product{compareList.length > 1 ? 's' : ''} in Compare
            </span>
          </div>

          {/* Product Thumbnails preview */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-white/20 dark:border-stone-300 pl-3">
            {compareList.map(p => (
              <img
                key={p.productId}
                src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80'}
                alt={p.name}
                className="w-7 h-7 rounded-full object-cover border border-white/30"
              />
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-white/20 dark:border-stone-300 pl-3">
            <button
              onClick={() => setCompareOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 px-3.5 py-1 rounded-full text-xs font-extrabold transition-all flex items-center gap-1 shadow-md"
            >
              <span>Compare Now</span>
              <ArrowRight size={13} />
            </button>
            <button
              onClick={clearCompare}
              className="text-stone-400 hover:text-stone-200 dark:text-stone-600 dark:hover:text-stone-900 p-1"
              title="Clear comparison"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Full Compare Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-hidden"
            onClick={() => setCompareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="lumina-card max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <GitCompareArrows size={18} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-stone-900 dark:text-white">
                      Product Comparison
                    </h2>
                    <p className="text-xs text-stone-400">Comparing {compareList.length} items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearCompare}
                    className="text-xs text-stone-500 hover:text-red-500 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Clear All</span>
                  </button>
                  <button
                    onClick={() => setCompareOpen(false)}
                    className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable Side-by-Side Table */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Product Header Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {compareList.map(p => (
                    <div
                      key={p.productId}
                      className="relative lumina-card p-4 flex flex-col justify-between space-y-3 bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800"
                    >
                      <button
                        onClick={() => removeFromCompare(p.productId)}
                        className="absolute top-3 right-3 p-1 rounded-full bg-stone-200/80 dark:bg-stone-700/80 text-stone-500 hover:text-red-500 transition-colors"
                        title="Remove product"
                      >
                        <X size={14} />
                      </button>

                      <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-stone-900 p-2 border border-stone-200/60 dark:border-stone-700">
                        <img
                          src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80'}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          {p.brand}
                        </span>
                        <h3 className="font-display font-bold text-xs text-stone-900 dark:text-white line-clamp-2">
                          {p.name}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-stone-200 dark:border-stone-700 space-y-2">
                        <div className="font-display font-extrabold text-sm text-stone-900 dark:text-white">
                          {formatPrice(p.sellingPrice)}
                          {p.mrp > p.sellingPrice && (
                            <span className="text-[10px] text-stone-400 line-through ml-1.5 font-normal">
                              {formatPrice(p.mrp)}
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/products/${p.slug}`}
                          onClick={() => setCompareOpen(false)}
                          className="w-full lumina-btn text-[11px] py-1.5 flex items-center justify-center gap-1"
                        >
                          <span>View Details</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed Comparison Matrix */}
                <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <h4 className="font-display font-bold text-xs uppercase tracking-widest text-stone-400">
                    Detailed Comparison
                  </h4>

                  {/* Category */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-white">Category</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      {compareList.map(p => (
                        <div key={p.productId} className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/40 font-medium text-stone-700 dark:text-stone-300">
                          {p.category} {p.subcategory ? `(${p.subcategory})` : ''}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-white">Key Features</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      {compareList.map(p => (
                        <div key={p.productId} className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 space-y-1">
                          {p.features && p.features.length > 0 ? (
                            p.features.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                                <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-stone-400 italic">No features listed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Technical Specifications */}
                  {allSpecKeys.map(specKey => (
                    <div key={specKey} className="space-y-1">
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{specKey}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        {compareList.map(p => (
                          <div key={p.productId} className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/40 font-medium text-stone-700 dark:text-stone-300 text-[11px]">
                            {p.specifications && p.specifications[specKey] ? p.specifications[specKey] : '—'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Warranty & Services */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-900 dark:text-white">Warranty</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      {compareList.map(p => (
                        <div key={p.productId} className="p-2.5 rounded-lg bg-stone-100 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 text-[11px]">
                          {p.warranty || 'Standard Manufacturer Warranty'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
