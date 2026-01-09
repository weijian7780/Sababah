
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, Star, User, Mail, Phone, Users, 
  CreditCard, Wallet, Landmark, ChevronRight, MessageSquare
} from 'lucide-react';
import { Attraction } from '../types';

interface BookingProps {
  attraction: Attraction;
  onBack: () => void;
  onSuccess: () => void;
}

type BookingStep = 'FORM' | 'PAYMENT' | 'SUCCESS';

const Booking: React.FC<BookingProps> = ({ attraction, onBack, onSuccess }) => {
  const [step, setStep] = useState<BookingStep>('FORM');
  const [formData, setFormData] = useState({
    name: 'Example',
    email: 'example@gmail.com',
    phone: '0123456789',
    members: {
      adult: 0,
      nonMalaysian: 3,
      concession: 0 // Student/OKU/Senior
    },
    remark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');

  const subtotal = 42.30;
  const serviceTax = 2.70;
  const rounding = 0.00;
  const total = 45.00;

  const handleNext = () => {
    if (step === 'FORM') setStep('PAYMENT');
    else if (step === 'PAYMENT') setStep('SUCCESS');
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
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h2 className="text-xl font-bold ml-4">Booking</h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-sm">
          <h1 className="text-3xl font-black text-slate-900 mb-6">Booking Success!</h1>
          
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-100">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2 text-center mb-12">
            <p className="text-slate-600 font-medium">Your application is successful!</p>
            <p className="text-slate-500 text-sm">You may review your itinerary or back to Home.</p>
          </div>

          <button 
            onClick={onSuccess}
            className="w-full bg-[#EAB308] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 mb-4"
          >
            Review Itinerary
          </button>
          
          <button 
            onClick={onSuccess}
            className="text-slate-500 text-sm font-bold hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${step === 'FORM' ? 'bg-[#E0F7FA]' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-6 flex items-center">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h2 className="text-xl font-bold ml-4">
          {step === 'FORM' ? 'Renting of Venue' : 'Booking'}
        </h2>
      </div>

      <div className="pb-32">
        {step === 'FORM' ? (
          <div className="animate-in slide-in-from-right-4 duration-300">
            {/* Venue Image */}
            <div className="px-6 mb-6">
              <img 
                src={attraction.imageUrl} 
                alt={attraction.name} 
                className="w-full h-56 object-cover rounded-2xl shadow-sm"
              />
            </div>

            {/* Venue Info */}
            <div className="px-6 mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-1">{attraction.name}</h1>
              <p className="text-[10px] text-slate-500 mb-2">{attraction.location}</p>
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current opacity-50" />
                </div>
                <span className="text-xs font-bold text-slate-800 ml-1">4.2</span>
                <span className="text-[10px] text-slate-400">(4.9k)</span>
              </div>
            </div>

            {/* Application Form */}
            <div className="px-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1">Name of applicant</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1">E-mail address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1">Phone number</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1">No. pax</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Adult (Malaysian)</span>
                    <input 
                      type="number" 
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Non-Malaysian</span>
                    <input 
                      type="number" 
                      value={formData.members.nonMalaysian}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1">Student /OKU /Senior /Taxi Driver</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none"
                />
              </div>

              <div className="space-y-1 pb-6">
                <label className="text-[11px] font-bold text-slate-600 ml-1">Remark</label>
                <textarea 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 outline-none h-24 resize-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="px-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
            {/* Applicant Details Summary */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Applicant Details</h3>
              <div className="space-y-3 text-sm font-medium">
                <div className="flex gap-2">
                  <span className="text-slate-500">Name of applicant :</span>
                  <span className="text-slate-800">{formData.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">E-mail address :</span>
                  <span className="text-slate-800 font-normal">{formData.email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Phone number :</span>
                  <span className="text-slate-800">{formData.phone}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">No. of member :</span>
                  <span className="text-slate-800">3</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Date :</span>
                  <span className="text-slate-800">July 1, 2025</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Time :</span>
                  <span className="text-slate-800 uppercase">10:00 AM</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Remark :</span>
                  <span className="text-slate-800">-</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold text-slate-900">Payment method</h3>
              <div className="space-y-4">
                {[
                  { label: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                  { label: 'E-wallet', icon: <Wallet className="w-5 h-5" /> },
                  { label: 'Online banking', icon: <Landmark className="w-5 h-5" /> }
                ].map((method) => (
                  <button 
                    key={method.label}
                    onClick={() => setPaymentMethod(method.label)}
                    className="w-full flex items-center gap-4 group"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method.label ? 'border-slate-800' : 'border-slate-300'}`}>
                      {paymentMethod === method.label && <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-800">Subtotal</span>
                <span className="text-slate-800">RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-800">Service Tax (6%)</span>
                <span className="text-slate-800">{serviceTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-800">Rounding adjustment</span>
                <span className="text-slate-800">{rounding.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-xl font-black text-slate-900">Total</span>
                <span className="text-3xl font-black text-slate-900">RM {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Button - Always centered and prominent */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white p-8 flex justify-center border-t border-slate-50 z-50">
        <button 
          onClick={handleNext}
          className="w-2/3 bg-[#EAB308] hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 text-lg"
        >
          {step === 'FORM' ? 'Proceed' : 'Book now!'}
        </button>
      </div>
    </div>
  );
};

export default Booking;
