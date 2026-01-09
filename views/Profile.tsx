
import React from 'react';
import { Shield, Bell, HelpCircle, LogOut, ChevronRight, UserCircle } from 'lucide-react';
import { AppRoute } from '../types';

interface ProfileProps {
  onLogout: () => void;
  onAdmin: () => void;
  onNavigateSubpage: (route: AppRoute) => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout, onAdmin, onNavigateSubpage }) => {
  const menuItems = [
    { icon: <UserCircle className="w-6 h-6" />, label: 'Personal Information', route: AppRoute.PROFILE_PERSONAL },
    { icon: <Bell className="w-6 h-6" />, label: 'Notifications', route: AppRoute.PROFILE_NOTIFICATIONS },
    { icon: <Shield className="w-6 h-6" />, label: 'Privacy & Security', route: AppRoute.PROFILE_PRIVACY },
    { icon: <HelpCircle className="w-6 h-6" />, label: 'Help Center', route: AppRoute.PROFILE_HELP }
  ];

  return (
    <div className="p-8 pb-32 animate-in fade-in duration-500 bg-[#FDFDFD] min-h-full">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Profile</h2>
      </div>

      {/* User Centered Identity */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="relative mb-6">
          <img 
            src="https://picsum.photos/seed/user1/400/400" 
            alt="Profile" 
            className="w-32 h-32 rounded-[48px] object-cover border-4 border-white shadow-2xl shadow-emerald-100 ring-1 ring-slate-100" 
          />
          <div className="absolute -bottom-1 -right-1 bg-[#10B981] text-white p-2.5 rounded-2xl border-4 border-white shadow-lg">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Ahmad Daniel</h3>
        <p className="text-slate-400 font-medium tracking-tight mt-1">ahmad.daniel@example.com</p>
      </div>

      {/* Settings Card Menu */}
      <div className="bg-white rounded-[40px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100/50 mb-12">
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigateSubpage(item.route)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50/80 rounded-[24px] transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">{item.icon}</div>
              <span className="font-bold text-slate-700 text-[13px] tracking-tight">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="flex flex-col items-center">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-[#FF5A5F] font-black text-[11px] uppercase tracking-[0.3em] hover:text-red-600 transition-all active:scale-95 py-4 px-8"
        >
          <LogOut className="w-5 h-5" /> Logout Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
