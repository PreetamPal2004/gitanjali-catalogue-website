// ===== Product Types =====
export interface Product {
  productId: string;
  name: string;
  slug: string;
  brand: string;
  brandLogo?: string;
  category: string;
  subcategory: string;
  model: string;
  mrp: number;
  sellingPrice: number;
  discount: number;
  stock: 'In Stock' | 'Out of Stock' | 'Limited';
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  warranty: string;
  installation: string;
  delivery: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  active: boolean;
  featured?: boolean;
  displayOrder: number;
}

// ===== Homepage Config =====
export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  cta: string;
  announcement: string;
}

// ===== Business Info =====
export interface BusinessInfo {
  shopName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  maps: string;
  businessHours: string;
  holidayNotice: string;
}

// ===== Testimonial =====
export interface Testimonial {
  customer: string;
  review: string;
  rating: number;
  photo: string;
  display: boolean;
}

// ===== Contact Method =====
export interface ContactMethod {
  type: string;
  label: string;
  value: string;
  url: string;
  icon: string;
  active: boolean;
  order: number;
}

// ===== Settings =====
export interface Settings {
  theme: 'light' | 'dark';
  language: 'en' | 'bn';
  darkModeDefault: boolean;
  analyticsId: string;
}

// ===== Offer =====
export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  validUntil: string;
  discount: string;
  category: string;
  active: boolean;
}

// ===== Service =====
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  active: boolean;
}

// ===== Gallery Item =====
export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  details?: string;
  pictureLink?: string;
}

// ===== Category =====
export interface Category {
  name: string;
  slug: string;
  icon: string;
  image: string;
  count: number;
}

// ===== Brand =====
export interface Brand {
  name: string;
  slug: string;
  logo: string;
  brandLogo?: string;
  description: string;
  productCount: number;
  active?: boolean;
}

// ===== Review =====
export interface Review {
  id?: string;
  productId?: string; // 'P000' for store testimonials, or specific productId (e.g. 'P001') for product reviews
  customer: string;
  review: string;
  rating: number;
  date?: string;
  photo?: string;
  display?: boolean;
}

// ===== Theme & Language Types =====
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'bn';

// ===== CMS Data Bundle =====
export interface CMSData {
  products: Product[];
  homepage: HomepageConfig;
  businessInfo: BusinessInfo;
  testimonials: Testimonial[];
  reviews: Review[];
  contactMethods: ContactMethod[];
  settings: Settings;
  offers: Offer[];
  services: Service[];
  gallery: GalleryItem[];
  categories: Category[];
  brands: Brand[];
}
