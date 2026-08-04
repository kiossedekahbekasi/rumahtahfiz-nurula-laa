export type ProductCategory = 
  | 'semua'
  | 'beras'
  | 'minyak_gula'
  | 'paket_sedekah'
  | 'lauk_pauk'
  | 'kebutuhan_dapur';

export interface SembakoProduct {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  normalPrice?: number;
  image: string;
  unit: string;
  stock: number;
  description: string;
  isSedekahSpecial?: boolean;
  impactBadge?: string; // e.g. "Menyokong 1 Santri / Minggu"
  isSubsidy?: boolean; // E.g., Tebus murah
}

export interface CartItem {
  product: SembakoProduct;
  quantity: number;
  isDonationDirectToTahfizh: boolean; // Sent directly to Rumah Tahfizh
}

export interface Santri {
  id: string;
  name: string;
  age: number;
  category: 'Yatim' | 'Dhuafa' | 'Reguler' | 'Takhassus';
  currentJuz: number;
  targetJuz: number;
  setoranTerakhir: string;
  photo: string;
  joinDate: string;
  bio: string;
}

export interface ProgramTahfizh {
  id: string;
  title: string;
  description: string;
  badge: string;
  schedule: string;
  featureList: string[];
  targetAudience: string;
  iconName: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  packageType: string;
  amount: number;
  date: string;
  message?: string;
  isAnonymous?: boolean;
  targetRecipient: string;
}

export interface RegistrationFormData {
  fullName: string;
  parentName: string;
  age: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string;
  phone: string;
  programChoice: string;
  isYatimDhuafa: boolean;
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  deliveryMethod: 'ambil_di_kios' | 'kurir_kios' | 'penyaluran_langsung';
  paymentMethod: 'qris' | 'transfer' | 'cod';
  totalAmount: number;
  infaqExtraAmount: number;
  createdAt: string;
  receiptNumber: string;
  status: 'proses' | 'siap' | 'tersalurkan';
}

export interface SiteConfig {
  appName: string;
  appSubtitle: string;
  aboutTagline: string;
  announcementText: string;
  heroBadgeText: string;
  heroTitleMain: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBerasGoalKg: number;
  heroBerasCurrentKg: number;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  heroTrust1?: string;
  heroTrust2?: string;
  heroTrust3?: string;
  heroCardBadge?: string;
  heroCardTitle?: string;
  heroCardSubtitle?: string;
  heroCardTarget?: string;
  heroCardGoalLabel?: string;
  heroCardFeature1Title?: string;
  heroCardFeature1Desc?: string;
  heroCardFeature2Title?: string;
  heroCardFeature2Desc?: string;
  // Text Colors
  textColorMain?: string;
  textColorHighlight?: string;
  textColorBody?: string;
  textColorCard?: string;
  textColorButton?: string;
  // 9 Photos & Captions
  photo1?: string;
  photo1Caption?: string;
  photo2?: string;
  photo2Caption?: string;
  photo3?: string;
  photo3Caption?: string;
  photo4?: string;
  photo4Caption?: string;
  photo5?: string;
  photo5Caption?: string;
  photo6?: string;
  photo6Caption?: string;
  photo7?: string;
  photo7Caption?: string;
  photo8?: string;
  photo8Caption?: string;
  photo9?: string;
  photo9Caption?: string;
  waNumberDisplay: string;
  waNumberDigits: string;
  organizationAddress: string;
  bankBsiAccount: string;
  bankBsiName: string;
  bankAccountHolder: string;
  qrisImageUrl: string;
  githubRepoUrl: string;
  footerDescription: string;
}

