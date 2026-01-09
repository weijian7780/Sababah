
import React, { useState, useEffect } from 'react';
import { AppRoute, Attraction } from './types';
import { ATTRACTIONS } from './constants';
import Welcome from './views/Welcome';
import Login from './views/Login';
import Signup from './views/Signup';
import AdminLogin from './views/AdminLogin';
import AdminSignup from './views/AdminSignup';
import Home from './views/Home';
import Explore from './views/Explore';
import Detail from './views/Detail';
import Booking from './views/Booking';
import Profile from './views/Profile';
import Favorites from './views/Favorites';
import AdminDashboard from './views/AdminDashboard';
import ARView from './views/ARView';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.WELCOME);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Favorites State (Mocking persistence with default values for prototype)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['2', '4']); 

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getFavoriteAttractions = () => {
    return ATTRACTIONS.filter(attr => favoriteIds.includes(attr.id));
  };

  // Simplified Router
  const navigate = (route: AppRoute, data?: any) => {
    if (data && (route === AppRoute.DETAIL || route === AppRoute.AR_VIEW)) {
      setSelectedAttraction(data);
    }
    setCurrentRoute(route);
  };

  const renderRoute = () => {
    const defaultAttraction = selectedAttraction || ATTRACTIONS[0];
    const isFavorite = (id: string) => favoriteIds.includes(id);
    
    switch (currentRoute) {
      case AppRoute.WELCOME:
        return <Welcome onNext={() => navigate(AppRoute.LOGIN)} />;
      case AppRoute.LOGIN:
        return <Login 
          onLogin={() => { setIsLoggedIn(true); navigate(AppRoute.HOME); }} 
          onSignup={() => navigate(AppRoute.SIGNUP)} 
          onAdminPortal={() => navigate(AppRoute.ADMIN_LOGIN)}
        />;
      case AppRoute.SIGNUP:
        return <Signup 
          onSignup={() => { setIsLoggedIn(true); navigate(AppRoute.HOME); }} 
          onBackToLogin={() => navigate(AppRoute.LOGIN)} 
        />;
      case AppRoute.ADMIN_LOGIN:
        return <AdminLogin 
          onLogin={() => { setIsAdminLoggedIn(true); navigate(AppRoute.ADMIN_DASHBOARD); }} 
          onSignup={() => navigate(AppRoute.ADMIN_SIGNUP)} 
          onBackToUser={() => navigate(AppRoute.LOGIN)}
        />;
      case AppRoute.ADMIN_SIGNUP:
        return <AdminSignup 
          onSignup={() => { setIsAdminLoggedIn(true); navigate(AppRoute.ADMIN_DASHBOARD); }} 
          onBackToLogin={() => navigate(AppRoute.ADMIN_LOGIN)} 
        />;
      case AppRoute.HOME:
        return <Home 
          onSelect={(attr) => navigate(AppRoute.DETAIL, attr)} 
          onCategory={(cat) => navigate(AppRoute.EXPLORE)} 
          onBookDirect={() => { setSelectedAttraction(ATTRACTIONS[0]); navigate(AppRoute.BOOKING); }}
          favorites={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />;
      case AppRoute.EXPLORE:
        return <Explore onSelect={(attr) => navigate(AppRoute.DETAIL, attr)} />;
      case AppRoute.FAVORITES:
        return <Favorites 
          favorites={getFavoriteAttractions()}
          onSelect={(attr) => navigate(AppRoute.DETAIL, attr)}
          onRemove={(id, e) => { e.stopPropagation(); toggleFavorite(id); }}
        />;
      case AppRoute.DETAIL:
        return <Detail 
          attraction={defaultAttraction} 
          onBack={() => navigate(AppRoute.HOME)} 
          onBook={() => navigate(AppRoute.BOOKING)} 
          onEnterAR={() => navigate(AppRoute.AR_VIEW, defaultAttraction)}
          isFavorite={isFavorite(defaultAttraction.id)}
          onToggleFavorite={() => toggleFavorite(defaultAttraction.id)}
        />;
      case AppRoute.BOOKING:
        return <Booking 
          attraction={defaultAttraction} 
          onBack={() => navigate(AppRoute.DETAIL, selectedAttraction)} 
          onSuccess={() => navigate(AppRoute.HOME)}
        />;
      case AppRoute.AR_VIEW:
        return <ARView 
          attraction={defaultAttraction} 
          onBack={() => navigate(AppRoute.DETAIL, defaultAttraction)} 
        />;
      case AppRoute.PROFILE:
        return <Profile 
          onLogout={() => { setIsLoggedIn(false); navigate(AppRoute.LOGIN); }} 
          onAdmin={() => {
            if (isAdminLoggedIn) navigate(AppRoute.ADMIN_DASHBOARD);
            else navigate(AppRoute.ADMIN_LOGIN);
          }} 
        />;
      case AppRoute.ADMIN_DASHBOARD:
        if (!isAdminLoggedIn) {
          // Force back to login if someone tries to direct-link without auth
          setTimeout(() => navigate(AppRoute.ADMIN_LOGIN), 0);
          return null;
        }
        return <AdminDashboard onBack={() => { 
          // Logout admin and return to login screen
          setIsAdminLoggedIn(false); 
          navigate(AppRoute.ADMIN_LOGIN); 
        }} />;
      default:
        return <Home 
          onSelect={(attr) => navigate(AppRoute.DETAIL, attr)} 
          onCategory={(cat) => navigate(AppRoute.EXPLORE)}
          onBookDirect={() => { setSelectedAttraction(ATTRACTIONS[0]); navigate(AppRoute.BOOKING); }}
          favorites={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />;
    }
  };

  const isFullPage = [
    AppRoute.WELCOME, 
    AppRoute.LOGIN, 
    AppRoute.SIGNUP, 
    AppRoute.ADMIN_LOGIN, 
    AppRoute.ADMIN_SIGNUP, 
    AppRoute.ADMIN_DASHBOARD, 
    AppRoute.AR_VIEW, 
    AppRoute.BOOKING
  ].includes(currentRoute);

  return (
    <Layout activeRoute={currentRoute} onNavigate={navigate} showNav={!isFullPage}>
      {renderRoute()}
    </Layout>
  );
};

export default App;
