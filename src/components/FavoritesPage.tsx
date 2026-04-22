import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface FavoritesPageProps {
  products: Product[];
  onBack: () => void;
  onAddToCart: (product: Product, size?: string) => void;
  onProductClick: (product: Product) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ products, onBack, onAddToCart, onProductClick }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const favoriteProducts = products.filter(p => {
    const isFavorite = user?.favorites?.includes(p._id);
    const hasStock = Object.values(p.stock || {}).some(val => Number(val) > 0);
    return isFavorite && hasStock;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-32 pb-20 container mx-auto px-6"
    >
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-green/60 hover:text-brand-orange transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </button>
      </div>

      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-serif italic font-bold text-brand-green tracking-tighter mb-4">
          {t.myFavorites.split(' ')[0]} <span className="text-brand-orange">{t.myFavorites.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-lg text-brand-green/60 font-medium">
          {t.favoritesDescription}
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {favoriteProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-brand-lime/10 rounded-full flex items-center justify-center text-brand-green/20 mb-6">
            <Heart className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-serif italic font-bold text-brand-green mb-4">{t.favoritesEmpty}</h3>
          <p className="text-brand-green/60 max-w-md mb-8 font-medium">
            {t.favoritesEmptyDesc}
          </p>
          <button 
            onClick={onBack}
            className="bg-brand-green text-white px-8 py-4 rounded-full font-bold hover:bg-brand-orange transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {t.startShopping}
          </button>
        </div>
      )}
    </motion.div>
  );
};
