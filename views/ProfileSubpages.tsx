
import React, { useState, useRef } from 'react';
import { ArrowLeft, UserCircle, Mail, Phone, ChevronRight, Bell, Smartphone, Send, ShieldCheck, Lock, Eye, HelpCircle, MessageCircle, FileText, Info, Search, Loader2 } from 'lucide-react';
import { User } from '../types';

interface SubpageProps {
  onBack: () => void;
}

interface PersonalInfoProps extends SubpageProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

// 1. Personal Information
export const PersonalInfo: React.FC<PersonalInfoProps> = ({ user, onSave, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate a brief save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    onSave(editedUser);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-8 pb-32 animate-in slide-in-from-right-8 duration-500 bg-[#FDFDFD] min-h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2.5 bg-slate-100 rounded-2xl text-slate-400 active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Personal Info</h2>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <img 
              src={editedUser.avatar} 
              className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl object-cover" 
              alt="Profile Avatar"
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <button 
            onClick={triggerFileSelect}
            className="text-[11px] font-black text-[#10B981] uppercase tracking-widest bg-emerald-50 px-8 py-3 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95"
          >
            Change Photo
          </button>
        </div>

        <div className="space-y-5">
          {[
            { id: 'name', icon: UserCircle, label: 'Full Name', value: editedUser.name },
            { id: 'email', icon: Mail, label: 'Email Address', value: editedUser.email },
            { id: 'phone', icon: Phone, label: 'Phone Number', value: editedUser.phone || '' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[40px] border border-slate-100/50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all focus-within:border-emerald-200">
              <div className="flex items-center gap-4 mb-2">
                <item.icon className="w-4 h-4 text-slate-300" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</label>
              </div>
              <input 
                type={item.id === 'email' ? 'email' : 'text'}
                value={item.value}
                onChange={(e) => setEditedUser(prev => ({ ...prev, [item.id === 'name' ? 'name' : item.id]: e.target.value }))}
                className="w-full text-base font-bold text-slate-900 ml-8 bg-transparent outline-none focus:text-emerald-600 transition-colors"
              />
            </div>
          ))}
        </div>
        
        <div className="pt-10">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full relative group active:scale-95 transition-all overflow-hidden"
          >
            {/* Main Button Body */}
            <div className="relative flex items-center justify-center bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black py-5.5 rounded-[40px] shadow-[0_15px_40px_rgba(16,185,129,0.3)] border-b-4 border-emerald-800/20">
              <div className="flex items-center gap-3 relative z-10">
                {isSaving ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="uppercase tracking-[0.4em] text-[12px]">Save Changes</span>
                )}
              </div>
              
              {/* Internal Accent Bar shown in screenshot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-1.5 bg-emerald-400/30 rounded-full pointer-events-none" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Notification Settings
export const NotificationSettings: React.FC<SubpageProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    itinerary: true,
    news: false
  });

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="p-8 pb-32 animate-in slide-in-from-right-8 duration-500 bg-[#FDFDFD] min-h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-white shadow-sm rounded-2xl text-slate-400 active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Notifications</h2>
      </div>

      <div className="bg-white rounded-[40px] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 space-y-2">
        {[
          { id: 'push', icon: <Smartphone className="w-5 h-5" />, label: 'Push Notifications', desc: 'Alerts on your mobile device' },
          { id: 'email', icon: <Mail className="w-5 h-5" />, label: 'Email Notifications', desc: 'Updates via your registered email' },
          { id: 'itinerary', icon: <Send className="w-5 h-5" />, label: 'Trip Updates', desc: 'Live itinerary changes & alerts' },
          { id: 'news', icon: <Bell className="w-5 h-5" />, label: 'Promotions', desc: 'Exclusive offers and news' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-5 hover:bg-slate-50/80 rounded-[24px] transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-slate-300">{item.icon}</div>
              <div>
                <p className="text-sm font-bold text-slate-800 tracking-tight">{item.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
              </div>
            </div>
            <Toggle 
              active={(settings as any)[item.id]} 
              onToggle={() => setSettings(prev => ({...prev, [item.id]: !(prev as any)[item.id]}))} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Privacy & Security
export const PrivacySecurity: React.FC<SubpageProps> = ({ onBack }) => {
  return (
    <div className="p-8 pb-32 animate-in slide-in-from-right-8 duration-500 bg-[#FDFDFD] min-h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-3 bg-white shadow-sm rounded-2xl text-slate-400 active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Privacy & Security</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
           <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
           <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Security Checkup</h3>
           <p className="text-slate-400 text-xs font-medium leading-relaxed">Your account is currently protected with high-level encryption.</p>
        </div>

        <div className="bg-white rounded-[40px] p-4 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] space-y-1">
          {[
            { icon: <Lock />, label: 'Change Password', desc: 'Update your login credentials' },
            { icon: <Eye />, label: 'Face ID / Touch ID', desc: 'Manage biometric authentication' },
            { icon: <ShieldCheck />, label: 'Two-Factor Auth', desc: 'Extra layer of protection' }
          ].map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-5 hover:bg-slate-50/80 rounded-[24px] transition-all group active:scale-95">
              <div className="flex items-center gap-4">
                <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">{item.icon}</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Help Center
export const HelpCenter: React.FC<SubpageProps> = ({ onBack }) => {
  return (
    <div className="p-8 pb-32 animate-in slide-in-from-right-8 duration-500 bg-[#FDFDFD] min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white shadow-sm rounded-2xl text-slate-400 active:scale-90 transition-transform"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Help Center</h2>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
        <input 
          type="text" 
          placeholder="How can we help?" 
          className="w-full bg-white shadow-sm border border-slate-100 rounded-[24px] py-5 pl-14 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-semibold transition-all"
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Popular Topics</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <MessageCircle className="w-6 h-6" />, label: 'Support Chat' },
            { icon: <FileText className="w-6 h-6" />, label: 'FAQ' },
            { icon: <Info className="w-6 h-6" />, label: 'About App' },
            { icon: <ShieldCheck className="w-6 h-6" />, label: 'Safe Travels' }
          ].map((item, idx) => (
            <button key={idx} className="flex flex-col items-center gap-4 p-8 bg-white rounded-[40px] border border-slate-100 hover:border-emerald-200 transition-all active:scale-95 group shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">{item.icon}</div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 mt-4 shadow-sm">
           <h4 className="text-lg font-black text-emerald-900 mb-2">Need Urgent Help?</h4>
           <p className="text-emerald-800/70 text-xs font-medium leading-relaxed mb-6">Our local guides are available 24/7 for emergency travel assistance.</p>
           <button className="w-full bg-[#10B981] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-200 active:scale-95 transition-transform">Call Support Now</button>
        </div>
      </div>
    </div>
  );
};
