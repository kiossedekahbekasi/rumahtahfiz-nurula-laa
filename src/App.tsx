import React, { useState, useEffect } from 'react';
import { 
  SembakoProduct, 
  CartItem, 
  ProductCategory, 
  DonationRecord,
  Santri,
  SiteConfig
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SANTRI, 
  PROGRAM_TAHFIZH_LIST, 
  INITIAL_DONATIONS,
  MOCK_TRANSPARENCY_STATS,
  INITIAL_SITE_CONFIG
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { KiosSembako } from './components/KiosSembako';
import { PaketSedekahSection } from './components/PaketSedekahSection';
import { RumahTahfizh } from './components/RumahTahfizh';
import { PendaftaranSantri } from './components/PendaftaranSantri';
import { TransparansiLaporan } from './components/TransparansiLaporan';
import { ZakatKalkulator } from './components/ZakatKalkulator';
import { CartDrawer } from './components/CartDrawer';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { Footer } from './components/Footer';
import { PhotoGallerySection } from './components/PhotoGallerySection';

// Local Storage Keys
const STORAGE_KEY_PRODUCTS = 'ksb_products_data_v1';
const STORAGE_KEY_SANTRI = 'ksb_santri_data_v1';
const STORAGE_KEY_DONATIONS = 'ksb_donations_data_v1';
const STORAGE_KEY_STATS = 'ksb_stats_data_v1';
const STORAGE_KEY_ADMIN_PIN = 'ksb_admin_pin_code';
const STORAGE_KEY_ADMIN_EMAIL = 'ksb_admin_email';
const STORAGE_KEY_ADMIN_PASSWORD = 'ksb_admin_password';
const STORAGE_KEY_SITE_CONFIG = 'ksb_site_config_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'kios' | 'tahfizh' | 'pendaftaran' | 'transparansi' | 'kalkulator'>('kios');
  
  // App Data State (Initialized from LocalStorage if present)
  const [products, setProducts] = useState<SembakoProduct[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SITE_CONFIG);
    return saved ? JSON.parse(saved) : INITIAL_SITE_CONFIG;
  });

  const [santriList, setSantriList] = useState<Santri[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SANTRI);
    return saved ? JSON.parse(saved) : INITIAL_SANTRI;
  });

  const [programs] = useState(PROGRAM_TAHFIZH_LIST);

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DONATIONS);
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STATS);
    return saved ? JSON.parse(saved) : {
      berasKg: MOCK_TRANSPARENCY_STATS.totalSembakoTerjualKg,
      santriCount: MOCK_TRANSPARENCY_STATS.santriPenerimaBeasiswa,
      porsiMakan: MOCK_TRANSPARENCY_STATS.porsiMakanBergiziDisalurkan,
      danaTersalurkan: MOCK_TRANSPARENCY_STATS.totalDanaTerhimpunRp,
    };
  });

  const [adminPin, setAdminPin] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || '123456';
  });

  const [adminEmail, setAdminEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_EMAIL) || 'admin@kiossedekah.com';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_PASSWORD) || 'admin123';
  });

  // Modals & Drawer State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('semua');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Sync Data to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SANTRI, JSON.stringify(santriList));
  }, [santriList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, adminPin);
  }, [adminPin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_EMAIL, adminEmail);
  }, [adminEmail]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_PASSWORD, adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SITE_CONFIG, JSON.stringify(siteConfig));
  }, [siteConfig]);

  // Total items in cart
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Add product to cart
  const handleAddToCart = (product: SembakoProduct, isDonationDirectToTahfizh: boolean) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.isDonationDirectToTahfizh === isDonationDirectToTahfizh);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.isDonationDirectToTahfizh === isDonationDirectToTahfizh
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, isDonationDirectToTahfizh }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleToggleDonation = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, isDonationDirectToTahfizh: !item.isDonationDirectToTahfizh }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Quick Action: Sponsor a specific Santri
  const handleSponsorSantri = (santriName: string) => {
    const berasProduct = products.find((p) => p.id === 'p-3') || products[0];
    handleAddToCart(
      {
        ...berasProduct,
        name: `Paket Beras & Gizi Santri (${santriName})`,
      },
      true
    );
    setIsCartOpen(true);
  };

  // Quick Action: Add custom Infaq from Zakat Calculator
  const handleAddInfaqToCart = (amount: number, packageName: string) => {
    const customInfaqProduct: SembakoProduct = {
      id: 'custom-infaq-' + Date.now(),
      name: packageName,
      category: 'paket_sedekah',
      price: amount,
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
      unit: 'paket',
      stock: 999,
      description: 'Penetapan Infaq & Zakat Sembako dari Kalkulator Kios Sedekah.',
      isSedekahSpecial: true,
      impactBadge: 'Zakat & Infaq Tepat Sasaran',
    };

    handleAddToCart(customInfaqProduct, true);
    setIsCartOpen(true);
  };

  // Reset to initial factory data
  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSiteConfig(INITIAL_SITE_CONFIG);
    setSantriList(INITIAL_SANTRI);
    setDonations(INITIAL_DONATIONS);
    setStats({
      berasKg: MOCK_TRANSPARENCY_STATS.totalSembakoTerjualKg,
      santriCount: MOCK_TRANSPARENCY_STATS.santriPenerimaBeasiswa,
      porsiMakan: MOCK_TRANSPARENCY_STATS.porsiMakanBergiziDisalurkan,
      danaTersalurkan: MOCK_TRANSPARENCY_STATS.totalDanaTerhimpunRp,
    });
    setAdminPin('123456');
    setAdminEmail('admin@kiossedekah.com');
    setAdminPassword('admin123');
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_SITE_CONFIG);
    localStorage.removeItem(STORAGE_KEY_SANTRI);
    localStorage.removeItem(STORAGE_KEY_DONATIONS);
    localStorage.removeItem(STORAGE_KEY_STATS);
    localStorage.removeItem(STORAGE_KEY_ADMIN_PIN);
    localStorage.removeItem(STORAGE_KEY_ADMIN_EMAIL);
    localStorage.removeItem(STORAGE_KEY_ADMIN_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        setIsAiOpen={setIsAiOpen}
        setIsAdminOpen={setIsAdminOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        siteConfig={siteConfig}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          setActiveTab={setActiveTab}
          onOpenSedekahPackage={() => {
            setActiveTab('kios');
            setSelectedCategory('paket_sedekah');
          }}
          siteConfig={siteConfig}
        />

        {/* Dynamic View Sections based on Active Tab */}
        {activeTab === 'kios' && (
          <>
            <KiosSembako
              products={products}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <PaketSedekahSection
              products={products}
              onAddToCart={handleAddToCart}
            />
          </>
        )}

        {activeTab === 'tahfizh' && (
          <RumahTahfizh
            santriList={santriList}
            programs={programs}
            onSponsorSantri={handleSponsorSantri}
            onOpenRegisterForm={() => setActiveTab('pendaftaran')}
          />
        )}

        {activeTab === 'pendaftaran' && (
          <PendaftaranSantri
            onSuccess={() => {
              // Scroll or confirmation
            }}
          />
        )}

        {activeTab === 'transparansi' && (
          <TransparansiLaporan donations={donations} stats={stats} />
        )}

        {activeTab === 'kalkulator' && (
          <ZakatKalkulator onAddInfaqToCart={handleAddInfaqToCart} />
        )}

        {/* 9 Photos Showcase Gallery */}
        <PhotoGallerySection siteConfig={siteConfig} />
      </main>

      {/* Footer & FAQ */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} siteConfig={siteConfig} />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleDonation={handleToggleDonation}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        setProducts={setProducts}
        santriList={santriList}
        setSantriList={setSantriList}
        donations={donations}
        setDonations={setDonations}
        stats={stats}
        setStats={setStats}
        adminPin={adminPin}
        setAdminPin={setAdminPin}
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        siteConfig={siteConfig}
        setSiteConfig={setSiteConfig}
        onResetData={handleResetData}
      />

    </div>
  );
}
