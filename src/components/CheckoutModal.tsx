
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Wallet, Smartphone, Check, Loader2, Globe, Tag, Sparkles, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { fetchExchangeRates, formatCurrency } from '../services/currencyService';
import { orderApi, giftCardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
  onRemoveItem?: (id: string, size?: string, isGiftCard?: boolean, giftCardId?: string) => void;
}

type PaymentMethod = 'credit_card' | 'paypal' | 'bizum';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, items, onSuccess, onRemoveItem }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currency, setCurrency] = useState('EUR');
  const [rates, setRates] = useState<Record<string, number>>({ EUR: 1 });
  const [isConverting, setIsConverting] = useState(false);

  // Gift Card State
  const [giftCardCode, setGiftCardCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingGiftCard, setIsValidatingGiftCard] = useState(false);
  const [appliedGiftCardCode, setAppliedGiftCardCode] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const allGiftCards = items.length > 0 && items.every(item => item.isGiftCard);
  const shippingCost = allGiftCards ? 0 : 5.99;
  const totalBeforeDiscount = subtotal + shippingCost;
  const finalTotalEUR = Math.max(0, totalBeforeDiscount - discountAmount);

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    setIsValidatingGiftCard(true);
    try {
      const gc = await giftCardApi.validate(giftCardCode);
      setDiscountAmount(gc.balance);
      setAppliedGiftCardCode(giftCardCode);
      alert(`${t.giftCard} aplicado com sucesso! Saldo disponível: €${gc.balance.toFixed(2)}`);
    } catch (err: any) {
      alert(err.message || 'Erro ao validar cartão presente');
      setDiscountAmount(0);
      setAppliedGiftCardCode(null);
    } finally {
      setIsValidatingGiftCard(false);
    }
  };

  useEffect(() => {
    const loadRates = async () => {
      const fetchedRates = await fetchExchangeRates();
      setRates(fetchedRates);
    };
    loadRates();
  }, []);

  const handleCurrencyChange = (newCurrency: string) => {
    setIsConverting(true);
    setCurrency(newCurrency);
    setTimeout(() => setIsConverting(false), 500);
  };

  const convertedTotal = finalTotalEUR * (rates[currency] || 1);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(t.loginToFavorite);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate payment processing if there's still a balance
      if (finalTotalEUR > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.isGiftCard ? null : (item._id || item.id),
          isGiftCard: item.isGiftCard,
          giftCardId: item.giftCardId,
          nome_produto: item.name,
          quantidade: item.quantity,
          preco_unitario: item.price,
          desconto_unitario: 0,
          subtotal: item.price * item.quantity,
          selectedSize: item.selectedSize
        })),
        valor_total: finalTotalEUR,
        desconto: discountAmount,
        giftCardCode: appliedGiftCardCode,
        moeda: 'EUR',
        metodo_pagamento: finalTotalEUR === 0 ? 'gift_card' : paymentMethod,
        status_pagamento: 'paid',
        codigo_transacao_pagamento: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        shipping: {
          address_id: 'Default',
          endereco: user.deliveryAddress,
          metodo_envio: 'standard',
          custo_envio: shippingCost,
          status_envio: 'pending'
        }
      };

      await orderApi.create(user.token, orderData);

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error creating order:', err);
      alert(t.paymentError);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
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
          className="relative w-full max-w-4xl bg-warm-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 text-brand-green/40 hover:text-brand-orange transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Order Summary */}
          <div className="w-full md:w-5/12 bg-brand-lime/10 p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-serif italic font-bold text-brand-green mb-8">{t.orderSummary}</h2>
            
            <div className="space-y-6 mb-8">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-brand-green/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-brand-green truncate pr-2">{item.name}</h4>
                      {onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item._id || item.id, item.selectedSize, item.isGiftCard, item.giftCardId)}
                          className="text-brand-green/20 hover:text-red-500 transition-colors p-1"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-brand-green/60 font-medium">
                      {item.quantity}x • {item.selectedSize || 'OS'} • {item.color}
                    </p>
                    <p className="font-bold text-brand-green mt-1">€{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-green/10">
              {/* Gift Card Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 ml-1">Possui um Cartão Presente?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-green/40" />
                    <input
                      type="text"
                      value={giftCardCode}
                      onChange={e => setGiftCardCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO"
                      className="w-full bg-white border border-brand-green/10 rounded-xl py-3 pl-8 pr-3 text-xs focus:ring-2 focus:ring-brand-orange/50 transition-all font-bold tracking-widest"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyGiftCard}
                    disabled={isValidatingGiftCard || !giftCardCode.trim()}
                    className="bg-brand-green text-white px-4 rounded-xl text-xs font-bold hover:bg-brand-orange transition-all disabled:opacity-50"
                  >
                    {isValidatingGiftCard ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APLICAR'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-brand-green/60 font-medium pt-2">
                <span>{t.subtotal}</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-green/60 font-medium">
                <span>{t.shippingCost}</span>
                <span>€{shippingCost.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between text-brand-orange font-bold text-sm"
                >
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Desconto Cartão Presente</span>
                  <span>-€{discountAmount.toFixed(2)}</span>
                </motion.div>
              )}

              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-bold text-brand-green">{t.total}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-orange">
                    {isConverting ? (
                      <span className="flex items-center gap-2 text-sm animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" /> {t.converting}
                      </span>
                    ) : (
                      formatCurrency(convertedTotal, currency)
                    )}
                  </div>
                  {currency !== 'EUR' && (
                    <p className="text-[10px] text-brand-green/40 font-bold uppercase tracking-widest mt-1">
                      {t.conversionRate}: 1 EUR = {rates[currency]?.toFixed(4)} {currency}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="mt-8 p-4 bg-white/50 rounded-2xl border border-brand-green/5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-green/40 mb-3">
                <Globe className="w-3 h-3" />
                {t.currency}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['EUR', 'USD', 'BRL', 'GBP', 'JPY', 'MXN'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => handleCurrencyChange(curr)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      currency === curr 
                        ? 'bg-brand-green text-white shadow-md' 
                        : 'bg-white text-brand-green/60 hover:bg-brand-lime/20'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="w-full md:w-7/12 p-8 md:p-12 overflow-y-auto">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif italic font-bold text-brand-green">{t.paymentSuccess}</h2>
                <p className="text-brand-green/60 font-medium">Redirecting you back...</p>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-8">
                <div>
                  <h2 className="text-3xl font-serif italic font-bold text-brand-green mb-8">{t.checkoutTitle}</h2>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">{t.paymentMethod}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === 'credit_card' 
                            ? 'border-brand-orange bg-brand-orange/5 text-brand-orange' 
                            : 'border-brand-green/5 text-brand-green/40 hover:border-brand-green/20'
                        }`}
                      >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.creditCard}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === 'paypal' 
                            ? 'border-brand-orange bg-brand-orange/5 text-brand-orange' 
                            : 'border-brand-green/5 text-brand-green/40 hover:border-brand-green/20'
                        }`}
                      >
                        <Wallet className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.paypal}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bizum')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === 'bizum' 
                            ? 'border-brand-orange bg-brand-orange/5 text-brand-orange' 
                            : 'border-brand-green/5 text-brand-green/40 hover:border-brand-green/20'
                        }`}
                      >
                        <Smartphone className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t.bizum}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-green/60 ml-2">{t.cardNumber}</label>
                      <input
                        required
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-6 py-4 bg-brand-lime/10 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-green/60 ml-2">{t.expiryDate}</label>
                        <input
                          required
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-6 py-4 bg-brand-lime/10 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-green/60 ml-2">{t.cvv}</label>
                        <input
                          required
                          type="text"
                          placeholder="000"
                          className="w-full px-6 py-4 bg-brand-lime/10 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'paypal' || paymentMethod === 'bizum') && (
                  <div className="p-8 bg-brand-lime/10 rounded-3xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                      {paymentMethod === 'paypal' ? <Wallet className="w-8 h-8 text-blue-600" /> : <Smartphone className="w-8 h-8 text-brand-green" />}
                    </div>
                    <p className="text-brand-green/60 font-medium">
                      {paymentMethod === 'paypal' 
                        ? 'You will be redirected to PayPal to complete your purchase securely.' 
                        : 'Open your Bizum app and authorize the payment to SambaFit.'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-brand-green text-white rounded-full font-bold text-xl shadow-2xl shadow-brand-green/20 hover:bg-brand-orange transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-6 h-6" />
                      {t.payNow}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-brand-green/40 font-bold uppercase tracking-widest">
                  Secure encrypted payment processing
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
