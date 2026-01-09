
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Apple, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setIsAuthenticating(provider);
    // Simulate external OAuth flow delay
    setTimeout(() => {
      setIsAuthenticating(null);
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center animate-in fade-in duration-500 relative">
      {/* Auth Loading Overlay */}
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
          <p className="text-slate-900 font-black text-lg tracking-tight">Authenticating with {isAuthenticating}...</p>
          <p className="text-slate-400 text-sm mt-2 font-medium">Please wait while we secure your session</p>
        </div>
      )}

      <div className="mb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">S</div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Explore Sabah</h2>
        <p className="text-slate-400 font-medium">Log in to your account to continue</p>
      </div>

      <div className="space-y-6 max-w-sm mx-auto w-full">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 ml-1 tracking-tight">Email Address</label>
          <div className="relative">
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-sm font-black text-slate-700 tracking-tight">Password</label>
            <button className="text-emerald-500 font-bold text-sm hover:underline tracking-tight">Forgot?</button>
          </div>
          <div className="relative">
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 px-6 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={onLogin}
            className="w-full relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black py-4.5 rounded-2xl active:scale-[0.98] transition-all shadow-xl shadow-emerald-200/50">
              Login <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
            <span className="bg-white px-6">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleSocialLogin('Apple')}
            className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-slate-700 shadow-sm active:scale-95 group"
          >
            <Apple className="w-5 h-5 text-slate-900 group-hover:scale-110 transition-transform" /> 
            <span className="tracking-tight">Apple</span>
          </button>
          <button 
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-slate-700 shadow-sm active:scale-95 group"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" /> 
            <span className="tracking-tight">Google</span>
          </button>
        </div>
      </div>

      <p className="mt-16 text-center text-slate-400 font-medium">
        Don't have an account? <button onClick={onSignup} className="text-emerald-500 font-black hover:underline ml-1">Sign Up</button>
      </p>
    </div>
  );
};

export default Login;
