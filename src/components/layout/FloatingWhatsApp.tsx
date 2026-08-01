import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function FloatingWhatsApp() {
  const { data } = useCMS();
  const isMobile = useIsMobile();
  const url = `https://wa.me/${data.businessInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I have an enquiry about your products.')}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 lg:bottom-6 right-5 z-40 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20"
      initial={isMobile ? false : { scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 1.5, stiffness: 200, damping: 15 }}
      whileHover={isMobile ? undefined : { scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} fill="white" />
    </motion.a>
  );
}
