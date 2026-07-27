import type { CMSData } from '../types';
import mockData from '../data/mockData';

// Public Google Apps Script Web App URL or proxy endpoint
const API_URL = import.meta.env.VITE_GSHEETS_API_URL || '';

const ELECTRONICS_SHOWROOM_IMAGE = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=75';

export async function fetchCMSData(): Promise<CMSData> {
  if (!API_URL) {
    console.info('Using local mock data (VITE_GSHEETS_API_URL not set)');
    return mockData;
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const raw: Partial<CMSData> = await res.json();

    const sanitizedGallery = Array.isArray(raw.gallery)
      ? raw.gallery.map((g: any, idx: number) => {
          const category = g.Category || g.category || 'Showroom';
          const details = g.Details || g.details || g.title || g.name || 'Showroom Display';
          const rawPic = g.pictureLink || g.picturelink || g.picture_link || g.image || g.photo || g.url || g.link || '';

          return {
            id: g.id || `gallery-${idx}`,
            title: details,
            category: category,
            image: (!rawPic || rawPic.includes('photo-1441986')) ? ELECTRONICS_SHOWROOM_IMAGE : rawPic,
            details: details,
            pictureLink: rawPic,
          };
        })
      : [];

    const rawReviewsList = Array.isArray(raw.reviews)
      ? raw.reviews
      : (Array.isArray(raw.testimonials) ? raw.testimonials : []);

    const sanitizedReviews = rawReviewsList.length > 0
      ? rawReviewsList.map((r: any, idx: number) => {
          const pid = r.productId || r.product_id || r.ProductId || r['Product ID'] || r.product || '';
          const name = r.customer || r.personName || r.name || r.author || r.reviewer || r.Customer || r.Name || 'Anonymous Customer';
          const text = r.review || r.comment || r.text || r.content || r.Review || r.Comment || '';
          const ratingVal = r.rating || r.noOfStars || r.stars || r.score || r.Rating || r.Stars || 5;

          return {
            id: r.id || r.reviewId || `rev-${idx}`,
            productId: pid ? String(pid).trim() : 'P000',
            customer: String(name),
            review: String(text),
            rating: Number(ratingVal) || 5,
            date: String(r.date || r.created_at || r.Date || ''),
            photo: String(r.photo || r.image || ''),
            display: r.display !== false && String(r.display).toLowerCase() !== 'false' && String(r.status).toLowerCase() !== 'hidden',
          };
        })
      : [];

    const businessInfo = raw.businessInfo ? { ...mockData.businessInfo, ...raw.businessInfo } : mockData.businessInfo;

    const contactMethods = Array.isArray(raw.contactMethods) && raw.contactMethods.length > 0
      ? raw.contactMethods
      : [
          { type: 'phone', label: 'Call Us', value: businessInfo.phone, url: `tel:${businessInfo.phone.replace(/\s+/g, '')}`, icon: 'Phone', active: true, order: 1 },
          { type: 'whatsapp', label: 'WhatsApp', value: businessInfo.phone, url: `https://wa.me/${businessInfo.whatsapp.replace(/[^0-9]/g, '')}`, icon: 'MessageCircle', active: true, order: 2 },
          { type: 'email', label: 'Email', value: businessInfo.email, url: `mailto:${businessInfo.email}`, icon: 'Mail', active: true, order: 3 },
          { type: 'maps', label: 'Directions', value: businessInfo.address, url: businessInfo.maps, icon: 'MapPin', active: true, order: 4 },
        ];

    const sanitizedProducts = Array.isArray(raw.products)
      ? raw.products.map((p: any) => ({
          ...p,
          warranty: String(p.warranty || p.Warranty || p.WARRANTY || p['Warranty Period'] || p['warranty_period'] || p.warrantyPeriod || '1 Year Manufacturer Warranty'),
        }))
      : [];

    return {
      products: sanitizedProducts,
      categories: Array.isArray(raw.categories) ? raw.categories : [],
      offers: Array.isArray(raw.offers) ? raw.offers : [],
      brands: Array.isArray(raw.brands) ? raw.brands : [],
      services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : mockData.services,
      testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : [],
      reviews: sanitizedReviews,
      businessInfo,
      gallery: sanitizedGallery,
      homepage: raw.homepage ? { ...mockData.homepage, ...raw.homepage } : mockData.homepage,
      contactMethods,
      settings: raw.settings ? { ...mockData.settings, ...raw.settings } : mockData.settings,
    };
  } catch (err) {
    console.error('Failed to fetch live data from Google Sheets API, falling back to mock data:', err);
    return mockData;
  }
}
