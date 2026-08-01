import { motion } from 'framer-motion';
import { Truck, Shield, CreditCard, Wrench } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '../hooks/useIsMobile';
import mockData from '../data/mockData';

const iconMap: Record<string, React.ElementType> = { Truck, Shield, CreditCard, Wrench };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function ServicesPage() {
  const { data } = useCMS();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const servicesList = data?.services && data.services.length > 0 ? data.services : mockData.services;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display font-extrabold text-3xl text-stone-900 dark:text-white tracking-tight">
          {t('services_title')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Complete after-sales assistance & installation services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesList.filter(s => s.active !== false).map(service => {
          const Icon = iconMap[service.icon] || Truck;
          const features = service.features || [];
          return (
            <motion.div key={service.id} variants={fadeUp} initial={isMobile ? false : "hidden"} animate="visible">
              <div className="lumina-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">{service.title}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{service.description}</p>
                {features.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
                    {features.map((feat, i) => (
                      <li key={i} className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-stone-900 dark:bg-white" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
