
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Package, 
  Database, 
  BarChart3,
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Check, 
  Loader2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckSquare,
  Square,
  Download,
  FileSpreadsheet,
  Tag,
  Gift,
  Mail
} from 'lucide-react';
import { adminApi, productApi, analyticsApi, collectionApi, categoryApi, orderApi, giftCardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, Collection, Category } from '../types';
import { useSocket } from '../context/SocketContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface AdminDashboardProps {
  onProductUpdate?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onProductUpdate }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'system' | 'reports' | 'collections' | 'categories' | 'orders' | 'giftCards'>('products');
  
  // Gestão de Produtos
  const [products, setProducts] = useState<Product[]>([]);
  
  // Gestão de Usuários
  const [users, setUsers] = useState<any[]>([]);
  
  // Gestão de Pedidos
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  // Gestão de Cartões Presente
  const [giftCards, setGiftCards] = useState<any[]>([]);
  
  // Gestão de Coleções
  const [collections, setCollections] = useState<Collection[]>([]);
  
  // Gestão de Categorias
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Relatórios e Análises
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [adjustingGiftCard, setAdjustingGiftCard] = useState<any | null>(null);
  const [detailedReport, setDetailedReport] = useState<any>(null);
  const [funnelData, setFunnelData] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [reportFilters, setReportFilters] = useState({
    size: '',
    sortBy: 'totalSold',
    order: 'desc'
  });
  // Configurações de Backup
  const [selectedBackupCollections, setSelectedBackupCollections] = useState<string[]>(['users', 'products', 'orders', 'categories', 'collections', 'newsletter', 'analytics']);

  const handleSeed = async () => {
    if (!user) return;
    if (!confirm('Isso irá apagar dados atuais e gerar novos dados de teste para relatórios. Deseja continuar?')) return;
    
    setIsLoading(true);
    try {
      await adminApi.seedDatabase();
      alert('Base de dados semeada com sucesso!');
      await fetchData();
      if (onProductUpdate) onProductUpdate();
    } catch (err: any) {
      console.error('Erro ao semear:', err);
      alert('Falha ao semear base de dados: ' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  // Efeitos e Real-time
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (payload: { type: string; data?: any }) => {
      console.log('Real-time update received:', payload);
      
      // If we are on the reports tab, refresh stats for any data change
      if (activeTab === 'reports') {
        fetchData();
      } else {
        // Refresh specific tab if it matches the update type
        if (payload.type === activeTab) {
          fetchData();
        }
        // Always refresh collections/categories for other tabs as they are dependencies
        if (payload.type === 'collections' || payload.type === 'categories') {
          fetchData();
        }
      }

      // If a product was updated, notify the parent for global refreshes
      if (payload.type === 'products' && onProductUpdate) {
        onProductUpdate();
      }
    };

    socket.on('data_update', handleUpdate);

    return () => {
      socket.off('data_update', handleUpdate);
    };
  }, [socket, activeTab, onProductUpdate]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Always fetch collections and categories as they are needed for products tab too
      const collectionsData = await collectionApi.getAll();
      setCollections(collectionsData);
      const categoriesData = await categoryApi.getAll();
      setCategories(categoriesData);

      if (activeTab === 'products') {
        const data = await productApi.getAll();
        setProducts(data);
      } else if (activeTab === 'users') {
        const data = await adminApi.getUsers(user.token);
        setUsers(data);
      } else if (activeTab === 'orders') {
        const data = await orderApi.getAll(user.token);
        setOrders(data);
      } else if (activeTab === 'giftCards') {
        const data = await giftCardApi.getAll(user.token);
        setGiftCards(data);
      } else if (activeTab === 'collections') {
        // collections already fetched at start of function
      } else if (activeTab === 'categories') {
        // categories already fetched at start of function
      } else if (activeTab === 'reports') {
        const statsData = await adminApi.getStats(user.token);
        setStats(statsData);
        const reportData = await adminApi.getDetailedReport(user.token, reportFilters);
        setDetailedReport(reportData);
        const funnel = await analyticsApi.getFunnel(user.token);
        setFunnelData(funnel);
        const heatmap = await analyticsApi.getHeatmap(user.token);
        setHeatmapData(heatmap);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Configurações de Backup
  const handleBackup = async (full: boolean = true) => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const colls = full ? '' : selectedBackupCollections.join(',');
      const url = `/api/backup/download?${colls ? `collections=${colls}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) throw new Error('Falha ao gerar backup');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `backup_${full ? 'completo' : 'selecionado'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleBackupCollection = (coll: string) => {
    setSelectedBackupCollections(prev => 
      prev.includes(coll) ? prev.filter(c => c !== coll) : [...prev, coll]
    );
  };

  // Gestão de Produtos
  const handleDeleteProduct = async (id: string) => {
    if (!user || !confirm('Excluir este produto?')) return;
    try {
      await productApi.delete(user.token, id);
      setProducts(products.filter(p => p._id !== id));
      if (onProductUpdate) onProductUpdate();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Gestão de Usuários
  const handleDeleteUser = async (id: string) => {
    if (!user || !confirm('Excluir este usuário?')) return;
    try {
      await adminApi.deleteUser(user.token, id);
      setUsers(users.filter(u => u._id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    if (!user) return;
    try {
      await adminApi.updateUserRole(user.token, id, role);
      setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Relatórios e Análises
  const refreshReport = async () => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const reportData = await adminApi.getDetailedReport(user.token, reportFilters);
      setDetailedReport(reportData);
    } catch (error: any) {
      console.error('Error refreshing report:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      refreshReport();
    }
  }, [reportFilters]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingProduct) return;
    setIsActionLoading(true);
    try {
      if (isAddingProduct) {
        const newProduct = await productApi.create(user.token, editingProduct);
        setProducts([...products, newProduct]);
      } else {
        const updatedProduct = await productApi.update(user.token, editingProduct._id!, editingProduct);
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
      if (onProductUpdate) onProductUpdate();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Gestão de Coleções
  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingCollection) return;
    setIsActionLoading(true);
    try {
      if (isAddingCollection) {
        const newCollection = await collectionApi.create(user.token, editingCollection);
        setCollections([...collections, newCollection]);
      } else {
        const updatedCollection = await collectionApi.update(user.token, editingCollection._id!, editingCollection);
        setCollections(collections.map(c => c._id === updatedCollection._id ? updatedCollection : c));
      }
      setEditingCollection(null);
      setIsAddingCollection(false);
      if (onProductUpdate) onProductUpdate();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!user || !confirm('Excluir esta coleção?')) return;
    try {
      await collectionApi.delete(user.token, id);
      setCollections(collections.filter(c => c._id !== id));
      if (onProductUpdate) onProductUpdate();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Gestão de Categorias
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingCategory) return;
    setIsActionLoading(true);
    try {
      if (isAddingCategory) {
        const newCategory = await categoryApi.create(user.token, editingCategory);
        setCategories([...categories, newCategory]);
      } else {
        const updatedCategory = await categoryApi.update(user.token, editingCategory._id!, editingCategory);
        setCategories(categories.map(c => c._id === updatedCategory._id ? updatedCategory : c));
      }
      setEditingCategory(null);
      setIsAddingCategory(false);
      if (onProductUpdate) onProductUpdate();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user || !confirm('Excluir esta categoria?')) return;
    try {
      await categoryApi.delete(user.token, id);
      setCategories(categories.filter(c => c._id !== id));
      if (onProductUpdate) onProductUpdate();
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Gestão de Pedidos
  const handleUpdateOrderStatus = async (id: string, status?: string, status_envio?: string, codigo_rastreamento?: string) => {
    if (!user) return;
    try {
      await orderApi.updateStatus(user.token, id, status, status_envio, codigo_rastreamento);
      setOrders(orders.map(o => {
        if (o._id === id) {
          const updated = { ...o };
          if (status) updated.status = status;
          if (status_envio) updated.shipping.status_envio = status_envio;
          if (codigo_rastreamento !== undefined) updated.shipping.codigo_rastreamento = codigo_rastreamento;
          return updated;
        }
        return o;
      }));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!user) return;
    if (!confirm('Deseja realmente excluir este pedido?')) return;
    
    setIsActionLoading(true);
    try {
      await orderApi.delete(user.token, id);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteSelectedOrders = async () => {
    if (!user || selectedOrderIds.length === 0) return;
    if (!confirm(`Deseja realmente excluir os ${selectedOrderIds.length} pedidos selecionados?`)) return;
    
    setIsActionLoading(true);
    try {
      await orderApi.deleteMultiple(user.token, selectedOrderIds);
      setSelectedOrderIds([]);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteAllOrders = async () => {
    if (!user) return;
    if (!confirm('Deseja realmente excluir TODOS os pedidos do banco de dados? Esta ação é irreversível.')) return;
    
    setIsActionLoading(true);
    try {
      await orderApi.deleteAll(user.token);
      setSelectedOrderIds([]);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const toggleAllOrdersSelection = () => {
    if (selectedOrderIds.length === orders.length && orders.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map(o => o._id));
    }
  };

  // Gestão de Cartões Presente
  const handleResendGiftCardEmail = async (id: string) => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const res = await giftCardApi.resendEmail(user.token, id);
      alert(res.message);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteGiftCard = async (id: string) => {
    const gc = giftCards.find(g => g._id === id);
    if (!gc) {
      console.warn('Cartão não encontrado no estado local:', id);
      return;
    }

    const code = gc.code || 'DRAFT';
    const message = `Excluir permanentemente o cartão [${code}]? Esta ação removerá o registro definitivamente do banco de dados e não pode ser desfeita.`;
    
    if (!user || isActionLoading || !window.confirm(message)) return;
    
    setIsActionLoading(true);
    try {
      console.log('Iniciando exclusão do cartão:', id);
      const response = await giftCardApi.delete(user.token, id);
      
      if (response.success || response.deletedId) {
        setGiftCards(prev => prev.filter(g => g._id !== id));
        alert(response.message || 'Cartão presente excluído permanentemente.');
        // Se o modal de ajuste estiver aberto para este cartão, fecha-o
        if (adjustingGiftCard?._id === id) setAdjustingGiftCard(null);
      } else {
        throw new Error(response.message || 'Erro inesperado ao excluir o cartão.');
      }
    } catch (error: any) {
      console.error('Falha na exclusão front-end:', error);
      alert(error.message || 'Ocorreu um erro ao tentar excluir o cartão.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAdjustGiftCardBalance = (id: string) => {
    const current = giftCards.find(g => g._id === id);
    if (current) {
      setAdjustingGiftCard({ ...current });
    }
  };

  const handleSaveGiftCardBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !adjustingGiftCard) return;
    setIsActionLoading(true);
    try {
      await giftCardApi.update(user.token, adjustingGiftCard._id, { balance: Number(adjustingGiftCard.balance) });
      setGiftCards(prev => prev.map(g => g._id === adjustingGiftCard._id ? { ...g, balance: Number(adjustingGiftCard.balance) } : g));
      setAdjustingGiftCard(null);
      alert('Saldo atualizado com sucesso!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBlockGiftCard = async (id: string) => {
    if (!user) return;
    const current = giftCards.find(g => g._id === id);
    if (!current) return;
    
    const newStatus = current.status === 'blocked' ? 'active' : 'blocked';
    
    try {
      await giftCardApi.update(user.token, id, { status: newStatus });
      setGiftCards(prev => prev.map(g => g._id === id ? { ...g, status: newStatus } : g));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleExportGiftCards = () => {
    const headers = ['Código', 'Data', 'Destinatário', 'Email', 'Valor', 'Saldo', 'Status'];
    const rows = giftCards.map(gc => [
      gc.code || 'DRAFT',
      new Date(gc.createdAt).toLocaleDateString(),
      gc.recipientName,
      gc.recipientEmail,
      `€${gc.value}`,
      `€${gc.balance}`,
      gc.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cartoes_presente_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <Button
            onClick={() => setActiveTab('products')}
            variant={activeTab === 'products' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'products' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<Package className="w-5 h-5" />}
          >
            Produtos
          </Button>
          <Button
            onClick={() => setActiveTab('collections')}
            variant={activeTab === 'collections' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'collections' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<Database className="w-5 h-5" />}
          >
            Coleções
          </Button>
          <Button
            onClick={() => setActiveTab('categories')}
            variant={activeTab === 'categories' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'categories' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<Tag className="w-5 h-5" />}
          >
            Categorias
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'users' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<Users className="w-5 h-5" />}
          >
            Usuários
          </Button>
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'orders' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<CheckSquare className="w-5 h-5" />}
          >
            Pedidos
          </Button>
          <Button
            onClick={() => setActiveTab('giftCards')}
            variant={activeTab === 'giftCards' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'giftCards' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<Gift className="w-5 h-5" />}
          >
            Cartões Presente
          </Button>
          <Button
            onClick={() => setActiveTab('reports')}
            variant={activeTab === 'reports' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'reports' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<BarChart3 className="w-5 h-5" />}
          >
            Relatórios
          </Button>
          <Button
            onClick={() => setActiveTab('system')}
            variant={activeTab === 'system' ? 'primary' : 'ghost'}
            className={cn(
              "w-full flex justify-start gap-3 px-6 py-4 rounded-2xl transition-all",
              activeTab !== 'system' && "bg-white dark:bg-dark-card text-brand-green dark:text-dark-text hover:bg-brand-lime/20"
            )}
            leftIcon={<Database className="w-5 h-5" />}
          >
            Sistema
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl p-8 border border-brand-green/5 dark:border-dark-border">
          
          {/* Gestão de Produtos */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Gestão de Produtos</h2>
                <Button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      price: 0,
                      category: 'Tops',
                      image: '',
                      description: '',
                      color: '',
                      collection: '',
                      sizes: ['S', 'M', 'L'],
                      stock: { 'S': 10, 'M': 10, 'L': 10 }
                    } as any);
                    setIsAddingProduct(true);
                  }}
                  variant="secondary"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Novo Produto
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Produto</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Categoria</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Preço</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Stock</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                      {products.map((product) => (
                        <tr key={product._id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" loading="lazy" />
                              <div className="flex flex-col">
                                <span className="font-bold text-brand-green dark:text-dark-text">{product.name}</span>
                                {product.collection && (
                                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-brand-orange text-white dark:bg-white dark:text-black w-fit">
                                    {product.collection}
                                  </span>
                                )}
                              </div>
                              {Object.values(product.stock || {}).every(val => Number(val) === 0) && (
                                <span className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                  Sem Stock
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-brand-green/60 dark:text-dark-text/60">{product.category}</td>
                          <td className="py-4 font-bold">€{product.price}</td>
                          <td className="py-4">
                            <div className="flex gap-1">
                              {Object.entries(product.stock || {}).map(([size, count]) => (
                                <span key={size} className="text-[10px] bg-brand-lime/20 px-1.5 py-0.5 rounded">{size}:{count}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsAddingProduct(false);
                                }}
                                className="p-2 text-brand-green/40 hover:text-brand-orange transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id!)}
                                className="p-2 text-brand-green/40 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gestão de Coleções */}
          {activeTab === 'collections' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Gestão de Coleções</h2>
                <Button
                  onClick={() => {
                    setEditingCollection({
                      name: '',
                      description: '',
                      active: true
                    } as any);
                    setIsAddingCollection(true);
                  }}
                  variant="secondary"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Nova Coleção
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Coleção</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Descrição</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Status</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                      {collections.map((coll) => (
                        <tr key={coll._id} className="group">
                          <td className="py-4 font-bold text-brand-green dark:text-dark-text">{coll.name}</td>
                          <td className="py-4 text-brand-green/60 dark:text-dark-text/60 text-sm max-w-xs truncate">{coll.description}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              coll.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {coll.active ? 'Ativa' : 'Inativa'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingCollection(coll);
                                  setIsAddingCollection(false);
                                }}
                                className="p-2 text-brand-green/40 hover:text-brand-orange transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCollection(coll._id!)}
                                className="p-2 text-brand-green/40 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gestão de Categorias */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Gestão de Categorias</h2>
                <Button
                  onClick={() => {
                    setEditingCategory({ name: '', description: '', active: true });
                    setIsAddingCategory(true);
                  }}
                  variant="secondary"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Nova Categoria
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Categoria</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Descrição</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Status</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                      {categories.map((cat) => (
                        <tr key={cat._id} className="group">
                          <td className="py-4 font-bold text-brand-green dark:text-dark-text">{cat.name}</td>
                          <td className="py-4 text-brand-green/60 dark:text-dark-text/60 text-sm max-w-xs truncate">{cat.description}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                              cat.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {cat.active ? 'Ativa' : 'Inativa'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setIsAddingCategory(false);
                                }}
                                className="p-2 text-brand-green/40 hover:text-brand-orange transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat._id!)}
                                className="p-2 text-brand-green/40 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gestão de Usuários */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Gestão de Usuários</h2>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Usuário</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Email</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Role</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="py-4 font-bold text-brand-green dark:text-dark-text">{u.name} {u.surname}</td>
                          <td className="py-4 text-brand-green/60 dark:text-dark-text/60">{u.email}</td>
                          <td className="py-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                              className={`border-none rounded-lg text-xs font-bold py-1 px-2 focus:ring-1 focus:ring-brand-orange transition-colors dark:[color-scheme:dark] ${
                                theme === 'dark' 
                                  ? 'bg-black text-white' 
                                  : 'bg-brand-lime/10 text-brand-green'
                              }`}
                            >
                              <option value="user" className={theme === 'dark' ? 'bg-black text-white' : ''}>User</option>
                              <option value="admin" className={theme === 'dark' ? 'bg-black text-white' : ''}>Admin</option>
                            </select>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u.role === 'admin'}
                              className="p-2 text-brand-green/40 hover:text-red-500 transition-colors disabled:opacity-20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gestão de Pedidos */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Gestão de Pedidos</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeleteSelectedOrders}
                    disabled={selectedOrderIds.length === 0 || isActionLoading}
                    variant="outline"
                    status="error"
                    size="sm"
                    className="h-10"
                    leftIcon={isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  >
                    Remover Selecionados ({selectedOrderIds.length})
                  </Button>
                  <Button
                    onClick={handleDeleteAllOrders}
                    disabled={orders.length === 0 || isActionLoading}
                    variant="ghost"
                    size="sm"
                    className="h-10 text-red-600 hover:text-red-700 hover:bg-red-50 font-bold"
                    leftIcon={<X className="w-4 h-4" />}
                  >
                    Limpar Tudo
                  </Button>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                        <th className="pb-4 w-10">
                          <button
                            onClick={toggleAllOrdersSelection}
                            className="p-2 text-brand-green/40 dark:text-dark-text/40 hover:text-brand-orange transition-colors"
                          >
                            {selectedOrderIds.length === orders.length && orders.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </button>
                        </th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">ID / Data</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Cliente / Endereço</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Valor</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Status Pedido</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Envio</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                      {orders.map((o) => (
                        <React.Fragment key={o._id}>
                          <tr className="hover:bg-brand-green/5 dark:hover:bg-white/5 transition-colors border-b border-brand-green/[0.03] dark:border-white/[0.03]">
                            <td className="py-4">
                              <button
                                onClick={() => toggleOrderSelection(o._id)}
                                className="p-2 transition-colors"
                              >
                                {selectedOrderIds.includes(o._id) ? (
                                  <CheckSquare className="w-4 h-4 text-brand-orange" />
                                ) : (
                                  <Square className="w-4 h-4 text-brand-green/20 dark:text-dark-text/20" />
                                )}
                              </button>
                            </td>
                            <td className="py-4 cursor-pointer group" onClick={() => setExpandedOrderId(expandedOrderId === o._id ? null : o._id)}>
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-brand-green/5 dark:bg-white/5 text-brand-green dark:text-dark-text group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-all">
                                  {expandedOrderId === o._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-brand-green dark:text-dark-text">#{o._id.slice(-6)}</div>
                                  <div className="text-[10px] text-brand-green/40 dark:text-dark-text/40">{new Date(o.data_pedido).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                            <div className="text-sm font-bold text-brand-green dark:text-dark-text">{o.user?.name} {o.user?.surname}</div>
                            <div className="text-[10px] text-brand-green/40 dark:text-dark-text/40">{o.user?.email}</div>
                            {o.shipping?.endereco && (
                              <div className="mt-1 p-2 bg-brand-lime/10 rounded-lg text-[9px] text-brand-green/60 dark:text-dark-text/60 leading-tight">
                                {o.shipping.endereco.street}, {o.shipping.endereco.city}<br />
                                {o.shipping.endereco.state}, {o.shipping.endereco.zip}<br />
                                {o.shipping.endereco.country}
                              </div>
                            )}
                          </td>
                          <td className="py-4 font-bold text-brand-green dark:text-dark-text">
                            €{o.valor_total.toFixed(2)}
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase w-fit ${
                                o.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                o.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-brand-orange/10 text-brand-orange'
                              }`}>
                                {o.status}
                              </span>
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value, undefined)}
                                className={`border-none rounded-lg text-[10px] font-bold py-1 px-2 focus:ring-1 focus:ring-brand-orange transition-colors dark:[color-scheme:dark] ${
                                  theme === 'dark' 
                                    ? 'bg-black text-white' 
                                    : 'bg-brand-lime/10 text-brand-green'
                                }`}
                              >
                                <option value="pending" className={theme === 'dark' ? 'bg-black text-white' : ''}>Pendente</option>
                                <option value="paid" className={theme === 'dark' ? 'bg-black text-white' : ''}>Pago</option>
                                <option value="processing" className={theme === 'dark' ? 'bg-black text-white' : ''}>Processando</option>
                                <option value="Ready to Ship" className={theme === 'dark' ? 'bg-black text-white' : ''}>Pronto para Envio</option>
                                <option value="Shipped" className={theme === 'dark' ? 'bg-black text-white' : ''}>Enviado</option>
                                <option value="Delivered" className={theme === 'dark' ? 'bg-black text-white' : ''}>Entregue</option>
                                <option value="Cancelled" className={theme === 'dark' ? 'bg-black text-white' : ''}>Cancelado</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-brand-green/40 uppercase tracking-widest">Método:</span>
                                <span className="text-[10px] font-bold text-brand-green dark:text-dark-text uppercase">{o.shipping?.metodo_envio || 'N/A'}</span>
                              </div>
                              <select
                                value={o.shipping?.status_envio || 'pending'}
                                onChange={(e) => handleUpdateOrderStatus(o._id, undefined, e.target.value)}
                                className={`border-none rounded-lg text-[10px] font-bold py-1 px-2 focus:ring-1 focus:ring-brand-orange transition-colors dark:[color-scheme:dark] ${
                                  theme === 'dark' 
                                    ? 'bg-black text-white' 
                                    : 'bg-brand-lime/10 text-brand-green'
                                }`}
                              >
                                <option value="pending" className={theme === 'dark' ? 'bg-black text-white' : ''}>Pendente</option>
                                <option value="shipped" className={theme === 'dark' ? 'bg-black text-white' : ''}>Enviado</option>
                                <option value="delivered" className={theme === 'dark' ? 'bg-black text-white' : ''}>Entregue</option>
                                <option value="returned" className={theme === 'dark' ? 'bg-black text-white' : ''}>Devolvido</option>
                              </select>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-brand-green/40 uppercase tracking-widest">Rastreio:</span>
                                <input
                                  type="text"
                                  placeholder="Inserir código"
                                  defaultValue={o.shipping?.codigo_rastreamento || ''}
                                  onBlur={(e) => {
                                    if (e.target.value !== (o.shipping?.codigo_rastreamento || '')) {
                                      handleUpdateOrderStatus(o._id, undefined, undefined, e.target.value);
                                    }
                                  }}
                                  className={`border-none rounded-lg text-[10px] font-medium py-1 px-2 focus:ring-1 focus:ring-brand-orange transition-all w-full dark:[color-scheme:dark] ${
                                    theme === 'dark' 
                                      ? 'bg-black text-white border-white/10' 
                                      : 'bg-brand-lime/10 text-brand-green'
                                  }`}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteOrder(o._id)}
                              className="p-2 text-brand-green/20 hover:text-red-500 transition-colors"
                              title="Excluir Pedido"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === o._id && (
                          <tr>
                            <td colSpan={7} className="py-0 px-4">
                              <AnimatePresence mode="wait">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="bg-brand-orange/[0.03] dark:bg-brand-orange/[0.05] rounded-3xl p-6 mb-6 mt-2 overflow-hidden border border-brand-orange/10"
                                >
                                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange mb-6 flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5" />
                                    Conteúdo Detalhado do Pedido
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {o.items?.map((item: any, idx: number) => (
                                      <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-black/20 rounded-2xl border border-brand-green/[0.03] dark:border-white/[0.03] shadow-sm">
                                        <div className="w-14 h-14 bg-brand-green/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-brand-green dark:text-dark-text font-serif italic font-bold border border-brand-green/5">
                                          {item.nome_produto?.[0] || 'S'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-bold text-brand-green dark:text-dark-text truncate">{item.nome_produto}</div>
                                          <div className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mt-1">
                                            Tam: {item.selectedSize} | Qtd: {item.quantidade}
                                          </div>
                                          <div className="text-[10px] font-medium text-brand-green/40 dark:text-dark-text/40 mt-0.5">
                                            Subtotal: €{item.subtotal?.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-6 pt-6 border-t border-brand-green/5 dark:border-white/5 flex flex-wrap gap-12">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-bold text-brand-green/30 dark:text-dark-text/30 uppercase tracking-widest">Resumo Financeiro</span>
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-brand-green dark:text-dark-text">€{o.valor_total.toFixed(2)}</span>
                                        <span className="text-[9px] font-medium text-brand-green/40 dark:text-dark-text/40">Total Líquido</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[9px] font-bold text-brand-green/30 dark:text-dark-text/30 uppercase tracking-widest">Método Pagamento</span>
                                      <span className="text-xs font-bold text-brand-green dark:text-dark-text uppercase">{o.metodo_pagamento || 'N/A'}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gestão de Cartões Presente */}
          {activeTab === 'giftCards' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Gestão de Cartões Presente</h2>
                <Button
                  onClick={handleExportGiftCards}
                  variant="secondary"
                  leftIcon={<Download className="w-5 h-5" />}
                  className="px-6"
                >
                  Exportar CSV
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Código / Data</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Destinatário</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Valor / Saldo</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs">Status</th>
                        <th className="pb-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-xs text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                      {giftCards.map((gc) => (
                        <tr key={gc._id}>
                          <td className="py-4">
                            <div className="text-sm font-bold text-brand-green dark:text-dark-text">{gc.code || 'DRAFT'}</div>
                            <div className="text-[10px] text-brand-green/40 dark:text-dark-text/40">{new Date(gc.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="py-4">
                            <div className="text-sm font-bold text-brand-green dark:text-dark-text">{gc.recipientName}</div>
                            <div className="text-[10px] text-brand-green/40 dark:text-dark-text/40">{gc.recipientEmail}</div>
                          </td>
                          <td className="py-4 font-bold text-brand-green dark:text-dark-text">
                            <div>V: €{gc.value}</div>
                            <div className="text-brand-orange text-xs">S: €{gc.balance}</div>
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                              gc.status === 'active' ? 'bg-green-100 text-green-700' :
                              gc.status === 'blocked' ? 'bg-red-100 text-red-700' :
                              gc.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {gc.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {gc.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => handleResendGiftCardEmail(gc._id)}
                                    className="p-2 text-brand-green/40 hover:text-brand-orange transition-colors"
                                    title="Reenviar Email"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAdjustGiftCardBalance(gc._id)}
                                    className="p-2 text-brand-green/40 hover:text-brand-orange transition-colors"
                                    title="Ajustar Saldo"
                                  >
                                    <Database className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleBlockGiftCard(gc._id)}
                                className={`p-2 transition-colors ${gc.status === 'blocked' ? 'text-brand-orange' : 'text-brand-green/40 hover:text-red-500'}`}
                                title={gc.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                              >
                                {gc.status === 'blocked' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteGiftCard(gc._id)}
                                className="p-2 text-brand-green/40 hover:text-red-500 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Relatórios e Análises */}
          {activeTab === 'reports' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text text-left">Relatórios de Vendas e Stock</h2>
                <button
                  onClick={handleSeed}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold hover:bg-brand-green transition-all shadow-lg shadow-brand-orange/10 disabled:opacity-50"
                >
                  <Database className="w-4 h-4" />
                  Resetar & Semear Dados de Relatório
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
              ) : stats && (
                <div className="space-y-8">
                  {/* Sales Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-green/40 mb-2">Vendas Hoje</p>
                      <p className="text-2xl font-bold text-brand-green dark:text-dark-text">€{stats.sales.daily.total.toFixed(2)}</p>
                      <p className="text-xs text-brand-green/60 dark:text-dark-text/60">{stats.sales.daily.count} pedidos</p>
                    </div>
                    <div className="p-6 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-green/40 mb-2">Vendas Semana</p>
                      <p className="text-2xl font-bold text-brand-green dark:text-dark-text">€{stats.sales.weekly.total.toFixed(2)}</p>
                      <p className="text-xs text-brand-green/60 dark:text-dark-text/60">{stats.sales.weekly.count} pedidos</p>
                    </div>
                    <div className="p-6 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-green/40 mb-2">Vendas Mês</p>
                      <p className="text-2xl font-bold text-brand-green dark:text-dark-text">€{stats.sales.monthly.total.toFixed(2)}</p>
                      <p className="text-xs text-brand-green/60 dark:text-dark-text/60">{stats.sales.monthly.count} pedidos</p>
                    </div>
                    <div className="p-6 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-green/40 mb-2">Vendas Ano</p>
                      <p className="text-2xl font-bold text-brand-green dark:text-dark-text">€{stats.sales.yearly.total.toFixed(2)}</p>
                      <p className="text-xs text-brand-green/60 dark:text-dark-text/60">{stats.sales.yearly.count} pedidos</p>
                    </div>
                  </div>

                  {/* Stock Stats */}
                  <div className="p-8 bg-brand-green text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-serif italic font-bold mb-6">Valor Total em Stock</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Valor Financeiro</p>
                          <p className="text-4xl font-bold">€{stats.stock.totalValue.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total de Itens</p>
                          <p className="text-4xl font-bold">{stats.stock.totalItems} unidades</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full -ml-32 -mb-32 blur-3xl" />
                  </div>

                  {/* Funnel and Heatmap Section */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Funnel Chart */}
                    <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-brand-green/5 shadow-xl">
                      <h3 className="text-xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-8">Funil de Conversão</h3>
                      <div className="h-[300px] w-full relative min-h-[300px]">
                        {funnelData ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: 'Visitantes', value: funnelData.visitors || 0 },
                                { name: 'Carrinho', value: funnelData.cartAdds || 0 },
                                { name: 'Checkout', value: funnelData.checkoutStarts || 0 },
                                { name: 'Compra', value: funnelData.completedPurchases || 0 }
                              ]}
                              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                              <XAxis 
                                dataKey="name" 
                                tick={{ fill: theme === 'dark' ? '#fff' : '#004236', fontSize: 12 }}
                              />
                              <YAxis />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip />
                              <Bar dataKey="value" fill="#004236" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p>Carregando dados...</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-brand-lime/5 rounded-2xl">
                          <p className="text-[10px] font-bold text-brand-green/40 uppercase tracking-widest mb-1">Taxa de Carrinho</p>
                          <p className="text-lg font-bold text-brand-green dark:text-dark-text">
                            {funnelData?.visitors ? ((funnelData.cartAdds / funnelData.visitors) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                        <div className="text-center p-4 bg-brand-lime/5 rounded-2xl">
                          <p className="text-[10px] font-bold text-brand-green/40 uppercase tracking-widest mb-1">Conversão Final</p>
                          <p className="text-lg font-bold text-brand-green dark:text-dark-text">
                            {funnelData?.visitors ? ((funnelData.completedPurchases / funnelData.visitors) * 100).toFixed(1) : 0}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Heatmap Chart */}
                    <div className="p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-brand-green/5 shadow-xl">
                      <h3 className="text-xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-8">Intensidade de Vendas (Horário/Dia)</h3>
                      <div className="overflow-x-auto">
                        <div className="min-w-[400px]">
                          <div className="flex mb-2 ml-8">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                              <div key={day} className="flex-1 text-center text-[10px] font-bold text-brand-green/40 uppercase tracking-widest">{day}</div>
                            ))}
                          </div>
                          <div className="flex flex-col gap-1">
                            {[...Array(24)].map((_, hour) => (
                              <div key={hour} className="flex gap-1 items-center h-4">
                                <div className="w-8 text-[8px] font-bold text-brand-green/40">{hour}h</div>
                                {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
                                  // MongoDB $dayOfWeek: 1 (Sun) to 7 (Sat)
                                  const mongoDay = dayIdx + 1;
                                  const cellData = heatmapData.find(h => h.day === mongoDay && h.hour === hour);
                                  const intensity = cellData ? Math.min(cellData.count * 0.2, 1) : 0;
                                  return (
                                    <div 
                                      key={dayIdx} 
                                      className="flex-1 h-full rounded-sm transition-all hover:scale-125 hover:z-10 cursor-pointer"
                                      style={{ 
                                        backgroundColor: intensity > 0 
                                          ? `rgba(251, 146, 60, ${0.1 + intensity * 0.9})` 
                                          : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,66,54,0.05)'
                                      }}
                                      title={`${cellData?.count || 0} vendas`}
                                    />
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-between items-center text-[10px] font-bold text-brand-green/40 uppercase tracking-widest">
                        <span>Menos Vendas</span>
                        <div className="flex gap-1">
                          {[0.1, 0.3, 0.5, 0.7, 1].map(v => (
                            <div key={v} className="w-4 h-4 rounded-sm" style={{ backgroundColor: `rgba(251, 146, 60, ${v})` }} />
                          ))}
                        </div>
                        <span>Mais Vendas</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Sales Report */}
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <h3 className="text-xl font-serif italic font-bold text-brand-green dark:text-dark-text">Produtos Mais Vendidos</h3>
                      
                      <div className="flex flex-wrap gap-4">
                        <select
                          value={reportFilters.size}
                          onChange={(e) => setReportFilters({ ...reportFilters, size: e.target.value })}
                          className="bg-brand-lime/10 dark:bg-black/40 dark:text-white border-none rounded-xl text-xs font-bold py-2 px-4 focus:ring-2 focus:ring-brand-orange transition-colors dark:[color-scheme:dark]"
                        >
                          <option value="" className={theme === 'dark' ? 'bg-black text-white' : ''}>Todos os Tamanhos</option>
                          {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                            <option key={s} value={s} className={theme === 'dark' ? 'bg-black text-white' : ''}>{s}</option>
                          ))}
                        </select>

                        <select
                          value={reportFilters.sortBy}
                          onChange={(e) => setReportFilters({ ...reportFilters, sortBy: e.target.value })}
                          className="bg-brand-lime/10 dark:bg-black/40 dark:text-white border-none rounded-xl text-xs font-bold py-2 px-4 focus:ring-2 focus:ring-brand-orange transition-colors dark:[color-scheme:dark]"
                        >
                          <option value="totalSold" className={theme === 'dark' ? 'bg-black text-white' : ''}>Total Vendido</option>
                          <option value="totalRevenue" className={theme === 'dark' ? 'bg-black text-white' : ''}>Receita Total</option>
                          <option value="lastSold" className={theme === 'dark' ? 'bg-black text-white' : ''}>Última Venda</option>
                        </select>

                        <select
                          value={reportFilters.order}
                          onChange={(e) => setReportFilters({ ...reportFilters, order: e.target.value })}
                          className="bg-brand-lime/10 dark:bg-black/40 dark:text-white border-none rounded-xl text-xs font-bold py-2 px-4 focus:ring-2 focus:ring-brand-orange transition-colors dark:[color-scheme:dark]"
                        >
                          <option value="desc" className={theme === 'dark' ? 'bg-black text-white' : ''}>Decrescente</option>
                          <option value="asc" className={theme === 'dark' ? 'bg-black text-white' : ''}>Crescente</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-3xl border border-brand-green/5 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b border-brand-green/10 dark:border-dark-border">
                              <th className="p-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-[10px]">Produto</th>
                              <th className="p-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-[10px]">Tamanho</th>
                              <th className="p-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-[10px]">Qtd. Vendida</th>
                              <th className="p-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-[10px]">Receita</th>
                              <th className="p-4 font-bold text-brand-green/40 dark:text-dark-text/40 uppercase tracking-widest text-[10px]">Última Venda</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-green/5 dark:divide-dark-border">
                            {detailedReport?.bestSellers?.map((item: any, idx: number) => (
                              <tr key={`${item.productId}-${item.size}-${idx}`}>
                                <td className="p-4 font-bold text-brand-green dark:text-dark-text">{item.productName}</td>
                                <td className="p-4 text-brand-green/60 dark:text-dark-text/60">{item.size || 'N/A'}</td>
                                <td className="p-4 font-bold text-brand-green dark:text-dark-text">{item.totalSold}</td>
                                <td className="p-4 text-brand-orange font-bold">€{item.totalRevenue?.toFixed(2)}</td>
                                <td className="p-4 text-brand-green/60 dark:text-dark-text/60 text-xs">
                                  {item.lastSold ? new Date(item.lastSold).toLocaleDateString() : 'Nunca'}
                                </td>
                              </tr>
                            ))}
                            {(detailedReport?.bestSellers?.length === 0 || !detailedReport) && (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-brand-green/40 italic">Nenhum dado de vendas encontrado.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Promotion Suggestions */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif italic font-bold text-brand-green dark:text-dark-text">Sugestões de Promoções</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detailedReport?.suggestions?.map((item: any, idx: number) => (
                        <div key={idx} className="p-6 bg-brand-orange/5 rounded-3xl border border-brand-orange/10 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-brand-green dark:text-dark-text mb-1">{item.productName}</h4>
                            <p className="text-xs text-brand-orange font-bold uppercase tracking-widest">{item.reason}</p>
                            {item.lastSold && (
                              <p className="text-[10px] text-brand-green/40 mt-1">Última venda: {new Date(item.lastSold).toLocaleDateString()}</p>
                            )}
                          </div>
                          <Button
                            onClick={() => {
                              const product = products.find(p => p._id === item.productId);
                              if (product) {
                                setEditingProduct(product);
                                setIsAddingProduct(false);
                              }
                            }}
                            variant="primary"
                            size="icon"
                            className="p-3 rounded-2xl shadow-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(detailedReport?.suggestions?.length === 0 || !detailedReport) && (
                        <div className="col-span-full p-8 text-center text-brand-green/40 italic bg-white dark:bg-black/20 rounded-3xl border border-brand-green/5">
                          Todos os produtos estão com bom desempenho de vendas!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sistema e Backup */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text">Configurações do Sistema</h2>
              
              <div className="p-8 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-green dark:text-dark-text mb-2">Popular Banco de Dados</h3>
                    <p className="text-brand-green/60 dark:text-dark-text/60 text-sm mb-6">
                      Esta ação irá resetar todos os produtos e usuários (exceto o admin atual) e popular com os dados padrão do sistema.
                    </p>
                    <Button
                      onClick={handleSeed}
                      isLoading={isActionLoading}
                      variant="secondary"
                      leftIcon={<Database className="w-5 h-5" />}
                    >
                      Executar Seed
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-brand-lime/10 rounded-3xl border border-brand-green/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl">
                    <Download className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-green dark:text-dark-text mb-2">Backup e Exportação</h3>
                    <p className="text-brand-green/60 dark:text-dark-text/60 text-sm mb-6">
                      Exporte os dados do sistema em formato Excel (.xlsx). Você pode escolher baixar todo o banco de dados ou coleções específicas.
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      {['users', 'products', 'orders', 'categories', 'collections', 'newsletter', 'analytics'].map(coll => (
                        <button
                          key={coll}
                          onClick={() => toggleBackupCollection(coll)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedBackupCollections.includes(coll)
                              ? 'bg-brand-orange text-white'
                              : 'bg-white dark:bg-black/40 text-brand-green/40 dark:text-dark-text/40'
                          }`}
                        >
                          {selectedBackupCollections.includes(coll) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          {coll.charAt(0).toUpperCase() + coll.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={() => handleBackup(true)}
                        isLoading={isActionLoading}
                        variant="primary"
                        leftIcon={<FileSpreadsheet className="w-5 h-5" />}
                      >
                        Backup Completo
                      </Button>
                      <Button
                        onClick={() => handleBackup(false)}
                        isLoading={isActionLoading}
                        disabled={selectedBackupCollections.length === 0}
                        variant="secondary"
                        leftIcon={<Download className="w-5 h-5" />}
                      >
                        Baixar Selecionados
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Edit Modal */}
      {/* Existing logic for product modal */}

      {/* Collection Edit Modal */}
      {editingCollection && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-green/40 backdrop-blur-md" onClick={() => setEditingCollection(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl p-8"
          >
            <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-8">
              {isAddingCollection ? 'Nova Coleção' : 'Editar Coleção'}
            </h2>
            <form onSubmit={handleSaveCollection} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Nome</label>
                <input
                  required
                  value={editingCollection.name}
                  onChange={e => setEditingCollection({...editingCollection, name: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Descrição</label>
                <textarea
                  rows={3}
                  value={editingCollection.description || ''}
                  onChange={e => setEditingCollection({...editingCollection, description: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingCollection.active}
                  onChange={e => setEditingCollection({...editingCollection, active: e.target.checked})}
                  className="w-5 h-5 rounded border-brand-green text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="active" className="text-xs font-bold uppercase tracking-widest text-brand-green/60">Coleção Ativa</label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setEditingCollection(null)}
                  variant="ghost"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isActionLoading}
                  leftIcon={<Save className="w-5 h-5" />}
                >
                  Salvar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Category Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-green/40 backdrop-blur-md" onClick={() => setEditingCategory(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl p-8"
          >
            <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-8">
              {isAddingCategory ? 'Nova Categoria' : 'Editar Categoria'}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Nome da Categoria</label>
                <input
                  required
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Descrição</label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({...editingCategory, description: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text resize-none h-32"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="category-active"
                  checked={editingCategory.active}
                  onChange={e => setEditingCategory({...editingCategory, active: e.target.checked})}
                  className="w-5 h-5 rounded border-brand-green text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="category-active" className="text-xs font-bold uppercase tracking-widest text-brand-green/60">Categoria Ativa</label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  variant="ghost"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isActionLoading}
                  leftIcon={<Save className="w-5 h-5" />}
                >
                  Salvar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-green/40 backdrop-blur-md" onClick={() => setEditingProduct(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-8">
              {isAddingProduct ? 'Novo Produto' : 'Editar Produto'}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Nome</label>
                  <input
                    required
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Preço (€)</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Cor</label>
                  <input
                    required
                    value={editingProduct.color || ''}
                    onChange={e => setEditingProduct({...editingProduct, color: e.target.value})}
                    placeholder="Ex: Deep Ocean Blue"
                    className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Categoria</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-colors dark:[color-scheme:dark]"
                  >
                    <option value="" className={theme === 'dark' ? 'bg-black text-white' : ''}>Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name} className={theme === 'dark' ? 'bg-black text-white' : ''}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Coleção</label>
                  <select
                    value={editingProduct.collection}
                    onChange={e => setEditingProduct({...editingProduct, collection: e.target.value})}
                    className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-colors dark:[color-scheme:dark]"
                  >
                    <option value="">{t.selectCollection}</option>
                    {collections.map(coll => (
                      <option key={coll._id} value={coll.name} className={theme === 'dark' ? 'bg-black text-white' : ''}>
                        {coll.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">URL da Imagem</label>
                <input
                  required
                  value={editingProduct.image}
                  onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Tamanhos Disponíveis (separados por vírgula)</label>
                <input
                  required
                  value={editingProduct.sizes?.join(', ') || ''}
                  onChange={e => {
                    const newSizes = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                    setEditingProduct({...editingProduct, sizes: newSizes});
                  }}
                  placeholder="Ex: S, M, L, XL"
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Stock por Tamanho</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {(editingProduct.sizes || []).map(size => (
                    <div key={size} className="space-y-1">
                      <label className="text-[10px] font-bold text-brand-green/40 block text-center">{size}</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.stock?.[size] || 0}
                        onChange={e => {
                          const newStock = { ...(editingProduct.stock || {}) };
                          newStock[size] = Number(e.target.value);
                          setEditingProduct({ ...editingProduct, stock: newStock });
                        }}
                        className="w-full px-2 py-2 bg-brand-lime/10 dark:bg-black/40 border-none rounded-xl text-center focus:ring-2 focus:ring-brand-orange text-sm font-bold dark:text-dark-text"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Descrição</label>
                <textarea
                  required
                  rows={3}
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  variant="ghost"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isActionLoading}
                  leftIcon={<Save className="w-5 h-5" />}
                >
                  Salvar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Gift Card Balance Adjustment Modal */}
      {adjustingGiftCard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-green/40 backdrop-blur-md" onClick={() => setAdjustingGiftCard(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl p-8"
          >
            <h2 className="text-2xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-4">
              Ajustar Saldo
            </h2>
            <p className="text-brand-green/60 dark:text-dark-text/60 text-sm mb-8 font-medium">
              Ajustando saldo para o cartão: <span className="font-bold text-brand-green dark:text-dark-text">{adjustingGiftCard.code || 'DRAFT'}</span>
            </p>

            <form onSubmit={handleSaveGiftCardBalance} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/40">Novo Saldo (€)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={adjustingGiftCard.balance}
                  onChange={e => setAdjustingGiftCard({...adjustingGiftCard, balance: e.target.value})}
                  className="w-full px-6 py-4 bg-brand-lime/10 dark:bg-black/40 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange dark:text-dark-text font-bold text-xl"
                  autoFocus
                />
              </div>

              <div className="p-4 bg-brand-orange/5 rounded-2xl text-[10px] font-bold text-brand-orange uppercase tracking-widest leading-loose">
                Atenção: Ao zerar o saldo, o cartão será marcado automaticamente como "Utilizado". Se restaurar o saldo, ele voltará a ser "Ativo".
              </div>

              <div className="flex gap-4 pt-4">
                {/* Botão de Exclusão Direta no Ajuste de Saldo */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 text-red-500 hover:bg-red-50 border-red-100" 
                  onClick={() => {
                    if (adjustingGiftCard) {
                      handleDeleteGiftCard(adjustingGiftCard._id);
                    }
                  }}
                  disabled={isActionLoading}
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Excluir Totalmente
                </Button>
                <Button
                  type="button"
                  onClick={() => setAdjustingGiftCard(null)}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  isLoading={isActionLoading}
                  className="flex-1"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
