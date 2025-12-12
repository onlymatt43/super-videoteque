export type MovieCategory = 'uncategorized' | 'uncut' | 'solo' | 'duo' | 'bts' | 'compilation';

export const CATEGORY_LABELS: Record<MovieCategory, string> = {
  uncategorized: 'Non classé',
  uncut: 'Uncut',
  solo: 'Solo',
  duo: 'Duo',
  bts: 'Behind the Scenes',
  compilation: 'Compilation'
};

export interface Movie {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  bunnyLibraryId?: string;
  bunnyVideoId?: string;
  videoPath: string;
  previewUrl?: string;
  rentalDurationHours: number;
  isFreePreview?: boolean;
  category?: MovieCategory;
  tags?: string[];
}

export interface Rental {
  _id: string;
  movie: Movie | string;
  customerEmail: string;
  payhipCode: string;
  status: 'active' | 'expired';
  expiresAt: string;
  lastSignedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayhipValidation {
  success: boolean;
  licenseKey: string;
  productId?: string;
  email?: string;
  status?: string;
  orderId?: string;
  purchasedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
