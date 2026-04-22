import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number, size?: string, isGiftCard?: boolean) => void;
  onRemove: (id: string, size?: string, isGiftCard?: boolean, giftCardId?: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const { t } = useLanguage();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-warm-white dark:bg-dark-bg shadow-2xl z-50 flex flex-col transition-colors duration-300"
          >
            <div className="p-6 flex items-center justify-between border-bottom border-brand-green/10 dark:border-dark-border">
              <h2 className="text-2xl font-serif italic">{t.yourBag}</h2>
              <button onClick={onClose} className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="text-brand-green/60 dark:text-dark-text/60 font-medium">{t.bagEmpty}</p>
                  <button 
                    onClick={onClose}
                    className="text-brand-green dark:text-dark-text underline font-semibold hover:text-brand-orange transition-colors"
                  >
                    {t.startShopping}
                  </button>
                </div>
              ) : (
                  items.map((item) => (
                    <motion.div 
                      layout
                      key={`${item.id}-${item.selectedSize}`} 
                      className="flex gap-4 group"
                    >
                      <div className="w-24 h-32 bg-brand-lime/20 dark:bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                            {item.selectedSize && (
                              <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-brand-green/60 dark:text-dark-text/60">{item.color}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-white dark:bg-dark-card rounded-full px-3 py-1 border border-brand-green/10 dark:border-dark-border">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1, item.selectedSize, item.isGiftCard)}
                              className="p-1 hover:text-brand-orange transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-medium min-w-[1ch] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                const stockCount = item.stock?.[item.selectedSize || ''] || 0;
                                if (item.isGiftCard || item.quantity < stockCount) {
                                  onUpdateQuantity(item.id, 1, item.selectedSize, item.isGiftCard);
                                }
                              }}
                              disabled={!item.isGiftCard && item.quantity >= (item.stock?.[item.selectedSize || ''] || 0)}
                              className={`p-1 transition-colors ${
                                item.quantity >= (item.stock?.[item.selectedSize || ''] || 0)
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'hover:text-brand-orange'
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">€{item.price * item.quantity}</span>
                            <button 
                              onClick={() => onRemove(item.id, item.selectedSize, item.isGiftCard, item.giftCardId)}
                              className="p-1 text-brand-green/40 dark:text-dark-text/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-brand-green/10 dark:border-dark-border space-y-4 bg-white dark:bg-dark-card transition-colors duration-300">
                <div className="flex items-center justify-between text-xl font-semibold">
                  <span>{t.total}</span>
                  <span>€{total}</span>
                </div>
                <button 
                  onClick={() => {
                    onCheckout();
                    onClose();
                  }}
                  className="w-full bg-brand-green text-white py-4 rounded-full font-bold text-lg hover:bg-brand-orange transition-all active:scale-[0.98] shadow-lg shadow-brand-green/10"
                >
                  {t.checkout}
                </button>
                <p className="text-center text-xs text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest">
                  {t.secureCheckout}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
