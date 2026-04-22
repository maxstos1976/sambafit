
import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';

interface SupportPageProps {
  title: string;
  content: string;
  onBack: () => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ title, content, onBack }) => {
  const { t } = useLanguage();

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

      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-serif italic font-bold mb-12 tracking-tighter">
          {title}
        </h1>
        <div className="prose prose-lg prose-brand-green">
          <p className="text-xl text-brand-green/70 leading-relaxed">
            {content}
          </p>
          {/* Placeholder for more detailed content if needed */}
          <div className="mt-12 p-8 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
            <p className="text-sm text-brand-green/60 font-medium">
              {t.essenceDescription2.split('.')[0]}.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
