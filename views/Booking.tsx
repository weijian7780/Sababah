
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, CheckCircle2, Star, CreditCard, Wallet, Landmark, 
  Minus, Plus, Calendar, Clock, User, ChevronDown, Check, 
  PlusCircle, Trash2, ShoppingBag, Receipt, Mail
} from 'lucide-react';
import { Attraction } from '../types';
import { ATTRACTIONS } from '../constants';

interface BookingProps {
  attraction: Attraction;
  onBack: () => void;
  onSuccess: () => void;
}

type BookingStep = 'FORM' | 'PAYMENT' | 'SUCCESS';

interface BookingItem {
  id: string;
  attraction: Attraction;
  date: string;
  time: string;
  members: {
    adult: number;
    nonMalaysian: number;
    concession: number;
  };
  remark: string;
  subtotal: number;
}

const Booking: React.FC<BookingProps> = ({ attraction: initialAttraction, onBack, onSuccess }) => {
  const [step, setStep] = useState<BookingStep>('FORM');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  // Global Applicant Details
  const [applicant, setApplicant] = useState({
    name: 'Ahmad Daniel',
    email: 'ahmad.daniel@example.com',
    phone: '+60 12 345 6789',
  });

  // Current Selection State
  const [currentAttraction, setCurrentAttraction] = useState<Attraction>(initialAttraction);
  const [visitDetails, setVisitDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    members: {
      adult: 1, 
      nonMalaysian: 0,
      concession: 0
    },
    remark: ''
  });

  const [cart, setCart] = useState<BookingItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');

  // Helper to calculate costs
  const calculateCosts = (price: number, members: typeof visitDetails.members) => {
    const priceMalaysian = price * 0.5;
    const priceIntl = price;
    const priceConcession = price * 0.3;

    return (members.adult * priceMalaysian) + 
           (members.nonMalaysian * priceIntl) + 
           (members.concession * priceConcession);
  };

  const currentItemSubtotal = calculateCosts(currentAttraction.price, visitDetails.members);
  const currentTotalPax = visitDetails.members.adult + visitDetails.members.nonMalaysian + visitDetails.members.concession;

  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const finalSubtotal = cart.length > 0 ? cartSubtotal : currentItemSubtotal;
  const serviceTax = finalSubtotal * 0.06;
  const totalPayable = finalSubtotal + serviceTax;

  const updateMember = (key: keyof typeof visitDetails.members, delta: number) => {
    setVisitDetails(prev => ({
      ...prev,
      members: {
        ...prev.members,
        [key]: Math.max(0, prev.members[key] + delta)
      }
    }));
  };

  const addToCart = () => {
    if (currentTotalPax === 0) return;
    const newItem: BookingItem = {
      id: Date.now().toString(),
      attraction: currentAttraction,
      ...visitDetails,
      subtotal: currentItemSubtotal
    };
    setCart([...cart, newItem]);
    setVisitDetails({
      ...visitDetails,
      members: { adult: 1, nonMalaysian: 0, concession: 0 },
      remark: ''
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleNext = () => {
    if (step === 'FORM') {
      if (cart.length === 0) {
        if (currentTotalPax > 0) {
           addToCart();
           setStep('PAYMENT');
        }
      } else {
        setStep('PAYMENT');
      }
    } else if (step === 'PAYMENT') {
      setStep('SUCCESS');
    }
  };

  const handleBack = () => {
    if (step === 'FORM') onBack();
    else if (step === 'PAYMENT') setStep('FORM');
    else if (step === 'SUCCESS') setStep('PAYMENT');
  };

  if (step === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center p-8 animate-in fade-in duration-500">
        <div className="w-full flex items-center mb-24">
          <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h2 className="text-xl font-bold ml-4">Booking Confirmed</h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-sm mx-auto">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-200/50 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 text-center">Adventure Awaits!</h1>
          <div className="bg-slate-50 rounded-3xl p-6 w-full mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="text-slate-500 font-bold text-sm">Total Paid</span>
              <span className="text-xl font-black text-emerald-600">RM {totalPayable.toFixed(2)}</span>
            </div>
            <div className="space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.attraction.name}</p>
                    <p className="text-xs text-slate-400">{item.date} • {item.members.adult + item.members.nonMalaysian + item.members.concession} Pax</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-slate-500 text-sm text-center mb-10">
            Booking confirmation sent to <br/><span className="font-bold text-slate-900">{applicant.email}</span>
          </p>
          <button 
            onClick={onSuccess}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${step === 'FORM' ? 'bg-[#F0FDF4]' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-6 flex items-center sticky top-0 z-30 bg-inherit/90 backdrop-blur-sm">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-black/5">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h2 className="text-xl font-bold ml-4 text-slate-900">
          {step === 'FORM' ? 'Compose Trip' : 'Payment'}
        </h2>
      </div>

      <div className="pb-40">
        {step === 'FORM' ? (
          <div className="animate-in slide-in-from-right-4 duration-300 space-y-8">
            {/* 1. Venue Selection */}
            <div className="px-6 relative z-20">
               <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em] mb-4 block">1. Select Attraction</label>
               <div className="relative">
                 <button 
                    onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                    className="w-full text-left bg-white rounded-[40px] shadow-[0_15px_30px_rgba(0,0,0,0.03)] border border-slate-100/50 transition-all active:scale-[0.99] group relative overflow-hidden outline-none"
                 >
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1.5 text-xs font-black text-slate-700 group-hover:bg-white transition-colors">
                      Change <ChevronDown className={`w-3 h-3 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    <img 
                      src={currentAttraction.imageUrl} 
                      alt={currentAttraction.name} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h1 className="text-2xl font-black text-slate-900 mb-1">{currentAttraction.name}</h1>
                      <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">RM {currentAttraction.price}/pax</span>
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider"><Landmark className="w-3 h-3" /> {currentAttraction.location}</span>
                      </div>
                    </div>
                 </button>

                 {isSelectorOpen && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[300px] overflow-y-auto z-50">
                      <div className="p-2 space-y-1">
                        {ATTRACTIONS.map(attr => (
                          <button 
                            key={attr.id}
                            onClick={() => { setCurrentAttraction(attr); setIsSelectorOpen(false); }}
                            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${currentAttraction.id === attr.id ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50 border border-transparent'}`}
                          >
                            <img src={attr.imageUrl} alt={attr.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1 text-left">
                              <h4 className={`font-bold text-sm ${currentAttraction.id === attr.id ? 'text-emerald-900' : 'text-slate-900'}`}>{attr.name}</h4>
                              <p className="text-xs text-slate-500">RM {attr.price} / pax</p>
                            </div>
                            {currentAttraction.id === attr.id && (
                              <Check className="w-4 h-4 text-emerald-600 mr-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                 )}
               </div>
            </div>

            {/* 2. Applicant Info */}
            <div className="px-6 space-y-4">
              <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em] block">2. Applicant Details</label>
              <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-3">
                 <div className="flex items-center gap-3 border-b border-slate-50 pb-3 bg-white rounded-t-2xl px-4">
                    <User className="w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={applicant.name}
                      onChange={(e) => setApplicant({...applicant, name: e.target.value})}
                      className="w-full text-sm font-bold text-black bg-white outline-none placeholder:font-normal placeholder:text-slate-400 py-2"
                      placeholder="Full Name"
                    />
                 </div>
                 <div className="flex items-center gap-3 bg-white rounded-b-2xl px-4">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={applicant.email}
                      onChange={(e) => setApplicant({...applicant, email: e.target.value})}
                      className="w-full text-sm font-bold text-black bg-white outline-none placeholder:font-normal placeholder:text-slate-400 py-2"
                      placeholder="Email Address"
                    />
                 </div>
              </div>
            </div>

            {/* 3. Visit Details */}
            <div className="px-6 space-y-4">
              <label className="text-[11px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em] block">3. Visit Details</label>

              <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                      <input 
                          type="date" 
                          value={visitDetails.date}
                          onChange={(e) => setVisitDetails({...visitDetails, date: e.target.value})}
                          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                      <input 
                          type="time" 
                          value={visitDetails.time}
                          onChange={(e) => setVisitDetails({...visitDetails, time: e.target.value})}
                          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
              </div>

              {/* Pax Counters */}
              <div className="bg-white p-2 rounded-[32px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-1">
                <div className="p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-800 text-sm">Adult (Malaysian)</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">RM {(currentAttraction.price * 0.5).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl">
                        <button onClick={() => updateMember('adult', -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 active:scale-90 shadow-sm"><Minus className="w-4 h-4" /></button>
                        <span className="w-4 text-center font-black text-slate-900 text-sm">{visitDetails.members.adult}</span>
                        <button onClick={() => updateMember('adult', 1)} className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white active:scale-90 shadow-md shadow-emerald-200"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-800 text-sm">International</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">RM {currentAttraction.price.toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl">
                        <button onClick={() => updateMember('nonMalaysian', -1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 active:scale-90 shadow-sm"><Minus className="w-4 h-4" /></button>
                        <span className="w-4 text-center font-black text-slate-900 text-sm">{visitDetails.members.nonMalaysian}</span>
                        <button onClick={() => updateMember('nonMalaysian', 1)} className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white active:scale-90 shadow-md shadow-emerald-200"><Plus className="w-4 h-4" /></button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" /> Applicant
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    <p className="text-sm font-bold text-slate-800">{applicant.name}</p>
                    <p className="text-sm text-slate-500">{applicant.email}</p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
               <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-600" /> Order Summary
               </h3>
               <div className="space-y-6">
                 {(cart.length > 0 ? cart : [{
                    attraction: currentAttraction,
                    ...visitDetails,
                    subtotal: currentItemSubtotal
                 }]).map((item, idx) => (
                    <div key={idx} className="flex gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                       <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <img src={item.attraction.imageUrl} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                             <h4 className="font-bold text-sm text-slate-900">{item.attraction.name}</h4>
                             <span className="font-bold text-sm text-slate-900">RM {item.subtotal}</span>
                          </div>
                          <p className="text-xs text-slate-500">{item.date} @ {item.time}</p>
                       </div>
                    </div>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 px-1">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                  { label: 'TnG eWallet', icon: <Wallet className="w-5 h-5" /> }
                ].map((method) => (
                  <button 
                    key={method.label}
                    onClick={() => setPaymentMethod(method.label)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.label ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.label ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                            {method.icon}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{method.label}</span>
                    </div>
                    {paymentMethod === method.label && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-6 text-white">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Subtotal</span>
                    <span className="font-bold">RM {finalSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Service Tax (6%)</span>
                    <span className="font-bold">RM {serviceTax.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Pay</span>
                <span className="text-3xl font-black text-emerald-400">RM {totalPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Button - Emerald Green theme */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-6 border-t border-slate-50 z-50">
        <button 
          onClick={handleNext}
          disabled={step === 'FORM' && cart.length === 0 && currentTotalPax === 0}
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-100/50 transition-all active:scale-[0.98] text-lg disabled:opacity-50 disabled:grayscale"
        >
          {step === 'FORM' 
            ? `Checkout RM ${currentItemSubtotal.toFixed(0)}`
            : `Pay RM ${totalPayable.toFixed(2)}`
          }
        </button>
      </div>
    </div>
  );
};

export default Booking;
