import React, { useState, useEffect } from 'react';
import { SembakoProduct, Santri, DonationRecord, ProductCategory, SiteConfig, ProgramTahfizh } from '../types';
import { INITIAL_SITE_CONFIG } from '../data/mockData';
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
  UserCheck,
  Type,
  Globe,
  Sliders,
  Upload,
  Palette,
  Camera,
  Clock,
  Calendar,
  BookOpen,
  GraduationCap,
  Award,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: SembakoProduct[];
  setProducts: React.Dispatch<React.SetStateAction<SembakoProduct[]>>;
  santriList: Santri[];
  setSantriList: React.Dispatch<React.SetStateAction<Santri[]>>;
  programs?: ProgramTahfizh[];
  setPrograms?: React.Dispatch<React.SetStateAction<ProgramTahfizh[]>>;
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
  siteConfig?: SiteConfig;
  setSiteConfig?: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onResetData: () => void;
  productToEdit?: SembakoProduct | null;
  onClearProductToEdit?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  setProducts,
  santriList,
  setSantriList,
  programs = [],
  setPrograms,
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
  siteConfig,
  setSiteConfig,
  onResetData,
  productToEdit,
  onClearProductToEdit,
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

  // Site Configuration Form State
  const [siteForm, setSiteForm] = useState<SiteConfig>(siteConfig || INITIAL_SITE_CONFIG);

  useEffect(() => {
    if (siteConfig) {
      setSiteForm(siteConfig);
    }
  }, [siteConfig]);

  const handleSaveSiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSiteConfig) {
      setSiteConfig(siteForm);
      setAuthSuccessMsg('Tulisan dan teks seluruh situs berhasil disimpan!');
      setTimeout(() => setAuthSuccessMsg(''), 4000);
    }
  };

  // Image upload handler for Product photo from local device
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductForm((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image upload handler for Santri photo from local device
  const handleSantriPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSantriForm((prev) => ({ ...prev, photo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image upload handler for any of the 9 gallery photos from local device
  const handleGalleryPhotoUpload = (photoKey: keyof SiteConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar! Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSiteForm((prev) => ({ ...prev, [photoKey]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Settings Credentials State
  const [editEmail, setEditEmail] = useState(adminEmail);
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Navigation tab inside Admin Panel
  const [activeAdminTab, setActiveAdminTab] = useState<'sheets' | 'produk' | 'santri' | 'program' | 'stats' | 'site' | 'settings'>('sheets');

  // Program Tahfizh Form State (Add / Edit)
  const [editingProgram, setEditingProgram] = useState<ProgramTahfizh | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [programForm, setProgramForm] = useState<{
    title: string;
    badge: string;
    schedule: string;
    description: string;
    targetAudience: string;
    featureListText: string;
    iconName: string;
  }>({
    title: '',
    badge: '100% BEASISWA GRATIS',
    schedule: 'Senin - Ahad (Asrama Mukim)',
    description: '',
    targetAudience: 'Anak Yatim & Dhuafa Usia 8 - 15 Tahun',
    featureListText: 'Asrama nyaman dan sehat\nAsupan sembako & nutrisi harian dijamin Kios Sedekah\nTarget 30 Juz dalam 2 tahun',
    iconName: 'BookOpen',
  });

  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      title: '',
      badge: '100% BEASISWA GRATIS',
      schedule: 'Senin - Ahad (Asrama Mukim)',
      description: '',
      targetAudience: 'Anak Yatim & Dhuafa Usia 8 - 15 Tahun',
      featureListText: 'Asrama nyaman dan sehat\nAsupan sembako & nutrisi harian dijamin Kios Sedekah\nTarget 30 Juz dalam 2 tahun',
      iconName: 'BookOpen',
    });
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (prog: ProgramTahfizh) => {
    setEditingProgram(prog);
    setProgramForm({
      title: prog.title,
      badge: prog.badge,
      schedule: prog.schedule,
      description: prog.description,
      targetAudience: prog.targetAudience,
      featureListText: prog.featureList ? prog.featureList.join('\n') : '',
      iconName: prog.iconName || 'BookOpen',
    });
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setPrograms) return;

    const featureList = programForm.featureListText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProgram) {
      const updated: ProgramTahfizh = {
        ...editingProgram,
        title: programForm.title,
        badge: programForm.badge,
        schedule: programForm.schedule,
        description: programForm.description,
        targetAudience: programForm.targetAudience,
        featureList,
        iconName: programForm.iconName,
      };
      setPrograms((prev) => prev.map((p) => (p.id === editingProgram.id ? updated : p)));
      setAuthSuccessMsg('Program Tahfizh berhasil diperbarui!');
    } else {
      const newProg: ProgramTahfizh = {
        id: `prog-${Date.now()}`,
        title: programForm.title,
        badge: programForm.badge,
        schedule: programForm.schedule,
        description: programForm.description,
        targetAudience: programForm.targetAudience,
        featureList,
        iconName: programForm.iconName,
      };
      setPrograms((prev) => [...prev, newProg]);
      setAuthSuccessMsg('Program Tahfizh baru berhasil ditambahkan!');
    }

    setIsProgramModalOpen(false);
    setTimeout(() => setAuthSuccessMsg(''), 4000);
  };

  const handleDeleteProgram = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kartu program ini?')) {
      if (setPrograms) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
        setAuthSuccessMsg('Program Tahfizh berhasil dihapus.');
        setTimeout(() => setAuthSuccessMsg(''), 4000);
      }
    }
  };

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

  useEffect(() => {
    if (isOpen && productToEdit) {
      setActiveAdminTab('produk');
      handleOpenEditProduct(productToEdit);
      if (onClearProductToEdit) {
        onClearProductToEdit();
      }
    }
  }, [isOpen, productToEdit]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    let updatedProducts: SembakoProduct[] = [];

    if (editingProduct) {
      updatedProducts = products.map((item) =>
        item.id === editingProduct.id ? ({ ...item, ...productForm } as SembakoProduct) : item
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
      updatedProducts = [newProd, ...products];
    }

    setProducts(updatedProducts);

    if (isAutoSyncEnabled()) {
      sendToGoogleSheets('PRODUCT_UPDATE', updatedProducts).catch(console.error);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini dari katalog?')) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);

      if (isAutoSyncEnabled()) {
        sendToGoogleSheets('PRODUCT_UPDATE', updatedProducts).catch(console.error);
      }
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
                onClick={() => setActiveAdminTab('program')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'program'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span>Program Tahfizh ({programs.length})</span>
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
                onClick={() => setActiveAdminTab('site')}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap ${
                  activeAdminTab === 'site'
                    ? 'bg-amber-400 text-emerald-950 shadow-md'
                    : 'text-emerald-200 hover:bg-emerald-900'
                }`}
              >
                <Palette className="w-4 h-4 flex-shrink-0" />
                <span>Edit Warna, 9 Foto & Teks</span>
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

              {/* TAB 3.5: KELOLA PROGRAM PENDIDIKAN TAHFIZH */}
              {activeAdminTab === 'program' && (
                <div className="space-y-6">
                  {authSuccessMsg && (
                    <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-200 font-bold flex items-center space-x-2 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Kelola Kartu Program Pendidikan Tahfizh ({programs.length})</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Tambah, edit, atau hapus kartu program pendidikan tahfizh yang tampil pada halaman situs.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddProgram}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Program Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {programs.map((prog) => (
                      <div
                        key={prog.id}
                        className="bg-slate-800 p-4 rounded-2xl border border-slate-700 hover:border-amber-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                              {prog.badge}
                            </span>
                            <span className="text-xs text-amber-300 font-semibold flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              <span>{prog.schedule}</span>
                            </span>
                          </div>

                          <h5 className="font-black text-sm text-white">{prog.title}</h5>
                          <p className="text-xs text-slate-300 leading-relaxed">{prog.description}</p>

                          <div className="pt-2 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                            <div className="text-slate-300">
                              <span className="text-amber-300 font-semibold">Sasaran: </span>
                              <strong>{prog.targetAudience}</strong>
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              {prog.featureList?.length || 0} Poin Keunggulan / Fasilitas
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleOpenEditProgram(prog)}
                            className="px-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Card</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProgram(prog.id)}
                            className="px-3 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
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

              {/* TAB 5: WARNA TULISAN, 9 FOTO GALERI & GLOBAL TEKS */}
              {activeAdminTab === 'site' && (
                <div className="space-y-6">
                  {authSuccessMsg && (
                    <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-200 font-bold flex items-center space-x-2 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  {/* 1. KUSTOMISASI WARNA TULISAN */}
                  <form onSubmit={handleSaveSiteConfig} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Palette className="w-4 h-4 text-amber-400" />
                        <span>Kustomisasi Warna Tulisan Situs</span>
                      </h4>
                      <span className="text-[10px] bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                        Warna Realtime
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Ubah warna tulisan judul utama, sorotan amber, deskripsi body, kartu, dan tombol secara mudah.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      {/* Warna Tulisan Utama */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2">
                        <label className="block text-slate-200 font-bold">Warna Tulisan Utama</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={siteForm.textColorMain || '#ffffff'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorMain: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteForm.textColorMain || '#ffffff'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorMain: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Warna Tulisan Sorotan / Highlight */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2">
                        <label className="block text-slate-200 font-bold">Warna Tulisan Sorotan (Highlight)</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={siteForm.textColorHighlight || '#fbbf24'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorHighlight: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteForm.textColorHighlight || '#fbbf24'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorHighlight: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-amber-300 font-mono text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Warna Tulisan Deskripsi Body */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2">
                        <label className="block text-slate-200 font-bold">Warna Tulisan Deskripsi / Body</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={siteForm.textColorBody || '#a7f3d0'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorBody: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteForm.textColorBody || '#a7f3d0'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorBody: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-emerald-200 font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Warna Tulisan Kartu / Label */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2">
                        <label className="block text-slate-200 font-bold">Warna Tulisan Kartu & Badge</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={siteForm.textColorCard || '#fef08a'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorCard: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteForm.textColorCard || '#fef08a'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorCard: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-amber-200 font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Warna Tulisan Tombol Action */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2 sm:col-span-2 md:col-span-1">
                        <label className="block text-slate-200 font-bold">Warna Tulisan Tombol / CTA</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={siteForm.textColorButton || '#022c22'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorButton: e.target.value })}
                            className="w-9 h-9 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteForm.textColorButton || '#022c22'}
                            onChange={(e) => setSiteForm({ ...siteForm, textColorButton: e.target.value })}
                            className="flex-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-emerald-300 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
                      >
                        <Palette className="w-4 h-4 text-emerald-950" />
                        <span>Simpan Perubahan Warna Tulisan</span>
                      </button>
                    </div>
                  </form>

                  {/* 2. KELOLA 9 FOTO GALERI */}
                  <form onSubmit={handleSaveSiteConfig} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Kelola 9 Foto Galeri Kegiatan & Kios</span>
                      </h4>
                      <span className="text-[10px] bg-emerald-800 text-amber-300 border border-emerald-600 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                        9 Slot Foto
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Unggah foto langsung dari perangkat atau tempel URL gambar untuk Foto 1 s/d Foto 9.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { num: 1, key: 'photo1' as keyof SiteConfig, capKey: 'photo1Caption' as keyof SiteConfig, label: 'Foto Pertama (Foto 1)' },
                        { num: 2, key: 'photo2' as keyof SiteConfig, capKey: 'photo2Caption' as keyof SiteConfig, label: 'Foto Kedua (Foto 2)' },
                        { num: 3, key: 'photo3' as keyof SiteConfig, capKey: 'photo3Caption' as keyof SiteConfig, label: 'Foto Ketiga (Foto 3)' },
                        { num: 4, key: 'photo4' as keyof SiteConfig, capKey: 'photo4Caption' as keyof SiteConfig, label: 'Foto Keempat (Foto 4)' },
                        { num: 5, key: 'photo5' as keyof SiteConfig, capKey: 'photo5Caption' as keyof SiteConfig, label: 'Foto Kelima (Foto 5)' },
                        { num: 6, key: 'photo6' as keyof SiteConfig, capKey: 'photo6Caption' as keyof SiteConfig, label: 'Foto Keenam (Foto 6)' },
                        { num: 7, key: 'photo7' as keyof SiteConfig, capKey: 'photo7Caption' as keyof SiteConfig, label: 'Foto Ketujuh (Foto 7)' },
                        { num: 8, key: 'photo8' as keyof SiteConfig, capKey: 'photo8Caption' as keyof SiteConfig, label: 'Foto Kedelapan (Foto 8)' },
                        { num: 9, key: 'photo9' as keyof SiteConfig, capKey: 'photo9Caption' as keyof SiteConfig, label: 'Foto Kesembilan (Foto 9)' },
                      ].map((item) => {
                        const photoVal = (siteForm[item.key] as string) || '';
                        const captionVal = (siteForm[item.capKey] as string) || '';

                        return (
                          <div key={item.num} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-700 space-y-3 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{item.label}</span>
                                </span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold">
                                  Slot {item.num}
                                </span>
                              </div>

                              {/* Preview thumbnail */}
                              {photoVal ? (
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-400/50 mb-2 group">
                                  <img
                                    src={photoVal}
                                    alt={`Preview ${item.label}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setSiteForm({ ...siteForm, [item.key]: '' })}
                                    className="absolute top-2 right-2 p-1.5 bg-red-950/90 hover:bg-red-900 text-red-200 rounded-lg text-xs shadow transition-colors"
                                    title="Hapus foto ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="aspect-video rounded-xl bg-slate-950 border border-dashed border-slate-700 mb-2 flex flex-col items-center justify-center text-slate-500 text-xs">
                                  <Camera className="w-6 h-6 mb-1 text-slate-600" />
                                  <span>Belum ada foto</span>
                                </div>
                              )}

                              {/* File uploader & URL paste */}
                              <div className="space-y-2">
                                <label className="cursor-pointer bg-emerald-900 hover:bg-emerald-800 text-amber-300 w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-700 transition-colors shadow-sm">
                                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                                  <span>Ambil Foto dari Perangkat</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleGalleryPhotoUpload(item.key, e)}
                                    className="hidden"
                                  />
                                </label>

                                <input
                                  type="url"
                                  value={photoVal}
                                  onChange={(e) => setSiteForm({ ...siteForm, [item.key]: e.target.value })}
                                  placeholder="Atau tempel URL gambar (https://...)"
                                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-[11px] focus:outline-none focus:border-amber-400"
                                />

                                <div>
                                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                                    Keterangan / Judul Foto {item.num}
                                  </label>
                                  <input
                                    type="text"
                                    value={captionVal}
                                    onChange={(e) => setSiteForm({ ...siteForm, [item.capKey]: e.target.value })}
                                    placeholder={`Keterangan untuk ${item.label}...`}
                                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 text-[11px] font-medium focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-slate-700 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2"
                      >
                        <Camera className="w-4 h-4 text-emerald-950" />
                        <span>Simpan Perubahan 9 Foto Galeri</span>
                      </button>
                    </div>
                  </form>

                  {/* 3. KELOLA JADWAL HARIAN SANTRI RUMAH TAHFIZH */}
                  <form onSubmit={handleSaveSiteConfig} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Kelola Jadwal Harian Santri Rumah Tahfizh</span>
                      </h4>
                      <span className="text-[10px] bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                        Rutinitas Santri
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Ubah judul section, badge, deskripsi, serta jadwal waktu dan kegiatan harian para santri.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Judul Header Section Program Pendidikan Tahfizh</label>
                        <input
                          type="text"
                          value={siteForm.programHeaderTitle || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, programHeaderTitle: e.target.value })}
                          placeholder="Program Pendidikan Tahfizh Al-Qur'an"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Badge Atas Judul Jadwal</label>
                        <input
                          type="text"
                          value={siteForm.scheduleBadgeText || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, scheduleBadgeText: e.target.value })}
                          placeholder="Rutinitas Asrama"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Utama Section Jadwal</label>
                        <input
                          type="text"
                          value={siteForm.scheduleTitleMain || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, scheduleTitleMain: e.target.value })}
                          placeholder="Jadwal Harian Santri Rumah Tahfizh"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Deskripsi Singkat Jadwal Harian</label>
                        <textarea
                          rows={2}
                          value={siteForm.scheduleSubtitle || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, scheduleSubtitle: e.target.value })}
                          placeholder="Deskripsi kegiatan disiplin santri..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Slot Jadwal 1 s/d 8 */}
                    <div className="space-y-3 pt-2 border-t border-slate-700">
                      <label className="block text-xs font-bold text-amber-300">
                        Daftar Baris Waktu & Kegiatan (Slot 1 s/d 8)
                      </label>

                      <div className="grid grid-cols-1 gap-2.5">
                        {[
                          { num: 1, timeKey: 'schedule1Time' as keyof SiteConfig, actKey: 'schedule1Activity' as keyof SiteConfig },
                          { num: 2, timeKey: 'schedule2Time' as keyof SiteConfig, actKey: 'schedule2Activity' as keyof SiteConfig },
                          { num: 3, timeKey: 'schedule3Time' as keyof SiteConfig, actKey: 'schedule3Activity' as keyof SiteConfig },
                          { num: 4, timeKey: 'schedule4Time' as keyof SiteConfig, actKey: 'schedule4Activity' as keyof SiteConfig },
                          { num: 5, timeKey: 'schedule5Time' as keyof SiteConfig, actKey: 'schedule5Activity' as keyof SiteConfig },
                          { num: 6, timeKey: 'schedule6Time' as keyof SiteConfig, actKey: 'schedule6Activity' as keyof SiteConfig },
                          { num: 7, timeKey: 'schedule7Time' as keyof SiteConfig, actKey: 'schedule7Activity' as keyof SiteConfig },
                          { num: 8, timeKey: 'schedule8Time' as keyof SiteConfig, actKey: 'schedule8Activity' as keyof SiteConfig },
                        ].map((slot) => (
                          <div key={slot.num} className="bg-slate-900 p-2.5 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-2">
                            <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-1 rounded font-mono font-bold whitespace-nowrap">
                              Baris {slot.num}
                            </span>
                            <input
                              type="text"
                              value={(siteForm[slot.timeKey] as string) || ''}
                              onChange={(e) => setSiteForm({ ...siteForm, [slot.timeKey]: e.target.value })}
                              placeholder="cth: 04.00 - 05.00"
                              className="w-full sm:w-36 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-400"
                            />
                            <input
                              type="text"
                              value={(siteForm[slot.actKey] as string) || ''}
                              onChange={(e) => setSiteForm({ ...siteForm, [slot.actKey]: e.target.value })}
                              placeholder={`Deskripsi kegiatan baris ${slot.num}... (kosongkan jika tidak dipakai)`}
                              className="w-full flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
                      >
                        <Clock className="w-4 h-4 text-emerald-950" />
                        <span>Simpan Perubahan Jadwal Harian</span>
                      </button>
                    </div>
                  </form>

                  {/* 3. GLOBAL SITE TEXT EDITORS */}
                  <form onSubmit={handleSaveSiteConfig} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Type className="w-4 h-4 text-amber-400" />
                        <span>Pengaturan Seluruh Tulisan & Teks Informasi Situs</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nama Utama Aplikasi / Brand</label>
                        <input
                          type="text"
                          required
                          value={siteForm.appName}
                          onChange={(e) => setSiteForm({ ...siteForm, appName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Sub-Judul / Label Lembaga</label>
                        <input
                          type="text"
                          value={siteForm.appSubtitle}
                          onChange={(e) => setSiteForm({ ...siteForm, appSubtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Running Text Pengumuman Atas (Ticker)</label>
                        <input
                          type="text"
                          value={siteForm.announcementText}
                          onChange={(e) => setSiteForm({ ...siteForm, announcementText: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Badge Tagline Hero Atas</label>
                        <input
                          type="text"
                          value={siteForm.heroBadgeText}
                          onChange={(e) => setSiteForm({ ...siteForm, heroBadgeText: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tagline Motto Logo</label>
                        <input
                          type="text"
                          value={siteForm.aboutTagline}
                          onChange={(e) => setSiteForm({ ...siteForm, aboutTagline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Utama Hero</label>
                        <input
                          type="text"
                          value={siteForm.heroTitleMain}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTitleMain: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Sorotan Hero (Amber Gradient)</label>
                        <input
                          type="text"
                          value={siteForm.heroTitleHighlight}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTitleHighlight: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Deskripsi Lengkap Hero</label>
                        <textarea
                          rows={2}
                          value={siteForm.heroSubtitle}
                          onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Target Beras Bulanan (Kg)</label>
                        <input
                          type="number"
                          value={siteForm.heroBerasGoalKg}
                          onChange={(e) => setSiteForm({ ...siteForm, heroBerasGoalKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Beras Terkumpul Saat Ini (Kg)</label>
                        <input
                          type="number"
                          value={siteForm.heroBerasCurrentKg}
                          onChange={(e) => setSiteForm({ ...siteForm, heroBerasCurrentKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Tampilan (cth: 0812-3456-7890)</label>
                        <input
                          type="text"
                          value={siteForm.waNumberDisplay}
                          onChange={(e) => setSiteForm({ ...siteForm, waNumberDisplay: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nomor WA Format Internasional (cth: 6281234567890)</label>
                        <input
                          type="text"
                          value={siteForm.waNumberDigits}
                          onChange={(e) => setSiteForm({ ...siteForm, waNumberDigits: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nama Bank Infaq (cth: Bank Syariah Indonesia (BSI))</label>
                        <input
                          type="text"
                          value={siteForm.bankBsiName}
                          onChange={(e) => setSiteForm({ ...siteForm, bankBsiName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nomor Rekening Bank</label>
                        <input
                          type="text"
                          value={siteForm.bankBsiAccount}
                          onChange={(e) => setSiteForm({ ...siteForm, bankBsiAccount: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Atas Nama Rekening</label>
                        <input
                          type="text"
                          value={siteForm.bankAccountHolder}
                          onChange={(e) => setSiteForm({ ...siteForm, bankAccountHolder: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">URL Repositori GitHub</label>
                        <input
                          type="url"
                          value={siteForm.githubRepoUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, githubRepoUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Alamat Lengkap Organisasi / Lembaga</label>
                        <textarea
                          rows={2}
                          value={siteForm.organizationAddress}
                          onChange={(e) => setSiteForm({ ...siteForm, organizationAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Deskripsi Footer Bottom</label>
                        <textarea
                          rows={2}
                          value={siteForm.footerDescription}
                          onChange={(e) => setSiteForm({ ...siteForm, footerDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
                    >
                      <Type className="w-4 h-4 text-emerald-950" />
                      <span>Simpan Seluruh Perubahan Teks Situs</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 6: SETTINGS & CREDENTIAL MANAGEMENT */}
              {activeAdminTab === 'settings' && (
                <div className="space-y-6">
                  {authSuccessMsg && (
                    <div className="p-3 bg-emerald-950 border border-emerald-700 rounded-xl text-xs text-emerald-200 font-bold flex items-center space-x-2 shadow-lg">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>{authSuccessMsg}</span>
                    </div>
                  )}

                  {/* Site Content & Global Text Editor */}
                  <form onSubmit={handleSaveSiteConfig} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                      <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                        <Type className="w-4 h-4 text-amber-400" />
                        <span>Pengaturan Seluruh Tulisan & Teks Situs</span>
                      </h4>
                      <span className="text-[10px] bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                        Kustomisasi Keseluruhan
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Ubah nama aplikasi, teks pengumuman running text, headline hero, kontak WhatsApp, nomor rekening, serta alamat yayasan secara langsung.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nama Utama Aplikasi / Brand</label>
                        <input
                          type="text"
                          required
                          value={siteForm.appName}
                          onChange={(e) => setSiteForm({ ...siteForm, appName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Sub-Judul / Label Lembaga</label>
                        <input
                          type="text"
                          value={siteForm.appSubtitle}
                          onChange={(e) => setSiteForm({ ...siteForm, appSubtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Running Text Pengumuman Atas (Ticker)</label>
                        <input
                          type="text"
                          value={siteForm.announcementText}
                          onChange={(e) => setSiteForm({ ...siteForm, announcementText: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Badge Tagline Hero Atas</label>
                        <input
                          type="text"
                          value={siteForm.heroBadgeText}
                          onChange={(e) => setSiteForm({ ...siteForm, heroBadgeText: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tagline Motto Logo</label>
                        <input
                          type="text"
                          value={siteForm.aboutTagline}
                          onChange={(e) => setSiteForm({ ...siteForm, aboutTagline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Utama Hero</label>
                        <input
                          type="text"
                          value={siteForm.heroTitleMain}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTitleMain: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Sorotan Hero (Amber Gradient)</label>
                        <input
                          type="text"
                          value={siteForm.heroTitleHighlight}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTitleHighlight: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Deskripsi Lengkap Hero</label>
                        <textarea
                          rows={2}
                          value={siteForm.heroSubtitle}
                          onChange={(e) => setSiteForm({ ...siteForm, heroSubtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Target Beras Bulanan (Kg)</label>
                        <input
                          type="number"
                          value={siteForm.heroBerasGoalKg}
                          onChange={(e) => setSiteForm({ ...siteForm, heroBerasGoalKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Beras Terkumpul Saat Ini (Kg)</label>
                        <input
                          type="number"
                          value={siteForm.heroBerasCurrentKg}
                          onChange={(e) => setSiteForm({ ...siteForm, heroBerasCurrentKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Tampilan (cth: 0812-3456-7890)</label>
                        <input
                          type="text"
                          value={siteForm.waNumberDisplay}
                          onChange={(e) => setSiteForm({ ...siteForm, waNumberDisplay: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nomor WA Format Internasional (cth: 6281234567890)</label>
                        <input
                          type="text"
                          value={siteForm.waNumberDigits}
                          onChange={(e) => setSiteForm({ ...siteForm, waNumberDigits: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nama Bank Infaq (cth: Bank Syariah Indonesia (BSI))</label>
                        <input
                          type="text"
                          value={siteForm.bankBsiName}
                          onChange={(e) => setSiteForm({ ...siteForm, bankBsiName: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Nomor Rekening Bank</label>
                        <input
                          type="text"
                          value={siteForm.bankBsiAccount}
                          onChange={(e) => setSiteForm({ ...siteForm, bankBsiAccount: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Atas Nama Rekening</label>
                        <input
                          type="text"
                          value={siteForm.bankAccountHolder}
                          onChange={(e) => setSiteForm({ ...siteForm, bankAccountHolder: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">URL Repositori GitHub</label>
                        <input
                          type="url"
                          value={siteForm.githubRepoUrl}
                          onChange={(e) => setSiteForm({ ...siteForm, githubRepoUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Alamat Lengkap Organisasi / Lembaga</label>
                        <textarea
                          rows={2}
                          value={siteForm.organizationAddress}
                          onChange={(e) => setSiteForm({ ...siteForm, organizationAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tombol CTA Utama 1 (Kios)</label>
                        <input
                          type="text"
                          value={siteForm.heroCtaPrimary || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCtaPrimary: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tombol CTA Utama 2 (Sedekah)</label>
                        <input
                          type="text"
                          value={siteForm.heroCtaSecondary || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCtaSecondary: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Teks Lencana Jaminan 1</label>
                        <input
                          type="text"
                          value={siteForm.heroTrust1 || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTrust1: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Teks Lencana Jaminan 2</label>
                        <input
                          type="text"
                          value={siteForm.heroTrust2 || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTrust2: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Teks Lencana Jaminan 3</label>
                        <input
                          type="text"
                          value={siteForm.heroTrust3 || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroTrust3: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Lencana Kartu Kanan (Badge Yellow)</label>
                        <input
                          type="text"
                          value={siteForm.heroCardBadge || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardBadge: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Kartu Rumah Tahfizh</label>
                        <input
                          type="text"
                          value={siteForm.heroCardTitle || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardTitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Sub-Judul Kartu Rumah Tahfizh</label>
                        <input
                          type="text"
                          value={siteForm.heroCardSubtitle || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardSubtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Target Hafalan Kartu</label>
                        <input
                          type="text"
                          value={siteForm.heroCardTarget || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardTarget: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Label Kebutuhan Beras Bulanan</label>
                        <input
                          type="text"
                          value={siteForm.heroCardGoalLabel || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardGoalLabel: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Tombol Fitur Kartu 1</label>
                        <input
                          type="text"
                          value={siteForm.heroCardFeature1Title || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardFeature1Title: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Sub-Teks Fitur Kartu 1</label>
                        <input
                          type="text"
                          value={siteForm.heroCardFeature1Desc || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardFeature1Desc: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Judul Tombol Fitur Kartu 2</label>
                        <input
                          type="text"
                          value={siteForm.heroCardFeature2Title || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardFeature2Title: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Sub-Teks Fitur Kartu 2</label>
                        <input
                          type="text"
                          value={siteForm.heroCardFeature2Desc || ''}
                          onChange={(e) => setSiteForm({ ...siteForm, heroCardFeature2Desc: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Deskripsi Footer Bottom</label>
                        <textarea
                          rows={2}
                          value={siteForm.footerDescription}
                          onChange={(e) => setSiteForm({ ...siteForm, footerDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center space-x-2"
                    >
                      <Type className="w-4 h-4 text-emerald-950" />
                      <span>Simpan Perubahan Teks Seluruh Situs</span>
                    </button>
                  </form>

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
                <label className="block text-slate-300 font-semibold mb-1">Foto Gambar Produk</label>
                <div className="space-y-2">
                  {productForm.image && (
                    <div className="flex items-center space-x-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
                      <img
                        src={productForm.image}
                        alt="Preview Produk"
                        className="w-14 h-14 object-cover rounded-lg border border-amber-400/50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-amber-300 font-bold truncate">Foto Terpasang</p>
                        <p className="text-[10px] text-slate-400 truncate">{productForm.image.startsWith('data:') ? 'Foto diunggah dari perangkat' : productForm.image}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image: '' })}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="cursor-pointer bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-600 shadow-sm transition-all">
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>Pilih Foto dari Perangkat</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={productForm.image || ''}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="Atau tempel URL Gambar (https://...)"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
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
                <label className="block text-slate-300 font-semibold mb-1">Foto Profile Santri</label>
                <div className="space-y-2">
                  {santriForm.photo && (
                    <div className="flex items-center space-x-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
                      <img
                        src={santriForm.photo}
                        alt="Preview Santri"
                        className="w-14 h-14 object-cover rounded-lg border border-amber-400/50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-amber-300 font-bold truncate">Foto Santri Terpasang</p>
                        <p className="text-[10px] text-slate-400 truncate">{santriForm.photo.startsWith('data:') ? 'Foto diunggah dari perangkat' : santriForm.photo}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSantriForm({ ...santriForm, photo: '' })}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="cursor-pointer bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-600 shadow-sm transition-all">
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>Pilih Foto Santri dari Perangkat</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSantriPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={santriForm.photo || ''}
                      onChange={(e) => setSantriForm({ ...santriForm, photo: e.target.value })}
                      placeholder="Atau tempel URL Foto Santri (https://...)"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
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

      {/* ADD / EDIT PROGRAM TAHFIZH MODAL */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-base flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{editingProgram ? 'Edit Program Tahfizh' : 'Tambah Program Tahfizh Baru'}</span>
              </h4>
              <button
                onClick={() => setIsProgramModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Program Tahfizh</label>
                <input
                  type="text"
                  required
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  placeholder="Contoh: Program Mukim Beasiswa Full Yatim & Dhuafa"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Badge Sorotan (Kuning)</label>
                  <input
                    type="text"
                    required
                    value={programForm.badge}
                    onChange={(e) => setProgramForm({ ...programForm, badge: e.target.value })}
                    placeholder="Contoh: 100% BEASISWA GRATIS"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jadwal & Waktu Program</label>
                  <input
                    type="text"
                    required
                    value={programForm.schedule}
                    onChange={(e) => setProgramForm({ ...programForm, schedule: e.target.value })}
                    placeholder="Contoh: Senin - Ahad (Asrama Mukim)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Ringkas Program</label>
                <textarea
                  rows={3}
                  required
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  placeholder="Fasilitas tempat tinggal, tempat belajar, makanan gizi sembako gratis..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sasaran Peserta / Usia</label>
                <input
                  type="text"
                  required
                  value={programForm.targetAudience}
                  onChange={(e) => setProgramForm({ ...programForm, targetAudience: e.target.value })}
                  placeholder="Contoh: Anak Yatim & Dhuafa Usia 8 - 15 Tahun"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Daftar Fasilitas & Keunggulan (1 baris = 1 poin centang)
                </label>
                <textarea
                  rows={4}
                  value={programForm.featureListText}
                  onChange={(e) => setProgramForm({ ...programForm, featureListText: e.target.value })}
                  placeholder={`Asrama nyaman dan sehat\nAsupan sembako & nutrisi harian dijamin Kios Sedekah\nTarget 30 Juz dalam 2 tahun`}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 leading-relaxed font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Setiap baris baru akan dijadikan 1 poin fasilitas dengan ikon centang di kartu program.
                </p>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl shadow transition-all"
                >
                  {editingProgram ? 'Simpan Perubahan Program' : 'Tambah Program Baru'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
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
