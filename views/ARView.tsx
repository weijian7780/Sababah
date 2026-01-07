
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  ArrowLeft, Camera, Map, Zap, CircleDashed, AlertCircle, X, Info, 
  History, Landmark, Sparkles, Navigation, Eye, ArrowUp, LocateFixed, 
  ChevronRight, Mountain, Droplets, PawPrint, Trees, Scan, Radio, 
  MapPin, ShieldAlert, Star, Users, DollarSign, Target, Activity,
  Battery, Wifi, Cpu, Crosshair, Globe
} from 'lucide-react';
import { Attraction, ARHotspot } from '../types';

interface InternalHotspot extends ARHotspot {
  depth: number;
  icon: React.ReactNode;
}

interface ARViewProps {
  attraction: Attraction;
  onBack: () => void;
}

const ARView: React.FC<ARViewProps> = ({ attraction, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(true);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [navigationNode, setNavigationNode] = useState<number | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'requesting' | 'active' | 'denied'>('requesting');
  const [showFlash, setShowFlash] = useState(false);
  const [showMapOverlay, setShowMapOverlay] = useState(false);
  const [mapSelectedNode, setMapSelectedNode] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  
  // Tracking & Orientation State
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const prevOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const [isLockedOn, setIsLockedOn] = useState<number | null>(null);
  const [stabilityScore, setStabilityScore] = useState(100);
  const [lowStabilityWarning, setLowStabilityWarning] = useState(false);

  const setupCamera = async () => {
    setCameraStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
          setCameraStatus('active');
        };
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraStatus('denied');
    }
  };

  useEffect(() => {
    setupCamera();

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const current = {
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      };

      const deltaAlpha = Math.abs(current.alpha - prevOrientation.current.alpha);
      const deltaBeta = Math.abs(current.beta - prevOrientation.current.beta);
      const deltaGamma = Math.abs(current.gamma - prevOrientation.current.gamma);
      const totalDelta = deltaAlpha + deltaBeta + deltaGamma;

      setStabilityScore(prev => {
        const target = Math.max(20, Math.min(100, 100 - (totalDelta * 5)));
        return Math.floor(prev * 0.9 + target * 0.1);
      });

      setOrientation(current);
      prevOrientation.current = current;
    };

    const requestOrientation = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (e) {
          console.error("Orientation permission denied", e);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestOrientation();
    
    const timer = setTimeout(() => setScanning(false), 3500);
    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    setLowStabilityWarning(stabilityScore < 65);
  }, [stabilityScore]);

  const handleCapture = () => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);
  };

  const getHotspotIcon = (type: string) => {
    switch (type) {
      case 'history': return <History className="w-5 h-5" />;
      case 'landmark': return <Landmark className="w-5 h-5" />;
      case 'nature': return <Mountain className="w-5 h-5" />;
      case 'wildlife': return <PawPrint className="w-5 h-5" />;
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const hotspots: InternalHotspot[] = useMemo(() => {
    if (attraction.arHotspots && attraction.arHotspots.length > 0) {
      return attraction.arHotspots.map((h, idx) => ({
        ...h,
        depth: 1 + (idx * 0.5),
        icon: getHotspotIcon(h.iconType)
      }));
    }
    return [{
      id: 'fallback',
      label: attraction.name,
      category: 'SITE',
      description: attraction.description,
      x: 50, y: 50, mapX: 50, mapY: 50,
      distance: '0m', rating: attraction.rating, reviews: attraction.reviews, price: attraction.price,
      iconType: 'landmark',
      depth: 1,
      icon: <MapPin className="w-5 h-5" />
    }] as InternalHotspot[];
  }, [attraction]);

  const getProjectedCoords = (baseX: number, baseY: number) => {
    const horizontalShift = orientation.gamma * 3.5; 
    const verticalShift = (orientation.beta - 45) * 3.5; 
    const finalX = `calc(${baseX}% + ${horizontalShift}px)`;
    const finalY = `calc(${baseY}% + ${verticalShift}px)`;
    return { x: finalX, y: finalY };
  };

  useEffect(() => {
    if (scanning) return;
    const centerX = 50;
    const centerY = 50;
    let nearest = null;
    let minDistance = 15; 

    hotspots.forEach((h, idx) => {
      const dist = Math.sqrt(Math.pow(h.x - centerX, 2) + Math.pow(h.y - centerY, 2));
      if (dist < minDistance) {
        minDistance = dist;
        nearest = idx;
      }
    });

    if (nearest !== isLockedOn) setIsLockedOn(nearest);
  }, [orientation, hotspots, scanning]);

  return (
    <div className={`relative h-screen w-full bg-black overflow-hidden font-mono transition-colors duration-300 ${lowStabilityWarning ? 'text-red-500' : 'text-emerald-400'}`}>
      {/* Background Camera */}
      <video 
        ref={videoRef}
        autoPlay playsInline muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${cameraStatus === 'active' ? 'opacity-100' : 'opacity-10'} ${lowStabilityWarning ? 'grayscale-[0.5] contrast-[1.2]' : ''}`}
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
      
      {showFlash && <div className="absolute inset-0 bg-white z-[200] animate-in fade-in fade-out duration-150" />}

      {/* Technical HUD - Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-40 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">SabaBah-Sync 4.5</span>
             </div>
             <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Wifi className="w-3 h-3" /> GPR-LNK: ACTIVE
             </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-[0.85]">
              {attraction.name.split(' ')[0]}<br/>
              <span className="text-2xl opacity-60 font-black">{attraction.name.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 text-right">
          <div className="bg-black/40 backdrop-blur-lg border border-white/10 p-3 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Local Time</span>
               <span className="text-xl font-black text-white leading-none tracking-tighter">{currentTime}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Battery</span>
               <div className="flex items-center gap-1">
                 <Battery className="w-4 h-4 text-emerald-400" />
                 <span className="text-xs font-black text-white">82%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compass Bar */}
      <div className="absolute top-36 left-0 right-0 z-30 pointer-events-none flex justify-center opacity-50">
         <div className="relative w-full max-w-sm h-12 overflow-hidden flex items-center justify-center border-y border-emerald-500/10">
            <div className="flex gap-8 transition-transform duration-100 ease-out" style={{ transform: `translateX(${-orientation.alpha * 4}px)` }}>
               {Array.from({length: 24}).map((_, i) => {
                 const deg = i * 15;
                 const isMajor = deg % 90 === 0;
                 return (
                   <div key={i} className="flex flex-col items-center gap-1 w-4">
                      <div className={`w-[1px] ${isMajor ? 'h-4 bg-emerald-400' : 'h-2 bg-emerald-400/40'}`} />
                      {isMajor && <span className="text-[10px] font-black text-emerald-400">{deg % 360 === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}</span>}
                   </div>
                 );
               })}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-emerald-400 z-10 shadow-[0_0_10px_rgba(52,211,153,1)]" />
         </div>
      </div>

      {/* Map Overlay Interface */}
      {showMapOverlay && (
        <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-300 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/30">
                <Globe className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-widest uppercase leading-none">Tactical Topo</h2>
                <span className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mt-1">Satellite Link Decrypted</span>
              </div>
            </div>
            <button 
              onClick={() => setShowMapOverlay(false)}
              className="p-4 bg-white/5 border border-white/10 rounded-3xl text-white active:scale-90 transition-all hover:bg-white/10"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="relative flex-1 bg-black/40 rounded-[56px] border-2 border-emerald-500/20 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mb-8">
             {/* Map Grid */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
            {/* Concentric Ranges */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="w-[85%] aspect-square border-2 border-emerald-500/5 rounded-full flex items-center justify-center relative">
                  <span className="absolute top-2 text-[8px] font-black text-emerald-500/20 uppercase">50M RANGE</span>
                  <div className="w-[65%] aspect-square border border-emerald-500/10 rounded-full flex items-center justify-center relative">
                     <span className="absolute top-2 text-[8px] font-black text-emerald-500/20 uppercase">25M RANGE</span>
                     <div className="w-[35%] aspect-square border border-emerald-500/20 rounded-full relative">
                        <span className="absolute top-2 text-[8px] font-black text-emerald-500/20 uppercase left-1/2 -translate-x-1/2">10M</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Scanning Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/[0.08] to-transparent animate-[radar-sweep_5s_linear_infinite] origin-center pointer-events-none" />

            {/* User Position (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
               <div className="relative transition-transform duration-200" style={{ transform: `rotate(${orientation.alpha}deg)` }}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-400/[0.07] rounded-full blur-xl" 
                       style={{ clipPath: 'polygon(50% 100%, 10% 0, 90% 0)' }} />
                  <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.8)] border-4 border-emerald-600/30">
                    <ArrowUp className="w-5 h-5 text-emerald-600" />
                  </div>
               </div>
            </div>

            {/* Map Hotspots */}
            {hotspots.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setMapSelectedNode(mapSelectedNode === i ? null : i)}
                className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${mapSelectedNode === i ? 'scale-125' : 'hover:scale-110'}`}
                style={{ left: `${h.mapX}%`, top: `${h.mapY}%` }}
              >
                <div className="relative">
                  {mapSelectedNode === i && (
                    <div className="absolute -inset-4 border-2 border-emerald-400 rounded-full animate-ping opacity-60" />
                  )}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-2xl border-2 ${mapSelectedNode === i ? 'bg-emerald-500 border-white text-white' : 'bg-emerald-950/80 backdrop-blur-md border-emerald-500/40 text-emerald-400'}`}>
                    {h.icon}
                  </div>
                </div>
              </button>
            ))}

            {/* Map Selection Mini-Card */}
            {mapSelectedNode !== null && (
              <div className="absolute bottom-8 left-8 right-8 z-40 bg-emerald-950/95 backdrop-blur-3xl border border-emerald-400/40 p-6 rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    {hotspots[mapSelectedNode].icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white leading-tight mb-1">{hotspots[mapSelectedNode].label}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{hotspots[mapSelectedNode].category}</span>
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{hotspots[mapSelectedNode].distance}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                   <button 
                    onClick={() => { setActiveNode(mapSelectedNode); setShowMapOverlay(false); setMapSelectedNode(null); }}
                    className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40"
                  >
                    Target Intel
                  </button>
                  <button 
                    onClick={() => { setNavigationNode(mapSelectedNode); setShowMapOverlay(false); setMapSelectedNode(null); }}
                    className="flex-1 bg-white text-emerald-950 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                  >
                    Lock Waypoint
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 shadow-inner">
                <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-1">ELEVATION</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tabular-nums">1.2k</span>
                   <span className="text-xs font-bold text-white/30 uppercase">AMS L</span>
                </div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 shadow-inner flex flex-col justify-center">
                <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-1">SAT-SYNC</p>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
                   <span className="text-xs font-black text-white uppercase tracking-widest">ENCRYPTED</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* AR Scene Content */}
      {!scanning && !showMapOverlay && (
        <>
          {/* Target HUD Reticle */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300 ${lowStabilityWarning ? 'opacity-80 scale-125' : 'opacity-40'}`}>
            <div className={`relative w-32 h-32 border rounded-full flex items-center justify-center transition-colors duration-300 ${lowStabilityWarning ? 'border-red-500/60' : 'border-emerald-500/20'}`}>
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 h-0.5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {isLockedOn !== null && !lowStabilityWarning && (
                <div className="absolute -inset-6 border-2 border-emerald-400 rounded-full animate-ping opacity-60" />
              )}
            </div>
          </div>

          {/* AR Hotspots */}
          {hotspots.map((spot, idx) => {
            const coords = getProjectedCoords(spot.x, spot.y);
            const isLocked = isLockedOn === idx;
            const scale = 1 / (spot.depth * 0.75); 
            const isNavTarget = navigationNode === idx;

            return (
              <div 
                key={spot.id}
                className={`absolute z-40 transition-all duration-100 ease-out will-change-transform`}
                style={{ 
                  left: coords.x, 
                  top: coords.y,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  opacity: activeNode !== null && activeNode !== idx ? 0.2 : 1
                }}
              >
                <button 
                  onClick={() => setActiveNode(activeNode === idx ? null : idx)}
                  className="group relative flex items-center justify-center p-8 active:scale-95 transition-transform"
                >
                  {isNavTarget && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                      <div className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20">TARGET</div>
                      <ArrowUp className="w-5 h-5 text-emerald-500" />
                    </div>
                  )}

                  <div className={`absolute -inset-4 border-2 border-emerald-400/30 rounded-2xl transition-all duration-500 ${isLocked ? 'scale-110 opacity-100 bg-emerald-500/5' : 'scale-90 opacity-0'}`} />
                  
                  <div className="relative flex items-center justify-center">
                    <div className={`relative rounded-full border-2 border-emerald-400/60 bg-emerald-950/80 backdrop-blur-xl flex items-center justify-center transition-all duration-500 ${activeNode === idx ? 'w-16 h-16 bg-emerald-500 text-white border-white' : 'w-14 h-14 text-emerald-400'} ${isLocked ? 'shadow-[0_0_30px_rgba(52,211,153,0.8)] border-emerald-400' : ''}`}>
                        {activeNode === idx ? <Scan className="w-8 h-8" /> : spot.icon}
                    </div>
                  </div>
                  
                  <div className={`absolute top-[125%] bg-[#022c22]/90 backdrop-blur-2xl border border-emerald-500/40 p-2.5 rounded-2xl transition-all duration-300 shadow-2xl ${isLocked || activeNode === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="text-[11px] font-black text-white uppercase tracking-wider block whitespace-nowrap">{spot.label}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </>
      )}

      {/* Detail Holographic Card */}
      {activeNode !== null && !showMapOverlay && (
        <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-6 animate-in fade-in duration-300 bg-black/20">
           <div 
             className="w-full max-w-[340px] bg-[#022c22]/95 p-8 rounded-[40px] border border-emerald-500/40 shadow-[0_40px_100px_rgba(0,0,0,0.9)] backdrop-blur-3xl animate-in zoom-in-95 duration-300 pointer-events-auto relative overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500/40 m-4 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500/40 m-4 rounded-br-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      {hotspots[activeNode].icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 truncate">{hotspots[activeNode].category} INTEL</p>
                      <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tight break-words">{hotspots[activeNode].label}</h3>
                    </div>
                  </div>
                  <button onClick={() => setActiveNode(null)} className="p-2.5 bg-white/5 border border-white/10 rounded-2xl text-white/40 active:scale-90">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-black/40 rounded-3xl p-4 border border-white/5 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-amber-400 mb-1">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="text-base font-black text-white">{hotspots[activeNode].rating}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{hotspots[activeNode].reviews} CITATIONS</span>
                   </div>
                   <div className="bg-black/40 rounded-3xl p-4 border border-white/5 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-emerald-400 mb-1">
                         <DollarSign className="w-4 h-4" />
                         <span className="text-base font-black text-white">{hotspots[activeNode].price > 0 ? `RM ${hotspots[activeNode].price}` : 'FREE'}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ACCESS FEE</span>
                   </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm leading-relaxed text-slate-200 font-medium h-24 overflow-y-auto custom-scrollbar pr-2 italic">
                    "{hotspots[activeNode].description}"
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button className="flex-1 bg-white/5 border border-white/10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl">
                    <Eye className="w-5 h-5" /> INTEL
                  </button>
                  <button 
                    onClick={() => { setNavigationNode(activeNode); setActiveNode(null); }}
                    className={`flex-1 ${navigationNode === activeNode ? 'bg-emerald-500' : 'bg-emerald-600'} text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95`}
                  >
                    <Navigation className="w-5 h-5" /> {navigationNode === activeNode ? 'LOCKED' : 'ROUTE'}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-14 px-10 z-[70]">
        <button onClick={onBack} className="w-16 h-16 bg-black/60 backdrop-blur-2xl rounded-3xl text-white border border-emerald-500/30 flex items-center justify-center active:scale-90 transition-all shadow-2xl">
          <ArrowLeft className="w-7 h-7" />
        </button>
        
        <div className="relative flex flex-col items-center">
          <button 
            onClick={handleCapture} 
            className="w-28 h-28 rounded-full border-[8px] border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center p-2 active:scale-95 transition-all shadow-[0_0_60px_rgba(0,0,0,0.5)]"
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              <Camera className="w-10 h-10 text-black" />
            </div>
          </button>
        </div>

        <button 
          onClick={() => setShowMapOverlay(prev => !prev)} 
          className={`w-16 h-16 backdrop-blur-2xl rounded-3xl text-white border transition-all shadow-2xl flex items-center justify-center active:scale-90 ${showMapOverlay ? 'bg-emerald-500 border-white' : 'bg-black/60 border-emerald-500/30'}`}
        >
          <Map className="w-7 h-7" />
        </button>
      </div>

      <style>{`
        @keyframes loading { from { width: 0%; } to { width: 100%; } }
        @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ARView;
