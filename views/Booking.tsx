
import React, { useState } from 'react';
import { ArrowLeft, Calendar, UserPlus, CreditCard, Landmark, CheckCircle2, ChevronRight } from 'lucide-react';
import { Attraction } from '../types';

interface BookingProps {
  attraction: Attraction;
  onBack: () => void;
  onSuccess: () => void;
}

const Booking: React.FC<BookingProps> = ({ attraction, onBack, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'null'>( 'null' );

  if (step === 3) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Success!</h2>
        <p className="text-slate-500 mb-12">Your ticket for <span className="font-bold text-slate-800">{attraction.name}</span> has been confirmed. We've sent the details to your email.</p>
        <button 
          onClick={onSuccess}
          className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-bold">{step === 1 ? 'Booking Details' : 'Payment Method'}</h2>
      </div>

      {step === 1 ? (
        <div className="space-y-10 animate-in slide-in-from-right-4">
          {/* Attraction Card */}
          <div className="flex gap-4 p-4 bg-emerald-50 rounded-3xl border border-emerald-100">
            <img src={attraction.imageUrl} className="w-20 h-20 rounded-2xl object-cover" />
            <div>
              <h4 className="font-bold text-slate-800">{attraction.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{attraction.category}</p>
              <p className="text-emerald-700 font-bold mt-2">RM {attraction.price} / person</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Select Date</h3>
            <div className="grid grid-cols-4 gap-3">
              {[15, 16, 17, 18].map(d => (
                <button key={d} className={`py-4 rounded-2xl text-center border transition-all ${d === 16 ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600'}`}>
                  <p className="text-[10px] font-medium opacity-70">May</p>
                  <p className="text-lg font-bold">{d}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Quantity</h3>
            <div className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">General Admission</p>
                  <p className="text-xs text-slate-400">Adult (12+ years)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setTickets(Math.max(1, tickets - 1))}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold"
                >-</button>
                <span className="font-bold w-4 text-center">{tickets}</span>
                <button 
                  onClick={() => setTickets(tickets + 1)}
                  className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold"
                >+</button>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t p-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-500 font-medium">Total Price ({tickets}x)</p>
              <p className="text-2xl font-bold text-emerald-700">RM {attraction.price * tickets}</p>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-100"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="space-y-4">
            <button 
              onClick={() => setPaymentMethod('bank')}
              className={`w-full p-6 rounded-3xl border flex items-center justify-between transition-all ${paymentMethod === 'bank' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${paymentMethod === 'bank' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800">Online Banking</h4>
                  <p className="text-xs text-slate-400">FPX, CIMB, Maybank</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-200'}`}>
                {paymentMethod === 'bank' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod('card')}
              className={`w-full p-6 rounded-3xl border flex items-center justify-between transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${paymentMethod === 'card' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-800">Credit / Debit Card</h4>
                  <p className="text-xs text-slate-400">Visa, Mastercard, Amex</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-200'}`}>
                {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </button>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Ticket Price</span>
              <span className="font-bold text-slate-800">RM {attraction.price * tickets}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Processing Fee</span>
              <span className="font-bold text-slate-800">RM 2.00</span>
            </div>
            <div className="h-px bg-slate-200"></div>
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">Grand Total</span>
              <span className="text-xl font-bold text-emerald-700">RM {(attraction.price * tickets) + 2}</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t p-6">
            <button 
              disabled={paymentMethod === 'null'}
              onClick={() => setStep(3)}
              className="w-full bg-emerald-600 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-100"
            >
              Confirm and Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
