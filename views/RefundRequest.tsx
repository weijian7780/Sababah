
import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, DollarSign, Calendar, MapPin, Loader2, X } from 'lucide-react';
import { Booking, Attraction } from '../types';

interface RefundRequestProps {
  booking: Booking;
  attraction: Attraction;
  onBack: () => void;
  onConfirmRefund: (bookingId: string, reason: string) => void;
}

const RefundRequest: React.FC<RefundRequestProps> = ({ booking, attraction, onBack, onConfirmRefund }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Refund calculation: 10% processing fee
  const processingFee = booking.total * 0.10;
  const refundAmount = booking.total - processingFee;

  const handleConfirm = () => {
    if (!reason) return;
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmRefund(booking.id, reason);
      }, 2500);
    }, 1800);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Request Filed</h2>
        <p className="text-slate-500 text-center mb-10 font-medium leading-relaxed max-w-xs mx-auto">
          Your refund request for <span className="text-slate-900 font-bold">{booking.id}</span> has been received. Funds will return to your account within <span className="text-emerald-600 font-bold">3-5 business days</span>.
        </p>
        <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[loading_2.5s_linear_infinite]" style={{ width: '40%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 pb-32 animate-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 mt-4">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-90 transition-all">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Cancel Trip</h2>
      </div>

      <div className="space-y-8">
        {/* Booking Details Summary */}
        <div className="bg-white rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex gap-5 mb-8">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 shadow-inner">
              <img src={attraction.imageUrl} alt={attraction.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 py-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 tracking-widest">Confirmed Trip</span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ID: {booking.id}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{attraction.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {booking.date}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-6 border-t border-slate-50">
            <div className="flex justify-between items-center text-sm font-bold text-slate-400">
              <span className="uppercase tracking-widest text-[10px]">Paid Amount</span>
              <span className="text-slate-800">RM {booking.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-400">
              <span className="uppercase tracking-widest text-[10px]">Processing Fee</span>
              <span className="text-red-500">- RM {processingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Estimated Refund</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">RM {refundAmount.toFixed(2)}</span>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-100" />
            </div>
          </div>
        </div>

        {/* Reason Picker */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Reason for Refund</label>
          <div className="grid grid-cols-1 gap-3">
            {['Change of plans', 'Weather conditions', 'Medical emergency', 'Other'].map((r) => (
              <button 
                key={r}
                onClick={() => setReason(r)}
                className={`p-5 rounded-[28px] text-left font-black text-[13px] uppercase tracking-wider border-2 transition-all active:scale-[0.98] ${
                  reason === r 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-900/5' 
                    : 'border-slate-50 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  {r}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${reason === r ? 'border-emerald-500 bg-emerald-500' : 'border-slate-100'}`}>
                    {reason === r && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Warning Policy */}
        <div className="bg-amber-50 rounded-[32px] p-6 border border-amber-100 flex gap-4 shadow-sm animate-pulse">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
          <div>
            <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Cancellation Policy</h4>
            <p className="text-[11px] text-amber-800/70 leading-relaxed font-bold">
              Refunds are processed within 24 hours of submission. Once cancelled, your digital ticket for {booking.id} will be permanently voided.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border-t border-slate-50 z-50">
        <button 
          onClick={handleConfirm}
          disabled={!reason || isSubmitting}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            'Authorize Refund'
          )}
        </button>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
};

export default RefundRequest;
