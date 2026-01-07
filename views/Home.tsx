
import React from 'react';
// Added Compass to the imports list to fix the "Cannot find name 'Compass'" error on line 99
import { Search, MapPin, Star, Bookmark, Landmark, MessageSquare, Ticket, Info, Compass } from 'lucide-react';
import { ATTRACTIONS } from '../constants';
import { Attraction } from '../types';

interface HomeProps {
  onSelect: (attr: Attraction) => void;
  onCategory: (cat: string) => void;
}

const Home: React.FC<HomeProps> = ({ onSelect, onCategory }) => {
  return (
    <div className="p-6 pb-4 animate-in fade-in duration-500">
      {/* Search Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Hi, Traveler! 👋</h2>
        <p className="text-slate-500 mb-6">Where would you like to go today?</p>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search attractions..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Landmark className="w-6 h-6" />, label: 'Museum', color: 'bg-orange-100 text-orange-600' },
          { icon: <MessageSquare className="w-6 h-6" />, label: 'Feedback', color: 'bg-emerald-100 text-emerald-600' },
          { icon: <Ticket className="w-6 h-6" />, label: 'Booking', color: 'bg-blue-100 text-blue-600' },
          { icon: <Info className="w-6 h-6" />, label: 'Info', color: 'bg-purple-100 text-purple-600' }
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onCategory(item.label)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95`}>
              {item.icon}
            </div>
            <span className="text-xs font-bold text-slate-600">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">Popular Destinations</h3>
          <button onClick={() => onCategory('all')} className="text-emerald-600 text-sm font-bold">View All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4">
          {ATTRACTIONS.map((attr) => (
            <div 
              key={attr.id}
              onClick={() => onSelect(attr)}
              className="min-w-[260px] bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="relative h-44">
                <img src={attr.imageUrl} alt={attr.name} className="w-full h-full object-cover" />
                <button className="absolute top-4 right-4 p-2 bg-white/30 backdrop-blur-md rounded-xl text-white">
                  <Bookmark className="w-5 h-5 fill-white" />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-800 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {attr.rating}
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-bold text-slate-800 mb-1">{attr.name}</h4>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <MapPin className="w-3 h-3" />
                  {attr.location}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">RM {attr.price} <span className="text-slate-400 font-normal text-xs">/ person</span></span>
                  <div className="text-xs text-slate-400">{attr.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary Banner */}
      <div className="bg-emerald-600 rounded-3xl p-6 text-white flex items-center gap-6 shadow-xl shadow-emerald-200">
        <div className="flex-1">
          <h4 className="text-xl font-bold mb-2">Build Your Itinerary</h4>
          <p className="text-emerald-100 text-sm mb-4">Let our AI help you plan the perfect day trip in Sabah.</p>
          <button className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all">Try Now</button>
        </div>
        <div className="w-24 h-24 bg-emerald-500/50 rounded-2xl flex items-center justify-center">
          <Compass className="w-12 h-12 text-white animate-spin-slow" style={{ animationDuration: '10s' }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
