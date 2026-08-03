import React, { useState } from 'react';
import { 
  SembakoProduct, 
  CartItem, 
  ProductCategory, 
  DonationRecord 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SANTRI, 
  PROGRAM_TAHFIZH_LIST, 
  INITIAL_DONATIONS 
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
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'kios' | 'tahfizh' | 'pendaftaran' | 'transparansi' | 'kalkulator'>('kios');
  
  // App Data State
  const [products] = useState<SembakoProduct[]>(INITIAL_PRODUCTS);
  const [santriList] = useState(INITIAL_SANTRI);
  const [programs] = useState(PROGRAM_TAHFIZH_LIST);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);

  // Cart & Filters State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('semua');

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-emerald-950">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        setIsAiOpen={setIsAiOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section (Always visible or highlighted) */}
        <Hero
          setActiveTab={setActiveTab}
          onOpenSedekahPackage={() => {
            setActiveTab('kios');
            setSelectedCategory('paket_sedekah');
          }}
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
              // Scroll or provide confirmation
            }}
          />
        )}

        {activeTab === 'transparansi' && (
          <TransparansiLaporan donations={donations} />
        )}

        {activeTab === 'kalkulator' && (
          <ZakatKalkulator onAddInfaqToCart={handleAddInfaqToCart} />
        )}
      </main>

      {/* Footer & FAQ */}
      <Footer />

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

    </div>
  );
}
