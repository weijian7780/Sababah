
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Users, Landmark, DollarSign, Calendar, TrendingUp, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_STATS = [
  { label: 'Total Users', value: '1,284', icon: <Users />, color: 'bg-blue-100 text-blue-600' },
  { label: 'Attractions', value: '23', icon: <Landmark />, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Monthly Rev', value: 'RM 18.5k', icon: <DollarSign />, color: 'bg-amber-100 text-amber-600' },
  { label: 'New Bookings', value: '157', icon: <Calendar />, color: 'bg-purple-100 text-purple-600' }
];

const DATA_7D = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 300 },
  { name: 'Wed', revenue: 600 },
  { name: 'Thu', revenue: 800 },
  { name: 'Fri', revenue: 500 },
  { name: 'Sat', revenue: 1100 },
  { name: 'Sun', revenue: 900 },
];

const DATA_30D = [
  { name: 'Week 1', revenue: 2400 },
  { name: 'Week 2', revenue: 3200 },
  { name: 'Week 3', revenue: 2800 },
  { name: 'Week 4', revenue: 4500 },
];

const DATA_YEAR = [
  { name: 'Q1', revenue: 12000 },
  { name: 'Q2', revenue: 15000 },
  { name: 'Q3', revenue: 18000 },
  { name: 'Q4', revenue: 22000 },
];

type Period = '7 Days' | '30 Days' | 'Year';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7 Days');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeData = useMemo(() => {
    switch (selectedPeriod) {
      case '30 Days': return DATA_30D;
      case 'Year': return DATA_YEAR;
      default: return DATA_7D;
    }
  }, [selectedPeriod]);

  const periods: Period[] = ['7 Days', '30 Days', 'Year'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full p-4 md:p-8 animate-in fade-in duration-700 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 active:scale-90"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight leading-none">
              Sabah Tourism CMS
            </h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Welcome back, Admin Panel</p>
          </div>
        </div>
        <button className="bg-[#059669] text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 text-sm md:text-base text-center">
          Add New<span className="hidden md:inline"> Attraction</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0 mb-8 snap-x">
        {MOCK_STATS.map((stat, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 w-28 md:w-32 bg-white rounded-full border border-slate-100 shadow-sm p-1 flex flex-col items-center py-6 md:py-8 snap-center"
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.color} rounded-full flex items-center justify-center mb-4 md:mb-6`}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-5 h-5 md:w-6 md:h-6' })}
            </div>
            <div className="text-center px-1">
              <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-none mb-1">{stat.label}</p>
              <h3 className="text-lg md:text-xl font-extrabold text-[#0F172A]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Revenue Overview with Date Filter */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] shadow-sm border border-slate-50 flex flex-col min-w-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Revenue Overview</h3>
                <div className="flex items-center gap-1.5 bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </div>
              </div>
              <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Data for the last {selectedPeriod}</p>
            </div>

            {/* Period Selector Filter */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-slate-600 text-sm font-bold min-w-[120px] hover:bg-slate-100 transition-all active:scale-95"
              >
                {selectedPeriod}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {periods.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setSelectedPeriod(p);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${selectedPeriod === p ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="relative w-full h-[280px] md:h-[350px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} 
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 15px 20px -5px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#059669" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] shadow-sm border border-slate-50">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-8">Recent Bookings</h3>
          <div className="space-y-6 md:space-y-7">
            {[
              { user: 'Ahmad D.', attr: 'Sabah Museum', time: '2 mins ago', amount: 'RM 45', initial: 'A', color: 'bg-emerald-50 text-emerald-600' },
              { user: 'Sarah L.', attr: 'Mount Kinabalu', time: '15 mins ago', amount: 'RM 250', initial: 'S', color: 'bg-blue-50 text-blue-600' },
              { user: 'Kevin W.', attr: 'Poring Hot Spring', time: '1 hr ago', amount: 'RM 30', initial: 'K', color: 'bg-amber-50 text-amber-600' },
              { user: 'Jane M.', attr: 'Sepilok Center', time: '3 hrs ago', amount: 'RM 120', initial: 'J', color: 'bg-purple-50 text-purple-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer transition-all hover:bg-slate-50/50 p-2 -m-2 rounded-2xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${item.color} rounded-[18px] flex items-center justify-center font-black text-base md:text-lg transition-transform group-hover:scale-105`}>
                    {item.initial}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base">{item.user}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate max-w-[120px] md:max-w-none">
                      {item.attr} • {item.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-emerald-700 text-sm md:text-base whitespace-nowrap">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 md:mt-10 py-4 text-emerald-600 font-extrabold border-2 border-emerald-50 rounded-2xl hover:bg-emerald-50 transition-all active:scale-95 text-sm md:text-base">
            View All Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
