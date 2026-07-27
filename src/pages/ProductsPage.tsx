import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, List, ArrowRight, Plus, Check, Star, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useCompare } from '../context/CompareContext';
import { formatPrice, calcDiscount } from '../utils/formatters';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
};

function ProductCardSkeleton() {
  return (
    <div className="bg-white/30 dark:bg-stone-900/30 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-4 space-y-3 animate-pulse">
      <div className="aspect-square rounded-2xl bg-stone-200/80 dark:bg-stone-800/80" />
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center">
          <div className="w-16 h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-full" />
          <div className="w-14 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
        </div>
        <div className="w-3/4 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
        <div className="w-full h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
      </div>
      <div className="pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex justify-between items-center">
        <div className="w-12 h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-full" />
        <div className="w-14 h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-full" />
      </div>
    </div>
  );
}

function FeaturedLaunchSkeleton() {
  return (
    <div className="lumina-card p-6 md:p-8 overflow-hidden animate-pulse border border-stone-200/60 dark:border-stone-800/60 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-3">
          <div className="w-24 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
          <div className="w-3/4 h-8 bg-stone-200/80 dark:bg-stone-800/80 rounded-lg" />
          <div className="w-full h-12 bg-stone-200/80 dark:bg-stone-800/80 rounded-lg" />
        </div>
        <div className="md:col-span-5 aspect-[4/3] rounded-2xl bg-stone-200/80 dark:bg-stone-800/80" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data, loading } = useCMS();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [searchParams] = useSearchParams();

  const catalogGridRef = useRef<HTMLDivElement>(null);

  const searchFromUrl = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  const brandFromUrl = searchParams.get('brand') || '';
  const featuredFromUrl = searchParams.get('featured') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedBrand, setSelectedBrand] = useState(brandFromUrl);
  const [featuredOnly, setFeaturedOnly] = useState(featuredFromUrl);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL search parameters
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSelectedBrand(brandFromUrl);
    setFeaturedOnly(featuredFromUrl);
  }, [categoryFromUrl, brandFromUrl, featuredFromUrl]);

  // Smooth scroll to catalog grid when user searches
  useEffect(() => {
    if (searchFromUrl && catalogGridRef.current) {
      catalogGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchFromUrl]);

  // Featured launch product (first active product or highlighted item)
  const featuredLaunch = data.products.find(p => p.active) || data.products[0];

  const filtered = useMemo(() => {
    let items = data.products.filter(p => p.active !== false);

    if (searchFromUrl) {
      const q = searchFromUrl.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      items = items.filter(p =>
        p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
        p.category === selectedCategory
      );
    }

    if (selectedBrand) {
      items = items.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (featuredOnly) {
      items = items.filter(p => p.featured);
    }

    return items;
  }, [data.products, searchFromUrl, selectedCategory, selectedBrand, featuredOnly]);

  const brands = [...new Set(data.products.map(p => p.brand))];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* 2-Column Catalogue Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===== LEFT SIDEBAR & MOBILE FILTER ===== */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Small Left-Corner Filter Button & In-Place Expandable Panel (Mobile Only) */}
          <div className="lg:hidden space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileFilters(prev => !prev)}
                className="lumina-card px-4 py-2.5 flex items-center gap-2 font-bold text-xs text-stone-900 dark:text-white border border-stone-200/80 dark:border-stone-800 shadow-sm active:scale-95 transition-all rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <SlidersHorizontal size={14} className="text-amber-500" />
                <span>{showMobileFilters ? 'Hide Filters' : 'Filters'}</span>
                {(selectedCategory || selectedBrand || featuredOnly) && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-0.5" />
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${showMobileFilters ? 'rotate-180' : ''}`}
                />
              </button>

            </div>

            {/* In-Place Height Expandable Drawer */}
            <AnimatePresence initial={false}>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="lumina-card p-5 space-y-5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-md">
                    {/* Categories */}
                    <div className="space-y-3">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
                        Categories
                      </h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => setSelectedCategory('')}
                          className={`w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-xl transition-colors ${
                            !selectedCategory
                              ? 'font-bold text-stone-900 dark:text-white bg-stone-200/50 dark:bg-stone-800/50'
                              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                          }`}
                        >
                          <span>All Products</span>
                          <span className="text-[10px] text-stone-400">{data.products.length}</span>
                        </button>

                        {data.categories.map(c => {
                          const count = data.products.filter(p => p.category === c.name).length;
                          const isSelected = selectedCategory === c.slug || selectedCategory === c.name;

                          return (
                            <button
                              key={c.slug}
                              onClick={() => setSelectedCategory(isSelected ? '' : c.slug)}
                              className={`w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-xl transition-colors ${
                                isSelected
                                  ? 'font-bold text-stone-900 dark:text-white bg-stone-200/50 dark:bg-stone-800/50'
                                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                              }`}
                            >
                              <span>{c.name}</span>
                              <span className="text-[10px] text-stone-400">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filters & Brand */}
                    <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/60 space-y-4">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
                        Filters
                      </h3>

                      {/* Featured Filter */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Product Highlights</p>
                        <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={featuredOnly}
                            onChange={e => setFeaturedOnly(e.target.checked)}
                            className="rounded accent-stone-900 dark:accent-white"
                          />
                          <span className="font-semibold text-amber-600 dark:text-amber-400">Featured Only</span>
                        </label>
                      </div>

                      {/* Brand Filter */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Brand</p>
                        <div className="flex flex-wrap gap-1.5">
                          {brands.map(b => {
                            const isSelected = selectedBrand === b;
                            return (
                              <button
                                key={b}
                                onClick={() => setSelectedBrand(isSelected ? '' : b)}
                                className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all ${
                                  isSelected
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                                    : 'bg-stone-200/50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                                }`}
                              >
                                {b}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(selectedCategory || selectedBrand || featuredOnly) && (
                        <button
                          onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setFeaturedOnly(false); }}
                          className="text-xs text-red-500 font-medium hover:underline pt-1 block"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Filter Sidebar (Static 3-Col Layout) */}
          <div className="hidden lg:block space-y-6">
            <div className="lumina-card p-5 space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
                Categories
              </h3>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-xl transition-colors ${
                    !selectedCategory
                      ? 'font-bold text-stone-900 dark:text-white bg-stone-200/50 dark:bg-stone-800/50'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[10px] text-stone-400">{data.products.length}</span>
                </button>

                {data.categories.map(c => {
                  const count = data.products.filter(p => p.category === c.name).length;
                  const isSelected = selectedCategory === c.slug || selectedCategory === c.name;

                  return (
                    <button
                      key={c.slug}
                      onClick={() => setSelectedCategory(isSelected ? '' : c.slug)}
                      className={`w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-xl transition-colors ${
                        isSelected
                          ? 'font-bold text-stone-900 dark:text-white bg-stone-200/50 dark:bg-stone-800/50'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-stone-400">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800/60 space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
                  Filters
                </h3>

                {/* Featured Filter */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Product Highlights</p>
                  <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={e => setFeaturedOnly(e.target.checked)}
                      className="rounded accent-stone-900 dark:accent-white"
                    />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Featured Only</span>
                  </label>
                </div>

                {/* Brand Filter */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Brand</p>
                  <div className="flex flex-wrap gap-1.5">
                    {brands.map(b => {
                      const isSelected = selectedBrand === b;
                      return (
                        <button
                          key={b}
                          onClick={() => setSelectedBrand(isSelected ? '' : b)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-all ${
                            isSelected
                              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                              : 'bg-stone-200/50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {(selectedCategory || selectedBrand || featuredOnly) && (
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setFeaturedOnly(false); }}
                    className="text-xs text-red-500 font-medium hover:underline pt-1 block"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="lg:col-span-9 space-y-8">
          {/* Featured Launch Hero Card (Hidden during active search) */}
          {!searchFromUrl && (
            loading ? (
              <FeaturedLaunchSkeleton />
            ) : featuredLaunch ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="lumina-card p-6 md:p-8 overflow-hidden relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-4">
                    <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-stone-900 dark:text-white">
                      {featuredLaunch.name}
                    </h2>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-md">
                      {featuredLaunch.description}
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <Link to={`/products/${featuredLaunch.slug}`}>
                        <button className="lumina-btn group text-xs">
                          <span>View Details</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>

                      <button
                        onClick={() => isInCompare(featuredLaunch.productId) ? removeFromCompare(featuredLaunch.productId) : addToCompare(featuredLaunch)}
                        className="px-3 py-1.5 rounded-full bg-stone-200/70 dark:bg-stone-800/70 text-stone-800 dark:text-stone-200 flex items-center gap-1.5 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors text-xs font-semibold"
                        title="Compare"
                      >
                        {isInCompare(featuredLaunch.productId) ? <Check size={14} /> : <Plus size={14} />}
                        <span>Compare</span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-amber-400 flex items-center justify-center p-4 shadow-lg">
                      <img
                        src={featuredLaunch.images[0]}
                        alt={featuredLaunch.name}
                        className="w-full h-full object-contain drop-shadow-md rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null
          )}

          {/* Grid Header & Search Anchor */}
          <div ref={catalogGridRef} className="flex items-center justify-between flex-wrap gap-3 scroll-mt-24">
            <div>
              <h2 className="font-display font-bold text-xl tracking-tight text-stone-900 dark:text-white">
                {searchFromUrl ? 'Catalogue Search Results' : 'Latest Catalogue'}
              </h2>
              {searchFromUrl && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1.5">
                  <span>Results for <strong className="text-stone-900 dark:text-white">"{searchFromUrl}"</strong> ({filtered.length} product{filtered.length !== 1 ? 's' : ''})</span>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-amber-600 dark:text-amber-400 hover:underline font-bold text-[11px] flex items-center gap-0.5 ml-1"
                  >
                    <X size={12} />
                    <span>Clear search</span>
                  </button>
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 bg-stone-200/50 dark:bg-stone-800/50 p-1 rounded-full text-xs">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-full transition-colors ${view === 'grid' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' : 'text-stone-400'}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-full transition-colors ${view === 'list' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm' : 'text-stone-400'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>

          {/* Mobile-only Clear Filters Button */}
          {(selectedCategory || selectedBrand || featuredOnly) && (
            <button
              onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setFeaturedOnly(false); }}
              className="lg:hidden px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-sm active:scale-95"
            >
              ✕ Clear All Filters
            </button>
          )}

          {/* Product Grid / List */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="lumina-card p-12 text-center text-stone-400 text-xs">
              No products found matching your filter criteria.
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6' : 'space-y-4'}
            >
              {filtered.map(p => (
                <motion.div key={p.productId} variants={fadeUp}>
                  <Link to={`/products/${p.slug}`}>
                    <div className="lumina-card p-3 sm:p-4 group cursor-pointer h-full flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all duration-300">
                      <div>
                        {/* Product Image */}
                        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white/40 dark:bg-stone-800/40 border border-white/30 dark:border-stone-700/30 mb-2.5 relative">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {p.featured && (
                            <div className="absolute top-2 right-2 bg-white/30 dark:bg-stone-900/30 backdrop-blur-md text-black/80 dark:text-white/90 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1 z-10 border border-white/40 dark:border-white/20">
                              <Star size={9} className="fill-amber-500 text-amber-500" />
                              <span className="tracking-wide hidden xs:inline">Featured</span>
                            </div>
                          )}
                        </div>

                        {/* Product Title */}
                        <h3 className="font-display font-bold text-xs sm:text-sm text-stone-900 dark:text-white line-clamp-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                          {p.name}
                        </h3>

                        {/* Category + Specs Summary */}
                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1 truncate">{p.category}</p>
                        <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                          {p.features.slice(0, 3).join(' • ')}
                        </p>

                        {/* Price Line: Selling Price + Slashed MRP + Discount */}
                        <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-stone-200/40 dark:border-stone-700/40">
                          <span className="text-stone-900 dark:text-white font-extrabold text-sm sm:text-base">{formatPrice(p.sellingPrice)}</span>
                          {p.mrp > p.sellingPrice && (
                            <>
                              <span className="text-[9px] sm:text-[10px] text-stone-400 line-through">{formatPrice(p.mrp)}</span>
                              <span className="text-[8px] sm:text-[9px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded-full">
                                {calcDiscount(p.mrp, p.sellingPrice)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Compare toggle footer */}
                      <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-[9px] sm:text-[10px]">
                        <span className="text-stone-400 font-medium truncate max-w-[65px] sm:max-w-none">{p.brand}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            isInCompare(p.productId) ? removeFromCompare(p.productId) : addToCompare(p);
                          }}
                          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 font-semibold text-[9px] sm:text-[10px]"
                        >
                          {isInCompare(p.productId) ? '✓ Compare' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
