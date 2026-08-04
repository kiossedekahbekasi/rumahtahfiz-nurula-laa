import React, { useState } from 'react';
import { Santri, ProgramTahfizh, SembakoProduct, SiteConfig } from '../types';
import { 
  BookOpen, 
  Award, 
  Users, 
  Home, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Heart, 
  Clock, 
  BookMarked,
  GraduationCap
} from 'lucide-react';

interface RumahTahfizhProps {
  santriList: Santri[];
  programs: ProgramTahfizh[];
  onSponsorSantri: (santriName: string) => void;
  onOpenRegisterForm: () => void;
  siteConfig?: SiteConfig;
}

export const RumahTahfizh: React.FC<RumahTahfizhProps> = ({
  santriList,
  programs,
  onSponsorSantri,
  onOpenRegisterForm,
  siteConfig,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchSantri, setSearchSantri] = useState<string>('');

  const filteredSantri = santriList.filter((s) => {
    const matchCat = selectedCategory === 'semua' || s.category === selectedCategory;
    const matchName = s.name.toLowerCase().includes(searchSantri.toLowerCase()) ||
                      s.bio.toLowerCase().includes(searchSantri.toLowerCase());
    return matchCat && matchName;
  });

  // Dynamic schedules built from siteConfig with defaults
  const scheduleBadge = siteConfig?.scheduleBadgeText || 'Rutinitas Asrama';
  const scheduleTitle = siteConfig?.scheduleTitleMain || 'Jadwal Harian Santri Rumah Tahfizh';
  const scheduleDesc = siteConfig?.scheduleSubtitle || 'Santri didisiplinkan dengan jadwal teratur sejak sepertiga malam hingga tidur, menyeimbangkan waktu menghafal, muraja\'ah, ibadah, dan nutrisi gizi sembako seimbang.';

  const rawSchedules = [
    { time: siteConfig?.schedule1Time ?? '04.00 - 05.00', activity: siteConfig?.schedule1Activity ?? 'Shalat Subuh Berjamaah & Setoran Hafalan Baru' },
    { time: siteConfig?.schedule2Time ?? '05.30 - 06.30', activity: siteConfig?.schedule2Activity ?? 'Muraja\'ah Mandiri & Olahraga Pagi' },
    { time: siteConfig?.schedule3Time ?? '07.00 - 15.00', activity: siteConfig?.schedule3Activity ?? 'Makan Pagi Sembako Kios & Sekolah Formal (Bagi Yatim/Dhuafa)' },
    { time: siteConfig?.schedule4Time ?? '15.30 - 17.30', activity: siteConfig?.schedule4Activity ?? 'Kajian Tajwid, Makhorijul Huruf & Kelas Tahfizh Sore' },
    { time: siteConfig?.schedule5Time ?? '18.00 - 20.00', activity: siteConfig?.schedule5Activity ?? 'Shalat Maghrib, Makan Malam & Tasmi\' 1 Juz Per Santri' },
    { time: siteConfig?.schedule6Time ?? '20.00 - 21.00', activity: siteConfig?.schedule6Activity ?? 'Evaluasi Hafalan Bersama Ustadz & Istirahat Malam' },
    { time: siteConfig?.schedule7Time, activity: siteConfig?.schedule7Activity },
    { time: siteConfig?.schedule8Time, activity: siteConfig?.schedule8Activity },
  ];

  const dailySchedules = rawSchedules.filter((s) => Boolean(s.time && s.activity));

  return (
    <section className="py-12 bg-emerald-950 text-white min-h-[700px] border-b border-emerald-800">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header & Vision */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Lembaga Pendidikan & Dakwah Al-Qur'an</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Rumah Tahfizh Al-Qur'an <br />
            <span className="text-amber-400">Kios Sedekah</span>
          </h2>

          <p className="text-emerald-100 text-base leading-relaxed">
            Menempa anak-anak yatim, dhuafa, dan masyarakat umum menjadi para penghafal Al-Qur'an 30 Juz yang mutqin, berakhlak mulia, dan berjiwa mandiri. Didukung penuh oleh hasil muamalah Kios Sedekah.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenRegisterForm}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-sm shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <GraduationCap className="w-5 h-5 text-emerald-950" />
              <span>Daftar Santri Baru (Online)</span>
            </button>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Program Pendidikan Tahfizh</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-emerald-900/80 rounded-2xl p-6 border border-emerald-800 hover:border-amber-400/60 shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-400 text-emerald-950">
                      {prog.badge}
                    </span>
                    <span className="text-xs text-emerald-300 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      {prog.schedule}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{prog.title}</h4>
                  <p className="text-emerald-200 text-xs leading-relaxed mb-4">{prog.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-emerald-800/80">
                    <span className="text-[11px] font-bold text-amber-300 uppercase block mb-1">
                      Fasilitas & Keunggulan:
                    </span>
                    {prog.featureList.map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-300">Sasaran: <strong>{prog.targetAudience}</strong></span>
                  <button
                    onClick={onOpenRegisterForm}
                    className="text-amber-300 font-bold hover:underline flex items-center"
                  >
                    <span>Daftar Program</span>
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Santri Progress Tracker */}
        <div className="mb-16 bg-emerald-900/90 rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-emerald-800 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase mb-1">
                <BookMarked className="w-4 h-4 text-amber-400" />
                <span>Transparansi Perkembangan</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Tracker Setoran Hafalan Santri
              </h3>
              <p className="text-emerald-200 text-xs mt-1">
                Pantau capaian hafalan santri penerima beasiswa Kios Sedekah secara berkala.
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  value={searchSantri}
                  onChange={(e) => setSearchSantri(e.target.value)}
                  placeholder="Cari nama santri..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-emerald-950 text-white rounded-lg border border-emerald-700 placeholder-emerald-400/60"
                />
                <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-xs bg-emerald-950 text-white rounded-lg border border-emerald-700"
              >
                <option value="semua">Semua Kategori</option>
                <option value="Yatim">Kategori Yatim</option>
                <option value="Dhuafa">Kategori Dhuafa</option>
                <option value="Takhassus">Takhassus 30 Juz</option>
                <option value="Reguler">Reguler</option>
              </select>
            </div>
          </div>

          {/* Santri Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSantri.map((santri) => {
              const progressPct = Math.round((santri.currentJuz / santri.targetJuz) * 100);
              return (
                <div
                  key={santri.id}
                  className="bg-emerald-950/90 rounded-2xl p-5 border border-emerald-800 hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={santri.photo}
                      alt={santri.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          {santri.category}
                        </span>
                        <span className="text-[11px] text-emerald-300">{santri.age} thn</span>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate mt-1">{santri.name}</h4>
                      <p className="text-[11px] text-emerald-300/80">Bergabung: {santri.joinDate}</p>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-200 line-clamp-2 leading-relaxed">
                    "{santri.bio}"
                  </p>

                  {/* Progress Meter */}
                  <div className="bg-emerald-900/80 p-3 rounded-xl border border-emerald-800 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-emerald-300">Capaian Hafalan:</span>
                      <span className="text-amber-300">{santri.currentJuz} / {santri.targetJuz} Juz ({progressPct}%)</span>
                    </div>
                    <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-emerald-300/90 truncate pt-1 border-t border-emerald-800">
                      📌 Setoran Terakhir: <strong>{santri.setoranTerakhir}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onSponsorSantri(santri.name)}
                    className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sponsori Makanan Santri Ini</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{scheduleBadge}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {scheduleTitle}
            </h3>
            <p className="text-emerald-200 text-xs sm:text-sm leading-relaxed">
              {scheduleDesc}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-2">
            {dailySchedules.map((item, idx) => (
              <div
                key={idx}
                className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-800 flex items-center space-x-4 hover:border-amber-400/50 transition-colors"
              >
                <div className="w-20 text-xs font-bold text-amber-300 flex-shrink-0">
                  {item.time}
                </div>
                <div className="text-xs text-emerald-100 flex-1">
                  {item.activity}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
