
import React from 'react';
import { Home, Compass, Heart, User, Bell } from 'lucide-react';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, onNavigate, showNav = true }) => {
  // Admin dashboard and welcome screens might want different width behaviors
  const isWidePage = activeRoute === AppRoute.ADMIN_DASHBOARD;
  const isFullHeight = [AppRoute.WELCOME, AppRoute.LOGIN].includes(activeRoute);

  return (
    <div className={`flex flex-col min-h-screen bg-slate-50 text-slate-900 mx-auto relative overflow-hidden transition-all duration-300 ${isWidePage ? 'w-full max-w-5xl' : 'max-w-md border-x border-slate-200 shadow-2xl'}`}>
      {/* Header */}
      {showNav && (
        <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">S</div>
            <h1 className="text-xl font-bold text-emerald-800 tracking-tight">SabaBah</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={() => onNavigate(AppRoute.PROFILE)} className="active:scale-90 transition-transform">
              <img 
                src="https://picsum.photos/seed/user1/100/100" 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-emerald-100 shadow-sm" 
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
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(448px-3rem)] bg-white/90 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-2 flex justify-around items-center z-50">
          <button 
            onClick={() => onNavigate(AppRoute.HOME)}
            className={`p-3 rounded-xl transition-all ${activeRoute === AppRoute.HOME ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.EXPLORE)}
            className={`p-3 rounded-xl transition-all ${activeRoute === AppRoute.EXPLORE ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}
          >
            <Compass className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.FAVORITES)}
            className={`p-3 rounded-xl transition-all ${activeRoute === AppRoute.FAVORITES ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}
          >
            <Heart className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.PROFILE)}
            className={`p-3 rounded-xl transition-all ${activeRoute === AppRoute.PROFILE ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default Layout;
