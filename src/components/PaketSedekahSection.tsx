import React from 'react';
import { SembakoProduct } from '../types';
import { HeartHandshake, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface PaketSedekahSectionProps {
  products: SembakoProduct[];
  onAddToCart: (product: SembakoProduct, isDonationDirectToTahfizh: boolean) => void;
}

export const PaketSedekahSection: React.FC<PaketSedekahSectionProps> = ({ products, onAddToCart }) => {
  const specialPackages = products.filter((p) => p.isSedekahSpecial);

  return (
    <section className="py-12 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden border-y border-emerald-800">
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Program Sedekah Pilihan</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Paket Sedekah Sembako Langsung
          </h2>
          <p className="text-emerald-200 text-sm mt-2">
            Pilihlah paket sembako di bawah ini untuk disalurkan 100% tepat sasaran kepada Santri Yatim Penghafal Al-Qur'an dan Lansia Dhuafa binaan Kios.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-emerald-900/90 rounded-2xl p-5 border border-amber-400/50 shadow-xl flex flex-col justify-between hover:border-amber-400 transition-all group"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-emerald-950">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded shadow">
                    Sedekah Utama
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-amber-300 transition-colors">
                  {pkg.name}
                </h3>

                <p className="text-emerald-200 text-xs leading-relaxed line-clamp-3 mb-4">
                  {pkg.description}
                </p>

                {pkg.impactBadge && (
                  <div className="bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-700/80 text-[11px] text-amber-300 font-semibold flex items-center space-x-1.5 mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{pkg.impactBadge}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-3 pt-2 border-t border-emerald-800">
                  <span className="text-xs text-emerald-300">Nilai Paket:</span>
                  <span className="text-lg font-black text-amber-300">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={() => onAddToCart(pkg, true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-950" />
                  <span>Kirim Paket Ini</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
