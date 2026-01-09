
import React from 'react';
import { ArrowLeft, MapPin, Star, Heart, Trash2, Search } from 'lucide-react';
import { Attraction } from '../types';

interface FavoritesProps {
  favorites: Attraction[];
  onSelect: (attr: Attraction) => void;
  onRemove: (id: string, e: React.MouseEvent) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, onSelect, onRemove }) => {
  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Saved Trips</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No favorites yet</h3>
            <p className="text-slate-400 max-w-xs mx-auto">
                Start exploring and save your dream destinations to access them here quickly.
            </p>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((attr) => (
            <div 
              key={attr.id}
              onClick={() => onSelect(attr)}
              className="group relative bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => onRemove(attr.id, e)}
                  className="p-2.5 bg-white/80 backdrop-blur-md rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row h-full">
                  <div className="sm:w-1/3 h-48 sm:h-auto relative">
                    <img src={attr.imageUrl} alt={attr.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                         <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-900 shadow-sm">
                            {attr.category.split(' ')[0]}
                         </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-slate-900 leading-tight">{attr.name}</h3>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                <span className="text-xs font-bold text-amber-700">{attr.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-4">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            {attr.location}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Starting from</span>
                            <span className="text-emerald-600 font-black text-lg">RM {attr.price}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">View Details →</span>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
