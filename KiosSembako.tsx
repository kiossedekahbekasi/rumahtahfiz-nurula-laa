import React, { useState } from 'react';
import { SembakoProduct, ProductCategory } from '../types';
import { 
  ShoppingBag, 
  HeartHandshake, 
  Sparkles, 
  Check, 
  Info, 
  Tag, 
  TrendingUp, 
  Package,
  Layers,
  Edit3
} from 'lucide-react';

interface KiosSembakoProps {
  products: SembakoProduct[];
  onAddToCart: (product: SembakoProduct, isDonationDirectToTahfizh: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  onEditProduct?: (product: SembakoProduct) => void;
}

export const KiosSembako: React.FC<KiosSembakoProps> = ({
  products,
  onAddToCart,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onEditProduct,
}) => {
  const [selectedProductDetail, setSelectedProductDetail] = useState<SembakoProduct | null>(null);
  const [addedToast, setAddedToast] = useState<{ id: string; msg: string } | null>(null);

  const categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'semua', label: 'Semua Produk', icon: '🏪' },
    { id: 'paket_sedekah', label: 'Paket Sedekah & Infaq', icon: '🎁' },
    { id: 'beras', label: 'Beras Premium', icon: '🌾' },
    { id: 'minyak_gula', label: 'Minyak & Gula', icon: '🍾' },
    { id: 'lauk_pauk', label: 'Telur & Lauk', icon: '🥚' },
    { id: 'kebutuhan_dapur', label: 'Kebutuhan Dapur', icon: '🧂' },
  ];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product: SembakoProduct, isDirectDonation: boolean) => {
    onAddToCart(product, isDirectDonation);
    const msg = isDirectDonation 
      ? `"${product.name}" dimasukkan keranjang sebagai SEDEKAH LANGSUNG!` 
      : `"${product.name}" telah ditambahkan ke keranjang belanja.`;
    setAddedToast({ id: product.id, msg });
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <section className="py-10 bg-slate-50 min-h-[600px] text-slate-800">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              <span>Katalog Kios Sedekah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Belanja Sembako Berkualitas & Berkah
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Pilih kebutuhan harian keluarga Anda atau pilih paket khusus untuk disedekahkan langsung ke Santri Tahfizh & Warga Dhuafa.
            </p>
          </div>

          {/* Special Quick Filter Badges */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedCategory('paket_sedekah')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                selectedCategory === 'paket_sedekah'
                  ? 'bg-amber-500 text-emerald-950 shadow-md ring-2 ring-amber-400'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              <span>Khusus Paket Sedekah</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Toast Alert */}
        {addedToast && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-700 flex items-center space-x-3 animate-bounce">
            <Check className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold">{addedToast.msg}</span>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm my-8">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-slate-700">Produk Tidak Ditemukan</h3>
            <p className="text-slate-500 text-xs mt-1">
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('semua');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isSedekah = product.isSedekahSpecial;
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col justify-between group ${
                    isSedekah 
                      ? 'border-amber-400/80 ring-1 ring-amber-300/50 shadow-amber-100' 
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Top Overlay Bar */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none gap-2">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-1 pointer-events-auto">
                        {isSedekah && (
                          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-emerald-950" />
                            <span>Paket Sedekah</span>
                          </span>
                        )}

                        {product.isSubsidy && (
                          <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
                            Subsidi Kios
                          </span>
                        )}
                      </div>

                      {/* Edit Product Button */}
                      {onEditProduct && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditProduct(product);
                          }}
                          className="pointer-events-auto bg-slate-900/85 hover:bg-amber-400 text-white hover:text-emerald-950 px-2.5 py-1 rounded-lg text-xs font-bold shadow-md backdrop-blur-sm transition-all flex items-center space-x-1 border border-slate-700/80 flex-shrink-0"
                          title="Edit Produk (Nama, Harga, Stok, URL Gambar)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {/* Impact Overlay Badge */}
                    {product.impactBadge && (
                      <div className="absolute bottom-2 left-2 right-2 bg-emerald-950/85 backdrop-blur-sm text-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 border border-emerald-700/60">
                        <HeartHandshake className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">{product.impactBadge}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium uppercase tracking-wider mb-1">
                        <span>{product.unit} • Stok {product.stock}</span>
                        {onEditProduct && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditProduct(product);
                            }}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-amber-400 text-emerald-800 hover:text-emerald-950 font-bold text-[10px] border border-emerald-200/80 transition-all"
                            title="Edit Produk dalam Admin Panel"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Produk</span>
                          </button>
                        )}
                      </div>

                      <h3 
                        onClick={() => setSelectedProductDetail(product)}
                        className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-2"
                      >
                        {product.name}
                      </h3>

                      <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline space-x-2 mb-3">
                        <span className="text-lg font-black text-emerald-900">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        {product.normalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            Rp {product.normalPrice.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAdd(product, false)}
                          className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all"
                          title="Beli untuk kebutuhan rumah tangga sendiri"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                          <span>Beli Dapur</span>
                        </button>

                        <button
                          onClick={() => handleAdd(product, true)}
                          className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black text-xs flex items-center justify-center space-x-1 shadow transition-all"
                          title="Sedekahkan & kirimkan langsung untuk Santri / Dhuafa"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-emerald-950" />
                          <span>Sedekahkan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="relative aspect-video bg-slate-100">
              <img
                src={selectedProductDetail.image}
                alt={selectedProductDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 bg-slate-900/80 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {selectedProductDetail.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedProductDetail.name}
                </h3>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedProductDetail.description}
              </p>

              {selectedProductDetail.impactBadge && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-3 text-emerald-900 text-xs">
                  <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <strong className="block font-bold">Dampak Keberkahan:</strong>
                    <span>{selectedProductDetail.impactBadge}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Harga Kios</span>
                  <span className="text-2xl font-black text-emerald-900">
                    Rp {selectedProductDetail.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onEditProduct && (
                    <button
                      onClick={() => {
                        const p = selectedProductDetail;
                        setSelectedProductDetail(null);
                        onEditProduct(p);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-amber-400 text-emerald-900 hover:text-emerald-950 font-bold text-xs border border-emerald-300 flex items-center space-x-1 transition-all"
                      title="Edit Produk ini di Admin Panel"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Edit Produk</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleAdd(selectedProductDetail, false);
                      setSelectedProductDetail(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Beli Mandiri
                  </button>
                  <button
                    onClick={() => {
                      handleAdd(selectedProductDetail, true);
                      setSelectedProductDetail(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-emerald-950 font-black text-xs shadow"
                  >
                    Sedekahkan Langsung
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
