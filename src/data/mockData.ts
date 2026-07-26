import type { CMSData } from '../types';

const mockData: CMSData = {
  homepage: {
    heroTitle: 'Gitanjali Electronics',
    heroSubtitle: 'Your Trusted Destination for Premium Electronics Since 1995',
    heroImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1400&q=80',
    cta: 'Browse Catalogue',
    announcement: '🎉 Grand Summer Sale — Up to 40% OFF on ACs & Refrigerators!',
  },
  businessInfo: {
    shopName: 'Gitanjali Electronics',
    address: 'Bagati Kantapukur Road (Near Mogra 2No Gram Panchayet Office), Mogra, Hooghly, WB 712 148',
    phone: '+91 91430 05296',
    whatsapp: '919143005296',
    email: 'gitanjaliputul73@gmail.com',
    maps: 'https://maps.app.goo.gl/TpzZncq91JvxbPCC7',
    businessHours: 'Tue-Sun: 10:00 AM - 10:30 PM',
    holidayNotice: '',
  },
  settings: {
    theme: 'light',
    language: 'en',
    darkModeDefault: false,
    analyticsId: '',
  },
  categories: [],
  brands: [],
  products: [],
  offers: [],
  services: [
    { id: 'S1', title: 'Free Home Delivery*', description: 'Free delivery and installation across Mogra, Hooghly and surrounding areas.', icon: 'Truck', features: ['Same-day delivery', 'Professional installation', 'Old product removal'], active: true },
    { id: 'S2', title: 'Warranty', description: 'Warranty plans from 1 to 5 additional years on all products.', icon: 'Shield', features: ['Affordable plans', 'Hassle-free claims', 'Authorized service'], active: true },
    { id: 'S4', title: 'Repair & Service', description: 'Expert repair services for all major electronic brands.', icon: 'Wrench', features: ['Certified technicians', 'Genuine parts', 'Quick Service Delivery'], active: true },
  ],
  gallery: [],
  testimonials: [],
  reviews: [],
  contactMethods: [
    { type: 'phone', label: 'Call Us', value: '+91 91430 05296', url: 'tel:+919143005296', icon: 'Phone', active: true, order: 1 },
    { type: 'whatsapp', label: 'WhatsApp', value: '+91 91430 05296', url: 'https://wa.me/919143005296', icon: 'MessageCircle', active: true, order: 2 },
    { type: 'email', label: 'Email', value: 'gitanjaliputul73@gmail.com', url: 'mailto:gitanjaliputul73@gmail.com', icon: 'Mail', active: true, order: 3 },
    { type: 'maps', label: 'Directions', value: 'Bagati Kantapukur Road, Mogra, Hooghly', url: 'https://maps.app.goo.gl/TpzZncq91JvxbPCC7', icon: 'MapPin', active: true, order: 4 },
  ],
};

export default mockData;
