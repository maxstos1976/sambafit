import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    theme: user?.theme || "light",
    preferredLanguage: user?.preferredLanguage || "ca",
    deliveryAddress: {
      street: user?.deliveryAddress?.street || "",
      city: user?.deliveryAddress?.city || "",
      state: user?.deliveryAddress?.state || "",
      zip: user?.deliveryAddress?.zip || "",
      country: user?.deliveryAddress?.country || "",
    },
    residentialAddress: {
      street: user?.residentialAddress?.street || "",
      city: user?.residentialAddress?.city || "",
      state: user?.residentialAddress?.state || "",
      zip: user?.residentialAddress?.zip || "",
      country: user?.residentialAddress?.country || "",
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        gender: user.gender || "",
        phone: user.phone || "",
        theme: user.theme || "light",
        preferredLanguage: user.preferredLanguage || "ca",
        deliveryAddress: {
          street: user.deliveryAddress?.street || "",
          city: user.deliveryAddress?.city || "",
          state: user.deliveryAddress?.state || "",
          zip: user.deliveryAddress?.zip || "",
          country: user.deliveryAddress?.country || "",
        },
        residentialAddress: {
          street: user.residentialAddress?.street || "",
          city: user.residentialAddress?.city || "",
          state: user.residentialAddress?.state || "",
          zip: user.residentialAddress?.zip || "",
          country: user.residentialAddress?.country || "",
        },
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        },
      }));
      if (parent === "residentialAddress" || parent === "deliveryAddress") {
        setSameAsShipping(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSameAsShippingToggle = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        residentialAddress: { ...prev.deliveryAddress },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setMessage({ type: "success", text: t.profileUpdated });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || t.profileUpdateError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t.deleteAccountConfirm)) {
      try {
        setIsLoading(true);
        await deleteAccount();
        onBack();
      } catch (err: any) {
        setMessage({
          type: "error",
          text: err.message || t.deleteAccountError,
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-32 pb-20 container mx-auto px-6 max-w-4xl"
    >
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-green/60 hover:text-brand-orange transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </button>
        <button
          onClick={() => {
            logout();
            onBack();
          }}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <LogOut className="w-4 h-4" />
          {t.logout}
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12 border border-brand-green/5">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 bg-brand-lime/20 dark:bg-white/10 rounded-full flex items-center justify-center text-brand-green dark:text-dark-text">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-serif italic font-bold text-brand-green dark:text-dark-text">
              {t.hello}, {user?.name}
            </h1>
            <p className="text-brand-green/60 dark:text-dark-text/60 font-medium">
              {t.completeProfile}
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl border font-medium text-sm ${
              message.type === "success"
                ? "bg-green-50 border-green-100 text-green-600"
                : "bg-red-50 border-red-100 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40 border-b border-brand-green/5 dark:border-white/5 pb-2">
              {t.personalInfo}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.dob}
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text dark:[color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.gender}
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium appearance-none dark:text-dark-text dark:[color-scheme:dark]"
                >
                  <option
                    value=""
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    {t.selectGender}
                  </option>
                  <option
                    value="male"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    {t.genderMale}
                  </option>
                  <option
                    value="female"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    {t.genderFemale}
                  </option>
                  <option
                    value="other"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    {t.genderOther}
                  </option>
                  <option
                    value="prefer_not_to_say"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    {t.genderPreferNotToSay}
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.preferredLanguage}
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium appearance-none dark:text-dark-text dark:[color-scheme:dark]"
                >
                  <option
                    value="ca"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    Català
                  </option>
                  <option
                    value="es"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    Español
                  </option>
                  <option
                    value="pt"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    Português
                  </option>
                  <option
                    value="en"
                    className={theme === "dark" ? "bg-black text-white" : ""}
                  >
                    English
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 ml-2">
                  {t.theme}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, theme: "light" }))
                    }
                    className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      formData.theme === "light"
                        ? "bg-brand-green text-white shadow-lg"
                        : "bg-brand-lime/5 dark:bg-white/5 text-brand-green dark:text-dark-text hover:bg-brand-lime/10 dark:hover:bg-white/10"
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
                    className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      formData.theme === "dark"
                        ? "bg-brand-green text-white shadow-lg"
                        : "bg-brand-lime/5 dark:bg-white/5 text-brand-green dark:text-dark-text hover:bg-brand-lime/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    {t.dark}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40 border-b border-brand-green/5 dark:border-white/5 pb-2">
              {t.deliveryAddress}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.street}
                </label>
                <input
                  type="text"
                  name="deliveryAddress.street"
                  value={formData.deliveryAddress.street}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.city}
                </label>
                <input
                  type="text"
                  name="deliveryAddress.city"
                  value={formData.deliveryAddress.city}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.state}
                </label>
                <input
                  type="text"
                  name="deliveryAddress.state"
                  value={formData.deliveryAddress.state}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.zipCode}
                </label>
                <input
                  type="text"
                  name="deliveryAddress.zip"
                  value={formData.deliveryAddress.zip}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.country}
                </label>
                <input
                  type="text"
                  name="deliveryAddress.country"
                  value={formData.deliveryAddress.country}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
            </div>
          </section>

          {/* Residential Address */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-green/5 dark:border-white/5 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green/40 dark:text-dark-text/40">
                {t.residentialAddress}
              </h3>
              <label className="flex items-center gap-2 cursor-pointer mt-2 md:mt-0">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => handleSameAsShippingToggle(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-green/20 text-brand-orange focus:ring-brand-orange transition-all"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60">
                  {t.sameAsShipping}
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.street}
                </label>
                <input
                  type="text"
                  name="residentialAddress.street"
                  value={formData.residentialAddress.street}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.city}
                </label>
                <input
                  type="text"
                  name="residentialAddress.city"
                  value={formData.residentialAddress.city}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.state}
                </label>
                <input
                  type="text"
                  name="residentialAddress.state"
                  value={formData.residentialAddress.state}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.zipCode}
                </label>
                <input
                  type="text"
                  name="residentialAddress.zip"
                  value={formData.residentialAddress.zip}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-green/60 dark:text-dark-text/60 ml-2">
                  {t.country}
                </label>
                <input
                  type="text"
                  name="residentialAddress.country"
                  value={formData.residentialAddress.country}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-brand-lime/5 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-orange transition-all font-medium dark:text-dark-text"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-brand-green/5">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 bg-brand-green text-white rounded-full font-bold text-lg shadow-xl shadow-brand-green/20 hover:bg-brand-orange transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-6 h-6" /> {t.saveChanges}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="px-8 py-4 border-2 border-red-100 text-red-500 rounded-full font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> {t.deleteAccount}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
