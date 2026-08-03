// Google Sheets Integration & Webhook Sync Manager

const STORAGE_KEY_WEBHOOK = 'ksb_sheets_webhook_url';
const STORAGE_KEY_AUTO_SYNC = 'ksb_sheets_auto_sync';

export interface SyncPayload {
  action: 'ORDER' | 'DONATION' | 'SANTRI_REGISTRATION' | 'PRODUCT_UPDATE' | 'TEST_EVENT';
  timestamp: string;
  data: any;
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
  action: 'ORDER' | 'DONATION' | 'SANTRI_REGISTRATION' | 'PRODUCT_UPDATE' | 'TEST_EVENT',
  data: any
): Promise<{ success: boolean; message: string }> {
  const url = getSheetsWebhookUrl();
  if (!url) {
    return { 
      success: false, 
      message: 'Google Sheets Webhook URL belum diatur di Panel Admin.' 
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
      message: 'Data berhasil dikirim ke Google Sheets Spreadsheet!' 
    };
  } catch (error: any) {
    console.error('Error syncing to Google Sheets:', error);
    return { 
      success: false, 
      message: 'Gagal mengirim data ke Google Sheets: ' + (error?.message || 'Network error') 
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
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT FOR KIOS SEDEKAH BEKASI
 * Salin dan tempel kode ini di Extensions -> Apps Script pada Google Sheets Anda!
 * 
 * Langkah-langkah:
 * 1. Buka Google Sheets baru di https://sheets.google.com
 * 2. Klik menu Extensi / Extensions -> Apps Script
 * 3. Hapus semua kode default, lalu PASTE kode di bawah ini.
 * 4. Klik "Deploy" / "Terapkan" -> "Web App" / "Aplikasi Web"
 * 5. Pilih Execute as: "Me" (Saya) dan Who has access: "Anyone" (Siapa Saja)
 * 6. Klik "Deploy", izinkan akses, lalu Salin Web App URL.
 * 7. Tempel Web App URL tersebut ke Panel Admin Kios Sedekah Bekasi!
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
      var sheet = getOrCreateSheet(ss, 'Pesanan_Sembako', [
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
      var sheet = getOrCreateSheet(ss, 'Donasi_Penyaluran', [
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
      var sheet = getOrCreateSheet(ss, 'Pendaftaran_Santri', [
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
    } else if (action === 'TEST_EVENT') {
      var sheet = getOrCreateSheet(ss, 'Log_Koneksi', ['Waktu', 'Status', 'Keterangan']);
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

function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#10B981').setFontColor('#FFFFFF');
  }
  return sheet;
}
`;
