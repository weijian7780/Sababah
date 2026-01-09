
import React from 'react';
import { Home, Compass, Heart, User, Bell } from 'lucide-react';
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
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 mb-2 scale-90 group-hover:scale-100">
        <div className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap relative">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      </div>

      {isFeatured ? (
        <div className="relative -mt-8">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
          <button 
            onClick={onClick}
            className="relative bg-[#10B981] p-4 rounded-2xl text-white shadow-lg shadow-emerald-200 active:scale-90 transition-all border-4 border-white group-hover:scale-105"
            aria-label={label}
          >
            <Heart className="w-6 h-6 fill-current" />
          </button>
        </div>
      ) : (
        <button 
          onClick={onClick}
          className={`p-3 transition-all rounded-2xl relative group-hover:bg-slate-50 ${isActive ? 'text-[#059669] bg-emerald-50' : 'text-slate-300 hover:text-slate-400'}`}
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

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 mx-auto relative overflow-hidden transition-all duration-300 ${isWidePage ? 'w-full max-w-5xl' : 'max-w-md border-x border-slate-200 shadow-2xl bg-white'}`}>
      {/* Header */}
      {showNav && (
        <header className="px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center text-white font-bold shadow-sm">S</div>
            <h1 className="text-xl font-bold text-[#065F46] tracking-tight">SabaBah</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors relative group">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
            <button onClick={() => onNavigate(AppRoute.PROFILE)} className="active:scale-90 transition-transform">
              <img 
                src="https://picsum.photos/seed/user1/100/100" 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
              />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto hide-scrollbar ${isFullHeight ? '' : 'pb-24'}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 pointer-events-none z-50">
          <nav className="bg-white/95 backdrop-blur-md border border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-[32px] p-2 flex justify-around items-center pointer-events-auto">
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
