
import React, { useState, useEffect } from 'react';
import { Home, Compass, Heart, User, Bell, WifiOff, X, Info, AlertCircle, Map as MapIcon, Calendar } from 'lucide-react';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  showNav?: boolean;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  isFeatured = false 
}: { 
  icon: React.ElementType, 
  label: string, 
  isActive: boolean, 
  onClick: () => void,
  isFeatured?: boolean
}) => {
  return (
    <div className="relative group flex flex-col items-center">
      {isFeatured ? (
        <div className="relative">
          <div className={`absolute -inset-2 bg-emerald-400 blur-xl transition-opacity duration-300 ${isActive ? 'opacity-30' : 'opacity-0'}`}></div>
          <button 
            onClick={onClick}
            className={`relative p-3 rounded-2xl text-white shadow-xl transition-all active:scale-90 border-2 border-white/50 ${isActive ? 'bg-[#10B981] shadow-emerald-200' : 'bg-slate-300'}`}
            aria-label={label}
          >
            <Heart className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
          </button>
        </div>
      ) : (
        <button 
          onClick={onClick}
          className={`p-3 transition-all rounded-2xl relative active:scale-90 ${isActive ? 'text-[#10B981] bg-emerald-50' : 'text-slate-300 hover:text-slate-400'}`}
          aria-label={label}
        >
          <Icon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, onNavigate, showNav = true }) => {
  const isWidePage = activeRoute === AppRoute.ADMIN_DASHBOARD;
  const isFullHeight = [AppRoute.WELCOME, AppRoute.LOGIN, AppRoute.SIGNUP].includes(activeRoute);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    { id: 1, title: 'Flight Update', msg: 'Your trip to KK is tomorrow!', icon: <Calendar className="w-4 h-4" />, type: 'info' },
    { id: 2, title: 'New Secret Gem', msg: 'A hidden spot in Kundasang was revealed.', icon: <MapIcon className="w-4 h-4" />, type: 'success' },
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-[#FDFDFD] text-slate-900 mx-auto relative overflow-hidden transition-all duration-300 ${isWidePage ? 'w-full max-w-5xl' : 'max-w-md border-x border-slate-100 shadow-2xl bg-white'}`}>
      
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-center gap-2 z-[60] animate-in slide-in-from-top duration-300 border-b border-amber-600 shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Offline Mode - Showing Cached Data</span>
        </div>
      )}

      {/* Header */}
      {showNav && (
        <header className="px-8 py-5 flex items-center justify-between bg-white sticky top-0 z-40">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(AppRoute.HOME)}>
            <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center text-white font-bold shadow-sm">S</div>
            <h1 className="text-xl font-bold text-[#059669] tracking-tight">SabaBah</h1>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) setUnreadCount(0);
              }}
              className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative group active:scale-90"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              )}
            </button>
            <button onClick={() => onNavigate(AppRoute.PROFILE)} className="active:scale-90 transition-transform">
              <img 
                src="https://picsum.photos/seed/user1/100/100" 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-100 object-cover shadow-sm" 
              />
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-6 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Alerts</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-slate-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {notifications.map(notif => (
                    <div key={notif.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 leading-tight mb-1">{notif.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed truncate">{notif.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-3 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] border-t border-slate-50">View all updates</button>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto hide-scrollbar ${isFullHeight ? '' : 'pb-24'}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-6 pb-6 pointer-events-none z-50">
          <nav className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] rounded-[32px] p-2 flex justify-around items-center pointer-events-auto">
            <NavItem 
              icon={Home} 
              label="Home" 
              isActive={activeRoute === AppRoute.HOME} 
              onClick={() => onNavigate(AppRoute.HOME)} 
            />
            <NavItem 
              icon={Compass} 
              label="Explore" 
              isActive={activeRoute === AppRoute.EXPLORE} 
              onClick={() => onNavigate(AppRoute.EXPLORE)} 
            />
            <NavItem 
              icon={Heart} 
              label="Favorites" 
              isActive={activeRoute === AppRoute.FAVORITES} 
              onClick={() => onNavigate(AppRoute.FAVORITES)} 
              isFeatured={true}
            />
            <NavItem 
              icon={User} 
              label="Profile" 
              isActive={activeRoute === AppRoute.PROFILE} 
              onClick={() => onNavigate(AppRoute.PROFILE)} 
            />
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
