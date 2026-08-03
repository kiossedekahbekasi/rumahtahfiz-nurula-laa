import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  HeartHandshake, 
  ShoppingBag, 
  Truck, 
  Store, 
  QrCode, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Sparkles,
  Phone,
  User,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onToggleDonation: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onToggleDonation,
  onRemoveItem,
  onClearCart,
}) => {
  const [extraInfaq, setExtraInfaq] = useState<number>(10000);
  const [deliveryMethod, setDeliveryMethod] = useState<'ambil_di_kios' | 'kurir_kios' | 'penyaluran_langsung'>('penyaluran_langsung');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer' | 'cod'>('qris');

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Checkout State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'kurir_kios' ? 10000 : 0;
  const grandTotal = subtotal + extraInfaq + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Mohon isi Nama Pembeli dan Nomor WhatsApp!');
      return;
    }

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      customerName,
      phone: customerPhone,
      address: customerAddress || 'Penyaluran Langsung Kios Sedekah & Rumah Tahfizh',
      deliveryMethod,
      paymentMethod,
      totalAmount: grandTotal,
      infaqExtraAmount: extraInfaq,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB',
      receiptNumber: 'INV/KS/' + Date.now().toString().slice(-6),
      status: 'proses',
    };

    setCompletedOrder(newOrder);

    // Celebration!
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Nomor rekening ${text} berhasil disalin!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 text-white w-full max-w-lg h-full flex flex-col shadow-2xl border-l border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">Keranjang Belanja & Sedekah</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Completed Order Receipt View */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900 text-slate-100">
            <div className="bg-emerald-950 p-6 rounded-2xl border-2 border-amber-400 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center mx-auto font-black text-2xl shadow">
                ✓
              </div>
              <h4 className="text-xl font-black text-white">Transaksi Berhasil Disimpan!</h4>
              <p className="text-xs text-amber-300 font-mono">
                No. Nota: <strong>{completedOrder.receiptNumber}</strong>
              </p>

              <div className="bg-emerald-900/80 p-4 rounded-xl text-left space-y-2 text-xs border border-emerald-800">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Nama Pembeli:</span>
                  <strong className="text-white">{completedOrder.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">No. WhatsApp:</span>
                  <strong className="text-white">{completedOrder.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Waktu Transaksi:</span>
                  <span className="text-emerald-100">{completedOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Metode Pengiriman:</span>
                  <span className="text-amber-300 font-bold uppercase">{completedOrder.deliveryMethod.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="text-left space-y-2 border-t border-emerald-800 pt-3 text-xs">
                <span className="font-bold text-amber-300 block">Rincian Belanja & Infaq:</span>
                {completedOrder.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-slate-200">
                    <span>
                      {item.quantity}x {item.product.name}
                      {item.isDonationDirectToTahfizh && (
                        <span className="ml-1 text-[10px] text-amber-400 font-bold">(Infaq Direct)</span>
                      )}
                    </span>
                    <span>Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
                {completedOrder.infaqExtraAmount > 0 && (
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>Extra Infaq Suka-Suka:</span>
                    <span>Rp {completedOrder.infaqExtraAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-emerald-800">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-amber-400">Rp {completedOrder.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Payment Instructions */}
              {completedOrder.paymentMethod === 'qris' && (
                <div className="bg-white text-slate-900 p-4 rounded-xl text-center space-y-2">
                  <span className="text-xs font-bold block">Pindai QRIS Kios Sedekah & Rumah Tahfizh:</span>
                  <div className="w-36 h-36 bg-slate-100 border border-slate-300 rounded-lg mx-auto p-2 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Mendukung GoPay, OVO, ShopeePay, Dana, & Seluruh Mobile Banking
                  </span>
                </div>
              )}

              {completedOrder.paymentMethod === 'transfer' && (
                <div className="bg-emerald-900 p-4 rounded-xl text-left space-y-2 text-xs">
                  <span className="font-bold text-amber-300 block">Transfer Rekening Bank Syariah:</span>
                  <div className="flex justify-between items-center bg-emerald-950 p-2 rounded border border-emerald-700">
                    <div>
                      <span className="block text-emerald-300">Bank Syariah Indonesia (BSI)</span>
                      <strong className="text-amber-300 font-mono text-sm">7182-9304-11</strong>
                      <span className="block text-[10px] text-emerald-400">a.n. KIOS SEDEKAH & TAHFIZH</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('7182930411')}
                      className="p-1.5 bg-emerald-800 rounded text-amber-300 hover:bg-emerald-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs shadow flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Struk Nota Digital</span>
                </button>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onClearCart();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Tutup & Kembali Belanja
                </button>
              </div>

            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <ShoppingBag className="w-16 h-16 text-slate-600" />
            <h4 className="font-bold text-slate-300 text-lg">Keranjang Masih Kosong</h4>
            <p className="text-slate-400 text-xs max-w-xs">
              Silakan pilih produk sembako atau paket sedekah di katalog untuk mulai berinfaq & berbelanja.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs shadow"
            >
              Lihat Produk Kios
            </button>
          </div>
        ) : (
          /* Active Cart Form */
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Item Belanja ({cartItems.length}):
              </h4>
              
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center space-x-3 text-xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white truncate">{item.product.name}</h5>
                    <div className="text-amber-300 font-semibold mt-0.5">
                      Rp {item.product.price.toLocaleString('id-ID')} / {item.product.unit}
                    </div>

                    {/* Toggle Donation Direct */}
                    <button
                      type="button"
                      onClick={() => onToggleDonation(item.product.id)}
                      className={`mt-1 text-[10px] px-2 py-0.5 rounded font-bold transition-all flex items-center space-x-1 ${
                        item.isDonationDirectToTahfizh
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <HeartHandshake className="w-3 h-3" />
                      <span>{item.isDonationDirectToTahfizh ? '✓ Disalurkan Ke Tahfizh' : 'Ubah Ke Infaq Direct'}</span>
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="p-1 hover:text-amber-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-white px-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="p-1 hover:text-amber-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Infaq Suka-suka Extra Slider */}
            <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-800 space-y-2">
              <div className="flex justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tambahan Infaq Suka-Suka (Uang Kembalian):</span>
                </span>
                <span>Rp {extraInfaq.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex gap-2">
                {[0, 5000, 10000, 20000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setExtraInfaq(amt)}
                    className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                      extraInfaq === amt
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                    }`}
                  >
                    {amt === 0 ? 'Tidak' : `+${amt / 1000}rb`}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Form & Shipping */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Informasi Pemesan & Pengiriman:
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap Pembeli *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Ibu Hj. Fitriani"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Delivery Option */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Opsi Pengiriman / Penyaluran</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('penyaluran_langsung')}
                      className={`p-2 rounded-lg border text-left text-[11px] font-bold ${
                        deliveryMethod === 'penyaluran_langsung'
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      🎁 Langsung ke Santri
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('ambil_di_kios')}
                      className={`p-2 rounded-lg border text-left text-[11px] font-bold ${
                        deliveryMethod === 'ambil_di_kios'
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      🏪 Ambil di Kios
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('kurir_kios')}
                      className={`p-2 rounded-lg border text-left text-[11px] font-bold ${
                        deliveryMethod === 'kurir_kios'
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      🛵 Kurir Kios (+10rb)
                    </button>
                  </div>
                </div>

                {deliveryMethod === 'kurir_kios' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Alamat Pengiriman Rumah</label>
                    <textarea
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Alamat rumah lengkap untuk kurir..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {/* Payment Option */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Metode Pembayaran</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-2 rounded-lg border text-center text-[11px] font-bold ${
                        paymentMethod === 'qris'
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      QRIS Instant
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-2 rounded-lg border text-center text-[11px] font-bold ${
                        paymentMethod === 'transfer'
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      Bank Syariah
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 rounded-lg border text-center text-[11px] font-bold ${
                        paymentMethod === 'cod'
                          ? 'bg-amber-400 text-emerald-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      COD / Bayar Kios
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation Footer */}
              <div className="bg-slate-950 p-4 rounded-xl space-y-1.5 text-xs border border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Belanja Sembako:</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Ongkos Kurir Express:</span>
                    <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {extraInfaq > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>Infaq Ekstra Suka-Suka:</span>
                    <span>Rp {extraInfaq.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-black text-base pt-2 border-t border-slate-800">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-amber-400">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                <span>Proses Pesanan & Infaq Sekarang</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
