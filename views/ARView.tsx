
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  ArrowLeft, Camera, Map, Zap, CircleDashed, AlertCircle, X, Info, 
  History, Landmark, Sparkles, Navigation, Eye, ArrowUp, LocateFixed, 
  ChevronRight, Mountain, Droplets, PawPrint, Trees, Scan, Radio, 
  MapPin, ShieldAlert, Star, Users, DollarSign, Target, Activity,
  Battery, Wifi, Cpu, Crosshair, Globe, ShieldClose, RefreshCw, Loader2, SearchCode
} from 'lucide-react';
import { Attraction, ARHotspot } from '../types';
import { geminiService } from '../services/geminiService';

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
  
  // Intel State
  const [isFetchingIntel, setIsFetchingIntel] = useState(false);
  const [intelText, setIntelText] = useState<string | null>(null);
  const [decryptionProgress, setDecryptionProgress] = useState(0);

  // Tracking & Orientation State
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const prevOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const [isLockedOn, setIsLockedOn] = useState<number | null>(null);
  const [stabilityScore, setStabilityScore] = useState(100);
  const [lowStabilityWarning, setLowStabilityWarning] = useState(false);

  const setupCamera = async () => {
    setCameraStatus('requesting');
    try {
      // Clear any existing stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Autoplay blocked:", err);
            setCameraStatus('denied');
          });
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

  const handleFetchIntel = async (nodeIdx: number) => {
    const spot = hotspots[nodeIdx];
    setIsFetchingIntel(true);
    setIntelText(null);
    setDecryptionProgress(0);

    // Simulated high-tech progress bar
    const interval = setInterval(() => {
      setDecryptionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (Math.random() * 15);
      });
    }, 150);

    try {
      const data = await geminiService.getHotspotIntel(spot.label, attraction.name);
      setIntelText(data);
    } catch (e) {
      setIntelText("LINK FAILURE: SATELLITE CONNECTION LOST.");
    } finally {
      setTimeout(() => setIsFetchingIntel(false), 500);
    }
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

  if (cameraStatus === 'denied') {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Camera Link Restricted</h2>
        <p className="text-slate-400 font-medium mb-10 max-w-xs leading-relaxed">
          The tactical interface requires active visual feeds. Please enable camera access in your browser settings and ensure no other application is using the sensor.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={setupCamera}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            <RefreshCw className="w-5 h-5" /> Re-Initialize Link
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-slate-900 text-slate-400 font-bold py-5 rounded-3xl hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            Abort AR Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-screen w-full bg-black overflow-hidden font-mono transition-colors duration-300 ${lowStabilityWarning ? 'text-red-500' : 'text-emerald-400'}`}>
      <video 
        ref={videoRef}
        autoPlay playsInline muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${cameraStatus === 'active' ? 'opacity-100' : 'opacity-10'} ${lowStabilityWarning ? 'grayscale-[0.5] contrast-[1.2]' : ''}`}
      />

      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/80 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
      
      {showFlash && <div className="absolute inset-0 bg-white z-[200] animate-in fade-in fade-out duration-150" />}

      {/* Technical HUD - Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-40 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-950/90 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-2">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">SabaBah-Sync 4.5</span>
             </div>
             <div className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest flex items-center gap-2">
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
          <div className="bg-emerald-950/60 backdrop-blur-lg border border-emerald-500/20 p-3 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Local Time</span>
               <span className="text-xl font-black text-emerald-400 leading-none tracking-tighter">{currentTime}</span>
            </div>
            <div className="w-[1px] h-8 bg-emerald-500/20" />
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Battery</span>
               <div className="flex items-center gap-1">
                 <Battery className="w-4 h-4 text-emerald-400" />
                 <span className="text-xs font-black text-emerald-400">82%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compass Bar */}
      <div className="absolute top-36 left-0 right-0 z-30 pointer-events-none flex justify-center opacity-40">
         <div className="relative w-full max-w-sm h-12 overflow-hidden flex items-center justify-center border-y border-emerald-500/20">
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
        <div className="absolute inset-0 z-[60] bg-emerald-950/95 backdrop-blur-3xl animate-in fade-in duration-300 p-6 flex flex-col">
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
              className="p-4 bg-emerald-900/40 border border-emerald-500/20 rounded-3xl text-emerald-400 active:scale-90 transition-all hover:bg-emerald-500/20"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="relative flex-1 bg-black/60 rounded-[56px] border-2 border-emerald-500/20 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mb-8">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
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

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/[0.08] to-transparent animate-[radar-sweep_5s_linear_infinite] origin-center pointer-events-none" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
               <div className="relative transition-transform duration-200" style={{ transform: `rotate(${orientation.alpha}deg)` }}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-400/[0.05] rounded-full blur-xl" 
                       style={{ clipPath: 'polygon(50% 100%, 10% 0, 90% 0)' }} />
                  <div className="relative w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)] border-4 border-emerald-950/40">
                    <ArrowUp className="w-5 h-5 text-emerald-100" />
                  </div>
               </div>
            </div>

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
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-2xl border-2 ${mapSelectedNode === i ? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-emerald-950/90 backdrop-blur-md border-emerald-500/40 text-emerald-400'}`}>
                    {h.icon}
                  </div>
                </div>
              </button>
            ))}

            {mapSelectedNode !== null && (
              <div className="absolute bottom-8 left-8 right-8 z-40 bg-emerald-950/98 backdrop-blur-3xl border border-emerald-500/30 p-6 rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-8 duration-500">
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
                    className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 active:scale-95 transition-transform"
                  >
                    Target Intel
                  </button>
                  <button 
                    onClick={() => { setNavigationNode(mapSelectedNode); setShowMapOverlay(false); setMapSelectedNode(null); }}
                    className="flex-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    Lock Waypoint
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-[40px] p-6 shadow-inner">
                <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-1">ELEVATION</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white tabular-nums">1.2k</span>
                   <span className="text-xs font-bold text-emerald-500/30 uppercase">AMS L</span>
                </div>
             </div>
             <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-[40px] p-6 shadow-inner flex flex-col justify-center">
                <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.3em] mb-1">SAT-SYNC</p>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,1)]" />
                   <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">ENCRYPTED</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* AR Scene Content */}
      {!scanning && !showMapOverlay && (
        <>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300 ${lowStabilityWarning ? 'opacity-80 scale-125' : 'opacity-30'}`}>
            <div className={`relative w-32 h-32 border rounded-full flex items-center justify-center transition-colors duration-300 ${lowStabilityWarning ? 'border-red-500/60' : 'border-emerald-500/30'}`}>
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-0.5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 h-0.5 ${lowStabilityWarning ? 'bg-red-500' : 'bg-emerald-500'}`} />
              {isLockedOn !== null && !lowStabilityWarning && (
                <div className="absolute -inset-6 border-2 border-emerald-400 rounded-full animate-ping opacity-60" />
              )}
            </div>
          </div>

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
                  opacity: activeNode !== null && activeNode !== idx ? 0.1 : 1
                }}
              >
                <button 
                  onClick={() => setActiveNode(activeNode === idx ? null : idx)}
                  className="group relative flex items-center justify-center p-8 active:scale-95 transition-transform"
                >
                  {isNavTarget && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                      <div className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-emerald-300/30">TARGET</div>
                      <ArrowUp className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                    </div>
                  )}

                  <div className={`absolute -inset-4 border-2 border-emerald-400/20 rounded-2xl transition-all duration-500 ${isLocked ? 'scale-110 opacity-100 bg-emerald-500/5' : 'scale-90 opacity-0'}`} />
                  
                  <div className="relative flex items-center justify-center">
                    <div className={`relative rounded-full border-2 border-emerald-500/40 bg-emerald-950/80 backdrop-blur-xl flex items-center justify-center transition-all duration-500 ${activeNode === idx ? 'w-16 h-16 bg-emerald-600 text-white border-white shadow-[0_0_40px_rgba(5,150,105,0.6)]' : 'w-14 h-14 text-emerald-400'} ${isLocked ? 'shadow-[0_0_30px_rgba(52,211,153,0.5)] border-emerald-400/60' : ''}`}>
                        {activeNode === idx ? <Scan className="w-8 h-8" /> : spot.icon}
                    </div>
                  </div>
                  
                  <div className={`absolute top-[125%] bg-emerald-950/90 backdrop-blur-2xl border border-emerald-500/30 p-2.5 rounded-2xl transition-all duration-300 shadow-2xl ${isLocked || activeNode === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
        <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center p-6 animate-in fade-in duration-300 bg-black/40">
           <div 
             className="w-full max-w-[340px] bg-emerald-950/95 p-8 rounded-[40px] border border-emerald-500/40 shadow-[0_40px_100px_rgba(0,0,0,0.9)] backdrop-blur-3xl animate-in zoom-in-95 duration-300 pointer-events-auto relative overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-500/30 m-4 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-500/30 m-4 rounded-br-2xl" />
              
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
                  <button onClick={() => { setActiveNode(null); setIntelText(null); }} className="p-2.5 bg-emerald-900/40 border border-emerald-500/20 rounded-2xl text-emerald-500 active:scale-90 hover:bg-emerald-500/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-black/40 rounded-3xl p-4 border border-emerald-500/10 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-amber-400 mb-1">
                         <Star className="w-4 h-4 fill-current" />
                         <span className="text-base font-black text-white">{hotspots[activeNode].rating}</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-500/30 uppercase tracking-widest">{hotspots[activeNode].reviews} CITATIONS</span>
                   </div>
                   <div className="bg-black/40 rounded-3xl p-4 border border-emerald-500/10 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-emerald-400 mb-1">
                         <DollarSign className="w-4 h-4" />
                         <span className="text-base font-black text-white">{hotspots[activeNode].price > 0 ? `RM ${hotspots[activeNode].price}` : 'FREE'}</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-500/30 uppercase tracking-widest">ACCESS FEE</span>
                   </div>
                </div>

                <div className="mb-8 relative min-h-[100px]">
                  {isFetchingIntel ? (
                    <div className="flex flex-col gap-4 animate-in fade-in">
                       <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Decrypting Field Reports...</span>
                       </div>
                       <div className="w-full h-1 bg-emerald-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 transition-all duration-150" style={{ width: `${decryptionProgress}%` }} />
                       </div>
                    </div>
                  ) : intelText ? (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">DECRYPTED BRIEFING</span>
                      </div>
                      <p className="text-sm leading-relaxed text-emerald-100 font-mono opacity-90 border-l-2 border-emerald-500/30 pl-4">
                        {intelText}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-emerald-100 font-medium h-24 overflow-y-auto custom-scrollbar pr-2 italic opacity-80">
                      "{hotspots[activeNode].description}"
                    </p>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleFetchIntel(activeNode!)}
                    disabled={isFetchingIntel}
                    className="flex-1 bg-emerald-900/30 border border-emerald-500/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 text-emerald-400 shadow-xl disabled:opacity-50"
                  >
                    {isFetchingIntel ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />} INTEL
                  </button>
                  <button 
                    onClick={() => { setNavigationNode(activeNode); setActiveNode(null); setIntelText(null); }}
                    className={`flex-1 ${navigationNode === activeNode ? 'bg-emerald-500' : 'bg-emerald-600'} text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-950/50`}
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
        <button onClick={onBack} className="w-16 h-16 bg-emerald-950/80 backdrop-blur-2xl rounded-3xl text-emerald-400 border border-emerald-500/20 flex items-center justify-center active:scale-90 transition-all shadow-2xl">
          <ArrowLeft className="w-7 h-7" />
        </button>
        
        <div className="relative flex flex-col items-center">
          <button 
            onClick={handleCapture} 
            className="w-28 h-28 rounded-full border-[8px] border-emerald-500/10 bg-emerald-950/40 backdrop-blur-xl flex items-center justify-center p-2 active:scale-95 transition-all shadow-[0_0_60px_rgba(0,0,0,0.7)] group"
          >
            <div className="w-full h-full bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.4)] group-hover:bg-emerald-500 transition-colors">
              <Camera className="w-10 h-10 text-emerald-100" />
            </div>
          </button>
        </div>

        <button 
          onClick={() => setShowMapOverlay(prev => !prev)} 
          className={`w-16 h-16 backdrop-blur-2xl rounded-3xl text-white border transition-all shadow-2xl flex items-center justify-center active:scale-90 ${showMapOverlay ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-emerald-950/80 border-emerald-500/20 text-emerald-400'}`}
        >
          <Map className="w-7 h-7" />
        </button>
      </div>

      <style>{`
        @keyframes loading { from { width: 0%; } to { width: 100%; } }
        @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ARView;
