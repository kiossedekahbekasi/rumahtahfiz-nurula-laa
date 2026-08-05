// Google Sheets Integration & Webhook Sync Manager
// Sheets bertindak sebagai "database" utama: setiap perubahan dari Panel Admin
// (Produk, Santri, Program, Statistik, Teks Situs) otomatis dikirim (POST) ke sini,
// dan aplikasi bisa menariknya kembali (GET) agar semua perangkat/browser tetap sinkron.

const STORAGE_KEY_WEBHOOK = 'ksb_sheets_webhook_url';
const STORAGE_KEY_AUTO_SYNC = 'ksb_sheets_auto_sync';

export type SyncAction =
  | 'ORDER'
  | 'DONATION'
  | 'SANTRI_REGISTRATION'
  | 'PRODUCT_UPDATE' // legacy alias, tetap didukung oleh skrip GAS terbaru
  | 'PRODUCTS_SYNC'
  | 'SANTRI_SYNC'
  | 'PROGRAMS_SYNC'
  | 'SITECONFIG_SYNC'
  | 'STATS_SYNC'
  | 'TEST_EVENT';

export interface SyncPayload {
  action: SyncAction;
  timestamp: string;
  data: any;
}

export interface DatabasePullResult {
  success: boolean;
  message: string;
  data?: {
    products?: any[];
    santri?: any[];
    programs?: any[];
    siteConfig?: any;
    stats?: any;
  };
}

export function getSheetsWebhookUrl(): string {
  return localStorage.getItem(STORAGE_KEY_WEBHOOK) || '';
}

export function setSheetsWebhookUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY_WEBHOOK, url.trim());
}

export function isAutoSyncEnabled(): boolean {
  const val = localStorage.getItem(STORAGE_KEY_AUTO_SYNC);
  return val === null ? true : val === 'true';
}

export function setAutoSyncEnabled(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEY_AUTO_SYNC, enabled ? 'true' : 'false');
}

/**
 * Sends real-time data to Google Sheets via Apps Script Webhook
 */
export async function sendToGoogleSheets(
  action: SyncAction,
  data: any
): Promise<{ success: boolean; message: string }> {
  const url = getSheetsWebhookUrl();
  if (!url) {
    return {
      success: false,
      message: 'Google Sheets Webhook URL belum diatur di Panel Admin.',
    };
  }

  const payload: SyncPayload = {
    action,
    timestamp: new Date().toISOString(),
    data,
  };

  try {
    // Standard Google Apps Script Webhook invocation
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', // Apps Script web apps redirect, no-cors ensures submission works cleanly from browser
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Data berhasil dikirim & disinkronkan ke Database Google Sheets!',
    };
  } catch (error: any) {
    console.error('Error syncing to Google Sheets:', error);
    return {
      success: false,
      message: 'Gagal mengirim data ke Google Sheets: ' + (error?.message || 'Network error'),
    };
  }
}

/** Sinkronkan seluruh katalog Produk & Paket Sedekah ke Database Sheets */
export function syncProductsToSheets(products: any[]) {
  return sendToGoogleSheets('PRODUCTS_SYNC', products);
}

/** Sinkronkan seluruh data Santri ke Database Sheets */
export function syncSantriToSheets(santri: any[]) {
  return sendToGoogleSheets('SANTRI_SYNC', santri);
}

/** Sinkronkan seluruh kartu Program Tahfizh ke Database Sheets */
export function syncProgramsToSheets(programs: any[]) {
  return sendToGoogleSheets('PROGRAMS_SYNC', programs);
}

/** Sinkronkan Konfigurasi & Teks Situs ke Database Sheets */
export function syncSiteConfigToSheets(siteConfig: any) {
  return sendToGoogleSheets('SITECONFIG_SYNC', siteConfig);
}

/** Sinkronkan Statistik/Metrik Transparansi ke Database Sheets */
export function syncStatsToSheets(stats: any) {
  return sendToGoogleSheets('STATS_SYNC', stats);
}

/**
 * Menarik (GET) seluruh data master (Produk, Santri, Program, Konfigurasi Situs,
 * Statistik) dari Google Sheets, supaya aplikasi otomatis tersinkron dengan data
 * terbaru di Database Sheets -- termasuk perubahan dari perangkat/browser lain.
 */
export async function fetchDatabaseFromSheets(): Promise<DatabasePullResult> {
  const url = getSheetsWebhookUrl();
  if (!url) {
    return {
      success: false,
      message: 'Google Sheets Webhook URL belum diatur di Panel Admin.',
    };
  }

  try {
    const res = await fetch(url, { method: 'GET' });
    const json = await res.json();

    if (!json || json.result === 'error') {
      return {
        success: false,
        message: 'Gagal memuat Database dari Google Sheets: ' + (json?.error || 'Respon tidak valid'),
      };
    }

    return {
      success: true,
      message: 'Database berhasil dimuat & disinkronkan dari Google Sheets!',
      data: {
        products: Array.isArray(json.products) ? json.products : undefined,
        santri: Array.isArray(json.santri) ? json.santri : undefined,
        programs: Array.isArray(json.programs) ? json.programs : undefined,
        siteConfig: json.siteConfig && typeof json.siteConfig === 'object' ? json.siteConfig : undefined,
        stats: json.stats && typeof json.stats === 'object' ? json.stats : undefined,
      },
    };
  } catch (error: any) {
    console.error('Error fetching database from Google Sheets:', error);
    return {
      success: false,
      message: 'Gagal memuat Database dari Google Sheets: ' + (error?.message || 'Network error. Pastikan skrip sudah di-Deploy ulang dengan akses "Anyone".'),
    };
  }
}

/**
 * CSV Export Utility for opening in Google Sheets
 */
export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) {
    alert('Tidak ada data untuk diexport.');
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
            if (typeof cell === 'object') {
              cell = JSON.stringify(cell).replace(/"/g, '""');
            } else {
              cell = String(cell).replace(/"/g, '""');
            }
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Google Apps Script Template Code for users to paste in Google Sheets
 *
 * v2 -- Sheets sebagai DATABASE penuh:
 * - doPost: menerima ORDER, DONATION, SANTRI_REGISTRATION, TEST_EVENT (log transaksi)
 *   DAN PRODUCTS_SYNC / SANTRI_SYNC / PROGRAMS_SYNC / SITECONFIG_SYNC / STATS_SYNC
 *   (menyimpan/menimpa seluruh data master dari Panel Admin).
 * - doGet: mengembalikan seluruh data master (products, santri, programs,
 *   siteConfig, stats) sebagai JSON, sehingga Panel Admin & aplikasi bisa
 *   menarik ulang ("Muat dari Database") data terbaru kapan saja.
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT - DATABASE KIOS SEDEKAH BEKASI (v2)
 * Salin dan tempel kode ini di Extensions -> Apps Script pada Google Sheets Anda!
 *
 * Langkah-langkah:
 * 1. Buka Google Sheets baru di https://sheets.google.com
 * 2. Klik menu Extensi / Extensions -> Apps Script
 * 3. Hapus semua kode default, lalu PASTE kode di bawah ini.
 * 4. Klik "Deploy" / "Terapkan" -> "New deployment" / "Aplikasi Web Baru"
 * 5. Pilih Execute as: "Me" (Saya) dan Who has access: "Anyone" (Siapa Saja)
 * 6. Klik "Deploy", izinkan akses, lalu Salin Web App URL.
 * 7. Tempel Web App URL tersebut ke Panel Admin Kios Sedekah Bekasi!
 *
 * PENTING: Setiap kali Anda mengedit kode ini, buat "New deployment" baru
 * (bukan hanya Save) agar URL Web App tetap berfungsi dengan kode terbaru.
 *
 * CATATAN UKURAN: Google Sheets membatasi 1 sel maksimal 50.000 karakter.
 * Jika Anda mengunggah foto langsung dari perangkat (base64) dalam ukuran
 * besar, sinkronisasi produk/santri/foto tersebut bisa gagal. Gunakan URL
 * gambar (link) atau kompres foto agar sinkronisasi ke Database Sheets lancar.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var jsonString = e.postData.contents;
    var payload = JSON.parse(jsonString);
    var action = payload.action;
    var data = payload.data;
    var now = new Date();

    if (action === 'ORDER') {
      var sheet = getOrCreateLogSheet(ss, 'Pesanan_Sembako', [
        'Waktu', 'ID Pesanan', 'Nota', 'Nama Pembeli', 'No WhatsApp',
        'Metode Pengiriman', 'Metode Pembayaran', 'Items Belanja', 'Infaq Ekstra', 'Total Bayar'
      ]);
      var itemsStr = (data.items || []).map(function(item) {
        return item.quantity + 'x ' + (item.product ? item.product.name : 'Produk');
      }).join('; ');

      sheet.appendRow([
        now.toLocaleString('id-ID'),
        data.id || '',
        data.receiptNumber || '',
        data.customerName || '',
        data.phone || '',
        data.deliveryMethod || '',
        data.paymentMethod || '',
        itemsStr,
        data.infaqExtraAmount || 0,
        data.totalAmount || 0
      ]);
    } else if (action === 'DONATION') {
      var sheet = getOrCreateLogSheet(ss, 'Donasi_Penyaluran', [
        'Waktu', 'Nama Donatur', 'Paket Sedekah', 'Nominal (Rp)', 'Penerima Manfaat', 'Pesan Doa'
      ]);
      sheet.appendRow([
        now.toLocaleString('id-ID'),
        data.donorName || 'Hamba Allah',
        data.packageType || '',
        data.amount || 0,
        data.targetRecipient || 'Rumah Tahfizh Bekasi',
        data.message || '-'
      ]);
    } else if (action === 'SANTRI_REGISTRATION') {
      var sheet = getOrCreateLogSheet(ss, 'Pendaftaran_Santri', [
        'Waktu', 'Nama Lengkap Santri', 'Nama Wali', 'Usia', 'Jenis Kelamin',
        'No WhatsApp', 'Program Pilihan', 'Status Yatim/Dhuafa', 'Alamat Lengkap', 'Catatan'
      ]);
      sheet.appendRow([
        now.toLocaleString('id-ID'),
        data.fullName || '',
        data.parentName || '',
        data.age || '',
        data.gender || '',
        data.phone || '',
        data.programChoice || '',
        data.isYatimDhuafa ? 'YA (Yatim/Dhuafa)' : 'Reguler',
        data.address || '',
        data.notes || '-'
      ]);
    } else if (action === 'PRODUCTS_SYNC' || action === 'PRODUCT_UPDATE') {
      syncJsonArraySheet(ss, 'DB_Produk', data);
    } else if (action === 'SANTRI_SYNC') {
      syncJsonArraySheet(ss, 'DB_Santri', data);
    } else if (action === 'PROGRAMS_SYNC') {
      syncJsonArraySheet(ss, 'DB_Program', data);
    } else if (action === 'SITECONFIG_SYNC') {
      syncJsonSingleSheet(ss, 'DB_Konfigurasi', data);
    } else if (action === 'STATS_SYNC') {
      syncJsonSingleSheet(ss, 'DB_Statistik', data);
    } else if (action === 'TEST_EVENT') {
      var sheet = getOrCreateLogSheet(ss, 'Log_Koneksi', ['Waktu', 'Status', 'Keterangan']);
      sheet.appendRow([now.toLocaleString('id-ID'), 'OK', 'Koneksi Kios Sedekah Bekasi ke Google Sheets Berhasil!']);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet: mengembalikan seluruh data master (Database) sebagai JSON, agar Panel
 * Admin / aplikasi web bisa menarik ulang data terbaru dari Google Sheets.
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = {
      result: 'success',
      products: readJsonArraySheet(ss, 'DB_Produk'),
      santri: readJsonArraySheet(ss, 'DB_Santri'),
      programs: readJsonArraySheet(ss, 'DB_Program'),
      siteConfig: readJsonSingleSheet(ss, 'DB_Konfigurasi'),
      stats: readJsonSingleSheet(ss, 'DB_Statistik')
    };
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== HELPER: LOG SHEET (transaksi) ====================
function getOrCreateLogSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF');
  }
  return sheet;
}

// ==================== HELPER: DATABASE TABEL (array data) ====================
// Setiap item disimpan sebagai satu baris JSON penuh agar seluruh field dari
// Panel Admin (termasuk yang baru ditambahkan di kemudian hari) ikut tersimpan
// dengan aman tanpa perlu mengubah skrip ini. JANGAN edit sel "Data JSON" secara
// manual di Sheets -- kelola datanya lewat Panel Admin situs.
function syncJsonArraySheet(ss, sheetName, dataArray) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  sheet.appendRow(['ID', 'Data JSON (Jangan Diedit Manual)', 'Terakhir Disinkronkan']);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF');

  var now = new Date().toLocaleString('id-ID');
  var list = Array.isArray(dataArray) ? dataArray : [];
  var rows = list.map(function (item) {
    return [item && item.id ? item.id : '', JSON.stringify(item), now];
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  }
  sheet.setColumnWidth(2, 520);
}

function readJsonArraySheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  var result = [];
  for (var i = 1; i < values.length; i++) {
    var raw = values[i][1];
    if (raw) {
      try {
        result.push(JSON.parse(raw));
      } catch (parseErr) {
        // Baris rusak/terpotong -- lewati agar data lain tetap terbaca
      }
    }
  }
  return result;
}

// ==================== HELPER: DATABASE OBJEK TUNGGAL (config/stats) ====================
function syncJsonSingleSheet(ss, sheetName, dataObj) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  sheet.appendRow(['Data JSON (Jangan Diedit Manual)', 'Terakhir Disinkronkan']);
  sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF');
  sheet.getRange(2, 1, 1, 2).setValues([[JSON.stringify(dataObj || {}), new Date().toLocaleString('id-ID')]]);
  sheet.setColumnWidth(1, 520);
}

function readJsonSingleSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return null;
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;
  try {
    return JSON.parse(values[1][0]);
  } catch (parseErr) {
    return null;
  }
}
`;
