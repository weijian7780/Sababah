
import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Star } from 'lucide-react';
import { ATTRACTIONS } from '../constants';
import { Attraction } from '../types';

interface ExploreProps {
  onSelect: (attr: Attraction) => void;
}

const Explore: React.FC<ExploreProps> = ({ onSelect }) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'History', 'Nature', 'Wildlife', 'Relaxation'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Explore Sabah</h2>
        <button className="p-2 bg-slate-100 rounded-xl">
          <SlidersHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Where to?" 
          className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 mb-8">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {ATTRACTIONS.map((attr) => (
          <div 
            key={attr.id}
            onClick={() => onSelect(attr)}
            className="flex gap-4 p-4 bg-white rounded-3xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all"
          >
            <img src={attr.imageUrl} alt={attr.name} className="w-28 h-28 rounded-2xl object-cover" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{attr.category}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3 h-3 fill-current" /> {attr.rating}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-lg leading-tight mt-1">{attr.name}</h4>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                  <MapPin className="w-3 h-3" /> {attr.location}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-emerald-700 font-bold">RM {attr.price}</span>
                <span className="text-[10px] text-slate-400">{attr.reviews} reviews</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
