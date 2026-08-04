import React, { useState } from 'react';
import { SiteConfig } from '../types';
import { Image as ImageIcon, Maximize2, X, Sparkles, Camera } from 'lucide-react';

interface PhotoGallerySectionProps {
  siteConfig: SiteConfig;
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ siteConfig }) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption: string; number: number } | null>(null);

  const photosList = [
    {
      number: 1,
      label: 'Foto Pertama',
      url: siteConfig.photo1 || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo1Caption || 'Foto Pertama: Kios Sembako Murah & Berkah Bekasi',
    },
    {
      number: 2,
      label: 'Foto Kedua',
      url: siteConfig.photo2 || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo2Caption || 'Foto Kedua: Penyaluran Paket Sedekah Beras Santri',
    },
    {
      number: 3,
      label: 'Foto Ketiga',
      url: siteConfig.photo3 || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo3Caption || 'Foto Ketiga: Halaqah Setoran Hafalan Al-Qur\'an',
    },
    {
      number: 4,
      label: 'Foto Keempat',
      url: siteConfig.photo4 || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo4Caption || 'Foto Keempat: Makan Bersejahtera Gizi Santri Mukim',
    },
    {
      number: 5,
      label: 'Foto Kelima',
      url: siteConfig.photo5 || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo5Caption || 'Foto Kelima: Stok Sembako Fresh Dapur Rumah Tahfizh',
    },
    {
      number: 6,
      label: 'Foto Keenam',
      url: siteConfig.photo6 || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo6Caption || 'Foto Keenam: Ujian Tasmi\' Setoran 5 Juz Sekali Duduk',
    },
    {
      number: 7,
      label: 'Foto Ketujuh',
      url: siteConfig.photo7 || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo7Caption || 'Foto Ketujuh: Tebus Murah Sembako Lansia Dhuafa',
    },
    {
      number: 8,
      label: 'Foto Kedelapan',
      url: siteConfig.photo8 || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo8Caption || 'Foto Kedelapan: Beasiswa Full 100% Santri Yatim',
    },
    {
      number: 9,
      label: 'Foto Kesembilan',
      url: siteConfig.photo9 || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
      caption: siteConfig.photo9Caption || 'Foto Kesembilan: Suasana Asrama & Kelas Tahfizh',
    },
  ];

  // Custom text colors from siteConfig
  const mainTextColor = siteConfig.textColorMain || '#ffffff';
  const highlightColor = siteConfig.textColorHighlight || '#fbbf24';
  const bodyTextColor = siteConfig.textColorBody || '#a7f3d0';
  const cardTextColor = siteConfig.textColorCard || '#fef08a';

  return (
    <section className="py-12 bg-slate-950 text-white border-y border-emerald-900/60 relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-900/20 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-900/90 border border-amber-400/50 text-xs font-extrabold uppercase tracking-wider" style={{ color: highlightColor }}>
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Dokumentasi 9 Foto Kegiatan</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: mainTextColor }}>
            Galeri Foto <span style={{ color: highlightColor }}>Kios & Rumah Tahfizh</span>
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: bodyTextColor }}>
            Potret kegiatan operasional toko sembako murah, penyaluran paket beras, serta aktivitas belajar para santri penghafal Al-Qur'an.
          </p>
        </div>

        {/* 9 Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photosList.map((item) => (
            <div
              key={item.number}
              onClick={() => setSelectedImage({ url: item.url, caption: item.caption, number: item.number })}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/60 shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              {/* Photo Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Photo Badge (e.g. Foto Pertama) */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] font-extrabold flex items-center space-x-1.5 shadow" style={{ color: highlightColor }}>
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Foto {item.number}</span>
                </div>

                {/* Hover Maximize Overlay Icon */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2.5 rounded-full bg-amber-400 text-emerald-950 shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Caption Footer */}
              <div className="p-3.5 bg-slate-900/90 flex-1 flex flex-col justify-between border-t border-slate-800">
                <p className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: cardTextColor }}>
                  {item.caption}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-medium pt-2 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-bold">Kios Sedekah Dokumentasi</span>
                  <span className="text-amber-300/80 group-hover:underline flex items-center">
                    <span>Perbesar</span>
                    <span className="ml-0.5">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Popup for Full Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-amber-400/50 shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-400 text-emerald-950 font-black text-xs">
                  Foto {selectedImage.number}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-md">
                  {selectedImage.caption}
                </h4>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image View */}
            <div className="p-2 sm:p-4 bg-slate-950 flex items-center justify-center min-h-[300px] max-h-[70vh]">
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="max-h-[65vh] w-auto object-contain rounded-xl border border-slate-800"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-amber-300 font-semibold">
                {selectedImage.caption}
              </p>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Tutup Tampilan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
