import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const SoulSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-white dark:bg-dark-card overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="aspect-square rounded-full overflow-hidden border-8 border-brand-lime/30"
            >
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" 
                alt="Brazilian Soul" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -z-10" />
          </div>

          <div className="space-y-8">
            <span className="text-brand-orange font-bold uppercase tracking-[0.3em] text-sm">{t.ourEssence}</span>
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
              {t.moreThanActivewear.split(' ')[0]} {t.moreThanActivewear.split(' ')[1]} <br />
              <span className="italic">{t.moreThanActivewear.split(' ').slice(2).join(' ')}</span>
            </h2>
            <p className="text-xl text-brand-green/70 leading-relaxed">
              {t.essenceDescription1}
            </p>
            <p className="text-lg text-brand-green/60">
              {t.essenceDescription2}
            </p>
            <div className="pt-4">
              <button className="group flex items-center gap-4 text-brand-green font-bold uppercase tracking-widest text-sm">
                {t.exploreHeritage}
                <span className="w-12 h-[2px] bg-brand-green group-hover:w-20 group-hover:bg-brand-orange transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
