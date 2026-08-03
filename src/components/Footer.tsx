import React from 'react';
import { MOCK_FAQS } from '../data/mockData';
import { MapPin, Phone, Clock, ShieldCheck, HeartHandshake, HelpCircle, Github, ExternalLink, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-800 pt-12 pb-8">
      <div className="container mx-auto max-w-6xl px-4 space-y-12">
        
        {/* FAQ Accordion Grid */}
        <div className="bg-emerald-900/60 p-6 sm:p-8 rounded-3xl border border-emerald-800 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Pertanyaan Populer</span>
            </div>
            <h3 className="text-2xl font-black text-white">FAQ Kios Sedekah Bekasi & Rumah Tahfizh</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_FAQS.map((faq, i) => (
              <div key={i} className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-800 space-y-1.5">
                <h4 className="font-bold text-amber-300 text-sm flex items-start space-x-2">
                  <span className="text-amber-400">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-emerald-200 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Repositories Highlight Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-900 p-6 rounded-2xl border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold flex-shrink-0 shadow-md">
              <Github className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-base text-white">Kios Sedekah Bekasi Repositories</h4>
                <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-black uppercase">
                  Open Source
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Akses sistem open source, repositori, dan transparansi ekosistem digital Kios Sedekah Bekasi di GitHub.
              </p>
            </div>
          </div>
          <a
            href="https://github.com/kiossedekahbekasi?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md flex-shrink-0"
          >
            <Code2 className="w-4 h-4 text-emerald-950" />
            <span>Buka Repositori GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Links & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg">
                🕌
              </div>
              <span className="font-extrabold text-lg text-white">KIOS SEDEKAH BEKASI</span>
            </div>
            <p className="text-emerald-300 leading-relaxed">
              Inisiatif Muamalah & Pendidikan Dakwah Terpadu Kota Bekasi. Belanja sembako berkualitas dengan harga jujur, menyokong langsung ratusan porsi nasi gizi dan beasiswa santri penghafal Al-Qur'an yatim & dhuafa.
            </p>
            <div className="pt-1 flex items-center space-x-2 text-amber-300 font-semibold text-[11px]">
              <Github className="w-4 h-4 text-amber-400" />
              <span>GitHub Org: <a href="https://github.com/kiossedekahbekasi" target="_blank" rel="noreferrer" className="underline hover:text-white">github.com/kiossedekahbekasi</a></span>
            </div>
            <div className="pt-1 text-[11px] text-amber-300 font-semibold">
              ✨ 100% Keuntungan Bersih Dialokasikan Untuk Kegiatan Sosial & Tahfizh
            </div>
          </div>

          {/* Contact & Location (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs">
              Lokasi & Kontak Operasional
            </h4>
            <div className="flex items-start space-x-2 text-emerald-200">
              <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span>Jl. Masjid Al-Barokah No. 77, Kompleks Kios Sedekah & Rumah Tahfizh, Bekasi, Jawa Barat, Indonesia</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-200">
              <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>WhatsApp Hotline Bekasi: 0812-3456-7890 / 0857-1122-3344</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-200">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Buka Setiap Hari: 06.00 - 20.30 WIB</span>
            </div>
          </div>

          {/* Bank Accounts for Direct Donations (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs">
              Rekening Infaq Resmi
            </h4>
            <div className="bg-emerald-900 p-3 rounded-xl border border-emerald-800 space-y-1">
              <span className="block font-bold text-white">BSI (Bank Syariah Indonesia)</span>
              <span className="block font-mono text-amber-300 font-extrabold">7182-9304-11</span>
              <span className="block text-[10px] text-emerald-300">a.n. YAYASAN KIOS SEDEKAH BEKASI</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400/80 gap-2">
          <div>
            © {new Date().getFullYear()} Kios Sedekah Bekasi & Rumah Tahfizh Al-Qur'an. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/kiossedekahbekasi?tab=repositories" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-amber-300 flex items-center space-x-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repositories</span>
            </a>
            <span>•</span>
            <span>Diberkahi Oleh Umat</span>
            <span>•</span>
            <span>Amanah & Transparan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
