
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string; country: string }[] = [
  { 
    code: 'ca', 
    label: 'Català', 
    flag: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Catalonia.svg', 
    country: 'Catalunya' 
  },
  { 
    code: 'es', 
    label: 'Castellano', 
    flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg', 
    country: 'España' 
  },
  { 
    code: 'pt', 
    label: 'Português', 
    flag: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg', 
    country: 'Brasil' 
  },
  { 
    code: 'en', 
    label: 'English', 
    flag: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg', 
    country: 'USA' 
  },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleLanguageChange = async (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    
    // Sync with profile if user is logged in
    if (user) {
      try {
        await updateProfile({ preferredLanguage: code });
      } catch (error) {
        console.error('Failed to sync language preference:', error);
      }
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-brand-green/5 dark:hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest dark:text-dark-text"
      >
        <div className="w-5 h-3.5 overflow-hidden rounded-sm border border-brand-green/10 dark:border-dark-border flex-shrink-0">
          <img 
            src={currentLang.flag} 
            alt={currentLang.country} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
        <span className="hidden md:inline">{currentLang.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl shadow-xl overflow-hidden z-50 p-2"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    language === lang.code 
                      ? 'bg-brand-green text-white' 
                      : 'hover:bg-brand-green/5 dark:hover:bg-white/5 text-brand-green dark:text-dark-text'
                  }`}
                >
                  <div className="w-6 h-4 overflow-hidden rounded-sm border border-brand-green/10 dark:border-dark-border flex-shrink-0">
                    <img 
                      src={lang.flag} 
                      alt={lang.country} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">{lang.label}</span>
                    <span className={`text-[10px] uppercase tracking-tighter ${language === lang.code ? 'text-white/70' : 'text-brand-green/40 dark:text-dark-text/40'}`}>
                      {lang.country}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
