
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldPlus, ChevronLeft, Loader2, Briefcase } from 'lucide-react';

interface AdminSignupProps {
  onSignup: () => void;
  onBackToLogin: () => void;
}

const AdminSignup: React.FC<AdminSignupProps> = ({ onSignup, onBackToLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onSignup();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col justify-center animate-in slide-in-from-right-8 duration-500 relative text-white">
      <button 
        onClick={onBackToLogin}
        className="absolute top-12 left-6 p-4 bg-slate-900/50 text-slate-500 hover:text-emerald-400 transition-all rounded-3xl border border-slate-800 active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="mb-10 flex flex-col items-center text-center mt-8">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-[32px] flex items-center justify-center mb-6 border border-emerald-500/30">
          <Briefcase className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Admin Enrollment</h2>
        <p className="text-slate-400 font-medium">Join the management taskforce</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5 max-w-sm mx-auto w-full relative z-10">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-emerald-500/70 ml-1 uppercase tracking-widest">Legal Name</label>
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              required
              type="text" 
              placeholder="Admin Name" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-emerald-500/70 ml-1 uppercase tracking-widest">Gov Email</label>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              required
              type="email" 
              placeholder="officer@sababah.gov.my" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-emerald-500/70 ml-1 uppercase tracking-widest">Create Access Key</label>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 mt-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
            By submitting, you acknowledge that all administrative actions are logged and subject to audit under internal governance guidelines.
          </p>
        </div>

        <button 
          type="submit"
          disabled={isAuthenticating}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black py-5 rounded-2xl active:scale-[0.98] transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3 text-lg mt-4"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing Request...
            </>
          ) : (
            <>
              Request Enrollment <ShieldPlus className="w-6 h-6" />
            </>
          )}
        </button>
      </form>

      <p className="mt-12 text-center text-slate-500 font-medium relative z-10">
        Already registered? <button onClick={onBackToLogin} className="text-emerald-400 font-black hover:underline ml-1">Admin Log In</button>
      </p>
    </div>
  );
};

export default AdminSignup;
