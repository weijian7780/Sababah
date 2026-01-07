
import React from 'react';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
      <div className="mb-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Explore Sabah</h2>
        <p className="text-slate-500">Log in to your account to continue</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1 flex justify-between">
            Password
            <button className="text-emerald-600 font-medium">Forgot?</button>
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          Login <ArrowRight className="w-5 h-5" />
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700">
            <Github className="w-5 h-5" /> Github
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" /> Google
          </button>
        </div>
      </div>

      <p className="mt-12 text-center text-slate-500">
        Don't have an account? <button className="text-emerald-600 font-bold">Sign Up</button>
      </p>
    </div>
  );
};

export default Login;
