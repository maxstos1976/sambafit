import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import { SoulSection } from "./components/SoulSection";
import { Product, CartItem, Collection, Category } from "./types";
import {
  productApi,
  newsletterApi,
  adminApi,
  analyticsApi,
  collectionApi,
  categoryApi,
} from "./services/api";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Loader2,
  Filter,
  ChevronDown,
  Database,
  ArrowLeft,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useLanguage } from "./context/LanguageContext";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";

// Lazy load components
const SupportPage = lazy(() =>
  import("./components/SupportPage").then((module) => ({
    default: module.SupportPage,
  })),
);
const GiftCardPage = lazy(() =>
  import("./components/GiftCardPage").then((module) => ({
    default: module.GiftCardPage,
  })),
);
const ProductModal = lazy(() =>
  import("./components/ProductModal").then((module) => ({
    default: module.ProductModal,
  })),
);
const AuthModal = lazy(() =>
  import("./components/AuthModal").then((module) => ({
    default: module.AuthModal,
  })),
);
const ProfilePage = lazy(() =>
  import("./components/ProfilePage").then((module) => ({
    default: module.ProfilePage,
  })),
);
const FavoritesPage = lazy(() =>
  import("./components/FavoritesPage").then((module) => ({
    default: module.FavoritesPage,
  })),
);
const OrdersPage = lazy(() =>
  import("./components/OrdersPage").then((module) => ({
    default: module.OrdersPage,
  })),
);
const CheckoutModal = lazy(() =>
  import("./components/CheckoutModal").then((module) => ({
    default: module.CheckoutModal,
  })),
);
const AdminDashboard = lazy(() =>
  import("./components/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
import { WhatsAppChat } from "./components/WhatsAppChat";

export default function App() {
  const { t } = useLanguage();
  const {
    user,
    addToCart: apiAddToCart,
    removeFromCart: apiRemoveFromCart,
    updateCartQuantity: apiUpdateCartQuantity,
    clearCart: apiClearCart,
  } = useAuth();
  const { socket } = useSocket();
  const prevUserRef = useRef(user);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const displayCartItems = user ? user.cart || [] : cartItems;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [isBestSellers, setIsBestSellers] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "shipping"
    | "returns"
    | "sizeGuide"
    | "contact"
    | "new"
    | "giftCards"
    | "lastUnits"
    | "profile"
    | "favorites"
    | "admin"
    | "orders"
  >("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">(
    "login",
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categories = [
    { id: "All", label: t.all },
    ...dynamicCategories.map((cat) => ({ id: cat.name, label: cat.name })),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    // Track visitor
    const sessionId =
      sessionStorage.getItem("samba_session") ||
      Math.random().toString(36).substring(7);
    sessionStorage.setItem("samba_session", sessionId);
    analyticsApi.track({ eventType: "visitor", sessionId });
  }, []);

  useEffect(() => {
    if (prevUserRef.current && !user) {
      setCartItems([]);
    } else if (user) {
      setCartItems(user.cart || []);
    } else {
      const storedCart = localStorage.getItem("samba_cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    }
    prevUserRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("samba_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (payload: { type: string; data?: any }) => {
      console.log("App: Real-time update received:", payload);
      if (["products", "collections", "categories"].includes(payload.type)) {
        setRefreshTrigger((prev) => prev + 1);
      }
    };

    socket.on("data_update", handleUpdate);

    return () => {
      socket.off("data_update", handleUpdate);
    };
  }, [socket]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const collectionsData = await collectionApi.getAll();
        setCollections(collectionsData.filter((c: Collection) => c.active));
        const categoriesData = await categoryApi.getAll();
        setDynamicCategories(categoriesData.filter((c: Category) => c.active));
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchInitialData();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data;
        if (isBestSellers) {
          data = await productApi.getBestSellers();
        } else {
          data = await productApi.getAll({
            category: selectedCategory,
            collection: selectedCollection || undefined,
          });
        }
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedCollection, isBestSellers, refreshTrigger]);

  const handleProductUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Show products if they have any stock OR if no stock is defined (newly created)
    const stockValues = Object.values(p.stock || {});
    const hasStock =
      stockValues.length === 0 || stockValues.some((val) => Number(val) > 0);
    return matchesSearch && hasStock;
  });

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("newsletter-email") as string;

    try {
      await newsletterApi.subscribe(email);
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (err) {
      console.error("Newsletter error:", err);
      alert(err instanceof Error ? err.message : "Erro ao cadastrar");
    }
  };

  const handleSeed = async () => {
    if (
      !confirm(
        "Deseja realmente resetar e popular o banco de dados com os produtos padrão?",
      )
    )
      return;

    try {
      setIsLoading(true);
      const result = await adminApi.seedDatabase();
      alert(`Sucesso! ${result.count} produtos foram semeados.`);
      // Refresh products
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Seed error:", err);
      alert(err instanceof Error ? err.message : "Erro ao semear banco");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const addToCart = async (product: Product, size?: string) => {
    const stockCount = product.stock?.[size || ""] || 0;

    // Track cart add
    analyticsApi.track({
      eventType: "cart_add",
      productId: product._id || product.id,
      sessionId: sessionStorage.getItem("samba_session") || undefined,
    });

    if (user) {
      try {
        const updatedCart = await apiAddToCart(
          product._id || product.id,
          1,
          size,
        );
        setCartItems(updatedCart);
        setIsCartOpen(true);
        return;
      } catch (err) {
        console.error("Failed to add to cart:", err);
      }
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          (item.id === product.id || item._id === product._id) &&
          item.selectedSize === size,
      );
      if (existing) {
        if (existing.quantity >= stockCount) {
          alert(
            `Desculpe, só temos ${stockCount} unidades deste tamanho em estoque.`,
          );
          return prev;
        }
        return prev.map((item) =>
          (item.id === product.id || item._id === product._id) &&
          item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      if (stockCount === 0) {
        alert("Desculpe, este produto está esgotado neste tamanho.");
        return prev;
      }

      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = async (
    id: string,
    delta: number,
    size?: string,
    isGiftCard?: boolean,
  ) => {
    if (user) {
      try {
        const item = displayCartItems.find(
          (i) =>
            (i.id === id || i._id === id) &&
            i.selectedSize === size &&
            i.isGiftCard === isGiftCard,
        );
        if (item) {
          const updatedCart = await apiUpdateCartQuantity(
            id,
            item.quantity + delta,
            size,
            isGiftCard,
          );
          setCartItems(updatedCart);
        }
        return;
      } catch (err) {
        console.error("Failed to update cart quantity:", err);
      }
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (
          (item.id === id || item._id === id) &&
          item.selectedSize === size &&
          item.isGiftCard === isGiftCard
        ) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = async (
    id: string,
    size?: string,
    isGiftCard?: boolean,
    giftCardId?: string,
  ) => {
    if (user) {
      try {
        const updatedCart = await apiRemoveFromCart(id, size, isGiftCard);
        setCartItems(updatedCart);
        return;
      } catch (err) {
        console.error("Failed to remove from cart:", err);
      }
    }

    setCartItems((prev) =>
      prev.filter((item) => {
        if (isGiftCard) {
          return item.giftCardId !== id;
        }
        return !(
          (item.id === id || item._id === id) &&
          item.selectedSize === size
        );
      }),
    );
  };

  const handleCheckoutSuccess = async () => {
    setCartItems([]);
    if (user) {
      apiClearCart();
    }
    // Refresh products to show updated stock
    try {
      const data = await productApi.getAll({
        category: selectedCategory,
        collection: selectedCollection || undefined,
      });
      setProducts(data);
    } catch (err) {
      console.error("Error refreshing products after checkout:", err);
    }
  };

  useEffect(() => {
    if (isCheckoutOpen && displayCartItems.length === 0) {
      setIsCheckoutOpen(false);
    }
  }, [displayCartItems, isCheckoutOpen]);

  const cartCount = displayCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleShowBestSellers = () => {
    setIsBestSellers(true);
    setSelectedCollection(null);
    setSelectedCategory("All");
    setSearchQuery("");
    setCurrentPage("home");
    setTimeout(() => scrollToSection("products"), 100);
  };

  const handleClearBestSellers = () => {
    setIsBestSellers(false);
  };

  const LoadingFallback = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Barra de Navegação */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={(id) => {
          setCurrentPage("home");
          setTimeout(() => scrollToSection(id), 100);
        }}
        onSearch={(q) => {
          setCurrentPage("home");
          setSearchQuery(q);
        }}
        onNavigate={(page) => setCurrentPage(page as any)}
        onSelectCollection={(collection) => {
          setSelectedCollection(collection);
          setSelectedCategory("All");
          setIsBestSellers(false);
          setSearchQuery("");
        }}
        onOpenAuth={handleOpenAuth}
        collections={collections}
      />

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {/* Página Inicial (Home) */}
            {currentPage === "home" ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hero onScrollTo={scrollToSection} />

                <section id="products" className="py-24 container mx-auto px-6">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                      <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                        {isBestSellers ? (
                          t.bestSellers
                        ) : selectedCollection ? (
                          selectedCollection
                        ) : (
                          <>
                            {t.essentialsCollection
                              .split(" ")
                              .slice(0, -1)
                              .join(" ")}{" "}
                            <span className="text-brand-orange">
                              {t.essentialsCollection.split(" ").slice(-1)}
                            </span>
                          </>
                        )}
                      </h2>
                      <p className="text-lg text-brand-green/70 font-medium">
                        {t.essentialsDescription}
                      </p>
                    </div>
                    <div className="relative">
                      {/* Desktop: Horizontal Buttons */}
                      <div className="hidden lg:flex flex-wrap gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setSelectedCollection(null);
                              handleClearBestSellers();
                            }}
                            className={`px-6 py-2 rounded-full border font-bold text-sm uppercase tracking-widest transition-all ${
                              selectedCategory === cat.id && !selectedCollection
                                ? "bg-brand-green border-brand-green text-white shadow-lg shadow-brand-green/20"
                                : "border-brand-green/10 hover:bg-brand-green/5"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Mobile: Filter Menu */}
                      <div className="lg:hidden">
                        <button
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className="flex items-center gap-3 px-6 py-3 rounded-full border border-brand-green/10 font-bold text-sm uppercase tracking-widest bg-white shadow-sm"
                        >
                          <Filter className="w-4 h-4" />
                          <span>
                            {categories.find((c) => c.id === selectedCategory)
                              ?.label || t.all}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {isFilterOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsFilterOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 mt-2 w-64 bg-white border border-brand-green/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                              >
                                <div className="p-2 flex flex-col">
                                  {categories.map((cat) => (
                                    <button
                                      key={cat.id}
                                      onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setSelectedCollection(null);
                                        handleClearBestSellers();
                                        setIsFilterOpen(false);
                                      }}
                                      className={`text-left px-4 py-3 rounded-xl transition-colors text-sm font-bold uppercase tracking-widest ${
                                        selectedCategory === cat.id &&
                                        !selectedCollection
                                          ? "bg-brand-green text-white"
                                          : "hover:bg-brand-green/5"
                                      }`}
                                    >
                                      {cat.label}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                  >
                    <AnimatePresence mode="popLayout">
                      {isLoading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                          <Loader2 className="w-12 h-12 text-brand-orange animate-spin" />
                          <p className="text-brand-green/60 font-medium">
                            Loading products...
                          </p>
                        </div>
                      ) : error ? (
                        <div className="col-span-full py-20 text-center space-y-4">
                          <p className="text-xl text-red-500 font-medium">
                            {error}
                          </p>
                          <button
                            onClick={() => window.location.reload()}
                            className="text-brand-orange font-bold underline"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : isBestSellers && filteredProducts.length > 0 ? (
                        <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                          <div className="space-y-4">
                            {filteredProducts.map((product, idx) => (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onMouseEnter={() => setHoveredProduct(product)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                onClick={() => handleProductClick(product)}
                                className="group flex items-center gap-8 cursor-pointer py-4 border-b border-brand-green/5 hover:border-brand-orange/20 transition-colors"
                              >
                                <span className="text-4xl font-serif italic text-brand-green/10 group-hover:text-brand-orange/20 transition-colors">
                                  {(idx + 1).toString().padStart(2, "0")}
                                </span>
                                <div className="flex flex-col">
                                  <h3 className="text-3xl md:text-5xl font-bold tracking-tighter group-hover:text-brand-orange transition-colors">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm font-mono uppercase tracking-widest text-brand-green/40 group-hover:text-brand-orange/60 transition-colors">
                                    {product.totalSold || 0} {t.unitsSold}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="hidden lg:block sticky top-32 h-[600px]">
                            <AnimatePresence mode="wait">
                              {hoveredProduct ? (
                                <motion.div
                                  key={hoveredProduct.id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className="w-full max-w-sm mx-auto"
                                >
                                  <ProductCard
                                    product={hoveredProduct}
                                    ghost={true}
                                  />
                                </motion.div>
                              ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed border-brand-green/5 rounded-3xl">
                                  <p className="text-brand-green/20 font-serif italic text-xl">
                                    {t.bestSellers}
                                  </p>
                                </div>
                              )}
                            </AnimatePresence>
                          </div>
                          {/* Mobile view fallback: still show cards for mobile since hover doesn't work well */}
                          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16 mt-12">
                            {filteredProducts.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                                onProductClick={handleProductClick}
                              />
                            ))}
                          </div>
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                            onProductClick={handleProductClick}
                          />
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="col-span-full py-20 text-center space-y-4"
                        >
                          <p className="text-2xl font-serif italic text-brand-green/40">
                            {t.noResults}
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedCategory("All");
                              setSelectedCollection(null);
                            }}
                            className="text-brand-orange font-bold underline"
                          >
                            {t.clearFilters}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </section>

                <div id="soul">
                  <SoulSection />
                </div>

                <section className="bg-brand-green text-warm-white py-32 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <img
                      src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=1000"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>

                  <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                      <h2 className="text-6xl md:text-8xl font-bold mb-12 tracking-tighter leading-none">
                        {t.bornInRio}
                        <br />
                        {t.madeForMovement
                          .split(" ")
                          .slice(0, -1)
                          .join(" ")}{" "}
                        <span className="italic">
                          {t.madeForMovement.split(" ").slice(-1)}
                        </span>
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                          <h4 className="text-2xl font-bold italic">
                            {t.sustainableSoul}
                          </h4>
                          <p className="text-warm-white/70 leading-relaxed">
                            {t.sustainableDescription}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-2xl font-bold italic">
                            {t.performanceFirst}
                          </h4>
                          <p className="text-warm-white/70 leading-relaxed">
                            {t.performanceDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="py-24 bg-brand-lime/20">
                  <div className="container mx-auto px-6 text-center">
                    <div className="max-w-2xl mx-auto space-y-8">
                      <h2 className="text-5xl font-bold tracking-tighter italic">
                        {t.joinMovement}
                      </h2>
                      <p className="text-lg text-brand-green/70">
                        {t.newsletterDescription}
                      </p>
                      {isSubscribed ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-brand-green text-white p-6 rounded-2xl font-bold"
                        >
                          {t.subscribedMessage}
                        </motion.div>
                      ) : (
                        <form
                          onSubmit={handleNewsletterSubmit}
                          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                        >
                          <input
                            required
                            name="newsletter-email"
                            type="email"
                            placeholder={t.emailPlaceholder}
                            className="flex-1 px-6 py-4 rounded-full bg-white border border-brand-green/10 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all"
                          />
                          <button
                            type="submit"
                            className="bg-brand-green text-white px-8 py-4 rounded-full font-bold hover:bg-brand-orange transition-all whitespace-nowrap"
                          >
                            {t.signUp}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </section>
              </motion.div>
            ) : /* Páginas de Suporte (Envios, Devoluções, Guia de Tamanhos, Contacto) */
            ["shipping", "returns", "sizeGuide", "contact"].includes(
                currentPage,
              ) ? (
              <SupportPage
                key={currentPage}
                title={
                  t[
                    currentPage === "shipping"
                      ? "shipping"
                      : currentPage === "returns"
                        ? "returns"
                        : currentPage === "sizeGuide"
                          ? "sizeGuide"
                          : "contact"
                  ]
                }
                content={
                  t[
                    currentPage === "shipping"
                      ? "shippingContent"
                      : currentPage === "returns"
                        ? "returnsContent"
                        : currentPage === "sizeGuide"
                          ? "sizeGuideContent"
                          : "contactContent"
                  ]
                }
                onBack={() => setCurrentPage("home")}
              />
            ) : /* Página de Cartões Presente */
            currentPage === "giftCards" ? (
              <GiftCardPage
                key="giftCards"
                onBack={() => setCurrentPage("home")}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenAuth={handleOpenAuth}
              />
            ) : /* Página de Perfil do Usuário */
            currentPage === "profile" ? (
              <ProfilePage
                key="profile"
                onBack={() => setCurrentPage("home")}
              />
            ) : /* Página de Pedidos/Histórico */
            currentPage === "orders" ? (
              <OrdersPage key="orders" onBack={() => setCurrentPage("home")} />
            ) : /* Página de Favoritos */
            currentPage === "favorites" ? (
              <FavoritesPage
                key="favorites"
                products={products}
                onBack={() => setCurrentPage("home")}
                onAddToCart={addToCart}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  setIsProductModalOpen(true);
                }}
              />
            ) : /* Painel Administrativo */
            currentPage === "admin" ? (
              <div className="pt-32 pb-20">
                <div className="container mx-auto px-6 mb-8">
                  <button
                    onClick={() => setCurrentPage("home")}
                    className="flex items-center gap-2 text-brand-green/60 hover:text-brand-orange transition-colors font-bold uppercase tracking-widest text-xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Home
                  </button>
                </div>
                <AdminDashboard onProductUpdate={handleProductUpdate} />
              </div>
            ) : (
              /* Outras Páginas (Novidades / Últimas Unidades) */
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-screen pt-32 pb-20 container mx-auto px-6"
              >
                <button
                  onClick={() => setCurrentPage("home")}
                  className="flex items-center gap-2 text-brand-green/60 hover:text-brand-orange transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.backToHome}
                </button>
                <h1 className="text-5xl md:text-7xl font-serif italic font-bold mb-6 tracking-tighter">
                  {currentPage === "new"
                    ? t.newArrivalsTitle
                    : t.lastUnitsTitle}
                </h1>
                <p className="text-xl text-brand-green/70 mb-12">
                  {currentPage === "new"
                    ? t.newArrivalsDescription
                    : t.lastUnitsDescription}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {products
                    .filter((p) =>
                      Object.values(p.stock || {}).some(
                        (val) => Number(val) > 0,
                      ),
                    )
                    .slice(0, 3)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onProductClick={handleProductClick}
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Rodapé (Footer) */}
      <footer className="bg-warm-white border-t border-brand-green/10 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-3xl font-serif italic font-bold mb-6">
                SambaFit
              </h3>
              <p className="text-brand-green/60 mb-8">
                {t.essenceDescription2.split(".")[0]}.
              </p>
              <div className="flex gap-4">
                <Instagram className="w-5 h-5 hover:text-brand-orange cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 hover:text-brand-orange cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-brand-orange cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6">
                {t.shop}
              </h5>
              <ul className="space-y-4 text-brand-green/70 font-medium">
                <li
                  onClick={() => {
                    handleClearBestSellers();
                    setCurrentPage("home");
                    setTimeout(() => scrollToSection("products"), 100);
                  }}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.newArrivals}
                </li>
                <li
                  onClick={handleShowBestSellers}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.bestSellers}
                </li>
                <li
                  onClick={() => {
                    handleClearBestSellers();
                    setCurrentPage("home");
                    setTimeout(() => scrollToSection("products"), 100);
                  }}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.collections}
                </li>
                <li
                  onClick={() => {
                    handleClearBestSellers();
                    setCurrentPage("home");
                    setSelectedCategory("Outerwear");
                    setTimeout(() => scrollToSection("products"), 100);
                  }}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.sale}
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6">
                {t.company}
              </h5>
              <ul className="space-y-4 text-brand-green/70 font-medium">
                <li
                  onClick={() => {
                    setCurrentPage("home");
                    setTimeout(() => scrollToSection("soul"), 100);
                  }}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.ourStory}
                </li>
                <li
                  onClick={() => {
                    setCurrentPage("home");
                    setTimeout(() => scrollToSection("soul"), 100);
                  }}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.sustainability}
                </li>
                <li className="hover:text-brand-green cursor-pointer">
                  {t.careers}
                </li>
                <li className="hover:text-brand-green cursor-pointer">
                  {t.press}
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-6">
                {t.support}
              </h5>
              <ul className="space-y-4 text-brand-green/70 font-medium">
                <li
                  onClick={() => setCurrentPage("shipping")}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.shipping}
                </li>
                <li
                  onClick={() => setCurrentPage("returns")}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.returns}
                </li>
                <li
                  onClick={() => setCurrentPage("sizeGuide")}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.sizeGuide}
                </li>
                <li
                  onClick={() => setCurrentPage("contact")}
                  className="hover:text-brand-green cursor-pointer"
                >
                  {t.contact}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-brand-green/5 text-xs font-bold uppercase tracking-widest text-brand-green/40 gap-4">
            <div className="flex items-center gap-4">
              <p>© 2026 SambaFit. {t.allRightsReserved}</p>
            </div>
            <div className="flex gap-8">
              <span className="hover:text-brand-green cursor-pointer">
                {t.privacyPolicy}
              </span>
              <span className="hover:text-brand-green cursor-pointer">
                {t.termsOfService}
              </span>
            </div>
          </div>
        </div>
      </footer>

      <Cart
        /* Carrinho de Compras Lateral */
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={displayCartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          analyticsApi.track({
            eventType: "checkout_start",
            sessionId: sessionStorage.getItem("samba_session") || undefined,
          });
          setIsCheckoutOpen(true);
        }}
      />

      <Suspense fallback={null}>
        {/* Modal de Checkout / Finalização de Compra */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={displayCartItems}
          onSuccess={handleCheckoutSuccess}
          onRemoveItem={removeFromCart}
        />

        {/* Modal de Detalhes do Produto */}
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={addToCart}
        />

        {/* Modal de Autenticação (Login / Registo) */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(mode) => {
            if (mode === "signup") {
              setCurrentPage("profile");
            }
          }}
          initialMode={authModalMode}
          localCart={cartItems}
        />
      </Suspense>
      {/* Botão Flutuante do WhatsApp */}
      <WhatsAppChat />
    </div>
  );
}
