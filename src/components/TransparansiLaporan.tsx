import React from 'react';
import { DonationRecord } from '../types';
import { MOCK_TRANSPARENCY_STATS } from '../data/mockData';
import { BarChart3, ShieldCheck, HeartHandshake, Award, Users, CheckCircle, FileText, Sparkles, Github, ExternalLink, Code2 } from 'lucide-react';

interface TransparansiLaporanProps {
  donations: DonationRecord[];
}

export const TransparansiLaporan: React.FC<TransparansiLaporanProps> = ({ donations }) => {
  return (
    <section className="py-12 bg-slate-900 text-white min-h-[600px] border-b border-slate-800">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Transparansi & Akuntabilitas Publik Bekasi</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            Laporan Penyaluran Keberkahan Kios Sedekah Bekasi
          </h2>
          <p className="text-slate-300 text-sm">
            Setiap rupiah transaksi sembako & donasi yang amanah disalurkan 100% secara terbuka untuk menyokong kehidupan Santri Penghafal Qur'an & Warga Dhuafa Kota Bekasi.
          </p>
        </div>

        {/* Big Impact Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-emerald-950 p-5 rounded-2xl border border-emerald-800 text-center space-y-1 shadow-lg">
            <div className="text-amber-400 font-extrabold text-xs uppercase">Beras & Sembako Terjual</div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {MOCK_TRANSPARENCY_STATS.totalSembakoTerjualKg.toLocaleString('id-ID')} <span className="text-sm font-normal text-emerald-300">kg</span>
            </div>
            <div className="text-[11px] text-emerald-300">Dipasok dari Petani Binaan</div>
          </div>

          <div className="bg-emerald-950 p-5 rounded-2xl border border-emerald-800 text-center space-y-1 shadow-lg">
            <div className="text-amber-400 font-extrabold text-xs uppercase">Dana Terhimpun & Disalurkan</div>
            <div className="text-xl sm:text-2xl font-black text-white">
              Rp {(MOCK_TRANSPARENCY_STATS.totalDanaTerhimpunRp / 1000000).toFixed(1)} <span className="text-sm font-normal text-emerald-300">Juta</span>
            </div>
            <div className="text-[11px] text-emerald-300">100% Alokasi Keuntungan</div>
          </div>

          <div className="bg-emerald-950 p-5 rounded-2xl border border-emerald-800 text-center space-y-1 shadow-lg">
            <div className="text-amber-400 font-extrabold text-xs uppercase">Santri Beasiswa Mukim</div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {MOCK_TRANSPARENCY_STATS.santriPenerimaBeasiswa} <span className="text-sm font-normal text-emerald-300">Santri</span>
            </div>
            <div className="text-[11px] text-emerald-300">Makan & Fasilitas 100% Gratis</div>
          </div>

          <div className="bg-emerald-950 p-5 rounded-2xl border border-emerald-800 text-center space-y-1 shadow-lg">
            <div className="text-amber-400 font-extrabold text-xs uppercase">Alumni Hafiz 30 Juz</div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {MOCK_TRANSPARENCY_STATS.alumniHafiz30Juz} <span className="text-sm font-normal text-emerald-300">Orang</span>
            </div>
            <div className="text-[11px] text-emerald-300">Telah Mengabdi di Masyarakat</div>
          </div>
        </div>

        {/* GitHub Repositories Banner inside Transparansi */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-800 to-emerald-950 p-5 sm:p-6 rounded-2xl border border-amber-400/30 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-sm sm:text-base">GitHub Organization & Code Repositories</span>
                <span className="text-[10px] bg-emerald-800 text-amber-300 px-2 py-0.5 rounded font-bold">@kiossedekahbekasi</span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Pengembangan sistem, aplikasi muamalah, dan manajemen pencatatan infaq bersifat terbuka & terverifikasi di GitHub.
              </p>
            </div>
          </div>
          <a
            href="https://github.com/kiossedekahbekasi?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center space-x-2 whitespace-nowrap shadow transition-colors flex-shrink-0"
          >
            <Code2 className="w-4 h-4 text-slate-950" />
            <span>Lihat Repositori GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Breakdown Allocation & Donor Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Allocation Breakdown Chart Simulation (5 cols) */}
          <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-700 pb-3">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Alokasi Margin Penjualan Sembako</h3>
            </div>

            <p className="text-xs text-slate-300">
              Berikut adalah transparansi pembagian margin hasil penjualan di Kios Sedekah Bekasi:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Beras & Makan Gizi Santri Tahfizh</span>
                  <span className="text-amber-300 font-bold">50%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5">
                  <div className="bg-amber-400 h-2.5 rounded-full w-[50%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Paket Sembako Gratis Dhuafa & Lansia</span>
                  <span className="text-emerald-400 font-bold">30%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5">
                  <div className="bg-emerald-400 h-2.5 rounded-full w-[30%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Beasiswa & Honorarium Ustadz Pengajar</span>
                  <span className="text-blue-400 font-bold">15%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5">
                  <div className="bg-blue-400 h-2.5 rounded-full w-[15%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300 font-medium">Pengembangan Operasional Kios</span>
                  <span className="text-purple-400 font-bold">5%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5">
                  <div className="bg-purple-400 h-2.5 rounded-full w-[5%]" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/80">
              <button 
                onClick={() => alert("Laporan keuangan bulanan versi PDF terbaru sedang diunduh (Simulasi PDF).")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-emerald-300 border border-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Unduh Audit Laporan Keuangan Bulanan (.PDF)</span>
              </button>
            </div>
          </div>

          {/* Donor Activity Feed (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-700 pb-3">
              <HeartHandshake className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Aktivitas Sedekah & Infaq Terkini</h3>
            </div>

            <div className="space-y-3">
              {donations.map((don) => (
                <div
                  key={don.id}
                  className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 flex items-start justify-between text-xs hover:border-amber-400/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <strong className="text-amber-300 font-bold text-sm">
                        {don.isAnonymous ? 'Hamba Allah' : don.donorName}
                      </strong>
                      <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-medium">
                        {don.packageType}
                      </span>
                    </div>

                    <p className="text-slate-300">
                      Disalurkan untuk: <span className="text-emerald-300 font-semibold">{don.targetRecipient}</span>
                    </p>

                    {don.message && (
                      <p className="text-slate-400 italic text-[11px]">
                        "{don.message}"
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="font-black text-amber-300 text-sm block">
                      +Rp {don.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-500">{don.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
