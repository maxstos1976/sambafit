import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (mode: "login" | "signup") => void;
  initialMode?: "login" | "signup";
  localCart?: any[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "login",
  localCart = [],
}) => {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t.passwordsDontMatch);
        }
        await register(
          {
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            password: formData.password,
            theme: (formData as any).theme || "light",
          },
          localCart,
        );
      } else {
        await login(
          {
            email: formData.email,
            password: formData.password,
          },
          localCart,
        );
      }
      onSuccess?.(mode);
      onClose();
    } catch (err: any) {
      setError(err.message || t.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-warm-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-brand-green/40 dark:text-dark-text/40 hover:text-brand-orange transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif italic font-bold text-brand-green dark:text-dark-text mb-2">
                {mode === "login" ? t.welcomeBack : t.createAccount}
              </h2>
              <p className="text-brand-green/60 dark:text-dark-text/60 text-sm font-medium">
                {mode === "login" ? t.loginSubtitle : t.signupSubtitle}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm rounded-2xl border border-red-100 dark:border-red-900/30 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green/20 dark:text-dark-text/20" />
                    <input
                      type="text"
                      name="name"
                      placeholder={t.firstName}
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-brand-lime/10 dark:bg-white/5 border border-brand-green/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all text-brand-green dark:text-dark-text placeholder:text-brand-green/50 dark:placeholder:text-dark-text/50 font-medium"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="surname"
                      placeholder={t.lastName}
                      required
                      value={formData.surname}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-brand-lime/10 dark:bg-white/5 border border-brand-green/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all text-brand-green dark:text-dark-text placeholder:text-brand-green/50 dark:placeholder:text-dark-text/50 font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green/20 dark:text-dark-text/20" />
                <input
                  type="email"
                  name="email"
                  placeholder={t.email}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-brand-lime/10 dark:bg-white/5 border border-brand-green/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all text-brand-green dark:text-dark-text placeholder:text-brand-green/50 dark:placeholder:text-dark-text/50 font-medium"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green/20 dark:text-dark-text/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t.password}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-brand-lime/10 dark:bg-white/5 border border-brand-green/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all text-brand-green dark:text-dark-text placeholder:text-brand-green/50 dark:placeholder:text-dark-text/50 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-green/20 dark:text-dark-text/20 hover:text-brand-orange transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {mode === "signup" && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-green/20 dark:text-dark-text/20" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder={t.confirmPassword}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-brand-lime/10 dark:bg-white/5 border border-brand-green/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all text-brand-green dark:text-dark-text placeholder:text-brand-green/50 dark:placeholder:text-dark-text/50 font-medium"
                  />
                </div>
              )}

              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                    {t.theme}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, theme: "light" }))
                      }
                      className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        (formData as any).theme === "light" ||
                        !(formData as any).theme
                          ? "bg-brand-green text-white shadow-lg"
                          : "bg-brand-lime/10 dark:bg-white/5 text-brand-green dark:text-dark-text hover:bg-brand-lime/20 dark:hover:bg-white/10"
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      {t.light}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, theme: "dark" }))
                      }
                      className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        (formData as any).theme === "dark"
                          ? "bg-brand-green text-white shadow-lg"
                          : "bg-brand-lime/10 dark:bg-white/5 text-brand-green dark:text-dark-text hover:bg-brand-lime/20 dark:hover:bg-white/10"
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      {t.dark}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-brand-orange text-white rounded-full font-bold text-lg shadow-xl shadow-brand-orange/20 hover:bg-brand-green transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : mode === "login" ? (
                  t.loginButton
                ) : (
                  t.signupButton
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-brand-green/60 dark:text-dark-text/60 text-sm font-bold hover:text-brand-orange transition-colors"
              >
                {mode === "login"
                  ? t.dontHaveAccountAction
                  : t.alreadyHaveAccountAction}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
