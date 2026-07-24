import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { data } = useCMS();
  const { t } = useLanguage();
  const info = data.businessInfo;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="font-display font-extrabold text-3xl text-stone-900 dark:text-white tracking-tight">
          {t('contact_title')}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Visit our Mogra, Hooghly showroom or contact us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="lumina-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-400">Phone</h3>
              <a href={`tel:${info.phone}`} className="text-sm font-bold text-stone-900 dark:text-white">{info.phone}</a>
            </div>
          </div>

          <div className="lumina-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-400">Email</h3>
              <a href={`mailto:${info.email}`} className="text-sm font-bold text-stone-900 dark:text-white">{info.email}</a>
            </div>
          </div>

          <div className="lumina-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-400">Hours</h3>
              <p className="text-sm font-bold text-stone-900 dark:text-white">{info.businessHours}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="lumina-card p-3 aspect-[4/3] overflow-hidden">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 16 }}
              allowFullScreen
              loading="lazy"
              title="Showroom Location"
            />
          </div>

          <a
            href={info.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="lumina-btn text-xs w-full justify-center"
          >
            <MapPin size={14} /> Get Directions on Google Maps <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
