
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
    price: 15,
    arHotspots: [
      { id: 'm1', label: 'Main Exhibit', category: 'COLLECTION', description: 'Ethnography and natural history archives of Borneo.', x: 48, y: 35, mapX: 45, mapY: 35, distance: '12m', rating: 4.5, reviews: 128, price: 0, iconType: 'landmark' },
      { id: 'm2', label: 'Heritage Village', category: 'SIGHT', description: 'Authentic traditional tribal houses representing Sabah ethnic groups.', x: 25, y: 45, mapX: 30, mapY: 65, distance: '45m', rating: 4.7, reviews: 85, price: 5, iconType: 'history' },
      { id: 'm3', label: 'Science Center', category: 'INTERACTIVE', description: 'Eco-tech and biodiversity displays and learning spaces.', x: 75, y: 55, mapX: 75, mapY: 55, distance: '28m', rating: 4.3, reviews: 42, price: 10, iconType: 'sparkles' }
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
    description: 'The highest peak in Southeast Asia, offering breathtaking views and a challenging climb for adventure seekers.',
    price: 250,
    arHotspots: [
      { id: 'k1', label: 'Summit Trail', category: 'TREKKING', description: 'The primary path leading to Low\'s Peak summit.', x: 50, y: 30, mapX: 50, mapY: 20, distance: '2.4km', rating: 4.9, reviews: 2100, price: 0, iconType: 'nature' },
      { id: 'k2', label: 'Laban Rata', category: 'BASECAMP', description: 'Main resthouse for climbers attempting the sunrise summit.', x: 35, y: 60, mapX: 40, mapY: 50, distance: '1.2km', rating: 4.6, reviews: 940, price: 180, iconType: 'landmark' },
      { id: 'k3', label: 'Orchid Garden', category: 'FLORA', description: 'Rare endemic orchid species found only on these slopes.', x: 70, y: 70, mapX: 65, mapY: 75, distance: '400m', rating: 4.8, reviews: 156, price: 5, iconType: 'wildlife' }
    ]
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
