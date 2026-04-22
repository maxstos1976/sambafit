import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size?: string) => void;
  onProductClick?: (product: Product) => void;
  ghost?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onProductClick,
  ghost = false
}) => {
  const { t } = useLanguage();
  const { user, toggleFavorite } = useAuth();
  const { theme } = useTheme();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  
  const isFavorite = user?.favorites?.includes(product._id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ghost) return;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ghost || !onAddToCart) return;
    if (!selectedSize) {
      setShowSizeWarning(true);
      setTimeout(() => setShowSizeWarning(false), 2000);
      return;
    }
    onAddToCart(product, selectedSize);
  };
  
  const getTranslatedCategory = (category: string) => {
    switch (category) {
      case 'Tops': return t.tops;
      case 'Bottoms': return t.bottoms;
      case 'Outerwear': return t.outerwear;
      case 'One-piece': return t.onePiece;
      case 'Sets': return t.sets;
      case 'Shorts': return t.shorts;
      case 'Leggings': return t.leggings;
      case 'Bodys': return t.bodys;
      case 'Socks': return t.socks;
      case 'T-Shirts': return t.tshirts;
      case 'Jackets': return t.jackets;
      case 'Jumpsuits': return t.jumpsuits;
      case 'Accessories': return t.accessories;
      default: return category;
    }
  };

  return (
    <motion.div 
      initial={ghost ? { opacity: 0, scale: 0.95 } : { opacity: 0, y: 20 }}
      animate={ghost ? { opacity: 0.7, scale: 1 } : { opacity: 1, y: 0 }}
      whileInView={ghost ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative ${ghost ? 'pointer-events-none' : 'group'}`}
    >
      <div 
        onClick={() => !ghost && onProductClick?.(product)}
        className={`relative aspect-[3/4] overflow-hidden rounded-2xl mb-4 ${ghost ? '' : 'bg-brand-lime/10 dark:bg-white/5 cursor-pointer'}`}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${ghost ? '' : 'group-hover:scale-110'}`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {!ghost && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />}
        
        {/* Sizes Overlay */}
        {!ghost && (
          <div id="sizes-overlay-1" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div id="sizes-overlay-2" className="flex flex-wrap justify-center gap-2 px-6">
              {product.sizes.map((size, idx) => {
                const stockCount = product.stock?.[size] || 0;
                const isOutOfStock = stockCount === 0;
                
                return (
                  <motion.button
                    key={size}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOutOfStock) setSelectedSize(size);
                    }}
                    className={`backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-lg transition-all pointer-events-auto ${
                      selectedSize === size 
                        ? 'bg-brand-orange text-white border-brand-orange scale-110' 
                        : isOutOfStock
                          ? 'bg-gray-100/50 dark:bg-black/20 text-gray-400 border-gray-200/20 cursor-not-allowed'
                          : `${theme === 'dark' ? 'bg-black text-white hover:text-brand-orange' : 'bg-white/90 text-brand-green hover:bg-brand-orange hover:text-white'} border-brand-green/10 dark:border-white/10`
                    }`}
                  >
                    {size}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {!ghost && (
          <div id="size-warning" className="absolute bottom-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
            <AnimatePresence>
              {showSizeWarning && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-brand-orange text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                >
                  {t.selectSizeWarning}
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              id="botao-add-cart"
              onClick={handleAddToCart}
              className="bg-white text-brand-green p-4 rounded-full shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-orange hover:text-white pointer-events-auto"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}

        {!ghost && (
          <button 
            id="botao-favoritos"
            onClick={handleToggleFavorite}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-xl transition-all duration-300 pointer-events-auto ${
              isFavorite 
                ? 'bg-brand-orange text-white opacity-100' 
                : 'bg-white text-brand-green opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 hover:text-brand-orange'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Product Category */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white/90 text-brand-green'} backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest self-start transition-colors`}>
            {getTranslatedCategory(product.category)}
          </span>
          
          {/* Product Collection */}
          <span className="bg-brand-orange/90 dark:bg-black backdrop-blur-sm text-white dark:text-brand-orange px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest self-start">
            {product.collection}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className={`text-xl font-serif italic font-bold transition-colors ${ghost ? '' : 'group-hover:text-brand-orange'}`}>
            {product.name}
          </h3>
          <span className="font-bold text-lg">€{product.price}</span>
        </div>
        <p className="text-sm text-brand-green/60 font-medium">{product.color}</p>
      </div>
    </motion.div>
  );
};
