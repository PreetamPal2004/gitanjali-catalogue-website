import { motion } from 'framer-motion';
import { Star, Award, Users, Clock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import { staggerContainer, staggerItem, fadeInUp, pageTransition } from '../utils/animations';

export default function AboutPage() {
  const { data, loading } = useCMS();
  const { t } = useLanguage();

  const reasons = [
    { icon: Award, title: 'Authorized Dealer', desc: 'Official dealer for all major electronics brands.' },
    { icon: Users, title: 'Expert Staff', desc: 'Trained professionals to help you choose the right product.' },
    { icon: Clock, title: '28+ Years', desc: 'Trusted by thousands of families across Kolkata since 1995.' },
    { icon: Star, title: 'Best Prices', desc: 'Competitive pricing with price match guarantee.' },
  ];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* About section */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-5">
            <motion.h1 variants={staggerItem} className="font-display text-3xl sm:text-4xl font-bold">{t('about_title')}</motion.h1>
            <motion.p variants={staggerItem} className="text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>{data.businessInfo.shopName}</strong> has been Kolkata's premier electronics destination since 1995. We bring you the latest and best in televisions, refrigerators, air conditioners, washing machines, audio systems, and kitchen appliances from the world's top brands.
            </motion.p>
            <motion.p variants={staggerItem} className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Our commitment to exceptional customer service, genuine products, competitive pricing, and comprehensive after-sales support has made us the trusted choice for over 28 years. Visit our spacious showroom to experience the latest technology firsthand.
            </motion.p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="glass-card p-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Showroom"
                className="w-full h-64 sm:h-80 object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Why choose us */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">{t('about_why_choose')}</h2>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {reasons.map(item => (
              <motion.div key={item.title} variants={staggerItem}>
                <motion.div className="glass-card p-6 text-center" whileHover={{ y: -6, scale: 1.02 }}>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <item.icon size={26} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-display font-bold text-base">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* What Our Customers Say (Filtered for P000 Shop Testimonials) */}
        {(() => {
          const storeReviews = (data.reviews || []).filter(
            r => r.display !== false && (!r.productId || r.productId.trim().toUpperCase() === 'P000')
          );
          const testimonialsList = storeReviews.length > 0 ? storeReviews : (data.testimonials || []).filter(t => t.display);

          if (loading) {
            return (
              <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">{t('about_testimonials')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="lumina-card p-6 h-44 animate-pulse space-y-4">
                      <div className="w-24 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
                      <div className="w-full h-12 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
                      <div className="w-1/3 h-4 bg-stone-200/80 dark:bg-stone-800/80 rounded-md" />
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          }

          return testimonialsList.length > 0 ? (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-8">{t('about_testimonials')}</h2>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {testimonialsList.map((item, i) => (
                  <motion.div key={i} variants={staggerItem}>
                    <motion.div className="lumina-card p-6 h-full flex flex-col justify-between" whileHover={{ y: -4 }}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} size={14} className={j < item.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300 dark:text-stone-700'} />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            VERIFIED STORE REVIEW
                          </span>
                        </div>
                        <p className="text-xs text-black dark:text-white leading-relaxed italic font-medium">"{item.review}"</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs flex items-center justify-center">
                          {item.customer.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-black dark:text-white block">{item.customer}</span>
                          <span className="text-[10px] text-black dark:text-stone-300 font-medium">Verified Buyer</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          ) : null;
        })()}
      </div>
    </motion.div>
  );
}
