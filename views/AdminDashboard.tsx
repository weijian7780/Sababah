
import React, { useState, useMemo } from 'react';
// Added CircleDashed to imports to fix the "Cannot find name 'CircleDashed'" error on line 397
import { ArrowLeft, Users, Landmark, DollarSign, Calendar, TrendingUp, ChevronDown, ArrowUpRight, ArrowDownRight, ArrowUpDown, Search, Filter, Eye, Edit3, Trash2, Box, Sparkles, CircleDashed } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_STATS = [
  { label: 'Total Users', value: '1,284', icon: <Users />, color: 'bg-blue-100 text-blue-600' },
  { label: 'Attractions', value: '23', icon: <Landmark />, color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Monthly Rev', value: 'RM 18.5k', icon: <DollarSign />, color: 'bg-amber-100 text-amber-600' },
  { label: 'New Bookings', value: '157', icon: <Calendar />, color: 'bg-purple-100 text-purple-600' }
];

const DATA_7D = [
  { name: 'Mon', revenue: 400, prev: 350 },
  { name: 'Tue', revenue: 300, prev: 320 },
  { name: 'Wed', revenue: 600, prev: 450 },
  { name: 'Thu', revenue: 800, prev: 700 },
  { name: 'Fri', revenue: 500, prev: 520 },
  { name: 'Sat', revenue: 1100, prev: 900 },
  { name: 'Sun', revenue: 900, prev: 850 },
];

const DATA_30D = [
  { name: 'Week 1', revenue: 2400, prev: 2100 },
  { name: 'Week 2', revenue: 3200, prev: 3000 },
  { name: 'Week 3', revenue: 2800, prev: 3100 },
  { name: 'Week 4', revenue: 4500, prev: 3800 },
];

const DATA_YEAR = [
  { name: 'Q1', revenue: 12000, prev: 10500 },
  { name: 'Q2', revenue: 15000, prev: 14000 },
  { name: 'Q3', revenue: 18000, prev: 16000 },
  { name: 'Q4', revenue: 22000, prev: 19500 },
];

const DETAILED_BOOKINGS = [
  { id: 'BK-1001', user: 'Ahmad D.', attraction: 'Sabah Museum', date: '2024-05-16', amount: 45, status: 'Confirmed', arReady: true },
  { id: 'BK-1002', user: 'Sarah L.', attraction: 'Mount Kinabalu', date: '2024-05-16', amount: 250, status: 'Confirmed', arReady: true },
  { id: 'BK-1003', user: 'Kevin W.', attraction: 'Poring Hot Spring', date: '2024-05-15', amount: 30, status: 'Pending', arReady: false },
  { id: 'BK-1004', user: 'Jane M.', attraction: 'Sepilok Center', date: '2024-05-15', amount: 120, status: 'Confirmed', arReady: true },
  { id: 'BK-1005', user: 'Robert C.', attraction: 'Sabah Museum', date: '2024-05-14', amount: 45, status: 'Confirmed', arReady: true },
  { id: 'BK-1006', user: 'Siti Aminah', attraction: 'Mount Kinabalu', date: '2024-05-13', amount: 500, status: 'Cancelled', arReady: true },
];

type Period = '7 Days' | '30 Days' | 'Year';
type SortKey = 'date' | 'amount';
type BookingStatus = 'All' | 'Confirmed' | 'Pending' | 'Cancelled';

interface AdminDashboardProps {
  onBack: () => void;
}

const CustomTooltip = ({ active, payload, label, selectedPeriod }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const current = data.revenue;
    const previous = data.prev;
    const diff = current - previous;
    const percentChange = ((diff / previous) * 100).toFixed(1);
    const isPositive = diff >= 0;

    return (
      <div className="bg-white p-4 rounded-[24px] shadow-2xl border border-slate-50 min-w-[180px] animate-in fade-in zoom-in duration-200">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
        <div className="space-y-3">
          <div>
            <p className="text-slate-500 text-[10px] font-medium">Revenue</p>
            <p className="text-xl font-black text-emerald-700">RM {current.toLocaleString()}</p>
          </div>
          <div className="h-px bg-slate-50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[9px] font-medium">vs Prev. {selectedPeriod.replace('s', '')}</p>
              <div className={`flex items-center gap-1 text-[11px] font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? '+' : ''}{percentChange}%
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[9px] font-medium">Previous</p>
              <p className="text-slate-600 text-xs font-bold">RM {previous.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7 Days');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  const activeData = useMemo(() => {
    switch (selectedPeriod) {
      case '30 Days': return DATA_30D;
      case 'Year': return DATA_YEAR;
      default: return DATA_7D;
    }
  }, [selectedPeriod]);

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...DETAILED_BOOKINGS];

    if (statusFilter !== 'All') {
      result = result.filter(b => b.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.user.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q) || 
        b.attraction.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
  }, [sortConfig, statusFilter, searchQuery]);

  const toggleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleAction = (action: string, id: string) => {
    console.log(`${action} booking: ${id}`);
  };

  const periods: Period[] = ['7 Days', '30 Days', 'Year'];
  const statuses: BookingStatus[] = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full p-4 md:p-8 animate-in fade-in duration-700 overflow-x-hidden pb-20">
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
        <button className="bg-[#059669] text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 text-sm md:text-base text-center flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Add New Attraction
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
              {React.cloneElement(stat.icon as React.ReactElement<any>, { className: 'w-5 h-5 md:w-6 md:h-6' })}
            </div>
            <div className="text-center px-1">
              <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider leading-none mb-1">{stat.label}</p>
              <h3 className="text-lg md:text-xl font-extrabold text-[#0F172A]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] shadow-sm border border-slate-50 flex flex-col min-w-0">
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 600}} />
                <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 2, strokeDasharray: '4 4' }} content={<CustomTooltip selectedPeriod={selectedPeriod} />} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary View */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[48px] shadow-sm border border-slate-50 flex flex-col">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Box className="w-6 h-6 text-emerald-600" />
            Feature Matrix
          </h3>
          <div className="space-y-5 flex-1">
             <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
               <div className="flex items-center justify-between mb-2">
                 <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">AR Integration</p>
                 <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" />
               </div>
               <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                 All primary locations now support immersive AR Heads-Up Displays.
               </p>
             </div>

             <div className="space-y-4 pt-2">
               {DETAILED_BOOKINGS.slice(0, 3).map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Box className={`w-4 h-4 ${item.arReady ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{item.attraction}</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${item.arReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {item.arReady ? 'AR LIVE' : 'SYNCING'}
                    </span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Booking Management Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden mb-8">
        <div className="p-6 md:p-8 border-b border-slate-50 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">Booking Management</h3>
              <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Detailed list of all recent reservations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:text-emerald-600 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar -mx-2 px-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border ${
                  statusFilter === status 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Booking ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Attraction</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 cursor-pointer hover:text-emerald-600 transition-colors" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-1.5">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 cursor-pointer hover:text-emerald-600 transition-colors text-right" onClick={() => toggleSort('amount')}>
                  <div className="flex items-center justify-end gap-1.5">
                    Total <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">AR Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAndSortedBookings.length > 0 ? (
                filteredAndSortedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{booking.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">
                          {booking.user[0]}
                        </div>
                        <span className="text-sm font-extrabold text-slate-800">{booking.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-slate-600">{booking.attraction}</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">
                      {new Date(booking.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-black text-slate-900">RM {booking.amount}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        {booking.arReady ? (
                          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            <Box className="w-3 h-3" />
                            <span className="text-[9px] font-black">LIVE</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <CircleDashed className="w-3 h-3 animate-spin-slow" />
                            <span className="text-[9px] font-black">SYNC</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleAction('View', booking.id)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('Edit', booking.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction('Cancel', booking.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">No bookings found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
