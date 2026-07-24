import { Phone, MessageCircle, MapPin, Send } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function StickyMobileBar() {
  const { data } = useCMS();
  const info = data.businessInfo;

  const actions = [
    { icon: Phone, label: 'Call', href: `tel:${info.phone}` },
    { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}` },
    { icon: MapPin, label: 'Visit', href: info.maps },
    { icon: Send, label: 'Enquire', href: '/contact' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/30 dark:bg-stone-900/30 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/40 dark:border-white/10 rounded-t-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around py-2 px-1">
        {actions.map(a => (
          <a
            key={a.label}
            href={a.href}
            target={a.label === 'Visit' ? '_blank' : undefined}
            rel={a.label === 'Visit' ? 'noopener noreferrer' : undefined}
            className="flex flex-col items-center gap-0.5 py-1 px-4 text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors"
          >
            <a.icon size={18} />
            <span className="text-[10px] font-medium">{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
