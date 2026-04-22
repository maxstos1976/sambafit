import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Share2, Check, ChevronRight, Ruler } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const { t } = useLanguage();
  const { user, toggleFavorite } = useAuth();
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeWarning, setShowSizeWarning] = useState(false);

  if (!product) return null;

  const isFavorite = user?.favorites?.includes(product._id);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert(t.loginToFavorite);
      return;
    }
    try {
      await toggleFavorite(product._id);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeWarning(true);
      setTimeout(() => setShowSizeWarning(false), 2000);
      return;
    }
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-green/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-warm-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] transition-colors duration-300"
          >
            <button 
              onClick={onClose}
              className={`absolute top-6 right-6 z-10 p-3 ${theme === 'dark' ? 'bg-dark-card/80 text-dark-text' : 'bg-white/80 text-brand-green'} backdrop-blur-md rounded-full hover:bg-brand-orange hover:text-white transition-all shadow-lg`}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 relative bg-brand-lime/10 overflow-hidden group">
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white/90 text-brand-green'} backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm transition-colors`}>
                  {product.category}
                </span>
                <span className="bg-brand-orange/90 dark:bg-black backdrop-blur-md text-white dark:text-brand-orange px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  {product.collection}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <div>
                  <div className="mb-6">
                    <h2 className="text-4xl md:text-5xl font-serif italic font-bold tracking-tighter text-brand-green mb-2">
                      {product.name}
                    </h2>
                    <span className="text-3xl font-bold text-brand-orange">€{product.price}</span>
                  </div>
                  <p className="text-lg text-brand-green/60 font-medium">{product.color}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green/40">
                      {t.selectSize}
                    </h4>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:opacity-70 transition-opacity">
                      <Ruler className="w-3.5 h-3.5" />
                      {t.sizeGuide}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const stockCount = product.stock?.[size] || 0;
                      const isOutOfStock = stockCount === 0;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => !isOutOfStock && setSelectedSize(size)}
                          disabled={isOutOfStock}
                          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold transition-all border-2 relative ${
                            selectedSize === size
                              ? 'bg-brand-orange border-brand-orange text-white scale-105 shadow-lg shadow-brand-orange/20'
                              : isOutOfStock
                                ? 'bg-gray-100 dark:bg-dark-bg/20 border-gray-200 dark:border-dark-border text-gray-400 cursor-not-allowed'
                                : 'bg-white dark:bg-black/50 border-brand-green/5 dark:border-white/10 text-brand-green dark:text-white hover:border-brand-orange hover:text-brand-orange'
                          }`}
                        >
                          <span className="text-sm">{size}</span>
                          {!isOutOfStock && stockCount <= 5 && (
                            <span className="text-[8px] absolute -bottom-1 bg-brand-orange text-white px-1 rounded-full">
                              {stockCount} left
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold uppercase tracking-widest text-xs text-brand-green/40">
                    {t.description}
                  </h4>
                  <p className="text-brand-green/70 leading-relaxed text-lg">
                    {product.description || t.performanceDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-brand-lime/10 rounded-2xl">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Material</h5>
                    <p className="font-bold text-brand-green">Premium Recycled Poly</p>
                  </div>
                  <div className="p-4 bg-brand-lime/10 rounded-2xl">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-1">Fit</h5>
                    <p className="font-bold text-brand-green">True to Size</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <AnimatePresence>
                    {showSizeWarning && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-brand-orange text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg text-center"
                      >
                        {t.selectSizeWarning}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdded}
                      className={`flex-1 h-16 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                        isAdded 
                          ? 'bg-brand-green text-white' 
                          : 'bg-brand-orange text-white hover:bg-brand-green shadow-xl shadow-brand-orange/20 hover:shadow-brand-green/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-6 h-6" />
                          {t.addedToCart}
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-6 h-6" />
                          {t.addToCart}
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleToggleFavorite}
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all bg-white ${
                        isFavorite 
                          ? 'border-brand-orange text-brand-orange bg-brand-orange/5' 
                          : 'border-brand-green/5 text-brand-green hover:border-brand-orange hover:text-brand-orange'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 pt-4">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-green/40 hover:text-brand-orange transition-colors">
                    <Share2 className="w-4 h-4" />
                    {t.share}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
