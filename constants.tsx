
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
    description: 'The Sabah State Museum is the state museum of Sabah, Malaysia. It is located on Bukit Istana Lama in Kota Kinabalu.',
    price: 15,
    mapPosition: { x: 45, y: 55 },
    userReviews: [
      { id: 'r1', userName: 'Lim Wei', userAvatar: 'https://picsum.photos/seed/u1/100/100', rating: 5, comment: 'Amazing place to learn about Sabah heritage.', date: '2024-03-10' }
    ]
  },
  {
    id: '2',
    name: 'Mount Kinabalu',
    category: 'Nature & Parks',
    location: 'Ranau',
    rating: 4.9,
    reviews: 1240,
    imageUrl: 'https://picsum.photos/seed/kinabalu/800/600',
    description: 'The highest peak in Southeast Asia, offering breathtaking views.',
    price: 250,
    mapPosition: { x: 75, y: 35 },
    userReviews: []
  },
  {
    id: 'hg-1',
    name: 'Kiulu Valley Secret',
    category: 'Hidden Gem',
    location: 'Kiulu',
    rating: 4.9,
    reviews: 12,
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800',
    description: 'A secluded river spot known only to locals, offering crystal clear waters and private bamboo rafting.',
    price: 45,
    isHiddenGem: true,
    isUnlocked: false,
    mapPosition: { x: 55, y: 42 }
  },
  {
    id: 'hg-2',
    name: 'Danum Valley Canopy',
    category: 'Hidden Gem',
    location: 'Lahad Datu',
    rating: 5.0,
    reviews: 5,
    imageUrl: 'https://images.unsplash.com/photo-1544921671-5517117e38e6?auto=format&fit=crop&q=80&w=800',
    description: 'An ancient observation platform 40m high, providing views of rare endemic birds and wild orangutans.',
    price: 120,
    isHiddenGem: true,
    isUnlocked: false,
    mapPosition: { x: 85, y: 65 }
  },
  {
    id: 'hg-3',
    name: 'Kokol Hill Viewpoint',
    category: 'Hidden Gem',
    location: 'Menggatal',
    rating: 4.8,
    reviews: 28,
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    description: 'The best sunset spot in KK, away from the crowds. A private paragliding takeoff site.',
    price: 25,
    isHiddenGem: true,
    isUnlocked: false,
    mapPosition: { x: 52, y: 58 }
  }
];

export const COLORS = {
  primary: '#059669',
  secondary: '#10b981',
  accent: '#fbbf24',
  background: '#f8fafc',
};
