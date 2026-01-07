
import { Attraction } from './types';

export const ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    name: 'Sabah Museum',
    category: 'History & Culture',
    location: 'Kota Kinabalu',
    rating: 4.5,
    reviews: 215,
    imageUrl: 'https://picsum.photos/seed/museum/800/600',
    description: 'The Sabah State Museum is the state museum of Sabah, Malaysia. It is located on 17 hectares of land at Bukit Istana Lama in Kota Kinabalu.',
    price: 15
  },
  {
    id: '2',
    name: 'Mount Kinabalu',
    category: 'Nature & Parks',
    location: 'Ranau',
    rating: 4.9,
    reviews: 1240,
    imageUrl: 'https://picsum.photos/seed/kinabalu/800/600',
    description: 'The highest peak in Southeast Asia, offering breathtaking views and a challenging climb for adventure seekers.',
    price: 250
  },
  {
    id: '3',
    name: 'Poring Hot Spring',
    category: 'Relaxation',
    location: 'Ranau',
    rating: 4.2,
    reviews: 530,
    imageUrl: 'https://picsum.photos/seed/poring/800/600',
    description: 'A natural hot spring set in a tropical forest, perfect for relaxing after a long day of hiking.',
    price: 30
  },
  {
    id: '4',
    name: 'Sepilok Orangutan',
    category: 'Wildlife',
    location: 'Sandakan',
    rating: 4.8,
    reviews: 890,
    imageUrl: 'https://picsum.photos/seed/orangutan/800/600',
    description: 'A rehabilitation center dedicated to rescuing and rehabilitating orphaned and injured orangutans.',
    price: 60
  }
];

export const COLORS = {
  primary: '#059669', // Emerald-600
  secondary: '#10b981', // Emerald-500
  accent: '#fbbf24', // Amber-400
  background: '#f8fafc', // Slate-50
};
