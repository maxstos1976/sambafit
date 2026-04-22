
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { giftCardApi, cartApi } from '../services/api';
import { ArrowLeft, Gift } from 'lucide-react';
import { GiftCardModal } from './GiftCardModal';

interface GiftCardPageProps {
  onBack: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const GiftCardPage: React.FC<GiftCardPageProps> = ({ onBack, onOpenCart, onOpenAuth }) => {
  const { t } = useLanguage();
  const { user, addToCart } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const amounts = [30, 50, 100, 150, 200, 250];

  const handleAmountSelect = (amount: number) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setSelectedAmount(amount);
    setIsModalOpen(true);
  };

  const handleConfirmGiftCard = async (details: any) => {
    if (!user || !selectedAmount) return;

    try {
      // 1. Create Draft on DB
      const draft = await giftCardApi.createDraft(user.token, {
        value: selectedAmount,
        ...details
      });

      // 2. Add to Bag with Draft ID (via context to update state immediately)
      await addToCart('', 1, undefined, true, draft._id);
      
      setIsModalOpen(false);
      onOpenCart();
    } catch (err) {
      console.error('Error creating gift card:', err);
      alert('Erro ao criar cartão presente. Tente novamente.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-32 pb-20 container mx-auto px-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-brand-green/60 hover:text-brand-orange transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backToHome}
      </button>

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-serif italic font-bold mb-6 tracking-tighter">
          {t.giftCardTitle}
        </h1>
        <p className="text-xl text-brand-green/70 max-w-2xl mx-auto">
          {t.giftCardDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {amounts.map((amount) => (
          <motion.div
            key={amount}
            whileHover={{ y: -10 }}
            className="bg-white rounded-3xl p-8 border border-brand-green/5 shadow-xl shadow-brand-green/5 flex flex-col items-center space-y-6 group"
          >
            <div className="w-20 h-20 bg-brand-lime/20 rounded-full flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
              <Gift className="w-10 h-10 text-brand-green group-hover:text-brand-orange transition-colors" />
            </div>
            <div className="text-4xl font-bold text-brand-green">€{amount}</div>
            <button 
              onClick={() => handleAmountSelect(amount)}
              className="w-full bg-brand-green text-white py-4 rounded-full font-bold hover:bg-brand-orange transition-all active:scale-95"
            >
              Comprar
            </button>
          </motion.div>
        ))}
      </div>

      <GiftCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={selectedAmount || 0}
        onConfirm={handleConfirmGiftCard}
      />
    </motion.div>
  );
};
