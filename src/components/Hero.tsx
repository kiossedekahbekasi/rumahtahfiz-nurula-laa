import React from 'react';
import { ShoppingBag, HeartHandshake, BookOpen, ShieldCheck, Sparkles, ArrowRight, Github, ExternalLink } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: 'kios' | 'tahfizh' | 'pendaftaran' | 'transparansi' | 'kalkulator') => void;
  onOpenSedekahPackage: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, onOpenSedekahPackage }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-850 to-slate-900 text-white pt-8 pb-14 px-4 border-b border-emerald-800">
      {/* Subtle Background Geometric Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Gerakan Muamalah Berkah & Dakwah Bekasi</span>
              </div>
              <a
                href="https://github.com/kiossedekahbekasi?tab=repositories"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-amber-400/40 text-amber-300 hover:text-white text-xs font-semibold shadow-inner transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-amber-300" />
                <span>kiossedekahbekasi</span>
                <ExternalLink className="w-3 h-3 text-emerald-300" />
              </a>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Belanja Sembako Sehari-hari, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                Sekaligus Membina Santri Tahfizh
              </span>
            </h1>

            <p className="text-emerald-100 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Selamat datang di <strong className="text-amber-300">Kios Sedekah Bekasi</strong> & <strong className="text-amber-300">Rumah Tahfizh Al-Qur'an</strong>. Setiap gram beras & kebutuhan dapur yang Anda beli turut membiayai makan gizi, tempat tinggal, dan hafalan santri yatim dhuafa.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setActiveTab('kios')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-base shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-950" />
                <span>Belanja Sembako Kios</span>
                <ArrowRight className="w-4 h-4 text-emerald-950 ml-1" />
              </button>

              <button
                onClick={onOpenSedekahPackage}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-base border border-emerald-600/80 shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <HeartHandshake className="w-5 h-5 text-amber-300" />
                <span>Kirim Paket Sedekah Santri</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-emerald-200 font-medium border-t border-emerald-800/80">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Beras & Sembako Fresh Terjamin</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>42 Santri Tahfizh Binaan Mukim</span>
              </div>
              <a 
                href="https://github.com/kiossedekahbekasi?tab=repositories"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 hover:text-amber-300 transition-colors"
              >
                <Github className="w-4 h-4 text-amber-400" />
                <span>Open Source GitHub Repositories</span>
              </a>
            </div>
          </div>

          {/* Hero Visual Card Stack (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 border border-emerald-700/80 shadow-2xl relative overflow-hidden">
              
              {/* Badge Overlay */}
              <div className="absolute top-3 right-3 bg-amber-400 text-emerald-950 text-[11px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                Bekasi + Rumah Tahfizh
              </div>

              <div className="flex items-center space-x-4 mb-5">
                <img 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400" 
                  alt="Santri Penghafal Qur'an" 
                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h3 className="font-bold text-lg text-white">Rumah Tahfizh Al-Qur'an</h3>
                  <p className="text-xs text-emerald-200">Mencetak Generasi Hafiz & Rabbani Bekasi</p>
                  <div className="flex items-center space-x-1 mt-1 text-xs text-amber-300 font-semibold">
                    <span>✨ Target 30 Juz Mutqin</span>
                  </div>
                </div>
              </div>

              {/* Progress Live Indicator */}
              <div className="bg-emerald-950/80 rounded-xl p-4 border border-emerald-800 mb-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-300 font-medium">Kebutuhan Beras Santri Bulan Ini</span>
                  <span className="text-amber-300 font-bold">450 kg / 600 kg</span>
                </div>
                <div className="w-full bg-emerald-900 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 rounded-full w-[75%]" />
                </div>
                <p className="text-[11px] text-emerald-300/90 text-right">
                  Tersisa 150 kg lagi untuk tercapai
                </p>
              </div>

              {/* Quick Feature Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button 
                  onClick={() => setActiveTab('tahfizh')}
                  className="bg-emerald-800/80 hover:bg-emerald-700 p-3 rounded-xl border border-emerald-700 text-left transition-colors"
                >
                  <div className="font-bold text-amber-300 mb-0.5">Lihat Hafalan Santri</div>
                  <div className="text-[11px] text-emerald-200">Setoran progress juz</div>
                </button>
                <button 
                  onClick={() => setActiveTab('pendaftaran')}
                  className="bg-emerald-800/80 hover:bg-emerald-700 p-3 rounded-xl border border-emerald-700 text-left transition-colors"
                >
                  <div className="font-bold text-amber-300 mb-0.5">Pendaftaran Santri</div>
                  <div className="text-[11px] text-emerald-200">100% Gratis Yatim & Dhuafa</div>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
