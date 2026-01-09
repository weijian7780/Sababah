
import React, { useState, useEffect } from 'react';
import { AppRoute, Attraction } from './types';
import { ATTRACTIONS } from './constants';
import Welcome from './views/Welcome';
import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';
import Explore from './views/Explore';
import Detail from './views/Detail';
import Booking from './views/Booking';
import Profile from './views/Profile';
import AdminDashboard from './views/AdminDashboard';
import ARView from './views/ARView';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.WELCOME);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simplified Router
  const navigate = (route: AppRoute, data?: any) => {
    if (data && (route === AppRoute.DETAIL || route === AppRoute.AR_VIEW)) {
      setSelectedAttraction(data);
    }
    setCurrentRoute(route);
  };

  const renderRoute = () => {
    const defaultAttraction = selectedAttraction || ATTRACTIONS[0];
    
    switch (currentRoute) {
      case AppRoute.WELCOME:
        return <Welcome onNext={() => navigate(AppRoute.LOGIN)} />;
      case AppRoute.LOGIN:
        return <Login 
          onLogin={() => { setIsLoggedIn(true); navigate(AppRoute.HOME); }} 
          onSignup={() => navigate(AppRoute.SIGNUP)} 
        />;
      case AppRoute.SIGNUP:
        return <Signup 
          onSignup={() => { setIsLoggedIn(true); navigate(AppRoute.HOME); }} 
          onBackToLogin={() => navigate(AppRoute.LOGIN)} 
        />;
      case AppRoute.HOME:
        return <Home onSelect={(attr) => navigate(AppRoute.DETAIL, attr)} onCategory={(cat) => navigate(AppRoute.EXPLORE)} />;
      case AppRoute.EXPLORE:
        return <Explore onSelect={(attr) => navigate(AppRoute.DETAIL, attr)} />;
      case AppRoute.DETAIL:
        return <Detail 
          attraction={defaultAttraction} 
          onBack={() => navigate(AppRoute.HOME)} 
          onBook={() => navigate(AppRoute.BOOKING)} 
          onEnterAR={() => navigate(AppRoute.AR_VIEW, defaultAttraction)}
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
        return <Profile onLogout={() => { setIsLoggedIn(false); navigate(AppRoute.LOGIN); }} onAdmin={() => navigate(AppRoute.ADMIN_DASHBOARD)} />;
      case AppRoute.ADMIN_DASHBOARD:
        return <AdminDashboard onBack={() => navigate(AppRoute.PROFILE)} />;
      default:
        return <Home onSelect={(attr) => navigate(AppRoute.DETAIL, attr)} onCategory={(cat) => navigate(AppRoute.EXPLORE)} />;
    }
  };

  const isFullPage = [AppRoute.WELCOME, AppRoute.LOGIN, AppRoute.SIGNUP, AppRoute.ADMIN_DASHBOARD, AppRoute.AR_VIEW].includes(currentRoute);

  return (
    <Layout activeRoute={currentRoute} onNavigate={navigate} showNav={!isFullPage}>
      {renderRoute()}
    </Layout>
  );
};

export default App;
