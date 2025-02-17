export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'host' | 'guest' | 'admin';
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Spot {
  id: string;
  hostId: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  pricePerHour: number;
  squareFootage?: number;
  type: string;
  amenities: string[];
  features: {
    parking: boolean;
    wifi: boolean;
    accessibility: boolean;
    kitchen: boolean;
    soundSystem: boolean;
    restrooms: boolean;
  };
  rules?: string;
  status: string;
  featuredImage?: string;
  galleryImages?: string[];
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
}

export interface Booking {
  id: string;
  spotId: string;
  guestId: string;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: string;
  paymentIntentId?: string;
  eventType: string;
  guestCount: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  createdAt: Date;
  updatedAt: Date;
}