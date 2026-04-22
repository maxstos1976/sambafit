import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { productApi } from '../services/api';
import { Product } from '../types';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini with safety check
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const WhatsAppChat: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // WhatsApp configuration
  const whatsappNumber = "+34900000000"; // Replace with real number or get from config
  const defaultWelcome = {
    pt: (name?: string) => `Olá${name ? ' ' + name : ''}! Como podemos ajudar você hoje na SambaFit? 🌴`,
    en: (name?: string) => `Hello${name ? ' ' + name : ''}! How can we help you today at SambaFit? 🌴`,
    es: (name?: string) => `¡Hola${name ? ' ' + name : ''}! ¿Cómo podemos ayudarte hoy en SambaFit? 🌴`,
    ca: (name?: string) => `Hola${name ? ' ' + name : ''}! Com et podem ajudar avui a SambaFit? 🌴`
  };

  useEffect(() => {
    // Reset and initialize welcome message when user session or language changes
    const welcomeFn = defaultWelcome[language as keyof typeof defaultWelcome] || defaultWelcome.pt;
    setMessages([{ 
      role: 'assistant', 
      content: welcomeFn(user?.name) 
    }]);
  }, [user?._id, language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }

      // Get products for context
      let productContext = '';
      try {
        const products = await productApi.getAll();
        productContext = products.map(p => `- ${p.name}: ${p.description} (${p.price}€, ${p.color})`).join('\n');
      } catch (pErr) {
        console.error('Failed to get products for context:', pErr);
      }

      // AI Response with Gemini
      // Ensure history starts with 'user' role or is empty
      const history = messages.length > 1 
        ? messages.slice(1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        : [];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `Você é o SambaFit Assistant, um atendente virtual de uma loja de activewear (moda fitness) premium que une o Brasil e a Catalunha.
          
          DIRETRIZES CRÍTICAS:
          1. DETECTAR IDIOMA: Identifique o idioma em que o cliente está falando e responda EXATAMENTE no mesmo idioma. Se ele mudar de idioma, você muda também. Idiomas suportados: Português, Inglês, Espanhol e Catalão.
          2. CONTEXTO DO PRODUTO: Use estas informações sobre nossos produtos atuais se o cliente perguntar:\n${productContext}
          3. PERSONA: Seja enérgico, calmo, brasileiro-europeu, elegante e prestativo.
          4. INFORMAÇÕES ADICIONAIS: 
             - Envio: 3-5 dias úteis para toda Europa.
             - Preço: Opções a partir de 38€.
             - Localização: Alma carioca, fabricação catalã (Catalunya).
          5. WHATSAPP: Se a dúvida for complexa ou o cliente quiser atendimento humano, sugira clicar no botão de WhatsApp abaixo.
          6. FORMATO: Responda de forma concisa (máximo 3 parágrafos). Use emojis tropicais 🌴🌊🧘‍♀️.`,
        }
      });

      const botMessage = response.text || "Desculpe, tive um probleminha técnico. Poderia repetir?";
      setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Ops! Estou com uma instabilidade técnica momentânea. Você pode me chamar no WhatsApp clicando no botão abaixo? 🌴" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const openWhatsApp = () => {
    const text = "Olá SambaFit! Gostaria de tirar algumas dúvidas.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 md:w-96 bg-white dark:bg-dark-card rounded-[2rem] shadow-2xl border border-brand-green/5 dark:border-white/5 overflow-hidden flex flex-col mb-2"
          >
            {/* Header */}
            <div className="bg-brand-green p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">SambaFit Assistant</h4>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[400px] min-h-[300px] space-y-4 bg-brand-lime/5 dark:bg-black/20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-brand-orange text-white rounded-tr-none shadow-md' 
                      : 'bg-white dark:bg-dark-border text-brand-green dark:text-dark-text rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-dark-border p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-4 bg-white dark:bg-dark-card border-t border-brand-green/5 dark:border-white/5">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escreva sua mensagem..."
                  className="flex-1 bg-brand-lime/10 dark:bg-white/5 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
                <button type="submit" className="p-2 bg-brand-green text-white rounded-full hover:bg-brand-orange transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <button 
                onClick={openWhatsApp}
                className="w-full mt-3 py-2 bg-[#25D366] text-white rounded-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-green text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-orange transition-all relative"
      >
        <MessageCircle className={`w-7 h-7 transition-transform ${isOpen ? 'scale-0' : 'scale-100'}`} />
        <X className={`w-7 h-7 absolute transition-transform ${isOpen ? 'scale-100' : 'scale-0'}`} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange rounded-full border-2 border-white dark:border-dark-card animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};
