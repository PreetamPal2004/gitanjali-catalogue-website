import { useState, useEffect } from 'react';
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

  // Lock background scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          {/* Top Row: Logo, Nav, Actions */}
          <div className="flex items-center justify-between gap-4 h-12">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold flex items-center justify-center text-xs tracking-tighter shadow-sm">
                G
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
                GITANJALI
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

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="hidden md:flex px-2.5 py-1 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-[11px] font-semibold text-stone-700 dark:text-stone-300 items-center gap-1 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                <Globe size={12} />
                {language === 'en' ? 'BN' : 'EN'}
              </button>

              {/* Theme Toggle */}
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-200/60 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 lg:hidden"
              >
                {open ? <X size={16} /> : <Menu size={16} />}
                <span className="text-[11px] font-semibold">{open ? 'Close' : 'Menu'}</span>
              </button>
            </div>
          </div>

          {/* Centered Search Bar Row — Directly below logo/nav in middle of header on PC & Mobile */}
          <div className="pt-2 pb-0.5 flex justify-center">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
              <div className="search-wrapper w-full">
                <div className="search-inner">
                  <Search size={13} className="absolute left-4 z-10 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-icon-btn" aria-label="Search">
                    <Search size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Centered Menu Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — tap to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] touch-none lg:hidden"
            />

            {/* Centered Menu Card */}
            <motion.nav
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed inset-x-4 top-20 z-[70] lg:hidden
                bg-white dark:bg-stone-900
                border border-stone-200 dark:border-stone-800
                rounded-2xl shadow-2xl
                p-5 overflow-hidden"
            >
              {/* Nav Links — list style */}
              <div className="space-y-0.5">
                {links.map(l => (
                  <Link
                    key={l.key}
                    to={l.path}
                    onClick={() => setOpen(false)}
                    className={`block py-2.5 px-3.5 rounded-xl text-sm transition-colors ${
                      isActive(l.path)
                        ? 'font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800'
                        : 'text-stone-600 dark:text-stone-400 active:bg-stone-100 dark:active:bg-stone-800'
                    }`}
                  >
                    {t(l.key)}
                  </Link>
                ))}
              </div>

              {/* Footer — Language & Theme toggles */}
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 active:bg-stone-200 dark:active:bg-stone-700 transition-colors"
                >
                  <Globe size={12} />
                  {language === 'en' ? 'বাংলা' : 'EN'}
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 active:bg-stone-200 dark:active:bg-stone-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon size={14} /> : <Sun size={14} className="text-amber-400" />}
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
