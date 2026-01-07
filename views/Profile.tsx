
import React from 'react';
import { Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, UserCircle, Briefcase } from 'lucide-react';

interface ProfileProps {
  onLogout: () => void;
  onAdmin: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout, onAdmin }) => {
  return (
    <div className="p-8 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-bold">Profile</h2>
        <button className="p-2 bg-slate-100 rounded-xl">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="flex flex-col items-center mb-10 text-center">
        <div className="relative mb-4">
          <img 
            src="https://picsum.photos/seed/user1/200/200" 
            alt="Profile" 
            className="w-28 h-28 rounded-[40px] object-cover border-4 border-emerald-50 shadow-xl" 
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-2xl border-4 border-white">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Ahmad Daniel</h3>
        <p className="text-slate-400 font-medium">ahmad.daniel@example.com</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onAdmin}
          className="w-full flex items-center justify-between p-5 bg-emerald-50 rounded-3xl border border-emerald-100 group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-bold text-emerald-800">CMS Dashboard</p>
              <p className="text-xs text-emerald-600 font-medium">Manage attractions & bookings</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100 space-y-1">
          {[
            { icon: <UserCircle className="w-5 h-5" />, label: 'Personal Information' },
            { icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
            { icon: <Shield className="w-5 h-5" />, label: 'Privacy & Security' },
            { icon: <HelpCircle className="w-5 h-5" />, label: 'Help Center' }
          ].map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="text-slate-400 group-hover:text-emerald-600 transition-colors">{item.icon}</div>
                <span className="font-bold text-slate-700 text-sm">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-5 bg-red-50 text-red-600 font-bold rounded-3xl mt-6 active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
