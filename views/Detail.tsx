
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Share2, Heart, Clock, Calendar, Users, Info, Box, ExternalLink, Loader2, Navigation } from 'lucide-react';
import { Attraction, AppRoute } from '../types';
import { geminiService } from '../services/geminiService';

interface DetailProps {
  attraction: Attraction;
  onBack: () => void;
  onBook: () => void;
  onEnterAR: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

interface LocationInfo {
  text: string;
  groundingChunks: any[];
}

interface LiveStatus {
  status: 'Good' | 'Busy' | 'Alert';
  label: string;
  emoji: string;
}

const Detail: React.FC<DetailProps> = ({ attraction, onBack, onBook, onEnterAR, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [aiTips, setAiTips] = useState<string>('Loading smart tips...');
  const [locationData, setLocationData] = useState<LocationInfo | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);

  useEffect(() => {
    const fetchTipsAndStatus = async () => {
      // Run tips fetch
      geminiService.getTravelTips(attraction.name).then(setAiTips);
      
      // Run status fetch
      geminiService.getLiveStatus(attraction.name, attraction.location).then(setLiveStatus);
    };
    fetchTipsAndStatus();
  }, [attraction.name, attraction.location]);

  useEffect(() => {
    if (activeTab === 'Location' && !locationData) {
      const fetchLocation = async () => {
        setIsLoadingLocation(true);
        const data = await geminiService.getLocationDetails(attraction.name, attraction.location);
        setLocationData(data);
        setIsLoadingLocation(false);
      };
      fetchLocation();
    }
  }, [activeTab, attraction.name, attraction.location, locationData]);

  return (
    <div className="relative bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[450px] overflow-hidden">
        <img src={attraction.imageUrl} alt={attraction.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
        
        {/* Actions Bar */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-3 bg-white/10 backdrop-blur-2xl rounded-2xl text-white border border-white/20 transition-all hover:bg-white/20 active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onEnterAR}
              className="p-3 bg-[#10B981] backdrop-blur-xl rounded-2xl text-white border border-emerald-400/30 flex items-center gap-2 pr-4 shadow-lg active:scale-95 transition-all"
            >
              <Box className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live AR</span>
            </button>
            <button 
              onClick={onToggleFavorite}
              className={`p-3 backdrop-blur-xl rounded-2xl border transition-all active:scale-90 ${isFavorite ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Badge */}
        <div className="absolute bottom-12 left-8 right-8 text-white">
          <div className="inline-block px-4 py-1.5 bg-[#10B981] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg shadow-emerald-900/20">
            {attraction.category}
          </div>
          <h1 className="text-4xl font-black leading-[1.1] mb-3 tracking-tighter">{attraction.name}</h1>
          
          {/* INFO BAR - LOCATION, RATING, AND STATUS PILL AS REQUESTED */}
          <div className="flex items-center flex-wrap gap-4 md:gap-5">
            <div className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold tracking-tight">{attraction.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black">{attraction.rating} <span className="font-medium opacity-60 ml-0.5">({attraction.reviews})</span></span>
            </div>
            
            {/* BREATHING STATUS PILL - MOVED HERE AFTER LOCATION/RATING */}
            {liveStatus && (
              <div className="flex items-center gap-2 bg-emerald-900/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10 animate-in fade-in zoom-in duration-700 shadow-lg">
                <div className="relative flex items-center justify-center">
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    liveStatus.status === 'Good' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 
                    liveStatus.status === 'Busy' ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]' : 
                    'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                  }`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white">
                  {liveStatus.status}: {liveStatus.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white -mt-10 rounded-t-[48px] px-8 pt-10 pb-32 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border border-slate-50">
        {/* Navigation Tabs */}
        <div className="flex gap-10 border-b border-slate-50 mb-10 overflow-x-auto hide-scrollbar">
          {['Overview', 'Reviews', 'Location'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-emerald-600' : 'text-slate-300'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full shadow-[0_-4px_10px_rgba(5,150,105,0.2)]"></div>}
            </button>
          ))}
        </div>

        {/* Tab Content: Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-500">
            <div className="grid grid-cols-3 gap-5">
              <div className="bg-slate-50/80 border border-slate-100 p-5 rounded-[32px] text-center">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Duration</p>
                <p className="text-xs font-black text-slate-800">2-4 Hours</p>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 p-5 rounded-[32px] text-center">
                <Calendar className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Open</p>
                <p className="text-xs font-black text-slate-800">Daily</p>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 p-5 rounded-[32px] text-center">
                <Users className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Group</p>
                <p className="text-xs font-black text-slate-800">All Ages</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Experience</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {attraction.description}
              </p>
            </div>

            <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-colors" />
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <Info className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-black text-emerald-900 uppercase tracking-widest text-xs">Smart Travel Insight</h4>
              </div>
              <p className="text-emerald-800/80 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                {aiTips}
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Location (Real Data) */}
        {activeTab === 'Location' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            {isLoadingLocation ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing with Maps...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                        <Navigation className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h4 className="font-black text-emerald-400 uppercase tracking-widest text-xs">Real-Time Directions</h4>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed font-medium relative z-10 mb-8">
                     {locationData?.text}
                   </p>
                   
                   <div className="flex flex-wrap gap-4 relative z-10">
                      {locationData?.groundingChunks.map((chunk: any, idx: number) => {
                        const mapsData = chunk.maps || (chunk.web && chunk.web.uri.includes('maps') ? chunk.web : null);
                        if (!mapsData) return null;
                        return (
                          <a 
                            key={idx}
                            href={mapsData.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                          >
                            Open in Maps <ExternalLink className="w-3 h-3" />
                          </a>
                        );
                      })}
                   </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
                   <h4 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                     <MapPin className="w-5 h-5 text-emerald-500" /> Nearby Transports
                   </h4>
                   <div className="space-y-5">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                               <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800">Taxi Stand</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">250m Away</p>
                            </div>
                         </div>
                         <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black uppercase">ACTIVE</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-3xl border border-slate-100">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                               <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800">Bus Terminal</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1.2km Away</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Booking Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-2xl border-t border-slate-50 p-6 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Total Package</p>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-emerald-700 leading-none">RM {attraction.price}</span>
             <span className="text-[10px] font-bold text-slate-300 lowercase tracking-normal">/ pax</span>
          </div>
        </div>
        <button 
          onClick={onBook}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4.5 px-10 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] uppercase tracking-[0.15em] text-sm"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Detail;
