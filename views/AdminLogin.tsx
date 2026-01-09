
import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, Loader2, Landmark, ChevronLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onSignup: () => void;
  onBackToUser: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onSignup, onBackToUser }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsAuthenticating(true);
    
    // Simulate admin auth delay
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col justify-center animate-in fade-in duration-500 relative text-white">
      {/* Back button to User flow */}
      <button 
        onClick={onBackToUser}
        className="absolute top-12 left-6 p-4 text-slate-500 hover:text-emerald-400 transition-all flex items-center gap-2 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">User Portal</span>
      </button>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 mb-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/30">
          <Landmark className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Sabah CMS</h2>
        <p className="text-slate-400 font-medium">Administrative Access Portal</p>
      </div>

      <form onSubmit={handleLogin} className="relative z-10 space-y-6 max-w-sm mx-auto w-full">
        <div className="space-y-2">
          <label className="text-xs font-black text-emerald-500/70 ml-1 uppercase tracking-widest">Admin ID / Email</label>
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              required
              type="email" 
              defaultValue="admin@sababah.gov.my"
              placeholder="admin@sababah.gov.my" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-white placeholder:text-slate-600 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-black text-emerald-500/70 uppercase tracking-widest">Secret Key</label>
            <button type="button" className="text-slate-500 font-bold text-xs hover:text-emerald-400 transition-colors">Emergency Reset</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              required
              type="password" 
              defaultValue="password123"
              placeholder="••••••••" 
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4.5 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-white placeholder:text-slate-600 font-medium"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black py-5 rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                Access Dashboard <ShieldCheck className="w-6 h-6" />
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-8">
          <p className="text-slate-500 text-sm font-medium">
            New administrator? <button type="button" onClick={onSignup} className="text-emerald-400 font-black hover:underline ml-1">Request Registration</button>
          </p>
        </div>
      </form>

      <div className="absolute bottom-8 left-0 right-0 text-center px-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
          Protected by Bornean Security Protocol v4.2
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
