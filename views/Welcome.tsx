
import React from 'react';

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-slate-900">
      <img 
        src="https://images.unsplash.com/photo-1571439270193-18e197374820?auto=format&fit=crop&q=80&w=1000" 
        alt="Sabah Nature" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110 animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-16 flex flex-col gap-6">
        <div className="space-y-2">
          <p className="text-emerald-400 font-semibold tracking-widest uppercase text-sm">Welcome to Borneo</p>
          <h1 className="text-5xl font-bold text-white leading-tight">It's Time To Travel.</h1>
          <p className="text-emerald-100/80 text-lg">Dive into adventure, explore Sabah's hidden treasures and unique cultures.</p>
        </div>
        
        <button 
          onClick={onNext}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95 text-lg"
        >
          Start Your Adventure
        </button>
      </div>
    </div>
  );
};

export default Welcome;
