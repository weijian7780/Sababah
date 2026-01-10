
import React from 'react';
import { ArrowLeft, Calendar, MapPin, Ticket, ChevronRight, XCircle } from 'lucide-react';
import { User, Booking } from '../types';
import { ATTRACTIONS } from '../constants';

interface MyBookingsProps {
  user: User;
  onBack: () => void;
  onSelectRefund: (booking: Booking) => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({ user, onBack, onSelectRefund }) => {
  return (
    <div className="p-8 pb-32 animate-in slide-in-from-right-8 duration-500 bg-[#FDFDFD] min-h-full">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="p-2.5 bg-white shadow-sm rounded-2xl text-slate-400 active:scale-90 transition-transform border border-slate-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">My Bookings</h2>
      </div>

      {user.bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Ticket className="w-10 h-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No active bookings</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">Your upcoming adventures will appear here. Start exploring Sabah's wonders!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {user.bookings.map((booking) => {
            const attraction = ATTRACTIONS.find(a => a.id === booking.attractionId);
            if (!attraction) return null;

            return (
              <div 
                key={booking.id}
                className="bg-white rounded-[40px] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-slate-100/50 group"
              >
                <div className="flex gap-5 mb-6">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden shrink-0 shadow-inner">
                    <img src={attraction.imageUrl} className="w-full h-full object-cover" alt={attraction.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-lg font-black text-slate-900 leading-tight truncate">{attraction.name}</h4>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full whitespace-nowrap ${
                        booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {attraction.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-none mb-1">Total Paid</span>
                    <span className="text-xl font-black text-slate-900 leading-none">RM {booking.total.toFixed(2)}</span>
                  </div>
                  
                  {booking.status !== 'cancelled' ? (
                    <button 
                      onClick={() => onSelectRefund(booking)}
                      className="flex items-center gap-2 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-100/50"
                    >
                      <XCircle className="w-4 h-4" /> Cancel & Refund
                    </button>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Cancelled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
