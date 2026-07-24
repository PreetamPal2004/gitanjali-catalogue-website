import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Share2, MessageCircle } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const { data } = useCMS();
  const info = data.businessInfo;

  return (
    <footer className="mt-28 bg-white/70 dark:bg-stone-900/60 border-t border-stone-200/60 dark:border-stone-800/60 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-stone-200/60 dark:border-stone-800/60">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold flex items-center justify-center text-xs">
                G
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
                GITANJALI
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
              The next generation of high-end consumer technology and appliances, delivered with uncompromising aesthetics.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-500 dark:text-stone-400">
              <li><Link to="/products" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('nav_products')}</Link></li>
              <li><Link to="/offers" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('nav_offers')}</Link></li>
              <li><Link to="/brands" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('nav_brands')}</Link></li>
              <li><Link to="/gallery" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('nav_gallery')}</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-500 dark:text-stone-400">
              <li><Link to="/services" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('nav_services')}</Link></li>
              <li><Link to="/contact" className="hover:text-stone-900 dark:hover:text-white transition-colors">{t('nav_contact')}</Link></li>
              <li><a href={`tel:${info.phone}`} className="hover:text-stone-900 dark:hover:text-white transition-colors">{info.phone}</a></li>
              <li><a href={info.maps} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-white transition-colors">Showroom Location</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Join the inner circle for exclusive updates and offers.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-stone-100 dark:bg-stone-800 text-xs px-4 py-2.5 rounded-full outline-none w-full text-stone-800 dark:text-stone-200 placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 dark:text-stone-500">
          <p>© {new Date().getFullYear()} Gitanjali Electronics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Cookies</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Website" className="hover:text-stone-900 dark:hover:text-white transition-colors"><Globe size={14} /></a>
            <a href="#" aria-label="WhatsApp" className="hover:text-stone-900 dark:hover:text-white transition-colors"><MessageCircle size={14} /></a>
            <a href="#" aria-label="Share" className="hover:text-stone-900 dark:hover:text-white transition-colors"><Share2 size={14} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
