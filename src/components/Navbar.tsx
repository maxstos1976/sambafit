import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu, X, Globe, ChevronRight, ChevronDown, ArrowLeft, User as UserIcon, LogOut, Heart, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Collection } from '../types';
import { Button } from './ui/Button';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollTo: (id: string) => void;
  onSearch: (query: string) => void;
  onNavigate?: (page: string) => void;
  onSelectCollection: (collection: string | null) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  collections: Collection[];
}

type MenuLevel = 'main' | 'collections' | 'products' | 'accessories';

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onScrollTo, 
  onSearch, 
  onNavigate, 
  onSelectCollection,
  onOpenAuth,
  collections: dynamicCollectionsList
}) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [menuLevel, setMenuLevel] = useState<MenuLevel>('main');
  const [isUserMenuHovered, setIsUserMenuHovered] = useState(false);

  const handleMobileNav = (id: string) => {
    onScrollTo(id);
    setIsMenuOpen(false);
    setMenuLevel('main');
  };

  const handleCollectionSelect = (collection: string) => {
    onSelectCollection(collection);
    handleMobileNav('products');
  };

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
    setIsMenuOpen(false);
    setMenuLevel('main');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
    setIsSearchOpen(false);
    onScrollTo('products');
  };

  const menuItems = {
    main: [
      { label: t.home, action: () => handleNavigate('home') },
      { label: t.collections.toUpperCase(), sub: 'collections' },
      { label: t.products.toUpperCase(), sub: 'products' },
      { label: t.new, action: () => handleNavigate('new') },
      { label: t.giftCard, action: () => handleNavigate('giftCards') },
      { label: t.lastUnits, action: () => handleNavigate('lastUnits') },
    ],
    collections: dynamicCollectionsList.map(c => ({
      label: c.name,
      action: () => handleCollectionSelect(c.name)
    })),
    products: [
      { label: t.sets, action: () => handleMobileNav('products') },
      { label: t.tops, action: () => handleMobileNav('products') },
      { label: t.shorts, action: () => handleMobileNav('products') },
      { label: t.leggings, action: () => handleMobileNav('products') },
      { label: t.bodys, action: () => handleMobileNav('products') },
      { label: t.socks, action: () => handleMobileNav('products') },
      { label: t.tshirts, action: () => handleMobileNav('products') },
      { label: t.jackets, action: () => handleMobileNav('products') },
      { label: t.jumpsuits, action: () => handleMobileNav('products') },
      { label: t.accessories, sub: 'accessories' },
    ],
    accessories: [
      { label: t.skateCovers, action: () => handleMobileNav('products') },
      { label: t.hairAccessories, action: () => handleMobileNav('products') },
      { label: t.socks, action: () => handleMobileNav('products') },
      { label: t.bags, action: () => handleMobileNav('products') },
      { label: t.phoneStrap, action: () => handleMobileNav('products') },
      { label: t.sweatshirt, action: () => handleMobileNav('products') },
      { label: t.thermal, action: () => handleMobileNav('products') },
    ]
  };

  const renderMenuLevel = (level: MenuLevel) => {
    const items = menuItems[level];
    const parentLevel: Record<MenuLevel, MenuLevel | null> = {
      main: null,
      collections: 'main',
      products: 'main',
      accessories: 'products'
    };

    return (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="flex flex-col space-y-6"
          >
        {parentLevel[level] && (
          <button 
            onClick={() => setMenuLevel(parentLevel[level]!)}
            className="flex items-center gap-2 text-brand-green/40 dark:text-dark-text/40 font-bold uppercase tracking-widest text-xs mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToHome.split(' ')[0]}
          </button>
        )}
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => item.sub ? setMenuLevel(item.sub as MenuLevel) : item.action!()}
            className="flex items-center justify-between text-3xl font-bold tracking-tighter hover:text-brand-orange transition-colors text-left dark:text-dark-text"
          >
            {item.label}
            {item.sub && <ChevronRight className="w-6 h-6 text-brand-green/20 dark:text-dark-text/20" />}
          </button>
        ))}
      </motion.div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center glass rounded-full px-6 py-3 shadow-sm relative z-50">
        {/* Left Section */}
        <div className="flex-1 flex items-center gap-4 lg:gap-8">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-brand-green/5 rounded-full transition-colors lg:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold uppercase tracking-widest dark:text-dark-text">
            <div 
              className="relative"
              onMouseEnter={() => setIsShopHovered(true)}
              onMouseLeave={() => setIsShopHovered(false)}
            >
              <button 
                className="hover:text-brand-orange transition-colors py-2 flex items-center gap-1 focus:outline-none"
              >
                {t.shop}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isShopHovered ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isShopHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-56 bg-white backdrop-blur-md border border-brand-green/10 rounded-2xl shadow-xl p-3 z-[100]"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          handleNavigate('giftCards');
                          setIsShopHovered(false);
                        }}
                        className="text-left px-4 py-2.5 rounded-xl hover:bg-brand-green/5 hover:text-brand-orange transition-all text-xs font-bold tracking-widest text-brand-green"
                      >
                        {t.giftCard}
                      </button>
                      <button
                        onClick={() => {
                          onScrollTo('products');
                          setIsShopHovered(false);
                        }}
                        className="text-left px-4 py-2.5 rounded-xl hover:bg-brand-green/5 hover:text-brand-orange transition-all text-xs font-bold tracking-widest text-brand-green"
                      >
                        {t.collections}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setIsCollectionsHovered(true)}
              onMouseLeave={() => setIsCollectionsHovered(false)}
            >
              <button 
                onClick={() => onSelectCollection(null)} 
                className="hover:text-brand-orange transition-colors py-2"
              >
                {t.collections}
              </button>
              <AnimatePresence>
                {isCollectionsHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-64 bg-white dark:bg-white backdrop-blur-md border border-brand-green/10 rounded-2xl shadow-xl p-4 z-[100]"
                    >
                      <div className="flex flex-col gap-2">
                        {menuItems.collections.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              item.action!();
                              setIsCollectionsHovered(false);
                            }}
                            className="text-left px-4 py-2 rounded-xl hover:bg-brand-green/5 hover:text-brand-orange transition-all text-xs font-bold tracking-widest text-brand-green dark:text-[#006241]"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => onScrollTo('soul')} className="hover:text-brand-orange transition-colors">{t.soul}</button>
          </div>
        </div>

        {/* Middle Section (Logo) */}
        <div 
          onClick={() => handleNavigate('home')}
          className="flex-shrink-0 cursor-pointer px-4 dark:text-dark-text"
        >
          <h1 className="text-2xl md:text-3xl font-serif italic font-bold tracking-tighter">SambaFit</h1>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-4 mr-2">
            {user ? (
              <>
                <button 
                  onClick={() => handleNavigate('favorites')}
                  className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors group relative dark:text-dark-text"
                  title={t.myFavorites}
                >
                  <Heart className={`w-5 h-5 ${user.favorites?.length > 0 ? 'text-brand-orange fill-current' : ''}`} />
                  {user.favorites?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-brand-orange text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {user.favorites.length}
                    </span>
                  )}
                </button>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => handleNavigate('admin')}
                    className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors group relative text-brand-orange"
                    title="Admin Dashboard"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                )}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsUserMenuHovered(true)}
                  onMouseLeave={() => setIsUserMenuHovered(false)}
                >
                  <button 
                    onClick={() => handleNavigate('profile')}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors text-xs font-bold uppercase tracking-widest dark:text-dark-text"
                  >
                    <UserIcon className="w-4 h-4" />
                    {user.name}
                  </button>

                  <AnimatePresence>
                    {isUserMenuHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 w-64 bg-white dark:bg-white backdrop-blur-md border border-brand-green/10 rounded-2xl shadow-xl p-4 z-[100]"
                      >
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              handleNavigate('profile');
                              setIsUserMenuHovered(false);
                            }}
                            className="text-left px-4 py-2 rounded-xl hover:bg-brand-green/5 hover:text-brand-orange transition-all text-xs font-bold tracking-widest text-brand-green dark:text-[#006241] flex items-center gap-2"
                          >
                            <UserIcon className="w-4 h-4" />
                            {t.personalInfo}
                          </button>
                          <button
                            onClick={() => {
                              handleNavigate('orders');
                              setIsUserMenuHovered(false);
                            }}
                            className="text-left px-4 py-2 rounded-xl hover:bg-brand-green/5 hover:text-brand-orange transition-all text-xs font-bold tracking-widest text-brand-green dark:text-[#006241] flex items-center gap-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            {t.purchaseHistory}
                          </button>
                          <div className="h-px bg-brand-green/5 my-1" />
                          <button
                            onClick={() => {
                              logout();
                              handleNavigate('home');
                              setIsUserMenuHovered(false);
                            }}
                            className="text-left px-4 py-2 rounded-xl hover:bg-red-50 text-red-500 transition-all text-xs font-bold tracking-widest flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            {t.logout}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => onOpenAuth('login')}
                  variant="ghost"
                  size="sm"
                >
                  {t.loginButton}
                </Button>
                <Button 
                  onClick={() => onOpenAuth('signup')}
                  size="sm"
                >
                  {t.signupButton}
                </Button>
              </>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors group relative"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-brand-green dark:text-dark-text" />
            ) : (
              <Sun className="w-5 h-5 text-brand-orange" />
            )}
          </button>
          <LanguageSwitcher />
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors hidden sm:block dark:text-dark-text"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenCart}
            className="relative p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors group dark:text-dark-text"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 glass rounded-3xl p-4 shadow-xl z-40"
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
              <Search className="w-5 h-5 text-brand-green/40" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-brand-green/20 dark:placeholder:text-white/20 dark:text-dark-text"
                />
              <button 
                type="button"
                onClick={() => { setIsSearchOpen(false); setLocalSearch(''); onSearch(''); }}
                className="p-2 hover:bg-brand-green/5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-warm-white dark:bg-dark-bg z-[60] p-8 flex flex-col lg:hidden transition-colors duration-300"
          >
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-2xl font-serif italic font-bold dark:text-dark-text">SambaFit</h2>
              <button 
                onClick={() => { setIsMenuOpen(false); setMenuLevel('main'); }}
                className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 dark:text-dark-text" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {renderMenuLevel(menuLevel)}
              </AnimatePresence>
            </div>

            <div className="mt-auto pt-8 border-t border-brand-green/10 dark:border-dark-border space-y-6">
              {!user && (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => { onOpenAuth('login'); setIsMenuOpen(false); }}
                    variant="outline"
                  >
                    {t.loginButton}
                  </Button>
                  <Button 
                    onClick={() => { onOpenAuth('signup'); setIsMenuOpen(false); }}
                    variant="secondary"
                  >
                    {t.signupButton}
                  </Button>
                </div>
              )}
              {user && (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { handleNavigate('favorites'); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-brand-green/10 dark:border-dark-border rounded-full font-bold uppercase tracking-widest text-xs hover:border-brand-orange transition-all dark:text-dark-text"
                  >
                    <Heart className="w-4 h-4" />
                    {t.myFavorites} ({user.favorites?.length || 0})
                  </button>
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => { handleNavigate('admin'); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 py-4 border-2 border-brand-orange/20 rounded-full font-bold uppercase tracking-widest text-xs text-brand-orange hover:bg-brand-orange/5 transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  <button 
                    onClick={() => { handleNavigate('profile'); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-brand-green/10 dark:border-dark-border rounded-full font-bold uppercase tracking-widest text-xs hover:border-brand-orange transition-all dark:text-dark-text"
                  >
                    <UserIcon className="w-4 h-4" />
                    {user.name} - {t.personalInfo}
                  </button>
                  <button 
                    onClick={() => { handleNavigate('orders'); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-brand-green/10 dark:border-dark-border rounded-full font-bold uppercase tracking-widest text-xs hover:border-brand-orange transition-all dark:text-dark-text"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {t.purchaseHistory}
                  </button>
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); handleNavigate('home'); }}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40">{t.bag}</span>
                <span className="font-bold dark:text-dark-text">{cartCount} items</span>
              </div>
              <Button 
                onClick={() => { onOpenCart(); setIsMenuOpen(false); }}
                className="w-full"
                size="lg"
              >
                {t.checkout}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
