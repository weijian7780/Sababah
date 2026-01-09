
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Share2, Heart, Clock, Calendar, Users, Info, Box, ExternalLink, Loader2, Navigation, Send, MessageSquare, Plus, ThumbsUp, Download, Check, X, Map as MapIcon, WifiOff, Zap } from 'lucide-react';
import { Attraction, AppRoute, Review } from '../types';
import { geminiService } from '../services/geminiService';

interface DetailProps {
  attraction: Attraction;
  onBack: () => void;
  onBook: () => void;
  onEnterAR: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  onAddReview: (id: string, review: Review) => void;
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

const Detail: React.FC<DetailProps> = ({ 
  attraction, onBack, onBook, onEnterAR, isFavorite, onToggleFavorite, 
  isLoggedIn, onLoginRequired, onAddReview 
}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [aiTips, setAiTips] = useState<string>('Loading smart tips...');
  const [locationData, setLocationData] = useState<LocationInfo | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);
  
  // Offline Download State
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Reviews UI State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTipsAndStatus = async () => {
      geminiService.getTravelTips(attraction.name).then(setAiTips);
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

  const handleStartDownload = () => {
    if (downloadStatus !== 'idle') return;
    setDownloadStatus('downloading');
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadStatus('completed');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    const newReview: Review = {
      id: `r${Date.now()}`,
      userName: 'Ahmad Daniel',
      userAvatar: 'https://picsum.photos/seed/user1/100/100',
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(attraction.id, newReview);
    setNewComment('');
    setNewRating(5);
    setShowReviewForm(false);
    setIsSubmitting(false);
  };

  return (
    <div className="relative bg-white min-h-screen">
      {/* Hero Image Section */}
      <div className="relative h-[450px] overflow-hidden">
        <img src={attraction.imageUrl} alt={attraction.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30"></div>
        
        {/* Top Header Controls */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-30">
          <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur-2xl rounded-2xl text-white border border-white/20 active:scale-90">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3 items-center">
            {/* Offline Maps Download Button */}
            <button 
              onClick={() => setShowOfflineModal(true)}
              className={`p-3 backdrop-blur-xl rounded-2xl border transition-all active:scale-90 relative overflow-hidden flex items-center justify-center ${downloadStatus === 'completed' ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
            >
              {downloadStatus === 'completed' ? <Check className="w-6 h-6" /> : <Download className="w-6 h-6" />}
            </button>

            <button onClick={onEnterAR} className="p-3 bg-[#10B981] backdrop-blur-xl rounded-2xl text-white border border-emerald-400/30 flex items-center gap-2 pr-4 shadow-lg active:scale-95">
              <Box className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live AR</span>
            </button>
            <button onClick={onToggleFavorite} className={`p-3 backdrop-blur-xl rounded-2xl border transition-all active:scale-90 ${isFavorite ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-white/10 text-white border-white/20'}`}>
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* LIVE STATUS DOT - Strictly positioned at the circle location from image */}
        {liveStatus && (
          <div className="absolute top-[25%] right-10 z-40 group/status">
            <div className="relative p-2.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-2xl transition-transform group-hover/status:scale-110 duration-300">
              <div className={`w-3.5 h-3.5 rounded-full animate-pulse shadow-xl cursor-help ${
                liveStatus.status === 'Good' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                liveStatus.status === 'Busy' ? 'bg-red-500 shadow-red-500/50' : 
                'bg-amber-400 shadow-amber-400/50'
              }`} />
            </div>
            
            {/* Interactive Tooltip - Positioned BELOW with SAFE horizontal alignment */}
            <div className="absolute top-full right-0 mt-3 opacity-0 group-hover/status:opacity-100 transition-all duration-300 pointer-events-none translate-y-4 group-hover/status:translate-y-0 flex flex-col items-end min-w-[200px]">
              {/* Arrow on TOP pointing UP, aligned with the dot */}
              <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mb-1.5 mr-4 border-l border-t border-white/10 z-0" />
              
              <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-[24px] shadow-2xl border border-white/10 relative z-10 w-full">
                <div className="flex items-center gap-3 mb-1">
                   <div className={`w-2 h-2 rounded-full ${
                      liveStatus.status === 'Good' ? 'bg-emerald-400' : 
                      liveStatus.status === 'Busy' ? 'bg-red-400' : 
                      'bg-amber-400'
                    }`} />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Live Intel</span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest leading-tight">
                  {liveStatus.emoji} {liveStatus.label}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-12 left-8 right-8 text-white z-20">
          <div className="inline-block px-4 py-1.5 bg-[#10B981] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            {attraction.category}
          </div>
          <h1 className="text-4xl font-black leading-[1.1] mb-3 tracking-tighter">{attraction.name}</h1>
          
          <div className="flex items-center flex-wrap gap-4 md:gap-5">
            <div className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold tracking-tight">{attraction.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black">{attraction.rating} <span className="font-medium opacity-60 ml-0.5">({attraction.reviews + (attraction.userReviews?.length || 0)})</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white -mt-10 rounded-t-[48px] px-8 pt-10 pb-32 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border border-slate-50">
        <div className="flex gap-10 border-b border-slate-50 mb-10 overflow-x-auto hide-scrollbar">
          {['Overview', 'Reviews', 'Location'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-emerald-600' : 'text-slate-300'}`}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full"></div>}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-6">
            <div className="grid grid-cols-3 gap-5">
              {[
                { icon: Clock, label: 'Duration', value: '2-4 Hours' },
                { icon: Calendar, label: 'Open', value: 'Daily' },
                { icon: Users, label: 'Group', value: 'All Ages' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50/80 border border-slate-100 p-5 rounded-[32px] text-center">
                  <item.icon className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xs font-black text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Experience</h3>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">{attraction.description}</p>
            </div>
            <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-colors" />
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-emerald-100 rounded-xl"><Info className="w-5 h-5 text-emerald-600" /></div>
                <h4 className="font-black text-emerald-900 uppercase tracking-widest text-xs">Smart Travel Insight</h4>
              </div>
              <p className="text-emerald-800/80 text-sm whitespace-pre-wrap leading-relaxed font-medium">{aiTips}</p>
            </div>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Traveler Reviews</h3>
                <p className="text-slate-400 text-sm font-medium">{(attraction.userReviews?.length || 0)} total experiences</p>
              </div>
              {!showReviewForm && (
                <button 
                  onClick={() => isLoggedIn ? setShowReviewForm(true) : onLoginRequired()}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" /> Share Story
                </button>
              )}
            </div>

            {showReviewForm && (
              <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-black text-emerald-900">Your Experience</h4>
                  <button onClick={() => setShowReviewForm(false)} className="text-emerald-400 font-bold text-xs uppercase hover:text-emerald-600 transition-colors">Cancel</button>
                </div>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-3">Rate your visit</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewRating(star)} className={`transition-all duration-300 active:scale-75 ${newRating >= star ? 'scale-110' : 'scale-100'}`}>
                          <Star className={`w-9 h-9 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-emerald-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Your Story</p>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Describe your experience in Sabah..." className="w-full bg-white border border-emerald-100 rounded-3xl p-6 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 min-h-[140px] font-medium" required />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Publish Review</>}
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {attraction.userReviews && attraction.userReviews.map((review) => (
                <div key={review.id} className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] group hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-4 ring-slate-50" />
                      <div>
                        <p className="text-base font-black text-slate-900 leading-none">{review.userName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(review.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-amber-700">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Location' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            {isLoadingLocation ? (
              <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing with Maps...</p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                      <Navigation className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h4 className="font-black text-emerald-400 uppercase tracking-widest text-xs">Real-Time Directions</h4>
                 </div>
                 <p className="text-slate-300 text-sm leading-relaxed font-medium mb-8">{locationData?.text}</p>
                 <div className="flex flex-wrap gap-4">
                    {locationData?.groundingChunks.map((chunk: any, idx: number) => {
                      const mapsData = chunk.maps || (chunk.web && chunk.web.uri.includes('maps') ? chunk.web : null);
                      if (!mapsData) return null;
                      return (
                        <a key={idx} href={mapsData.uri} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                          Open in Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Offline Maps Modal Overlay */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in duration-300">
          <div className="w-full bg-white rounded-t-[56px] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <MapIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Offline Maps</h3>
              </div>
              <button onClick={() => setShowOfflineModal(false)} className="p-3 bg-slate-100 rounded-2xl text-slate-400 active:scale-90 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Map Preview Image */}
              <div className="relative rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-inner">
                 <img 
                  src={`https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800`} 
                  className="w-full h-48 object-cover grayscale opacity-50" 
                  alt="Map Area"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-emerald-500/50 rounded-full bg-emerald-500/10 flex items-center justify-center">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                 </div>
                 <div className="absolute top-4 left-4 bg-emerald-950/90 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-2">
                   <WifiOff className="w-3 h-3" /> Data-Free Navigation
                 </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">Navigate without data</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                  SabaBah Offline Maps lets you download the <strong>{attraction.location}</strong> area to your phone for navigation without data. 
                  You can use the app as usual for driving directions, search, and turn-by-turn guidance.
                </p>
                <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                         <Navigation className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-600">Available: Driving directions, search, turn-by-turn guidance.</p>
                   </div>
                   <div className="flex items-start gap-4 opacity-50">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-300 shrink-0">
                         <Clock className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">Unavailable: Transit/Biking directions, live traffic, and alternate routes.</p>
                   </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-6">
                {downloadStatus === 'idle' ? (
                  <button 
                    onClick={handleStartDownload}
                    className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                  >
                    <Download className="w-5 h-5" /> Download Area (24MB)
                  </button>
                ) : downloadStatus === 'downloading' ? (
                  <div className="space-y-4">
                    <div className="w-full bg-slate-100 h-10 rounded-full overflow-hidden relative">
                       <div 
                         className="h-full bg-emerald-500 transition-all duration-300" 
                         style={{ width: `${downloadProgress}%` }}
                       />
                       <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-900 uppercase tracking-widest">
                         Downloading... {downloadProgress}%
                       </span>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">Ensuring you're online to sync map data...</p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] flex flex-col items-center gap-4 animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                       <Check className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                       <h4 className="text-emerald-900 font-black uppercase tracking-widest text-sm mb-1">Download Complete</h4>
                       <p className="text-emerald-800/60 text-xs font-medium">Area saved. Tap profile > Offline maps to manage.</p>
                    </div>
                    <button onClick={() => setShowOfflineModal(false)} className="mt-2 text-emerald-600 font-black uppercase tracking-widest text-[10px] hover:underline">Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Booking Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-2xl border-t border-slate-50 p-6 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 leading-none">Total Package</p>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-emerald-700 leading-none">RM {attraction.price}</span>
             <span className="text-[10px] font-bold text-slate-300 lowercase tracking-normal">/ pax</span>
          </div>
        </div>
        <button onClick={onBook} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4.5 px-10 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] uppercase tracking-[0.15em] text-sm">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Detail;
