
import React from 'react';
import { Search, MapPin, Star, Bookmark, Landmark, MessageSquare, Ticket, Info } from 'lucide-react';
import { ATTRACTIONS } from '../constants';
import { Attraction } from '../types';

interface HomeProps {
  onSelect: (attr: Attraction) => void;
  onCategory: (cat: string) => void;
  onBookDirect: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelect, onCategory, onBookDirect, favorites, onToggleFavorite }) => {
  return (
    <div className="p-6 pb-4 animate-in fade-in duration-500 bg-white">
      {/* Search Section */}
      <div className="mb-8 mt-2">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Hi, Traveler! 👋</h2>
        <p className="text-slate-400 font-medium mb-8">Where would you like to go today?</p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-300" />
          </div>
          <input 
            type="text" 
            placeholder="Search attractions" 
            className="w-full bg-[#F3F4F6] border-none rounded-2xl py-4.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Landmark className="w-6 h-6" />, label: 'Museum', color: 'bg-[#FFF7ED] text-[#F97316]', action: () => onCategory('Museum') },
          { icon: <MessageSquare className="w-6 h-6" />, label: 'Feedback', color: 'bg-[#ECFDF5] text-[#10B981]', action: () => onCategory('Feedback') },
          { icon: <Ticket className="w-6 h-6" />, label: 'Booking', color: 'bg-[#EFF6FF] text-[#3B82F6]', action: onBookDirect },
          { icon: <Info className="w-6 h-6" />, label: 'Info', color: 'bg-[#FAF5FF] text-[#A855F7]', action: () => onCategory('Info') }
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={item.action}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95`}>
              {item.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-500">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Popular Destinations</h3>
          <button onClick={() => onCategory('all')} className="text-[#10B981] text-sm font-bold flex items-center gap-1">
            View All
          </button>
        </div>

        <div className="flex gap-5 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-6">
          {ATTRACTIONS.map((attr, idx) => {
            const isFav = favorites.includes(attr.id);
            return (
              <div 
                key={attr.id}
                onClick={() => onSelect(attr)}
                className="min-w-[240px] bg-white rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] cursor-pointer active:scale-[0.98] transition-all border border-slate-50 relative group"
              >
                <div className="relative h-44">
                  <img 
                    src={idx === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600" : attr.imageUrl} 
                    alt={attr.name} 
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(attr.id); }}
                    className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-2xl transition-all ${isFav ? 'bg-emerald-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 shadow-sm">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    {attr.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{attr.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <MapPin className="w-3 h-3" />
                    {attr.location}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[#065F46] font-extrabold text-base leading-none">RM {attr.price} <span className="text-slate-300 font-bold text-[10px] ml-0.5">/ person</span></span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{attr.category.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
