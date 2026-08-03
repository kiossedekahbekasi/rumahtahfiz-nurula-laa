import React, { useState } from 'react';
import { SembakoProduct, Santri, DonationRecord, ProductCategory } from '../types';
import { 
  getSheetsWebhookUrl, 
  setSheetsWebhookUrl, 
  isAutoSyncEnabled, 
  setAutoSyncEnabled, 
  sendToGoogleSheets, 
  exportToCSV, 
  GOOGLE_APPS_SCRIPT_CODE 
} from '../lib/sheetsSync';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Database, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Lock, 
  KeyRound, 
  Send,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: SembakoProduct[];
  setProducts: React.Dispatch<React.SetStateAction<SembakoProduct[]>>;
  santriList: Santri[];
  setSantriList: React.Dispatch<React.SetStateAction<Santri[]>>;
  donations: DonationRecord[];
  setDonations: React.Dispatch<React.SetStateAction<DonationRecord[]>>;
  stats: {
    berasKg: number;
    santriCount: number;
    porsiMakan: number;
    danaTersalurkan: number;
  };
  setStats: React.Dispatch<React.SetStateAction<{
    berasKg: number;
    santriCount: number;
    porsiMakan: number;
    danaTersalurkan: number;
  }>>;
  adminPin: string;
  setAdminPin: (pin: string) => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  adminPassword: string;
  setAdminPassword: (pass: string) => void;
  onResetData: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  setProducts,
  santriList,
  setSantriList,
  donations,
  setDonations,
  stats,
  setStats,
  adminPin,
  setAdminPin,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  onResetData,
}) => {
  // Auth Login state
  const [loginMode, setLoginMode] = useState<'email' | 'pin'>('email');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Settings Credentials State
  const [editEmail, setEditEmail] = useState(adminEmail);
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Navigation tab inside Admin Panel
  const [activeAdminTab, setActiveAdminTab] = useState<'sheets' | 'produk' | 'santri' | 'stats' | 'settings'>('sheets');

  // Google Sheets settings state
  const [webhookUrl, setWebhookUrlState] = useState(getSheetsWebhookUrl());
  const [autoSync, setAutoSyncState] = useState(isAutoSyncEnabled());
  const [copiedScript, setCopiedScript] = useState(false);
  const [testSyncStatus, setTestSyncStatus] = useState<{ loading: boolean; message: string; success?: boolean }>({
    loading: false,
    message: '',
  });

  // Product Form State (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<SembakoProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<SembakoProduct>>({
    name: '',
    category: 'beras',
    price: 15000,
    normalPrice: 18000,
    unit: 'kg',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    description: '',
    impactBadge: 'Membantu Santri Tahfizh',
    isSubsidy: false,
    isSedekahSpecial: false,
  });

  // Santri Form State (Add / Edit)
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [isSantriModalOpen, setIsSantriModalOpen] = useState(false);
  const [santriForm, setSantriForm] = useState<Partial<Santri>>({
    name: '',
    age: 12,
    category: 'Yatim',
    currentJuz: 1,
    targetJuz: 30,
    setoranTerakhir: 'Surah Al-Baqarah',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    bio: '',
  });

  // PIN Change Form
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  if (!isOpen) return null;

  // Handle Login Email & Password
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      inputEmail.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
      inputPassword === adminPassword
    ) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Email atau Password Admin salah! (Default: admin@kiossedekah.com / admin123)');
    }
  };

  // Handle Login PIN
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === adminPin) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('PIN Admin Salah! (Default: 123456)');
    }
  };

  // Quick Auto-Fill Default Credentials
  const handleAutoFillDefault = () => {
    if (loginMode === 'email') {
      setInputEmail(adminEmail);
      setInputPassword(adminPassword);
    } else {
      setInputPin(adminPin);
    }
    setAuthError('');
  };

  // Update Email & Password in Settings
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmail.trim()) {
      alert('Email tidak boleh kosong!');
      return;
    }
    if (editPassword) {
      if (editPassword !== confirmPassword) {
        alert('Konfirmasi password tidak cocok!');
        return;
      }
      setAdminPassword(editPassword);
    }
    setAdminEmail(editEmail.trim());
    setEditPassword('');
    setConfirmPassword('');
    setAuthSuccessMsg('Email & Password Admin berhasil diperbarui!');
    setTimeout(() => setAuthSuccessMsg(''), 4000);
  };

  // Update PIN in Settings
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('PIN minimal harus 4 digit angka/karakter!');
      return;
    }
    if (newPin !== confirmPin) {
      alert('Konfirmasi PIN baru tidak cocok!');
      return;
    }
    setAdminPin(newPin);
    setNewPin('');
    setConfirmPin('');
    setAuthSuccessMsg('PIN Admin berhasil diperbarui!');
    setTimeout(() => setAuthSuccessMsg(''), 4000);
  };

  // Google Sheets Save
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setSheetsWebhookUrl(webhookUrl);
    setAutoSyncEnabled(autoSync);
    alert('Pengaturan Google Sheets Webhook berhasil disimpan!');
  };

  // Copy Apps Script Code
  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // Test Event to Google Sheets
  const handleTestSync = async () => {
    setTestSyncStatus({ loading: true, message: 'Mengirim data uji coba ke Google Sheets...' });
    const res = await sendToGoogleSheets('TEST_EVENT', { note: 'Uji coba koneksi admin Kios Sedekah Bekasi' });
    setTestSyncStatus({ loading: false, message: res.message, success: res.success });
  };

  // PRODUCT CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'beras',
      price: 15000,
      normalPrice: 18000,
      unit: 'kg',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
      description: '',
      impactBadge: 'Menyokong Santri Tahfizh',
      isSubsidy: false,
      isSedekahSpecial: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: SembakoProduct) => {
    setEditingProduct(p);
    setProductForm({ ...p });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) => (item.id === editingProduct.id ? ({ ...item, ...productForm } as SembakoProduct) : item))
      );
    } else {
      const newProd: SembakoProduct = {
        id: 'p-' + Date.now(),
        name: productForm.name || 'Produk Baru',
        category: (productForm.category as ProductCategory) || 'beras',
        price: Number(productForm.price),
        normalPrice: productForm.normalPrice ? Number(productForm.normalPrice) : undefined,
        unit: productForm.unit || 'pcs',
        stock: Number(productForm.stock) || 50,
        image: productForm.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
        description: productForm.description || '',
        impactBadge: productForm.impactBadge || 'Sedekah Berkah',
        isSubsidy: productForm.isSubsidy,
        isSedekahSpecial: productForm.isSedekahSpecial,
      };
      setProducts((prev) => [newProd, ...prev]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini dari katalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // SANTRI CRUD
  const handleOpenAddSantri = () => {
    setEditingSantri(null);
    setSantriForm({
      name: '',
      age: 12,
      category: 'Yatim',
      currentJuz: 1,
      targetJuz: 30,
      setoranTerakhir: 'Surah Al-Baqarah',
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
      bio: 'Santri semangat menghafal Al-Qur\'an di Rumah Tahfizh Bekasi.',
    });
    setIsSantriModalOpen(true);
  };

  const handleOpenEditSantri = (s: Santri) => {
    setEditingSantri(s);
    setSantriForm({ ...s });
    setIsSantriModalOpen(true);
  };

  const handleSaveSantri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!santriForm.name) return;

    if (editingSantri) {
      setSantriList((prev) =>
        prev.map((item) => (item.id === editingSantri.id ? ({ ...item, ...santriForm } as Santri) : item))
      );
    } else {
      const newSantriObj: Santri = {
        id: 'santri-' + Date.now(),
        name: santriForm.name || 'Santri Baru',
        age: Number(santriForm.age) || 12,
        category: (santriForm.category as any) || 'Yatim',
        currentJuz: Number(santriForm.currentJuz) || 1,
        targetJuz: Number(santriForm.targetJuz) || 30,
        setoranTerakhir: santriForm.setoranTerakhir || 'Juz 1',
        photo: santriForm.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
        joinDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        bio: santriForm.bio || '',
      };
      setSantriList((prev) => [newSantriObj, ...prev]);
    }
    setIsSantriModalOpen(false);
  };

  const handleDeleteSantri = (id: string) => {
    if (confirm('Yakin ingin menghapus data santri ini?')) {
      setSantriList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-800 text-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-emerald-950 px-6 py-4 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Panel Kelola Admin & Database Google Sheets</h3>
              <p className="text-xs text-emerald-300">
                Kios Sedekah Bekasi & Rumah Tahfizh Al-Qur'an
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Check Password PIN or Email/Password if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 max-w-lg mx-auto my-auto w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-700 shadow-xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-white">Login Admin Kios Sedekah</h4>
              <p className="text-xs text-slate-400">
                Pilih metode masuk untuk mengelola katalog, data santri, dan integrasi Google Sheets.
              </p>
            </div>

            {/* Login Method Tabs */}
            <div className="flex p-1 bg-slate-800/80 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('email');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  loginMode === 'email'
                    ? 'bg-amber-400 text-emerald-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email & Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('pin');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                  loginMode === 'pin'
                    ? 'bg-amber-400 text-emerald-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>PIN Cepat</span>
              </button>
            </div>

            {/* EMAIL & PASSWORD LOGIN FORM */}
            {loginMode === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Admin</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="admin@kiossedekah.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-emerald-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Password Admin</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-emerald-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-amber-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-medium">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk dengan Email & Password</span>
                </button>
              </form>
            ) : (
              /* PIN LOGIN FORM */
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 text-center">Masukkan 6-Digit PIN Admin</label>
                  <input
                    type="password"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    placeholder="PIN (Default: 123456)"
                    className="w-full text-center tracking-widest text-xl px-4 py-3 bg-slate-800 border border-emerald-700 rounded-xl text-amber-300 focus:outline-none focus:border-amber-400 font-bold"
                    autoFocus
                  />
                  {authError && (
                    <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 font-medium mt-3 text-center">
                      {authError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk dengan PIN</span>
                </button>
              </form>
            )}

            {/* Quick Helper Button for Auto-fill Credentials */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={handleAutoFillDefault}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                ⚡ Isikan Akses Default Demo ({loginMode === 'email' ? 'Email: admin@kiossedekah.com | Pass: admin123' : 'PIN: 123456'})
              </button>
            </div>
          </div>
        ) : (
          /* Main Admin Interface */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Admin Sidebar Navigation */}
            <div className="w-full md:w-64 bg-emerald-950/60 border-b md:border-b-0 md:border-r border-emerald-900 p-3 flex md:flex-col gap-1 overflow-x-auto flex-shrink-0">
              <button
                onClick={() => setActiveAdminTab('sheets')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'sheets'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                <span>Google Sheets Database</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('produk')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'produk'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span>Produk Sembako ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('santri')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'santri'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>Data Santri ({santriList.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('stats')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'stats'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
                <span>Metrik Transparansi</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('settings')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'settings'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <Database className="w-4 h-4 flex-shrink-0" />
                <span>Pengaturan & PIN</span>
              </button>
            </div>

            {/* Admin Active Tab View Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-900">
              
              {/* TAB 1: GOOGLE SHEETS INTEGRATION */}
              {activeAdminTab === 'sheets' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-950 via-slate-800 to-emerald-950 p-5 rounded-2xl border border-amber-400/40 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-sm">
                      <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                      <span>Database Integrasi Google Sheets</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Hubungkan pesanan sembako, transaksi donasi, dan pendaftaran santri baru secara otomatis langsung ke Spreadsheet Google Sheets Anda!
                    </p>
                  </div>

                  {/* Webhook Configuration Form */}
                  <form onSubmit={handleSaveWebhook} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Database className="w-4 h-4 text-amber-400" />
                      <span>Google Apps Script Webhook Endpoint</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Web App URL (Google Apps Script)
                      </label>
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrlState(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Dapatkan Web App URL dengan memasang skrip otomatis di bawah ini ke Google Sheets Anda.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="checkbox"
                        id="autoSyncCheck"
                        checked={autoSync}
                        onChange={(e) => setAutoSyncState(e.target.checked)}
                        className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                      />
                      <label htmlFor="autoSyncCheck" className="text-xs text-slate-200 cursor-pointer font-semibold">
                        Aktifkan Otomatis Sinkronisasi Realtime saat Checkout / Pendaftaran
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow transition-colors"
                      >
                        Simpan Webhook URL
                      </button>

                      <button
                        type="button"
                        onClick={handleTestSync}
                        disabled={testSyncStatus.loading}
                        className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs rounded-xl border border-emerald-700 transition-colors flex items-center space-x-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-amber-300" />
                        <span>Kirim Uji Coba Koneksi</span>
                      </button>
                    </div>

                    {testSyncStatus.message && (
                      <div className={`p-3 rounded-xl text-xs font-semibold ${
                        testSyncStatus.success ? 'bg-emerald-950 text-emerald-200 border border-emerald-700' : 'bg-slate-900 text-amber-300 border border-slate-700'
                      }`}>
                        {testSyncStatus.message}
                      </div>
                    )}
                  </form>

                  {/* Copy Google Apps Script Generator */}
                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Langkah 1-Klik Buat Database Google Sheets</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow"
                      >
                        {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedScript ? 'Tersalin!' : 'Salin Kode Skrip'}</span>
                      </button>
                    </div>

                    <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1">
                      <li>Buka Google Sheets di <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-amber-300 underline font-semibold">sheets.google.com</a>.</li>
                      <li>Klik menu <strong>Extensi (Extensions) → Apps Script</strong>.</li>
                      <li>Hapus semua isi kode default, lalu klik tombol <strong>"Salin Kode Skrip"</strong> di atas dan tempelkan.</li>
                      <li>Klik <strong>Deploy (Terapkan) → New Deployment (Aplikasi Web Baru)</strong>.</li>
                      <li>Atur <em>Execute as</em>: <strong>Me</strong> dan <em>Who has access</em>: <strong>Anyone</strong>.</li>
                      <li>Klik <strong>Deploy</strong>, izinkan akses Google, lalu salin Web App URL dan tempel ke kotak di atas!</li>
                    </ol>

                    <textarea
                      readOnly
                      rows={6}
                      value={GOOGLE_APPS_SCRIPT_CODE}
                      className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-[10px] font-mono text-emerald-300 focus:outline-none"
                    />
                  </div>

                  {/* Manual CSV Export Tools */}
                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export Manual Data Ke Google Sheets (File CSV)</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Unduh data lengkap untuk langsung diimpor ke Google Sheets, Excel, atau software akuntansi:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                      <button
                        onClick={() => exportToCSV('katalog_produk_kios', products)}
                        className="p-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 text-left flex items-center space-x-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>Export Katalog Produk</span>
                      </button>

                      <button
                        onClick={() => exportToCSV('data_santri_tahfizh', santriList)}
                        className="p-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 text-left flex items-center space-x-2"
                      >
                        <Users className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>Export Data Santri</span>
                      </button>

                      <button
                        onClick={() => exportToCSV('laporan_donasi_infaq', donations)}
                        className="p-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 hover:text-amber-300 text-left flex items-center space-x-2"
                      >
                        <BarChart3 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>Export Log Donasi</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUK SEMBAKO MANAGEMENT */}
              {activeAdminTab === 'produk' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">Kelola Produk Sembako & Paket Sedekah</h4>
                      <p className="text-xs text-slate-400">Tambah, edit harga, ubah stok, atau hapus produk.</p>
                    </div>
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Produk Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-600 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-white truncate">{p.name}</h5>
                            <div className="text-amber-300 font-extrabold text-xs">
                              Rp {p.price.toLocaleString('id-ID')} / {p.unit}
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              Stok: {p.stock} | Kategori: {p.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-2 bg-slate-700 hover:bg-emerald-800 text-slate-200 hover:text-white rounded-lg transition-colors"
                            title="Edit Produk"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 bg-slate-700 hover:bg-red-900 text-slate-200 hover:text-red-200 rounded-lg transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DATA SANTRI MANAGEMENT */}
              {activeAdminTab === 'santri' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">Kelola Data Santri Rumah Tahfizh</h4>
                      <p className="text-xs text-slate-400">Tambah santri penerima beasiswa & update progres hafalan.</p>
                    </div>
                    <button
                      onClick={handleOpenAddSantri}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Santri Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {santriList.map((s) => (
                      <div
                        key={s.id}
                        className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img
                            src={s.photo}
                            alt={s.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-white truncate">{s.name} ({s.age} thn)</h5>
                            <div className="text-amber-300 font-bold text-[11px]">
                              Hafalan: Juz {s.currentJuz} dari {s.targetJuz} Juz
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              Status: {s.category} | {s.setoranTerakhir}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditSantri(s)}
                            className="p-2 bg-slate-700 hover:bg-emerald-800 text-slate-200 hover:text-white rounded-lg transition-colors"
                            title="Edit Santri"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSantri(s.id)}
                            className="p-2 bg-slate-700 hover:bg-red-900 text-slate-200 hover:text-red-200 rounded-lg transition-colors"
                            title="Hapus Santri"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: METRIK TRANSPARANSI & STATS */}
              {activeAdminTab === 'stats' && (
                <div className="space-y-6">
                  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                      <span>Edit Ringkasan Statistik Berkah</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Total Beras Terjual/Disalurkan (Kg)</label>
                        <input
                          type="number"
                          value={stats.berasKg}
                          onChange={(e) => setStats({ ...stats, berasKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Jumlah Santri Binaan (Orang)</label>
                        <input
                          type="number"
                          value={stats.santriCount}
                          onChange={(e) => setStats({ ...stats, santriCount: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Total Porsi Makan Bergizi</label>
                        <input
                          type="number"
                          value={stats.porsiMakan}
                          onChange={(e) => setStats({ ...stats, porsiMakan: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Total Dana Tersalurkan (Rp)</label>
                        <input
                          type="number"
                          value={stats.danaTersalurkan}
                          onChange={(e) => setStats({ ...stats, danaTersalurkan: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS & CREDENTIAL MANAGEMENT */}
              {activeAdminTab === 'settings' && (
                <div className="space-y-6">
                  {authSuccessMsg && (
                    <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-200 font-bold flex items-center space-x-2 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  {/* Change Email & Password Form */}
                  <form onSubmit={handleSaveCredentials} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <span>Kelola Email & Password Admin</span>
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Email Admin</label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="admin@kiossedekah.com"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Password Baru (Opsional)</label>
                          <input
                            type="password"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Isi jika ingin mengubah password"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-medium focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Konfirmasi Password Baru</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password baru"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-medium focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Simpan Perubahan Email & Password
                    </button>
                  </form>

                  {/* Change PIN Form */}
                  <form onSubmit={handleChangePin} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Ubah PIN Akses Admin Cepat</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">PIN Baru (Min 4 Digit)</label>
                        <input
                          type="password"
                          required
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Masukkan PIN baru (contoh: 123456)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Konfirmasi PIN Baru</label>
                        <input
                          type="password"
                          required
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Ulangi PIN baru"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Ubah PIN Admin
                    </button>
                  </form>

                  {/* Reset Factory Data */}
                  <div className="bg-red-950/40 p-5 rounded-2xl border border-red-900 space-y-3">
                    <h4 className="font-bold text-sm text-red-300 flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>Reset Ke Data Default Pabrik</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Kembalikan seluruh data produk, santri, dan statistik ke data awal.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke awal? Editan Anda akan terhapus.')) {
                          onResetData();
                          alert('Data berhasil direset ke awal!');
                        }
                      }}
                      className="px-4 py-2.5 bg-red-800 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Seluruh Data App</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* MODAL EDIT PRODUK */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-bold text-base text-amber-400">
                {editingProduct ? 'Edit Produk Sembako' : 'Tambah Produk Sembako Baru'}
              </h4>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={productForm.name || ''}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Contoh: Beras Ramos Super 5kg"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={productForm.category || 'beras'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="beras">Beras</option>
                    <option value="minyak_gula">Minyak & Gula</option>
                    <option value="paket_sedekah">Paket Sedekah</option>
                    <option value="lauk_pauk">Lauk Pauk & Telur</option>
                    <option value="kebutuhan_dapur">Kebutuhan Dapur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-amber-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Normal (Coret)</label>
                  <input
                    type="number"
                    value={productForm.normalPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, normalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satuan</label>
                  <input
                    type="text"
                    value={productForm.unit || 'kg'}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="kg / liter / paket"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stok</label>
                  <input
                    type="number"
                    value={productForm.stock || 50}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Gambar Produk</label>
                <input
                  type="url"
                  value={productForm.image || ''}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Impact Badge (Pesan Berkah)</label>
                <input
                  type="text"
                  value={productForm.impactBadge || ''}
                  onChange={(e) => setProductForm({ ...productForm, impactBadge: e.target.value })}
                  placeholder="Contoh: Menyokong 1 Porsi Beras Santri"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isSubsidy || false}
                    onChange={(e) => setProductForm({ ...productForm, isSubsidy: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span>Tebus Murah / Subsidi</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isSedekahSpecial || false}
                    onChange={(e) => setProductForm({ ...productForm, isSedekahSpecial: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span>Paket Khusus Sedekah</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 text-emerald-950 font-bold rounded-xl shadow"
                >
                  Simpan Produk
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT SANTRI */}
      {isSantriModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-bold text-base text-amber-400">
                {editingSantri ? 'Edit Data Santri' : 'Tambah Santri Baru'}
              </h4>
              <button onClick={() => setIsSantriModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSantri} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Santri *</label>
                <input
                  type="text"
                  required
                  value={santriForm.name || ''}
                  onChange={(e) => setSantriForm({ ...santriForm, name: e.target.value })}
                  placeholder="Nama Lengkap Santri"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={santriForm.age || 12}
                    onChange={(e) => setSantriForm({ ...santriForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Santri</label>
                  <select
                    value={santriForm.category || 'Yatim'}
                    onChange={(e) => setSantriForm({ ...santriForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Yatim">Yatim</option>
                    <option value="Dhuafa">Dhuafa</option>
                    <option value="Reguler">Reguler</option>
                    <option value="Takhassus">Takhassus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Progres Hafalan saat ini (Juz)</label>
                  <input
                    type="number"
                    value={santriForm.currentJuz || 1}
                    onChange={(e) => setSantriForm({ ...santriForm, currentJuz: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Juz Mutqin</label>
                  <input
                    type="number"
                    value={santriForm.targetJuz || 30}
                    onChange={(e) => setSantriForm({ ...santriForm, targetJuz: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Setoran Terakhir</label>
                <input
                  type="text"
                  value={santriForm.setoranTerakhir || ''}
                  onChange={(e) => setSantriForm({ ...santriForm, setoranTerakhir: e.target.value })}
                  placeholder="Contoh: Surah Al-Baqarah Ayat 100-150"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">URL Foto Santri</label>
                <input
                  type="url"
                  value={santriForm.photo || ''}
                  onChange={(e) => setSantriForm({ ...santriForm, photo: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cita-cita / Bio Santri</label>
                <textarea
                  rows={2}
                  value={santriForm.bio || ''}
                  onChange={(e) => setSantriForm({ ...santriForm, bio: e.target.value })}
                  placeholder="Cita-cita dan kisah santri..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 text-emerald-950 font-bold rounded-xl shadow"
                >
                  Simpan Data Santri
                </button>
                <button
                  type="button"
                  onClick={() => setIsSantriModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
