
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

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
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
  userReviews?: Review[];
  isHiddenGem?: boolean;
  isUnlocked?: boolean;
  coords?: { lat: number; lng: number };
  mapPosition?: { x: number; y: number }; // Percentage for custom prototype map
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
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
  PROFILE_PERSONAL = 'profile-personal',
  PROFILE_NOTIFICATIONS = 'profile-notifications',
  PROFILE_PRIVACY = 'profile-privacy',
  PROFILE_HELP = 'profile-help',
  ADMIN_LOGIN = 'admin-login',
  ADMIN_SIGNUP = 'admin-signup',
  ADMIN_DASHBOARD = 'admin-dashboard',
  AR_VIEW = 'ar-view'
}
