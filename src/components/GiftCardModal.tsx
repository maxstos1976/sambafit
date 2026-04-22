import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Calendar, Send, MessageSquare, Phone, Mail, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onConfirm: (details: any) => void;
}

export const GiftCardModal: React.FC<GiftCardModalProps> = ({ isOpen, onClose, amount, onConfirm }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientWhatsApp: '',
    message: '',
    isScheduled: false,
    scheduledDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-green/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-brand-green/10"
        >
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-lime/20 rounded-2xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-brand-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-green tracking-tight">Personalize seu Presente</h2>
                  <p className="text-brand-green/50 font-medium">Cartão Presente de €{amount}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green hover:bg-brand-orange hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recipient Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-1">Nome do presenteado</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/40" />
                    <input
                      required
                      type="text"
                      value={formData.recipientName}
                      onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                      placeholder="Ex: Maria Silva"
                      className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-brand-green"
                    />
                  </div>
                </div>

                {/* Recipient Email */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-1">E-mail para envio</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/40" />
                    <input
                      required
                      type="email"
                      value={formData.recipientEmail}
                      onChange={e => setFormData({ ...formData, recipientEmail: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-brand-green"
                    />
                  </div>
                </div>

                {/* Recipient WhatsApp */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-1">WhatsApp (Opcional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/40" />
                    <input
                      type="tel"
                      value={formData.recipientWhatsApp}
                      onChange={e => setFormData({ ...formData, recipientWhatsApp: e.target.value })}
                      placeholder="+34 000 000 000"
                      className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-brand-green"
                    />
                  </div>
                </div>

                {/* Delivery Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-1">Quando enviar?</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-green/40" />
                    <select
                      value={formData.isScheduled ? 'scheduled' : 'now'}
                      onChange={e => setFormData({ ...formData, isScheduled: e.target.value === 'scheduled' })}
                      className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-brand-green appearance-none"
                    >
                      <option value="now">Enviar agora (após confirmação)</option>
                      <option value="scheduled">Agendar envio</option>
                    </select>
                  </div>
                </div>
              </div>

              {formData.isScheduled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-1">Data do agendamento</label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.scheduledDate}
                    onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-brand-green"
                  />
                </motion.div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-1">Mensagem para o presenteado</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-brand-green/40" />
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Sua mensagem pessoal aqui..."
                    className="w-full bg-brand-green/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand-orange/50 transition-all font-medium text-brand-green resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-green text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    'Processando...'
                  ) : (
                    <>
                      Confirmar e Adicionar à Bag
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
