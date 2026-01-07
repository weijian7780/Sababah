
export interface ARHotspot {
  id: string;
  label: string;
  category: string;
  description: string;
  x: number; // Relative X coordinate (0-100) for AR positioning
  y: number; // Relative Y coordinate (0-100) for AR positioning
  mapX: number; // Relative X coordinate for 2D map
  mapY: number; // Relative Y coordinate for 2D map
  distance: string;
  rating: number;
  reviews: number;
  price: number;
  iconType: 'landmark' | 'history' | 'nature' | 'wildlife' | 'info' | 'sparkles';
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  description: string;
  price: number;
  arHotspots?: ARHotspot[];
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  attractionId: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
}

export enum AppRoute {
  WELCOME = 'welcome',
  LOGIN = 'login',
  SIGNUP = 'signup',
  RESET_PASSWORD = 'reset-password',
  HOME = 'home',
  EXPLORE = 'explore',
  FAVORITES = 'favorites',
  DETAIL = 'detail',
  BOOKING = 'booking',
  PAYMENT = 'payment',
  SUCCESS = 'success',
  PROFILE = 'profile',
  ADMIN_DASHBOARD = 'admin-dashboard',
  AR_VIEW = 'ar-view'
}
