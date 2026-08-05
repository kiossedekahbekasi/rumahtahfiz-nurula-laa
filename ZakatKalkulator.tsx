import React, { useState } from 'react';
import { Calculator, HeartHandshake, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface ZakatKalkulatorProps {
  onAddInfaqToCart: (amount: number, packageName: string) => void;
}

export const ZakatKalkulator: React.FC<ZakatKalkulatorProps> = ({ onAddInfaqToCart }) => {
  const [calcMode, setCalcMode] = useState<'belanja' | 'zakat_maal'>('belanja');
  
  // Belanja Mode State
  const [monthlyGrocery, setMonthlyGrocery] = useState<number>(1500000);
  const [infaqPercentage, setInfaqPercentage] = useState<number>(5);

  // Zakat Maal State
  const [incomeMonthly, setIncomeMonthly] = useState<number>(5000000);

  // Calculations
  const calculatedInfaqFromBelanja = Math.round(monthlyGrocery * (infaqPercentage / 100));
  const calculatedZakatMaal = Math.round(incomeMonthly * 0.025);

  return (
    <section className="py-12 bg-slate-900 text-white min-h-[550px] border-b border-slate-800">
      <div className="container mx-auto max-w-3xl px-4">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Infaq & Zakat Sembako</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            Hitung Porsi Kebajikan Dapur Anda
          </h2>
          <p className="text-slate-300 text-sm">
            Ketahui berapa porsi sedekah sembako yang ideal disisihkan dari belanja bulanan keluarga Anda untuk membantu Santri Tahfizh & Dhuafa.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setCalcMode('belanja')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              calcMode === 'belanja'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Infaq Belanja Sembako
          </button>
          <button
            onClick={() => setCalcMode('zakat_maal')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              calcMode === 'zakat_maal'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Zakat Penghasilan (2.5%)
          </button>
        </div>

        {/* Calculator Body */}
        {calcMode === 'belanja' ? (
          <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Estimasi Pengeluaran Belanja Sembako Bulanan Keluarga (Rp)
              </label>
              <input
                type="number"
                step="50000"
                value={monthlyGrocery}
                onChange={(e) => setMonthlyGrocery(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-extrabold text-lg focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Terbilang: Rp {monthlyGrocery.toLocaleString('id-ID')}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Persentase Infaq Mandiri Disisihkan:</span>
                <span className="text-amber-400 font-extrabold text-sm">{infaqPercentage}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={infaqPercentage}
                onChange={(e) => setInfaqPercentage(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2% (Ringan)</span>
                <span>5% (Disarankan)</span>
                <span>10% (Berkah Kelimpahan)</span>
                <span>20%</span>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-emerald-950 p-6 rounded-xl border border-emerald-800 space-y-3 text-center">
              <span className="text-xs font-bold text-emerald-300 uppercase block">
                Rekomendasi Paket Sedekah Sembako Bulanan Anda:
              </span>
              <div className="text-3xl font-black text-amber-300">
                Rp {calculatedInfaqFromBelanja.toLocaleString('id-ID')} <span className="text-sm font-normal text-white">/ bulan</span>
              </div>
              <p className="text-xs text-emerald-200">
                Setara dengan menyumbangkan sekitar <strong>{(calculatedInfaqFromBelanja / 13500).toFixed(1)} kg beras super</strong> setiap bulannya untuk konsumsi Santri Tahfizh!
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onAddInfaqToCart(calculatedInfaqFromBelanja, `Infaq Belanja Sembako (${infaqPercentage}%)`)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-950" />
                  <span>Masukkan Infaq Ini ke Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Total Penghasilan / Gaji Bersih Bulanan (Rp)
              </label>
              <input
                type="number"
                step="500000"
                value={incomeMonthly}
                onChange={(e) => setIncomeMonthly(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-extrabold text-lg focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Terbilang: Rp {incomeMonthly.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="bg-emerald-950 p-6 rounded-xl border border-emerald-800 space-y-3 text-center">
              <span className="text-xs font-bold text-emerald-300 uppercase block">
                Kewajiban Zakat Penghasilan (2.5%):
              </span>
              <div className="text-3xl font-black text-amber-300">
                Rp {calculatedZakatMaal.toLocaleString('id-ID')} <span className="text-sm font-normal text-white">/ bulan</span>
              </div>
              <p className="text-xs text-emerald-200">
                Penyaluran zakat penghasilan dalam bentuk Paket Sembako beras & gizi untuk anak yatim piatu di Rumah Tahfizh.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onAddInfaqToCart(calculatedZakatMaal, 'Zakat Penghasilan Sembako (2.5%)')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto"
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-950" />
                  <span>Salurkan Zakat Ini Sebagai Sembako</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
