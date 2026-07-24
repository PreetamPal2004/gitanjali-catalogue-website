import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice, calcDiscount } from '../utils/formatters';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

/* ===== SKELETON FILLER BOXES ===== */
function HeroProductSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-stone-200/80 dark:bg-stone-800/80 animate-pulse border border-white/60 dark:border-white/10 flex flex-col justify-end p-5 space-y-2">
      <div className="w-24 h-4 bg-stone-300 dark:bg-stone-700 rounded-full" />
      <div className="w-3/4 h-5 bg-stone-300 dark:bg-stone-700 rounded-md" />
      <div className="w-1/3 h-4 bg-stone-300 dark:bg-stone-700 rounded-md" />
    </div>
  );
}

function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="lumina-card p-4 space-y-3 animate-pulse">
          <div className="aspect-square rounded-2xl bg-stone-200/80 dark:bg-stone-800/80" />
          <div className="space-y-2 pt-1">
            <div className="w-16 h-3 bg-stone-200 dark:bg-stone-800 rounded-full" />
            <div className="w-3/4 h-4 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-md" />
          </div>
          <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
            <div className="w-20 h-5 bg-stone-200 dark:bg-stone-800 rounded-md" />
            <div className="w-14 h-4 bg-stone-200 dark:bg-stone-800 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="lumina-card aspect-[4/3] rounded-3xl bg-stone-200/80 dark:bg-stone-800/80 animate-pulse relative p-5 flex flex-col justify-end space-y-2">
          <div className="w-1/2 h-5 bg-stone-300 dark:bg-stone-700 rounded-md" />
          <div className="w-1/3 h-3 bg-stone-300 dark:bg-stone-700 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data, loading } = useCMS();
  const { t } = useLanguage();
  
  const products = data.products || [];
  const brandsSheet = data.brands || [];
  const storeReviews = (data.reviews || []).filter(r => r.display !== false && (!r.productId || r.productId.trim().toUpperCase() === 'P000'));
  const testimonials = storeReviews.length > 0 ? storeReviews : (data.testimonials || []).filter(t => t.display !== false);

  // Strictly filter products marked featured: true from the Products sheet
  const featuredProducts = products.filter(p => p.featured && p.active !== false);
  const heroProduct = featuredProducts[0] || products[0];

  // Group featured products by brand to build Featured Brand Collections
  const featuredBrandsMap = new Map<string, { brand: string; count: number; image: string }>();

  featuredProducts.forEach(p => {
    if (!p.brand) return;
    const existing = featuredBrandsMap.get(p.brand);
    
    // Find brand logo from brandLogo column or brand sheet logo or fallback product image
    const matchingBrandSheet = brandsSheet.find(b => b.name.toLowerCase() === p.brand.toLowerCase());
    const brandLogo = p.brandLogo || matchingBrandSheet?.logo || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80';

    if (existing) {
      existing.count += 1;
      if (!existing.image && brandLogo) {
        existing.image = brandLogo;
      }
    } else {
      featuredBrandsMap.set(p.brand, {
        brand: p.brand,
        count: 1,
        image: brandLogo,
      });
    }
  });

  const featuredBrandCollections = Array.from(featuredBrandsMap.values());

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-20">
      {/* ===== HERO SECTION ===== */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="lumina-card p-8 md:p-14 overflow-hidden relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-stone-900 dark:text-white leading-[1.08]">
              Design Meets <br />
              <span className="italic font-serif font-normal text-stone-600 dark:text-stone-300">Innovation.</span>
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Discover a curated collection of premium electronics designed to elevate your everyday life. Uncompromising aesthetics, unparalleled performance.
            </p>

            <div>
              <Link to="/products">
                <button className="lumina-btn group">
                  <span>{t('hero_cta')}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Hero Image Card - Skeleton when loading */}
          <div className="lg:col-span-5">
            {loading || !heroProduct ? (
              <HeroProductSkeleton />
            ) : (
              <Link to={`/products/${heroProduct.slug}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group border border-white/60 dark:border-white/10 cursor-pointer">
                  <img
                    src={heroProduct.images && heroProduct.images[0] ? heroProduct.images[0] : 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80'}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      FLAGSHIP SHOWCASE
                    </span>
                    <p className="font-display font-bold text-sm mt-1.5 line-clamp-1">{heroProduct.name}</p>
                    <p className="text-xs text-amber-300 font-semibold">{formatPrice(heroProduct.sellingPrice)}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </motion.section>

      {/* ===== FEATURED PRODUCTS SHOWCASE (Strictly from Google Sheets) ===== */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="font-display font-bold text-2xl tracking-tight text-stone-900 dark:text-white">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-stone-900 dark:text-white hover:underline flex items-center gap-1"
          >
            View Full Catalogue <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <ProductSkeletonGrid />
        ) : featuredProducts.length === 0 ? (
          <div className="lumina-card p-10 text-center text-stone-400 text-xs">
            No featured products marked in Google Sheets yet. Mark items with <code className="bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">featured: TRUE</code> in your spreadsheet.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredProducts.slice(0, 3).map(product => {
              const discount = calcDiscount(product.mrp, product.sellingPrice);
              return (
                <motion.div key={product.productId} variants={fadeUp}>
                  <Link to={`/products/${product.slug}`}>
                    <div className="lumina-card p-4 space-y-3 group hover:translate-y-[-2px] transition-all duration-300 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                          <img
                            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {discount > 0 && (
                            <span className="absolute top-3 left-3 bg-black text-white dark:bg-white dark:text-stone-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {discount}% OFF
                            </span>
                          )}
                          <span className="absolute top-3 right-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-stone-900 dark:text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {product.brand}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            {product.category}
                          </p>
                          <h3 className="font-display font-bold text-sm text-stone-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
                        <div>
                          <span className="font-display font-extrabold text-base text-stone-900 dark:text-white">
                            {formatPrice(product.sellingPrice)}
                          </span>
                          {product.mrp > product.sellingPrice && (
                            <span className="text-xs text-stone-400 line-through ml-2">
                              {formatPrice(product.mrp)}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-stone-900 dark:text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ===== FEATURED COLLECTIONS (Grouped by Featured Brand from Products Sheet) ===== */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl tracking-tight text-stone-900 dark:text-white">
              Featured Collections
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Top brands featuring highlighted products.
            </p>
          </div>
        </div>

        {loading ? (
          <CollectionSkeletonGrid />
        ) : featuredBrandCollections.length === 0 ? (
          <div className="lumina-card p-10 text-center text-stone-400 text-xs">
            No featured brand collections found. Mark products with <code className="bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">featured: TRUE</code> in your Products sheet.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredBrandCollections.slice(0, 3).map(item => (
              <motion.div key={item.brand} variants={fadeUp}>
                <Link to={`/products?brand=${encodeURIComponent(item.brand)}&featured=true`}>
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group lumina-card border border-white/60 dark:border-white/10 cursor-pointer">
                    <img
                      src={item.image}
                      alt={item.brand}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                        BRAND COLLECTION
                      </span>
                      <h3 className="font-display font-bold text-xl">{item.brand}</h3>
                      <p className="text-xs text-stone-300 font-light">
                        {item.count} Featured Item{item.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ===== EDITORIAL BRAND STORY BANNER ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        className="lumina-card p-10 md:p-16 text-center max-w-4xl mx-auto space-y-5"
      >
        <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center mx-auto">
          <Sparkles size={18} />
        </div>

        <h2 className="font-display font-extrabold text-2xl md:text-4xl text-stone-900 dark:text-white tracking-tight">
          The Intersection of Art and Technology
        </h2>

        <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
          We believe that the devices you use every day should be beautiful as well as functional. Gitanjali Electronics brings together world-class industrial design with cutting-edge engineering to create products that inspire.
        </p>

        <div className="pt-2">
          <Link
            to="/about"
            className="text-xs font-bold text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white pb-0.5 hover:opacity-80 transition-opacity uppercase tracking-wider"
          >
            Read Our Story
          </Link>
        </div>
      </motion.section>

      {/* ===== WHAT CREATORS SAY (TESTIMONIALS) ===== */}
      {testimonials.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="font-display font-bold text-2xl tracking-tight text-stone-900 dark:text-white">
              What Creators Say
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.filter(t => t.display !== false).map((item, idx) => (
              <motion.div key={idx} variants={fadeUp}>
                <div className="lumina-card p-6 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic font-serif">
                      "{item.review}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-stone-200/50 dark:border-stone-800/50">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {item.customer ? item.customer.charAt(0) : 'C'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{item.customer}</p>
                      <p className="text-[10px] text-stone-400">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
}
