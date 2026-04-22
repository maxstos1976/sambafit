import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Package, Clock, CreditCard, ShoppingBag, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { Button } from './ui/Button';

interface OrdersPageProps {
  onBack: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await orderApi.getMyOrders(user.token);
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
    'Ready to Ship': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Delivered: 'bg-brand-green/10 text-brand-green dark:bg-brand-lime/20 dark:text-brand-lime',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
    // Legacy/Lowercase fallbacks
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-brand-green/10 text-brand-green dark:bg-brand-lime/20 dark:text-brand-lime',
    canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-6 pt-32 pb-20 max-w-4xl"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-brand-green/60 hover:text-brand-orange transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.backToHome}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif italic font-bold tracking-tighter mb-4">
            {t.purchaseHistory}
          </h1>
          <p className="text-brand-green/60 font-medium">
            {user?.name}, aqui você pode acompanhar todos os seus pedidos realizados.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-brand-green/5 dark:bg-white/5 p-4 rounded-3xl border border-brand-green/10 dark:border-white/10">
          <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold dark:text-dark-text">{orders.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40">Total de Pedidos</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin" />
          <p className="text-brand-green/40 font-bold uppercase tracking-widest text-xs">Carregando histórico...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32 bg-brand-green/5 dark:bg-white/5 rounded-[40px] px-6">
          <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mx-auto mb-8">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-serif italic font-bold mb-4 dark:text-dark-text">Nenhum pedido ainda</h3>
          <p className="text-brand-green/60 max-w-sm mx-auto mb-10 font-medium">
            Parece que você ainda não realizou nenhuma compra. Explore nossas coleções e encontre seu look perfeito!
          </p>
          <Button onClick={onBack}>
            Explorar Coleção
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-white dark:bg-white/5 border border-brand-green/10 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              <div 
                className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-green/5 dark:bg-white/10 rounded-2xl flex items-center justify-center text-brand-green dark:text-dark-text">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold dark:text-dark-text uppercase tracking-tighter">#{order._id.slice(-6)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-green/40 dark:text-dark-text/40 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {formatDate(order.data_pedido)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto">
                  <div className="text-right">
                    <div className="text-2xl font-bold dark:text-dark-text">€{order.valor_total.toFixed(2)}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40 flex items-center justify-end gap-1">
                      <CreditCard className="w-3 h-3" />
                      {order.metodo_pagamento}
                    </div>
                  </div>
                  <div className="p-2 hover:bg-brand-green/5 dark:hover:bg-white/10 rounded-full text-brand-green dark:text-dark-text transition-colors">
                    {expandedOrder === order._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {expandedOrder === order._id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-brand-green/5 dark:border-white/5 bg-brand-green/[0.02] dark:bg-white/[0.02] p-6 md:p-8"
                >
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green/40 dark:text-dark-text/40 mb-6 underline decoration-brand-orange/30">Itens do Pedido</h4>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-brand-green/5 dark:bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-brand-green text-xl border border-brand-green/5">
                            {item.nome_produto?.[0] || 'P'}
                          </div>
                          <div>
                            <div className="font-bold dark:text-dark-text text-sm">{item.nome_produto}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40 mt-1">
                              Tamanho: <span className="text-brand-orange">{item.selectedSize}</span> • Quantidade: {item.quantidade}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-bold dark:text-dark-text">€{item.subtotal.toFixed(2)}</div>
                      </div>
                    ))}
                    
                    <div className="mt-8 pt-8 border-t border-brand-green/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green/40 dark:text-dark-text/40 mb-4">Informações de Entrega</h4>
                        <div className="text-sm space-y-1 dark:text-dark-text/70">
                          <p className="font-bold dark:text-dark-text text-xs uppercase tracking-wide">{order.shipping?.status_envio === 'shipped' ? 'Enviado' : 'Aguardando Envio'}</p>
                          {order.shipping?.codigo_rastreamento && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mt-2">Código: {order.shipping.codigo_rastreamento}</p>
                          )}
                        </div>
                      </div>
                      <div className="bg-brand-green/5 dark:bg-white/5 p-6 rounded-3xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40">Pagamento</span>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${statusColors[order.status_pagamento as keyof typeof statusColors] || 'bg-gray-100'}`}>
                            {order.status_pagamento}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold dark:text-dark-text">
                          <span>Total Pago</span>
                          <span className="text-brand-orange">€{order.valor_total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
