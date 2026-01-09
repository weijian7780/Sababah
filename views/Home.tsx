
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, Bookmark, Landmark, MessageSquare, 
  Ticket, Info, Sparkles, X, ChevronRight, Mountain, 
  Utensils, Camera, Wallet, Clock, Check, Loader2, Calendar,
  Backpack, Compass, CloudRain
} from 'lucide-react';
import { ATTRACTIONS } from '../constants';
import { Attraction } from '../types';
import { geminiService } from '../services/geminiService';

interface HomeProps {
  onSelect: (attr: Attraction) => void;
  onCategory: (cat: string) => void;
  onBookDirect: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

type WizardStep = 'days' | 'style' | 'budget' | 'loading' | 'result';

interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
}

interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

interface LiveStatus {
  status: 'Good' | 'Busy' | 'Alert';
  label: string;
  emoji: string;
}

const Home: React.FC<HomeProps> = ({ onSelect, onCategory, onBookDirect, favorites, onToggleFavorite }) => {
  // Itinerary Wizard State
  const [wizardStep, setWizardStep] = useState<WizardStep | null>(null);
  const [itineraryConfig, setItineraryConfig] = useState({
    days: 3,
    style: 'Nature & Wildlife',
    budget: 'Moderate'
  });
  const [generatedPlan, setGeneratedPlan] = useState<ItineraryDay[] | null>(null);
  
  // Real-time status state
  const [statuses, setStatuses] = useState<Record<string, LiveStatus>>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      // Fetch statuses for featured attractions sequentially to avoid 429 quota errors
      const featured = ATTRACTIONS.slice(0, 3);
      for (const attr of featured) {
        try {
          const status = await geminiService.getLiveStatus(attr.name, attr.location);
          setStatuses(prev => ({ ...prev, [attr.id]: status }));
          // Stagger requests slightly
          await new Promise(r => setTimeout(r, 150));
        } catch (e) {
          console.error(`Failed to fetch status for ${attr.name}`);
        }
      }
    };
    fetchStatuses();
  }, []);

  const startPlanning = () => setWizardStep('days');
  const closeWizard = () => {
    setWizardStep(null);
    setGeneratedPlan(null);
  };

  const handleGenerate = async () => {
    setWizardStep('loading');
    try {
      const plan = await geminiService.generateDetailedItinerary(
        itineraryConfig.days,
        itineraryConfig.style,
        itineraryConfig.budget
      );
      setGeneratedPlan(plan);
      setWizardStep('result');
    } catch (error) {
      console.error(error);
      setWizardStep(null);
    }
  };

  return (
    <div className="relative p-6 pb-4 animate-in fade-in duration-500 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Hi, Traveler! 👋</h2>
          <p className="text-slate-400 font-medium">Where would you like to go today?</p>
        </div>
      </div>
      
      {/* Search Input */}
      <div className="relative mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-300" />
        </div>
        <input 
          type="text" 
          placeholder="Search attractions" 
          className="w-full bg-[#F3F4F6] border-none rounded-[24px] py-5 pl-14 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-0 outline-none text-sm font-semibold"
        />
      </div>

      {/* Main Categories - Simplified to 2 items */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        {[
          { icon: <Landmark className="w-6 h-6" />, label: 'Museum', color: 'bg-[#FFF7ED] text-[#F97316]', action: () => onCategory('Museum') },
          { icon: <Ticket className="w-6 h-6" />, label: 'Booking', color: 'bg-[#EFF6FF] text-[#3B82F6]', action: onBookDirect },
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={item.action}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-full h-16 ${item.color} rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 shadow-sm border border-slate-50`}>
              {item.icon}
            </div>
            <span className="text-xs font-bold text-slate-400">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Popular Destinations</h3>
          <button onClick={() => onCategory('all')} className="text-[#10B981] text-sm font-bold flex items-center gap-1">
            View All
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-8">
          {ATTRACTIONS.map((attr, idx) => {
            const isFav = favorites.includes(attr.id);
            const live = statuses[attr.id];
            
            return (
              <div 
                key={attr.id}
                onClick={() => onSelect(attr)}
                className="min-w-[280px] bg-white rounded-[40px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.06)] cursor-pointer active:scale-[0.98] transition-all border border-slate-50 relative group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={attr.imageUrl} 
                    alt={attr.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(attr.id); }}
                    className={`absolute top-4 right-4 p-3 backdrop-blur-md rounded-2xl transition-all ${isFav ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/80 text-slate-400 hover:bg-white/100'}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-amber-400 px-3.5 py-1.5 rounded-full text-[11px] font-black text-slate-900 shadow-xl border border-white/20">
                    <Star className="w-4 h-4 fill-current" />
                    {attr.rating}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{attr.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold tracking-tight uppercase opacity-70">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {attr.location}
                    </div>
                    
                    {/* INLINE STATUS INDICATOR */}
                    {live && (
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 animate-in fade-in duration-500">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          live.status === 'Good' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 
                          live.status === 'Busy' ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]' : 
                          'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                        }`} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{live.status}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-5 pt-5 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[#065F46] font-black text-xl leading-none">
                        RM {attr.price} 
                        <span className="text-slate-300 font-bold text-xs ml-1 lowercase tracking-normal">/ pax</span>
                      </span>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{attr.category.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Itinerary FAB */}
      <button 
        onClick={startPlanning}
        className="fixed bottom-32 right-6 md:right-[calc(50%-11rem)] z-[60] flex items-center justify-center bg-emerald-600 text-white w-18 h-18 rounded-full shadow-2xl shadow-emerald-200 active:scale-95 transition-all border-4 border-white animate-bounce hover:animate-none group overflow-hidden"
        aria-label="Smart Itinerary Planner"
      >
        <Sparkles className="w-8 h-8 group-hover:scale-125 transition-transform" />
      </button>

      {/* Itinerary Wizard Modal */}
      {wizardStep && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
          <div className="w-full max-w-md mx-auto bg-white rounded-t-[48px] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-2 z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Magic Itinerary</h3>
              </div>
              <button onClick={closeWizard} className="p-2.5 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {wizardStep === 'days' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <p className="text-slate-500 font-semibold text-lg">How many days for your adventure?</p>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <button 
                      key={d}
                      onClick={() => setItineraryConfig({...itineraryConfig, days: d})}
                      className={`py-5 rounded-3xl font-black text-xl transition-all ${itineraryConfig.days === d ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setWizardStep('style')}
                  className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mt-4 shadow-xl shadow-emerald-100"
                >
                  Next Step <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {wizardStep === 'style' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <p className="text-slate-500 font-semibold text-lg">Choose your exploration style</p>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'Nature & Wildlife', icon: <Mountain /> },
                    { label: 'City & Culture', icon: <Landmark /> },
                    { label: 'Food & Gourmet', icon: <Utensils /> },
                    { label: 'Adventure', icon: <Backpack /> }
                  ].map(s => (
                    <button 
                      key={s.label}
                      onClick={() => setItineraryConfig({...itineraryConfig, style: s.label})}
                      className={`p-8 rounded-[40px] flex flex-col items-center gap-4 border-2 transition-all ${itineraryConfig.style === s.label ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-inner scale-105' : 'border-slate-50 text-slate-400 bg-slate-50/30 hover:border-slate-200'}`}
                    >
                      {React.cloneElement(s.icon as React.ReactElement<any>, { className: 'w-10 h-10' })}
                      <span className="text-[12px] font-black uppercase tracking-wider text-center">{s.label}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setWizardStep('budget')}
                  className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mt-4 shadow-xl shadow-emerald-100"
                >
                  Almost there <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {wizardStep === 'budget' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                <p className="text-slate-500 font-semibold text-lg">Select your preferred budget range</p>
                <div className="space-y-4">
                  {[
                    { label: 'Economy', desc: 'Affordable stays & local delights', icon: <Wallet className="w-6 h-6" /> },
                    { label: 'Moderate', desc: 'Balanced comfort & experiences', icon: <Compass className="w-6 h-6" /> },
                    { label: 'Luxury', desc: 'Premium resorts & fine dining', icon: <Sparkles className="w-6 h-6" /> }
                  ].map(b => (
                    <button 
                      key={b.label}
                      onClick={() => setItineraryConfig({...itineraryConfig, budget: b.label})}
                      className={`w-full flex items-center justify-between p-7 rounded-[32px] border-2 transition-all ${itineraryConfig.budget === b.label ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-slate-50'}`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${itineraryConfig.budget === b.label ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                          {b.icon}
                        </div>
                        <div className="text-left">
                          <p className={`text-lg font-black ${itineraryConfig.budget === b.label ? 'text-emerald-700' : 'text-slate-900'}`}>{b.label}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1.5">{b.desc}</p>
                        </div>
                      </div>
                      {itineraryConfig.budget === b.label && <Check className="w-7 h-7 text-emerald-600" />}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleGenerate}
                  className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mt-4 shadow-xl shadow-emerald-200"
                >
                  Generate My Plan <Sparkles className="w-6 h-6" />
                </button>
              </div>
            )}

            {wizardStep === 'loading' && (
              <div className="flex flex-col items-center justify-center py-28 text-center animate-in fade-in">
                <div className="relative mb-14">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full blur-[60px] animate-pulse"></div>
                  <Loader2 className="w-28 h-28 text-emerald-600 animate-spin relative z-10" />
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tight">Syncing...</h4>
                <p className="text-slate-400 font-bold max-w-[260px] mx-auto leading-relaxed text-sm">Gemini is curating your personalized Sabah experience based on real-time data.</p>
              </div>
            )}

            {wizardStep === 'result' && generatedPlan && (
              <div className="flex flex-col animate-in zoom-in-95 duration-500">
                <div className="space-y-12 pb-12">
                  {generatedPlan.map((dayPlan, dIdx) => (
                    <div key={dIdx} className="relative pl-10">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-100 rounded-full" />
                      <div className="absolute left-[-5px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-6 ring-white shadow-lg" />
                      
                      <div className="mb-8">
                        <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1.5 block">Day {dayPlan.day}</span>
                        <h5 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{dayPlan.theme}</h5>
                      </div>

                      <div className="space-y-6">
                        {dayPlan.activities.map((act, aIdx) => (
                          <div key={aIdx} className="bg-slate-50/70 rounded-[32px] p-6 border border-slate-100/50 hover:bg-emerald-50 transition-all hover:scale-[1.02] group shadow-sm">
                            <div className="flex items-center gap-2.5 mb-3">
                              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                <Clock className="w-4 h-4 text-emerald-500 group-hover:text-emerald-700" />
                              </div>
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600">{act.time}</span>
                            </div>
                            <p className="font-black text-slate-900 text-base mb-2 group-hover:text-emerald-900 transition-colors">{act.title}</p>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-emerald-800/70">{act.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white pt-8 border-t border-slate-50 flex gap-5">
                  <button 
                    onClick={closeWizard}
                    className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] active:scale-95 transition-transform"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      onBookDirect();
                      closeWizard();
                    }}
                    className="flex-[2] bg-emerald-600 text-white py-5 px-8 rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-200 active:scale-95 transition-transform"
                  >
                    Add All to My Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
