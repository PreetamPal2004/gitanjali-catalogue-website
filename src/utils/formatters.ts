/**
 * Format price in Indian Rupees
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calcDiscount(mrp: number, selling: number): number {
  if (mrp <= 0) return 0;
  return Math.round(((mrp - selling) / mrp) * 100);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Build a WhatsApp chat link with pre-filled message
 */
export function whatsappLink(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a tel: link
 */
export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}

const DEFAULT_ELECTRONICS_IMAGE = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=75';

/**
 * Get the first image URL from a product images array or comma-separated string
 */
export function getFirstImage(images?: string[] | string): string {
  if (!images) return DEFAULT_ELECTRONICS_IMAGE;
  if (Array.isArray(images)) {
    if (images.length === 0) return DEFAULT_ELECTRONICS_IMAGE;
    const first = images[0];
    if (!first) return DEFAULT_ELECTRONICS_IMAGE;
    return typeof first === 'string' ? first.split(',')[0].trim() : String(first);
  }
  if (typeof images === 'string' && images.trim()) {
    return images.split(',')[0].trim();
  }
  return DEFAULT_ELECTRONICS_IMAGE;
}

/**
 * Get all image URLs from a product images array or comma-separated string
 */
export function getAllImages(images?: string[] | string): string[] {
  if (!images) return [DEFAULT_ELECTRONICS_IMAGE];
  let list: string[] = [];
  if (Array.isArray(images)) {
    list = images
      .flatMap(img => (typeof img === 'string' ? img.split(',') : String(img)))
      .map(s => s.trim())
      .filter(Boolean);
  } else if (typeof images === 'string' && images.trim()) {
    list = images.split(',').map(s => s.trim()).filter(Boolean);
  }
  return list.length > 0 ? list : [DEFAULT_ELECTRONICS_IMAGE];
}
