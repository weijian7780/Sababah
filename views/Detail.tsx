
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Share2, Heart, Clock, Calendar, Users, Info, Box } from 'lucide-react';
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

const Detail: React.FC<DetailProps> = ({ attraction, onBack, onBook, onEnterAR, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [aiTips, setAiTips] = useState<string>('Loading smart tips...');

  useEffect(() => {
    const fetchTips = async () => {
      const tips = await geminiService.getTravelTips(attraction.name);
      setAiTips(tips);
    };
    fetchTips();
  }, [attraction.name]);

  return (
    <div className="relative bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[450px] overflow-hidden">
        <img src={attraction.imageUrl} alt={attraction.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
        
        {/* Actions Bar */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 transition-all hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onEnterAR}
              className="p-3 bg-emerald-600/80 backdrop-blur-xl rounded-2xl text-white border border-emerald-400/30 flex items-center gap-2 pr-4 shadow-lg active:scale-95 transition-all"
            >
              <Box className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-widest">AR</span>
            </button>
            <button 
              onClick={onToggleFavorite}
              className={`p-3 backdrop-blur-xl rounded-2xl border transition-all ${isFavorite ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30' : 'bg-white/20 text-white border-white/20 hover:bg-white/30'}`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Badge */}
        <div className="absolute bottom-10 left-8 right-8 text-white">
          <div className="inline-block px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
            {attraction.category}
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-2">{attraction.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-100">{attraction.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold">{attraction.rating} <span className="font-normal opacity-70">({attraction.reviews})</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white -mt-8 rounded-t-[40px] px-8 pt-10 pb-32 relative z-10">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-100 mb-8 overflow-x-auto hide-scrollbar">
          {['Overview', 'Reviews', 'Location'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-emerald-600' : 'text-slate-400'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full"></div>}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-3xl text-center">
                <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500 font-medium">Duration</p>
                <p className="text-xs font-bold text-slate-800">2-4 Hours</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl text-center">
                <Calendar className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500 font-medium">Open</p>
                <p className="text-xs font-bold text-slate-800">Mon-Sun</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl text-center">
                <Users className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                <p className="text-[10px] text-slate-500 font-medium">Group</p>
                <p className="text-xs font-bold text-slate-800">Family Friendly</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">About</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {attraction.description}
              </p>
            </div>

            <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-emerald-800">Smart Travel Tips</h4>
              </div>
              <p className="text-emerald-700/80 text-sm whitespace-pre-wrap leading-relaxed">
                {aiTips}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Booking */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-2xl border-t border-slate-100 p-6 flex items-center justify-between z-50">
        <div>
          <p className="text-slate-400 text-xs font-medium">Total Price</p>
          <p className="text-2xl font-bold text-emerald-700">RM {attraction.price} <span className="text-sm font-normal text-slate-400">/ pax</span></p>
        </div>
        <button 
          onClick={onBook}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Detail;
