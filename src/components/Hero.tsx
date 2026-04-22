import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

interface HeroProps {
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollTo }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/587860113e00be246e9fa173/1621656213950-E8TCE1AUMHZ8JS6XXWTW/sunrise-rio-de-janeiro-landscape-photography-morning-photographer-brasil-brazil.jpg"
          alt="Brazilian Landscape" 
          className="w-full h-full object-cover opacity-70 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white/40 dark:from-dark-bg/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-warm-white/30 dark:to-dark-bg/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {user && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-[0.2em] mb-4 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.hello}, {user.name}</span>
              </motion.div>
            )}
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-lime text-brand-green dark:text-[#006241] text-xs font-bold uppercase tracking-[0.2em] mb-6">
              {t.newCollection}
            </span>
            <h1 className="text-7xl md:text-9xl font-serif italic font-bold leading-[0.85] tracking-tighter mb-8 text-balance text-contrast">
              {t.performanceWithSoul.split(' ')[0]} <br />
              <span className="text-brand-orange">{t.performanceWithSoul.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold max-w-xl mb-10 text-brand-green leading-relaxed text-contrast">
              {t.heroDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => onScrollTo('products')}
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              >
                {t.shopCollection}
              </Button>
              <Button 
                onClick={() => onScrollTo('soul')}
                variant="outline"
                size="lg"
                className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-md"
              >
                {t.ourStory}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 right-12 hidden lg:block"
      >
        <Button 
          onClick={() => onScrollTo('products')}
          variant="ghost"
          size="sm"
          className="flex items-center gap-4 group origin-right"
        >
          <span className="w-12 h-[1px] bg-brand-green/30 group-hover:bg-brand-orange/50 transition-colors" />
          {t.scrollToExplore}
        </Button>
      </motion.div>
    </section>
  );
};
