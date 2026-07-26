import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MessageCircle, Check, GitCompareArrows, Star, MessageSquare, Plus, X } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useCompare } from '../context/CompareContext';
import { formatPrice, calcDiscount, whatsappLink } from '../utils/formatters';
import type { Review } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12 animate-pulse">
      <div className="w-24 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 aspect-square rounded-3xl bg-stone-200/80 dark:bg-stone-800/80" />
        <div className="lg:col-span-6 space-y-4">
          <div className="w-20 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-full" />
          <div className="w-3/4 h-8 bg-stone-200/80 dark:bg-stone-800/80 rounded-lg" />
          <div className="w-1/2 h-6 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
          <div className="w-full h-24 bg-stone-200/80 dark:bg-stone-800/80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = useCMS();
  const { addToCompare, removeFromCompare, isInCompare, setCompareOpen } = useCompare();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const product = data.products.find(p => p.slug === slug);

  // Link product-specific reviews from GSheets reviews sheet by productId (e.g. P001) or slug
  const productReviews = useMemo(() => {
    if (!product) return [];
    const cmsReviews = (data.reviews || []).filter(
      r => r.display !== false &&
      (
        (r.productId && r.productId.trim().toUpperCase() === product.productId.trim().toUpperCase()) ||
        (r.productId && r.productId.trim().toLowerCase() === product.slug.toLowerCase())
      )
    );
    return [...cmsReviews, ...localReviews];
  }, [data.reviews, product, localReviews]);

  const avgRating = useMemo(() => {
    if (productReviews.length === 0) return '5.0';
    const sum = productReviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / productReviews.length).toFixed(1);
  }, [productReviews]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-stone-400 text-sm">Product not found.</p>
        <Link to="/products" className="text-xs font-bold text-stone-900 dark:text-white mt-3 inline-block">
          ← Back to Catalogue
        </Link>
      </div>
    );
  }

  const related = data.products.filter(p => p.category === product.category && p.productId !== product.productId && p.active).slice(0, 3);
  const isCompared = isInCompare(product.productId);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newReviewText.trim()) return;

    const newRev: Review = {
      id: `local-${Date.now()}`,
      productId: product.productId,
      customer: newName.trim(),
      review: newReviewText.trim(),
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      display: true,
    };

    setLocalReviews(prev => [newRev, ...prev]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowReviewModal(false);
      setNewName('');
      setNewReviewText('');
      setNewRating(5);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* Back button */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left column - Images */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-6 space-y-4">
          <div className="lumina-card aspect-[4/3] rounded-3xl overflow-hidden relative border border-white/60 dark:border-white/10 p-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                {calcDiscount(product.mrp, product.sellingPrice)}% OFF
              </span>
            )}
          </div>
        </motion.div>

        {/* Right column - Details */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="lumina-badge">{product.brand}</span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{product.category}</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            <p className="text-xs text-stone-400 font-mono">Model: {product.model}</p>

            {/* Rating Summary Link */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} className="fill-amber-500" />
                <span className="text-xs font-extrabold text-stone-900 dark:text-white">{avgRating}</span>
              </div>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <a href="#reviews-section" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                {productReviews.length} Customer Review{productReviews.length !== 1 ? 's' : ''}
              </a>
            </div>
          </div>

          {/* Pricing */}
          <div className="lumina-card p-5 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-extrabold text-3xl text-stone-900 dark:text-white">
                {formatPrice(product.sellingPrice)}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Inclusive of all taxes • {product.warranty}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsappLink(data.businessInfo.whatsapp, product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle size={16} />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={`tel:${data.businessInfo.phone}`}
                className="w-full lumina-btn-secondary text-xs py-3 px-4 flex items-center justify-center gap-2"
              >
                <Phone size={15} />
                <span>Call Store</span>
              </a>
            </div>

            {/* Compare Toggle Button */}
            <button
              onClick={() => {
                if (isCompared) {
                  removeFromCompare(product.productId);
                } else {
                  addToCompare(product);
                  setCompareOpen(true);
                }
              }}
              className={`w-full py-2.5 px-4 rounded-full text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                isCompared
                  ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-400'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <GitCompareArrows size={15} />
              <span>{isCompared ? '✓ Added to Product Compare' : '+ Add to Compare'}</span>
            </button>
          </div>

          {/* Key Specifications */}
          <div className="lumina-card p-5 space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
              Key Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {product.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Check size={13} className="text-green-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== LINKED PRODUCT REVIEWS SECTION ===== */}
      <section id="reviews-section" className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 dark:border-stone-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                VERIFIED CUSTOMER FEEDBACK
              </span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-stone-900 dark:text-white mt-1">
              Customer Reviews & Ratings
            </h2>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="lumina-btn group text-xs shrink-0 self-start sm:self-auto"
          >
            <Plus size={14} />
            <span className="font-bold">Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-stone-100 dark:bg-stone-900 text-black dark:text-white border border-stone-200 dark:border-stone-800 p-6 rounded-3xl gap-4">
          <div className="flex items-center gap-4">
            <div className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-black dark:text-white">
              {avgRating} <span className="text-amber-500 text-3xl">★</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Customer Rating
              </p>
              <p className="text-xs text-black dark:text-white/80 font-semibold">
                {productReviews.length} Verified Review{productReviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-black dark:text-white font-bold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-4 py-2 rounded-full shadow-sm">
            <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-black dark:text-white">Genuine Buyer Reviews</span>
          </div>
        </div>

        {/* Reviews List */}
        {productReviews.length === 0 ? (
          <div className="lumina-card p-10 text-center space-y-3">
            <MessageSquare size={32} className="mx-auto text-stone-400" />
            <p className="text-xs text-black dark:text-white font-bold">
              No customer reviews found for this product yet.
            </p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-block"
            >
              Be the first to rate and review this product!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.map((rev, idx) => (
              <div key={rev.id || idx} className="lumina-card p-6 flex flex-col justify-between space-y-4 border border-stone-200/80 dark:border-stone-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < (rev.rating || 5) ? 'fill-amber-500 text-amber-500' : 'text-stone-300 dark:text-stone-700'}
                        />
                      ))}
                    </div>

                    {rev.date && (
                      <span className="text-[10px] text-black dark:text-stone-300 font-mono font-medium">{rev.date}</span>
                    )}
                  </div>

                  <p className="text-xs text-black dark:text-white leading-relaxed italic font-medium">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs flex items-center justify-center">
                      {rev.customer ? rev.customer.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-black dark:text-white block">{rev.customer}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Check size={10} /> Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="lumina-card p-6 w-full max-w-md space-y-4 relative border border-stone-200 dark:border-stone-700 shadow-2xl"
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white">
                  Write a Customer Review
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Sharing your experience for {product.name}
                </p>
              </div>

              {submittedSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-center space-y-1 py-6">
                  <Check size={28} className="mx-auto" />
                  <p className="font-bold text-sm">Review Submitted!</p>
                  <p className="text-xs text-stone-500">Thank you for helping other buyers.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4">
                  {/* Star Rating Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={22}
                            className={star <= newRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300 dark:text-stone-700'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sen"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Review Text Area */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us about the picture quality, sound, delivery, etc."
                      value={newReviewText}
                      onChange={e => setNewReviewText(e.target.value)}
                      className="w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full lumina-btn py-2.5 justify-center text-xs font-bold"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-6 space-y-6">
          <h2 className="font-display font-bold text-xl text-stone-900 dark:text-white">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.productId} to={`/products/${p.slug}`}>
                <div className="lumina-card p-4 group cursor-pointer hover:translate-y-[-2px] transition-transform duration-300">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-100 dark:bg-stone-800">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{p.brand}</p>
                  <h3 className="font-display font-bold text-sm text-stone-900 dark:text-white line-clamp-1">{p.name}</h3>
                  <p className="text-xs font-bold text-stone-900 dark:text-white mt-1">{formatPrice(p.sellingPrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
