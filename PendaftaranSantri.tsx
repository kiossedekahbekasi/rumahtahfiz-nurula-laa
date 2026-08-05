import React, { useState } from 'react';
import { RegistrationFormData } from '../types';
import { sendToGoogleSheets, isAutoSyncEnabled } from '../lib/sheetsSync';
import { GraduationCap, CheckCircle2, User, Phone, MapPin, Sparkles, Send, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PendaftaranSantriProps {
  onSuccess?: () => void;
}

export const PendaftaranSantri: React.FC<PendaftaranSantriProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    parentName: '',
    age: '',
    gender: 'Laki-laki',
    address: '',
    phone: '',
    programChoice: 'Program Mukim Beasiswa Full Yatim & Dhuafa',
    isYatimDhuafa: true,
    notes: '',
  });

  const [submittedData, setSubmittedData] = useState<RegistrationFormData | null>(null);
  const [regNumber, setRegNumber] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.parentName || !formData.phone) {
      alert('Mohon lengkapi Nama Lengkap, Nama Orang Tua, dan Nomor WhatsApp!');
      return;
    }

    const randomReg = 'REG-THFZ-' + Math.floor(100000 + Math.random() * 900000);
    setRegNumber(randomReg);
    setSubmittedData({ ...formData });

    // Auto-sync registration to Google Sheets if enabled
    if (isAutoSyncEnabled()) {
      sendToGoogleSheets('SANTRI_REGISTRATION', { ...formData, regNumber: randomReg }).catch((err) =>
        console.error('Santri registration sync error:', err)
      );
    }

    // Trigger celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onSuccess) onSuccess();
  };

  return (
    <section className="py-12 bg-slate-900 text-white min-h-[600px] border-b border-slate-800">
      <div className="container mx-auto max-w-3xl px-4">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-800 text-amber-300 text-xs font-bold uppercase">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Pendaftaran Santri Online</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            Formulir Pendaftaran Rumah Tahfizh
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Silakan isi data calon santri di bawah ini. Untuk kategori Yatim & Dhuafa, seluruh biaya asrama, fasilitas, & konsumsi sembako gizi 100% BEASISWA GRATIS.
          </p>
        </div>

        {submittedData ? (
          /* Confirmation Slip Card */
          <div className="bg-emerald-950 rounded-2xl p-6 sm:p-8 border-2 border-amber-400 shadow-2xl space-y-6 text-emerald-100 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2 border-b border-emerald-800 pb-6">
              <div className="w-16 h-16 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
                ✓
              </div>
              <h3 className="text-2xl font-black text-white">Pendaftaran Berhasil Diterima!</h3>
              <p className="text-amber-300 font-extrabold text-sm">
                Nomor Registrasi: <span className="bg-emerald-900 px-3 py-1 rounded text-white border border-amber-400/40">{regNumber}</span>
              </p>
            </div>

            <div className="bg-emerald-900/80 p-5 rounded-xl border border-emerald-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-emerald-400 block">Nama Santri:</span>
                  <strong className="text-white text-sm">{submittedData.fullName}</strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">Usia / Gender:</span>
                  <strong className="text-white text-sm">{submittedData.age} Thn ({submittedData.gender})</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/80">
                <div>
                  <span className="text-emerald-400 block">Orang Tua / Wali:</span>
                  <strong className="text-white">{submittedData.parentName}</strong>
                </div>
                <div>
                  <span className="text-emerald-400 block">No. WhatsApp:</span>
                  <strong className="text-amber-300">{submittedData.phone}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800/80">
                <span className="text-emerald-400 block">Pilihan Program:</span>
                <strong className="text-amber-300">{submittedData.programChoice}</strong>
              </div>

              {submittedData.isYatimDhuafa && (
                <div className="bg-amber-400/20 p-2.5 rounded-lg border border-amber-400/40 text-amber-300 font-semibold flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Kategori Beasiswa Full Yatim & Dhuafa dikonfirmasi.</span>
                </div>
              )}
            </div>

            <div className="text-center space-y-3">
              <p className="text-xs text-emerald-200">
                Panitia Penerimaan Santri Baru Rumah Tahfizh Kios Sedekah akan menghubungi nomor WhatsApp Anda dalam 1x24 jam untuk verifikasi & jadwal tes seleksi hafalan.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/6281234567890?text=Assalamu'alaikum%20Panitia%20Rumah%20Tahfizh,%20saya%20sudah%20mendaftar%20dengan%20No%20Reg:%20${regNumber}%20atas%20nama%20${encodeURIComponent(submittedData.fullName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs shadow hover:bg-amber-300 transition-colors"
                >
                  Konfirmasi Langsung via WhatsApp →
                </a>

                <button
                  onClick={() => setSubmittedData(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-900 text-emerald-200 font-bold text-xs hover:bg-emerald-800 border border-emerald-700"
                >
                  Daftarkan Santri Lainnya
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Lengkap Calon Santri *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Contoh: Ahmad Faiz"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Orang Tua / Wali *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Contoh: H. Abdul Rahman"
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Usia Santri (Tahun) *
                </label>
                <input
                  type="number"
                  required
                  min="6"
                  max="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Contoh: 11"
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Jenis Kelamin *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  No. WhatsApp Aktif *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Pilihan Program Tahfizh *
              </label>
              <select
                value={formData.programChoice}
                onChange={(e) => setFormData({ ...formData, programChoice: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Program Mukim Beasiswa Full Yatim & Dhuafa">
                  Program Mukim Beasiswa Full (Yatim & Dhuafa - 100% Gratis)
                </option>
                <option value="Program Tahfizh Reguler Non-Mukim (Sore Hari)">
                  Program Tahfizh Reguler Non-Mukim (Sore Hari)
                </option>
                <option value="Program Takhassus Percepatan 30 Juz">
                  Program Takhassus Intensif 30 Juz
                </option>
                <option value="Program Tahfizh Dewasa & Orang Tua">
                  Program Tahfizh Dewasa / Orang Tua
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Alamat Domisili Lengkap
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Merdeka No. 123, RT 01/02, Desa/Kelurahan..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-800 flex items-center space-x-3">
              <input
                type="checkbox"
                id="yatimCheck"
                checked={formData.isYatimDhuafa}
                onChange={(e) => setFormData({ ...formData, isYatimDhuafa: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
              />
              <label htmlFor="yatimCheck" className="text-xs text-emerald-200 cursor-pointer select-none">
                <strong className="text-amber-300 block font-bold">Kategori Anak Yatim / Dhuafa Less Fortunate</strong>
                Centang kotak ini jika santri termasuk kategori yatim/dhuafa untuk pembebasan seluruh biaya pendidikan & konsumsi gizi sembako.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4 text-emerald-950" />
              <span>Kirim Pendaftaran Santri Sekarang</span>
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
