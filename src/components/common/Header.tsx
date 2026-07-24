import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe, Search, GitCompareArrows } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCompare } from '../../context/CompareContext';

const links = [
  { key: 'nav_home' as const, path: '/' },
  { key: 'nav_products' as const, path: '/products' },
  { key: 'nav_brands' as const, path: '/brands' },
  { key: 'nav_offers' as const, path: '/offers' },
  { key: 'nav_services' as const, path: '/services' },
  { key: 'nav_gallery' as const, path: '/gallery' },
  { key: 'nav_about' as const, path: '/about' },
  { key: 'nav_contact' as const, path: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage, language } = useLanguage();
  const { compareList, setCompareOpen } = useCompare();
  const loc = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === '/' ? loc.pathname === '/' : loc.pathname.startsWith(path);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/30 dark:bg-stone-900/30 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/40 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold flex items-center justify-center text-xs tracking-tighter shadow-sm">
              G
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
              GEETANJALI
            </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.key} to={l.path}>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive(l.path)
                      ? 'text-stone-900 dark:text-white font-semibold'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  {t(l.key)}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Header Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-stone-200/50 dark:bg-stone-800/50 text-xs px-3.5 py-1.5 pl-8 rounded-full outline-none w-28 sm:w-36 md:w-44 focus:w-40 sm:focus:w-48 md:focus:w-56 transition-all text-stone-800 dark:text-stone-200 placeholder:text-stone-400"
              />
              <Search size={13} className="absolute left-3 text-stone-400 pointer-events-none" />
            </form>

            {/* Compare Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setCompareOpen(true)}
                className="relative p-2 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
                title="Compare products"
              >
                <GitCompareArrows size={15} />
                <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Language Toggle (hidden on mobile, shown in drawer instead) */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex px-2.5 py-1 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-[11px] font-semibold text-stone-700 dark:text-stone-300 items-center gap-1 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
            >
              <Globe size={12} />
              {language === 'en' ? 'BN' : 'EN'}
            </button>

            {/* Theme Toggle (hidden on mobile, shown in drawer instead) */}
            <button
              onClick={toggleTheme}
              className="hidden md:block p-2 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} className="text-amber-400" />}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 lg:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Right Half Side Panel) — rendered outside <header> so fixed positioning works */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            />

            {/* Slide-over Right Drawer — Glass texture, rounded left corners */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-3/5 min-w-[220px] max-w-[320px] z-[70] lg:hidden
                bg-white/30 dark:bg-stone-900/30 backdrop-blur-2xl backdrop-saturate-150
                border-l border-white/40 dark:border-white/10
                rounded-l-3xl shadow-2xl
                p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/20 dark:border-white/10">
                  <span className="font-display font-extrabold text-xs tracking-wider text-stone-900 dark:text-white uppercase">
                    Menu
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {links.map(l => (
                    <Link
                      key={l.key}
                      to={l.path}
                      onClick={() => setOpen(false)}
                      className={`block py-2.5 px-3 rounded-xl text-xs transition-colors ${
                        isActive(l.path)
                          ? 'font-bold text-stone-900 dark:text-white bg-white/25 dark:bg-white/15'
                          : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white/15 dark:hover:bg-white/10'
                      }`}
                    >
                      {t(l.key)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Drawer Footer — Language & Theme toggles + branding */}
              <div className="pt-4 border-t border-white/20 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLanguage}
                    className="px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/10 text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
                  >
                    <Globe size={12} />
                    {language === 'en' ? 'BN' : 'EN'}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/20 dark:bg-white/10 text-stone-700 dark:text-stone-300 hover:bg-white/30 dark:hover:bg-white/20 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? <Moon size={14} /> : <Sun size={14} className="text-amber-400" />}
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 block">Geetanjali Catalogue</span>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
