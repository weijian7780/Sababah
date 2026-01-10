
import React, { useState, useEffect } from 'react';
import { AppRoute, Attraction, Review, User, Booking } from './types';
import { ATTRACTIONS } from './constants';
import Welcome from './views/Welcome';
import Login from './views/Login';
import Signup from './views/Signup';
import AdminLogin from './views/AdminLogin';
import AdminSignup from './views/AdminSignup';
import Home from './views/Home';
import Explore from './views/Explore';
import Detail from './views/Detail';
import BookingView from './views/Booking';
import Profile from './views/Profile';
import Favorites from './views/Favorites';
import AdminDashboard from './views/AdminDashboard';
import ARView from './views/ARView';
import MyBookings from './views/MyBookings';
import RefundRequest from './views/RefundRequest';
import Layout from './components/Layout';
import { PersonalInfo, NotificationSettings, PrivacySecurity, HelpCenter } from './views/ProfileSubpages';

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.WELCOME);
  const [lastMainRoute, setLastMainRoute] = useState<AppRoute>(AppRoute.HOME);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // User Profile State with initial mock bookings
  const [user, setUser] = useState<User>({
    name: 'Ahmad Daniel',
    email: 'ahmad.daniel@example.com',
    phone: '+60 12 345 6789',
    avatar: 'https://picsum.photos/seed/user1/400/400',
    bookings: [
      { id: 'BK-1001', attractionId: '1', date: '2024-05-20', total: 45.00, status: 'completed' },
      { id: 'BK-1002', attractionId: '2', date: '2024-06-15', total: 250.00, status: 'completed' }
    ]
  });

  // Session Persistence for User Reviews
  const [userGeneratedReviews, setUserGeneratedReviews] = useState<Record<string, Review[]>>({});
  
  // Favorites State
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['2', '4']); 

  const toggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleAddReview = (attractionId: string, review: Review) => {
    setUserGeneratedReviews(prev => ({
      ...prev,
      [attractionId]: [review, ...(prev[attractionId] || [])]
    }));
  };

  const getFavoriteAttractions = () => {
    return ATTRACTIONS.filter(attr => favoriteIds.includes(attr.id));
  };

  // Simplified Router
  const navigate = (route: AppRoute, data?: any) => {
    // Track the last "main" view we were in to handle back buttons correctly
    if ([AppRoute.HOME, AppRoute.EXPLORE, AppRoute.FAVORITES, AppRoute.PROFILE].includes(currentRoute)) {
      setLastMainRoute(currentRoute);
    }

    if (data) {
      if (route === AppRoute.DETAIL || route === AppRoute.AR_VIEW) {
        setSelectedAttraction(data);
      }
      if (route === AppRoute.REFUND_REQUEST) {
        setSelectedBooking(data);
      }
    }
    setCurrentRoute(route);
  };

  const handleCancelBooking = (bookingId: string) => {
    setUser(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
    }));
  };

  const renderRoute = () => {
    const defaultAttraction = selectedAttraction || ATTRACTIONS[0];
    const isFavorite = (id: string) => favoriteIds.includes(id);
    
    // Combine static reviews with session reviews
    const currentReviews = [
      ...(userGeneratedReviews[defaultAttraction.id] || []),
      ...(defaultAttraction.userReviews || [])
    ];
    
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
          attraction={{...defaultAttraction, userReviews: currentReviews}} 
          onBack={() => navigate(lastMainRoute)} 
          onBook={() => navigate(AppRoute.BOOKING)} 
          onEnterAR={() => navigate(AppRoute.AR_VIEW, defaultAttraction)}
          isFavorite={isFavorite(defaultAttraction.id)}
          onToggleFavorite={() => toggleFavorite(defaultAttraction.id)}
          isLoggedIn={isLoggedIn}
          onLoginRequired={() => navigate(AppRoute.LOGIN)}
          onAddReview={handleAddReview}
        />;
      case AppRoute.BOOKING:
        return <BookingView 
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
          user={user}
          onLogout={() => { setIsLoggedIn(false); navigate(AppRoute.LOGIN); }} 
          onAdmin={() => {
            if (isAdminLoggedIn) navigate(AppRoute.ADMIN_DASHBOARD);
            else navigate(AppRoute.ADMIN_LOGIN);
          }} 
          onNavigateSubpage={(route) => navigate(route)}
        />;
      case AppRoute.MY_BOOKINGS:
        return <MyBookings 
          user={user}
          onBack={() => navigate(AppRoute.PROFILE)}
          onSelectRefund={(booking) => navigate(AppRoute.REFUND_REQUEST, booking)}
        />;
      case AppRoute.REFUND_REQUEST:
        const refundTargetAttraction = ATTRACTIONS.find(a => a.id === selectedBooking?.attractionId) || ATTRACTIONS[0];
        return <RefundRequest 
          booking={selectedBooking!}
          attraction={refundTargetAttraction}
          onBack={() => navigate(AppRoute.MY_BOOKINGS)}
          onConfirmRefund={(id) => {
            handleCancelBooking(id);
            navigate(AppRoute.MY_BOOKINGS);
          }}
        />;
      case AppRoute.PROFILE_PERSONAL:
        return <PersonalInfo user={user} onSave={(updatedUser) => { setUser(updatedUser); navigate(AppRoute.PROFILE); }} onBack={() => navigate(AppRoute.PROFILE)} />;
      case AppRoute.PROFILE_NOTIFICATIONS:
        return <NotificationSettings onBack={() => navigate(AppRoute.PROFILE)} />;
      case AppRoute.PROFILE_PRIVACY:
        return <PrivacySecurity onBack={() => navigate(AppRoute.PROFILE)} />;
      case AppRoute.PROFILE_HELP:
        return <HelpCenter onBack={() => navigate(AppRoute.PROFILE)} />;
      case AppRoute.ADMIN_DASHBOARD:
        if (!isAdminLoggedIn) {
          setTimeout(() => navigate(AppRoute.ADMIN_LOGIN), 0);
          return null;
        }
        return <AdminDashboard onBack={() => { 
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
    AppRoute.BOOKING,
    AppRoute.REFUND_REQUEST
  ].includes(currentRoute);

  return (
    <Layout activeRoute={currentRoute} onNavigate={navigate} showNav={!isFullPage}>
      {renderRoute()}
    </Layout>
  );
};

export default App;
