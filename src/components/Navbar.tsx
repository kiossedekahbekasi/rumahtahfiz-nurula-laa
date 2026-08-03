import React, { useState } from 'react';
import { 
  ShoppingBag, 
  HeartHandshake, 
  BookOpenCheck, 
  Bot, 
  Menu, 
  X, 
  Search, 
  Calculator, 
  BarChart3,
  Sparkles,
  PhoneCall,
  Github,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'kios' | 'tahfizh' | 'pendaftaran' | 'transparansi' | 'kalkulator';
  setActiveTab: (tab: 'kios' | 'tahfizh' | 'pendaftaran' | 'transparansi' | 'kalkulator') => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  setIsAiOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  setIsAiOpen,
  searchQuery,
  setSearchQuery,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'kios', label: 'Toko Sembako', icon: ShoppingBag },
    { id: 'tahfizh', label: 'Rumah Tahfizh', icon: BookOpenCheck },
    { id: 'pendaftaran', label: 'Daftar Santri', icon: HeartHandshake },
    { id: 'transparansi', label: 'Transparansi & Laporan', icon: BarChart3 },
    { id: 'kalkulator', label: 'Kalkulator Infaq', icon: Calculator },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-lg border-b border-emerald-800">
      {/* Top Banner Ticker */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 font-medium flex justify-between items-center overflow-hidden border-b border-emerald-800/60">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 animate-pulse">
            <span className="bg-amber-500 text-emerald-950 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Program Berkah
            </span>
            <span className="truncate">
              100% Keuntungan Penjualan Sembako Kios Dialokasikan untuk Beasiswa & Beras Santri Tahfizh Al-Qur'an
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-emerald-300">
            <a 
              href="https://github.com/kiossedekahbekasi?tab=repositories" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 transition-colors bg-emerald-900/80 px-2.5 py-0.5 rounded border border-amber-400/30"
            >
              <Github className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-semibold text-[11px]">GitHub Repositories</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3 h-3 mr-1" />
              WA Bekasi: 0812-3456-7890
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('kios')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              🕌
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  KIOS SEDEKAH BEKASI
                </span>
                <span className="text-amber-400 text-xs px-1.5 py-0.5 rounded bg-emerald-800/80 font-semibold border border-amber-400/30">
                  & Rumah Tahfizh
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 hidden xs:block">
                Belanja Sembako Sambil Membina Para Penghafal Al-Qur'an
              </p>
            </div>
          </div>

          {/* Quick Search Bar (For Sembako) */}
          <div className="hidden lg:flex flex-1 max-w-xs relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari beras, minyak, gula, telur..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-emerald-800/70 text-white placeholder-emerald-300/70 rounded-full border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-2.5" />
          </div>

          {/* Action Buttons: Cart & AI Assistant & GitHub Link */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* GitHub Repo Button */}
            <a
              href="https://github.com/kiossedekahbekasi?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-700 text-xs font-semibold transition-all hover:text-white"
              title="Kunjungi GitHub Kios Sedekah Bekasi Repositories"
            >
              <Github className="w-4 h-4 text-amber-400" />
              <span>GitHub</span>
            </a>

            {/* AI Assistant CTA */}
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Konsultasi Zakat & Tanya Ustadz AI"
            >
              <Bot className="w-4 h-4 text-emerald-950" />
              <span className="hidden sm:inline">Ustadz AI</span>
              <Sparkles className="w-3 h-3 text-emerald-900 animate-spin" />
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white transition-colors border border-emerald-700 shadow-inner"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-800 text-emerald-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 mt-3 pt-2 border-t border-emerald-800/80 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                    : 'text-emerald-100 hover:bg-emerald-800/70 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-amber-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800 px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk sembako..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-emerald-900 text-white placeholder-emerald-300/70 rounded-lg border border-emerald-700 focus:outline-none"
            />
            <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400 text-emerald-950 font-bold'
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  <Icon className="w-5 h-5 text-amber-300" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <a
              href="https://github.com/kiossedekahbekasi?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium text-amber-300 hover:bg-emerald-800 border border-amber-400/30 mt-2"
            >
              <Github className="w-5 h-5 text-amber-300" />
              <span>GitHub Repositories Kios Sedekah Bekasi</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
