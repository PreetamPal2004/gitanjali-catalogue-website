import { motion } from 'framer-motion';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import mockData from '../data/mockData';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function OffersPage() {
  const { data } = useCMS();
  const { t } = useLanguage();
  const offersList = data?.offers && data.offers.length > 0 ? data.offers : mockData.offers;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display font-extrabold text-3xl text-stone-900 dark:text-white tracking-tight">
          {t('offers_title')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Exclusive showroom deals and festive discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offersList.filter(o => o.active !== false).map(offer => (
          <motion.div key={offer.id} variants={fadeUp} initial="hidden" animate="visible">
            <div className="lumina-card overflow-hidden group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {offer.badge}
                </span>
                <span className="absolute bottom-3 right-3 text-white font-display font-extrabold text-2xl">
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
    </div>
  );
}
