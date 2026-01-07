
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
  ADMIN_DASHBOARD = 'admin-dashboard'
}
