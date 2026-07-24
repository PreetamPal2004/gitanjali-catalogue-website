import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
};

interface DerivedBrand {
  name: string;
  count: number;
  brandLogo?: string;
}

function BrandSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="lumina-card p-6 text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-stone-200/80 dark:bg-stone-800/80 mx-auto" />
          <div className="w-24 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md mx-auto" />
          <div className="w-16 h-3 bg-stone-200/80 dark:bg-stone-800/80 rounded-md mx-auto" />
        </div>
      ))}
    </div>
  );
}

export default function BrandsPage() {
  const { data, loading } = useCMS();
  const { t } = useLanguage();
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  // Derive brands directly from Products sheet (filter active products)
  const brandsList = useMemo(() => {
    const products = data.products || [];
    const activeProducts = products.filter(p => p.active !== false);

    const brandMap = new Map<string, DerivedBrand>();

    activeProducts.forEach(p => {
      if (!p.brand) return;
      const trimmedBrand = p.brand.trim();
      if (!trimmedBrand) return;

      const key = trimmedBrand.toLowerCase();
      const existing = brandMap.get(key);

      if (existing) {
        existing.count += 1;
        // Prefer a product that has a non-empty brandLogo
        if (!existing.brandLogo && p.brandLogo && p.brandLogo.trim()) {
          existing.brandLogo = p.brandLogo.trim();
        }
      } else {
        brandMap.set(key, {
          name: trimmedBrand,
          count: 1,
          brandLogo: p.brandLogo && p.brandLogo.trim() ? p.brandLogo.trim() : undefined,
        });
      }
    });

    return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [data.products]);

  const handleImageError = (brandName: string) => {
    setFailedLogos(prev => ({ ...prev, [brandName]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-3xl text-stone-900 dark:text-white tracking-tight">
            {t('nav_brands')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Official retail partner for leading electronics brands in our catalogue.
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-semibold text-stone-900 dark:text-white hover:underline flex items-center gap-1 shrink-0"
        >
          View All Products <ArrowRight size={13} />
        </Link>
      </div>

      {/* Main Brands Grid */}
      {loading ? (
        <BrandSkeletonGrid />
      ) : brandsList.length === 0 ? (
        <div className="lumina-card p-12 text-center text-stone-400 text-xs">
          No brands found in the products catalogue.
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {brandsList.map(brand => {
            const hasLogo = brand.brandLogo && !failedLogos[brand.name];

            return (
              <motion.div key={brand.name} variants={fadeUp}>
                <Link to={`/products?brand=${encodeURIComponent(brand.name)}`}>
                  <div className="lumina-card p-6 text-center space-y-4 group cursor-pointer hover:translate-y-[-4px] transition-all duration-300 h-full flex flex-col justify-between border border-stone-200/80 dark:border-stone-800">
                    <div className="space-y-3">
                      {/* Logo or Initial Avatar */}
                      <div className="w-20 h-20 rounded-2xl bg-white dark:bg-stone-800/80 p-2.5 mx-auto flex items-center justify-center border border-stone-200/60 dark:border-stone-700/60 shadow-sm group-hover:shadow-md transition-shadow">
                        {hasLogo ? (
                          <img
                            src={brand.brandLogo}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={() => handleImageError(brand.name)}
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-display font-extrabold text-2xl flex items-center justify-center">
                            {brand.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Brand Title */}
                      <h3 className="font-display font-bold text-base text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {brand.name}
                      </h3>
                    </div>

                    {/* Product Count Pill */}
                    <div className="pt-2 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider bg-stone-200/50 dark:bg-stone-800/50 px-3 py-1 rounded-full">
                        {brand.count} Product{brand.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Authorized Guarantee Banner */}
      <div className="lumina-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-stone-900 dark:text-white">100% Genuine Brand Warranty</h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
              All products listed under these brands come with full manufacturer warranty & store support.
            </p>
          </div>
        </div>

        <Link
          to="/products"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs px-5 py-2.5 rounded-full transition-all shrink-0 shadow-sm"
        >
          Explore Catalogue
        </Link>
      </div>
    </div>
  );
}
