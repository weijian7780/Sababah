
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Star, Map as MapIcon, List, Lock, Gem, Navigation, Share2, X, Sparkles, Loader2, LocateFixed } from 'lucide-react';
import { ATTRACTIONS as STATIC_ATTRACTIONS } from '../constants';
import { Attraction } from '../types';

interface ExploreProps {
  onSelect: (attr: Attraction) => void;
}

const Explore: React.FC<ExploreProps> = ({ onSelect }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filter, setFilter] = useState('All');
  const [attractions, setAttractions] = useState<Attraction[]>(STATIC_ATTRACTIONS);
  const [selectedGem, setSelectedGem] = useState<Attraction | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const categories = ['All', 'History', 'Nature', 'Wildlife', 'Hidden Gem'];

  const filteredAttractions = attractions.filter(attr => 
    filter === 'All' || attr.category.includes(filter)
  );

  const handleUnlock = (gem: Attraction) => {
    if (gem.isUnlocked) {
      onSelect(gem);
      return;
    }
    setSelectedGem(gem);
  };

  const confirmUnlock = async (type: 'GPS' | 'SHARE') => {
    if (type === 'GPS') setGpsLoading(true);
    setIsUnlocking(true);

    // Simulate task/GPS verification
    await new Promise(r => setTimeout(r, 2000));

    setAttractions(prev => prev.map(a => 
      a.id === selectedGem?.id ? { ...a, isUnlocked: true } : a
    ));
    
    setIsUnlocking(false);
    setGpsLoading(false);
    setSelectedGem(null);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      {/* View Toggle and Filters */}
      <div className="p-6 pb-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Explore</h2>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <MapIcon className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Sabah's secrets..." 
            className="w-full bg-[#F3F4F6] border-none rounded-[24px] py-5 pl-14 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-semibold"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border ${filter === cat ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {viewMode === 'list' ? (
          <div className="px-6 space-y-6 animate-in slide-in-from-bottom-4">
            {filteredAttractions.map((attr) => (
              <div 
                key={attr.id}
                onClick={() => attr.isHiddenGem && !attr.isUnlocked ? handleUnlock(attr) : onSelect(attr)}
                className={`relative flex gap-5 p-5 bg-white rounded-[40px] shadow-sm border transition-all active:scale-[0.98] group ${attr.isHiddenGem && !attr.isUnlocked ? 'border-amber-100' : 'border-slate-50'}`}
              >
                <div className="relative shrink-0">
                  <img src={attr.imageUrl} alt={attr.name} className={`w-32 h-32 rounded-3xl object-cover transition-all duration-700 ${attr.isHiddenGem && !attr.isUnlocked ? 'blur-md grayscale' : 'group-hover:scale-110'}`} />
                  {attr.isHiddenGem && !attr.isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl">
                      <Lock className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${attr.isHiddenGem ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'}`}>
                        {attr.category}
                      </span>
                      {!attr.isHiddenGem && (
                        <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                          <Star className="w-3 h-3 fill-current" /> {attr.rating}
                        </div>
                      )}
                    </div>
                    <h4 className={`font-black text-slate-800 text-xl leading-tight ${attr.isHiddenGem && !attr.isUnlocked ? 'opacity-40' : ''}`}>
                      {attr.isHiddenGem && !attr.isUnlocked ? '???' : attr.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-2 opacity-70">
                      <MapPin className="w-3.5 h-3.5" /> {attr.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-emerald-700 font-black text-lg">RM {attr.price}</span>
                    {attr.isHiddenGem && !attr.isUnlocked ? (
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        Locked <Lock className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{attr.reviews} Reviews</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* HIDDEN GEMS TACTICAL MAP */
          <div className="h-full px-6 animate-in fade-in duration-500 relative">
            <div className="relative w-full aspect-square bg-slate-900 rounded-[56px] border-4 border-slate-800 shadow-2xl overflow-hidden shadow-emerald-900/10">
               {/* Map Grid and Background */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
               />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#065f46_0%,transparent_70%)] opacity-20" />
               
               {/* Map Markers */}
               {filteredAttractions.map((attr) => (
                 <button
                    key={attr.id}
                    onClick={() => attr.isHiddenGem && !attr.isUnlocked ? handleUnlock(attr) : onSelect(attr)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-all active:scale-90 group"
                    style={{ left: `${attr.mapPosition?.x}%`, top: `${attr.mapPosition?.y}%` }}
                 >
                    <div className="relative flex flex-col items-center">
                       {/* Indicator Light */}
                       <div className={`w-3 h-3 rounded-full animate-pulse mb-1 shadow-[0_0_10px_currentColor] ${attr.isHiddenGem && !attr.isUnlocked ? 'text-amber-500 bg-amber-500' : 'text-emerald-400 bg-emerald-400'}`} />
                       
                       <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                         attr.isHiddenGem && !attr.isUnlocked 
                           ? 'bg-slate-800 border-amber-500/40 text-amber-500 shadow-xl' 
                           : 'bg-emerald-600 border-emerald-300 text-white shadow-lg shadow-emerald-500/20'
                       }`}>
                         {attr.isHiddenGem && !attr.isUnlocked ? <Lock className="w-5 h-5" /> : <Gem className="w-6 h-6" />}
                       </div>

                       {/* Hover Info */}
                       <div className="absolute top-full mt-2 bg-slate-800/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                          <p className="text-[10px] font-black text-white tracking-widest uppercase">
                            {attr.isHiddenGem && !attr.isUnlocked ? 'Locked Gem' : attr.name}
                          </p>
                       </div>
                    </div>
                 </button>
               ))}

               {/* Map Compass */}
               <div className="absolute bottom-6 right-6 w-16 h-16 bg-slate-800/50 rounded-full border border-white/10 flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-emerald-400 animate-pulse" />
               </div>
            </div>

            <div className="mt-8 bg-emerald-50 rounded-[40px] p-8 border border-emerald-100">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-black text-emerald-900 uppercase tracking-widest text-[11px]">Fog of War Activated</h4>
               </div>
               <p className="text-emerald-800/70 text-sm font-medium leading-relaxed">
                 Sabah's best secrets are hidden. Travel near the marked locations or share with friends to reveal the "Hidden Gems" on your map.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Unlock Modal Overlay */}
      {selectedGem && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-end animate-in fade-in duration-300">
           <div className="w-full bg-white rounded-t-[56px] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border-t border-slate-100">
              <div className="flex justify-between items-center mb-10">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-amber-50 rounded-3xl text-amber-500 border border-amber-100">
                       <Lock className="w-8 h-8" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">Hidden Gem Found!</h3>
                       <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Mystery Location in {selectedGem.location}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedGem(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-all">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="p-6 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                          <LocateFixed className="w-7 h-7 text-emerald-600" />
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-base">Arrive Nearby</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Check-in within 500m</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => confirmUnlock('GPS')}
                      disabled={isUnlocking}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
                    >
                      {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify GPS'}
                    </button>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                          <Share2 className="w-7 h-7 text-blue-500" />
                       </div>
                       <div>
                          <p className="font-black text-slate-800 text-base">Spread the Word</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Share to Unlock Intel</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => confirmUnlock('SHARE')}
                      disabled={isUnlocking}
                      className="bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
                    >
                      Share Task
                    </button>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-4 py-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Borneo Explorer Challenge</p>
                 <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/3 animate-pulse" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
