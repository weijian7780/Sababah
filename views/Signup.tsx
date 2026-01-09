
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Apple, ChevronLeft, Loader2 } from 'lucide-react';

interface SignupProps {
  onSignup: () => void;
  onBackToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onBackToLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);

  const handleSocialSignup = (provider: string) => {
    setIsAuthenticating(provider);
    setTimeout(() => {
      setIsAuthenticating(null);
      onSignup();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center animate-in slide-in-from-right-8 duration-500 relative">
      {isAuthenticating && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
            {isAuthenticating === 'Apple' ? (
              <Apple className="w-10 h-10 text-slate-900" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-10 h-10" alt="Google" />
            )}
          </div>
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-900 font-black text-lg tracking-tight">Setting up with {isAuthenticating}...</p>
          <p className="text-slate-400 text-sm mt-2 font-medium">Creating your secure explorer profile</p>
        </div>
      )}

      <button 
        onClick={onBackToLogin}
        className="absolute top-12 left-6 p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all rounded-2xl active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="mb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Create Account</h2>
        <p className="text-slate-400 font-medium">Join our community of explorers</p>
      </div>

      <div className="space-y-5 max-w-sm mx-auto w-full">
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Ahmad Daniel" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-700 ml-1 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-1 py-3">
          <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500/20 transition-all" />
          <p className="text-[11px] text-slate-400 font-medium leading-snug">
            I agree to the <button className="text-emerald-600 font-bold">Terms</button> and <button className="text-emerald-600 font-bold">Privacy Policy</button>
          </p>
        </div>

        <button 
          onClick={onSignup}
          className="w-full relative group mt-2"
        >
          <div className="absolute -inset-1 bg-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative flex items-center justify-center gap-2 bg-emerald-600 text-white font-black py-4.5 rounded-2xl active:scale-[0.98] transition-all shadow-xl shadow-emerald-200/50">
            Create Account <ArrowRight className="w-5 h-5" />
          </div>
        </button>

        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
            <span className="bg-white px-4">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSocialSignup('Apple')}
            className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm active:scale-95"
          >
            <Apple className="w-5 h-5 text-slate-900" /> Apple
          </button>
          <button 
            onClick={() => handleSocialSignup('Google')}
            className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" /> Google
          </button>
        </div>
      </div>

      <p className="mt-12 text-center text-slate-400 font-medium">
        Already have an account? <button onClick={onBackToLogin} className="text-emerald-600 font-black hover:underline ml-1">Log In</button>
      </p>
    </div>
  );
};

export default Signup;
