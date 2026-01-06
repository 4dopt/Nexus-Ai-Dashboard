import React, { useEffect, useState, useRef } from 'react';
import { Reservation } from '../types';
import { dataService } from '../services/dataService';
import { CheckCircle, Clock, DollarSign, ArrowUpRight, ArrowDownRight, MoreHorizontal, Download, Info, User, ChevronRight, Pencil, Save, X, GripVertical, UserX, LogIn, CalendarX, LayoutDashboard, ChartBar, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import Analytics from './Analytics';
import CRM from './CRM';

interface DashboardProps {
  onAlertTrigger: (active: boolean) => void;
}

type TimeRange = '7d' | '30d' | '12m';

// Mock Data Sets
const WEEKLY_DATA = [
  { name: 'Mon', revenue: 4000, visitors: 2400 },
  { name: 'Tue', revenue: 3000, visitors: 1398 },
  { name: 'Wed', revenue: 2000, visitors: 9800 },
  { name: 'Thu', revenue: 2780, visitors: 3908 },
  { name: 'Fri', revenue: 1890, visitors: 4800 },
  { name: 'Sat', revenue: 2390, visitors: 3800 },
  { name: 'Sun', revenue: 3490, visitors: 4300 },
];

const MONTHLY_DATA = [
    { name: 'Week 1', revenue: 15400, visitors: 12400 },
    { name: 'Week 2', revenue: 18300, visitors: 14398 },
    { name: 'Week 3', revenue: 22000, visitors: 19800 },
    { name: 'Week 4', revenue: 27800, visitors: 23908 },
];

const YEARLY_DATA = [
  { name: 'Jan', revenue: 45000, visitors: 32000 },
  { name: 'Feb', revenue: 52000, visitors: 35000 },
  { name: 'Mar', revenue: 48000, visitors: 33000 },
  { name: 'Apr', revenue: 61000, visitors: 42000 },
  { name: 'May', revenue: 55000, visitors: 38000 },
  { name: 'Jun', revenue: 67000, visitors: 48000 },
  { name: 'Jul', revenue: 72000, visitors: 52000 },
  { name: 'Aug', revenue: 69000, visitors: 49000 },
  { name: 'Sep', revenue: 62000, visitors: 44000 },
  { name: 'Oct', revenue: 58000, visitors: 41000 },
  { name: 'Nov', revenue: 65000, visitors: 46000 },
  { name: 'Dec', revenue: 85000, visitors: 65000 },
];

const METRICS_DATA = {
  '7d': { revenue: "$12,450", hours: "364h", success: "86.5%", trendRev: "+15.8%", trendHours: "-34.0%", trendSuccess: "+24.2%" },
  '30d': { revenue: "$48,200", hours: "1,450h", success: "88.2%", trendRev: "+12.4%", trendHours: "-28.5%", trendSuccess: "+18.1%" },
  '12m': { revenue: "$642,000", hours: "18,500h", success: "91.0%", trendRev: "+24.5%", trendHours: "-15.2%", trendSuccess: "+8.4%" },
};

// Define Widget Types
type WidgetId = 'metric-revenue' | 'metric-hours' | 'metric-success' | 'chart-revenue' | 'chart-guests' | 'table-arrivals';

interface WidgetConfig {
  id: WidgetId;
  colSpan: string; // Tailwind class for column span
  render: (props: any) => React.ReactNode;
}

const DEFAULT_WIDGET_ORDER: WidgetId[] = [
  'metric-revenue', 
  'metric-hours', 
  'metric-success', 
  'chart-revenue', 
  'chart-guests', 
  'table-arrivals'
];

const Dashboard: React.FC<DashboardProps> = ({ onAlertTrigger }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickerMsg, setTickerMsg] = useState("AI Agent Online");
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReservations, setShowAllReservations] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [currentView, setCurrentView] = useState<'operations' | 'analytics' | 'marketing'>('operations');
  
  // Layout State with LocalStorage Persistence
  const [widgetOrder, setWidgetOrder] = useState<WidgetId[]>(() => {
    try {
      const savedLayout = localStorage.getItem('restoai_dashboard_layout');
      return savedLayout ? JSON.parse(savedLayout) : DEFAULT_WIDGET_ORDER;
    } catch (e) {
      console.error('Failed to load dashboard layout', e);
      return DEFAULT_WIDGET_ORDER;
    }
  });

  // Drag Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    dataService.getReservations().then(setReservations);
    const unsubscribe = dataService.subscribeToReservations((updatedList) => {
      setReservations(updatedList);
      setTickerMsg(`Booking: ${updatedList[0].guestName} (${updatedList[0].partySize} pax)`);
    });
    const interval = setInterval(() => {
        const trigger = Math.random() > 0.98;
        onAlertTrigger(trigger);
    }, 15000);
    return () => {
        unsubscribe();
        clearInterval(interval);
    };
  }, [onAlertTrigger]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenuId && !(event.target as Element).closest('.action-menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  // --- Actions ---

  const handleCheckIn = async (id: string) => {
    // Optimistic UI update
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'seated' } : r));
    await dataService.checkInGuest(id);
    setActiveMenuId(null);
  };

  const handleCancel = async (id: string) => {
    // Optimistic UI update (In a real app, call a cancel endpoint)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    setActiveMenuId(null);
  };

  // --- Drag Handlers ---

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
    e.preventDefault();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyListItems = [...widgetOrder];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      setWidgetOrder(copyListItems);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSaveLayout = () => {
    // We only explicitly save the main operations layout here. 
    // Sub-components (Analytics/CRM) handle their own persistence when isEditing toggles or on drop.
    localStorage.setItem('restoai_dashboard_layout', JSON.stringify(widgetOrder));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Revert to saved state or default for operations
    try {
      const savedLayout = localStorage.getItem('restoai_dashboard_layout');
      setWidgetOrder(savedLayout ? JSON.parse(savedLayout) : DEFAULT_WIDGET_ORDER);
    } catch (e) {
      setWidgetOrder(DEFAULT_WIDGET_ORDER);
    }
    setIsEditing(false);
  };

  // --- Helper to get current chart data ---
  const getCurrentChartData = () => {
      switch(timeRange) {
          case '30d': return MONTHLY_DATA;
          case '12m': return YEARLY_DATA;
          default: return WEEKLY_DATA;
      }
  };

  const getCurrentMetrics = () => METRICS_DATA[timeRange];

  // --- Widget Renderers ---

  const renderMetricCard = (label: string, value: string, trend: string, trendUp: boolean, Icon: any, color: 'emerald' | 'blue' | 'purple') => (
    <div className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed bg-primary-50/10' : 'border-gray-100'} shadow-card flex flex-col justify-between h-36 relative overflow-hidden group transition-all`}>
        {/* Background Decorator */}
        <div className={`absolute -right-4 -top-4 opacity-5 ${!isEditing && 'group-hover:scale-110'} transition-transform duration-500`}>
            <Icon size={100} className={color === 'emerald' ? 'text-emerald-900' : color === 'blue' ? 'text-blue-900' : 'text-purple-900'} />
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${
                    color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                    color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                    <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-500">{label}</span>
            </div>
            {isEditing && <GripVertical className="text-gray-400 cursor-grab" size={20} />}
        </div>

        <div className="relative z-10">
            <span className="text-3xl font-bold text-gray-900 tracking-tight block mb-1">{value}</span>
            <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </span>
                <span className="text-xs text-gray-400 font-medium">{timeRange === '7d' ? 'vs last week' : timeRange === '30d' ? 'vs last month' : 'vs last year'}</span>
            </div>
        </div>
    </div>
  );

  const renderRevenueChart = () => (
    <div className={`lg:col-span-2 bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed bg-primary-50/10' : 'border-gray-100'} shadow-card`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900">
                    {timeRange === '7d' ? 'Weekly' : timeRange === '30d' ? 'Monthly' : 'Annual'} Revenue
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        {timeRange === '7d' ? '$9,257.51' : timeRange === '30d' ? '$38,250.00' : '$642,000.00'}
                    </span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full flex items-center">
                        {getCurrentMetrics().trendRev}
                    </span>
                </div>
            </div>
            {isEditing ? <GripVertical className="text-gray-400 cursor-grab" size={20} /> : (
                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            )}
        </div>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getCurrentChartData()}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '12px' }} itemStyle={{ color: '#1f2937', fontWeight: 600 }} formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#7c3aed' }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );

  const renderGuestChart = () => (
    <div className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed bg-primary-50/10' : 'border-gray-100'} shadow-card flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Total Guests</h3>
            {isEditing ? <GripVertical className="text-gray-400 cursor-grab" size={20} /> : (
                 <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                    {timeRange === '7d' ? 'Daily' : timeRange === '30d' ? 'Weekly' : 'Monthly'}
                 </span>
            )}
        </div>
        <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCurrentChartData()}>
                     <Bar dataKey="visitors" fill="#10b981" radius={[6, 6, 6, 6]} barSize={timeRange === '12m' ? 12 : 32} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={10} />
                     <Tooltip cursor={{fill: '#f3f4f6', radius: 4}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );

  const renderTable = () => (
    <div className={`bg-white rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed bg-primary-50/10' : 'border-gray-100'} shadow-card overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">Today's Arrivals</h3>
                {isEditing ? <GripVertical className="text-gray-400 cursor-grab" size={20} /> : (
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                        {reservations.length} Pending
                    </span>
                )}
            </div>
            {!isEditing && (
                <button 
                    onClick={() => setShowAllReservations(!showAllReservations)}
                    className="text-sm text-primary-600 font-semibold hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                    {showAllReservations ? 'Show Less' : 'View All'}
                </button>
            )}
        </div>
        <div className={`overflow-x-auto ${showAllReservations ? 'max-h-[500px] overflow-y-auto' : ''}`}>
            <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
                <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-400 tracking-wide sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-4 font-medium">Guest Details</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Time</th>
                        <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {(showAllReservations ? reservations : reservations.slice(0, 5)).map((res) => (
                        <tr key={res.id} className={`group hover:bg-gray-50/80 transition-colors ${res.status === 'cancelled' ? 'opacity-50' : ''}`}>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={res.avatarUrl} alt="" className={`w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover ${res.status === 'cancelled' ? 'grayscale' : ''}`} />
                                        {res.status === 'seated' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>}
                                        {res.status === 'confirmed' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                                    </div>
                                    <div>
                                        <p className={`font-bold ${res.status === 'cancelled' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{res.guestName}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                <User size={12} /> {res.partySize} ppl
                                            </span>
                                            {res.notes && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 font-medium">
                                                        {res.notes}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    res.status === 'seated' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    res.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        res.status === 'confirmed' ? 'bg-emerald-500' :
                                        res.status === 'seated' ? 'bg-blue-500' : 
                                        res.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                                    }`}></span>
                                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-gray-900 font-semibold bg-gray-50 w-fit px-3 py-1 rounded-lg border border-gray-100">
                                    <Clock size={14} className="text-gray-400" />
                                    {res.time}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right relative action-menu-container">
                                {res.status !== 'seated' && res.status !== 'cancelled' ? (
                                    <button 
                                        onClick={() => handleCheckIn(res.id)}
                                        className="text-primary-600 hover:text-white hover:bg-primary-600 font-medium text-xs border border-primary-200 px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto"
                                    >
                                        <LogIn size={14} /> Check-in
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setActiveMenuId(activeMenuId === res.id ? null : res.id)}
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>
                                )}

                                {/* Dropdown Menu */}
                                {activeMenuId === res.id && (
                                    <div className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="py-1">
                                            {res.status !== 'seated' && (
                                                <button 
                                                    onClick={() => handleCheckIn(res.id)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <LogIn size={14} className="text-emerald-500" /> Check In
                                                </button>
                                            )}
                                            {res.status !== 'cancelled' && (
                                                <button 
                                                    onClick={() => handleCancel(res.id)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <CalendarX size={14} /> Cancel Reservation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {reservations.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-gray-50 rounded-full"><Clock size={24} /></div>
                                    <p className="text-sm font-medium">No arrivals scheduled for today.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  // Widget Configuration Map
  const WIDGETS: Record<WidgetId, WidgetConfig> = {
      'metric-revenue': {
          id: 'metric-revenue',
          colSpan: 'col-span-1 md:col-span-1',
          render: () => {
             const m = getCurrentMetrics();
             return renderMetricCard("Revenue Secured", m.revenue, m.trendRev, true, DollarSign, "emerald");
          }
      },
      'metric-hours': {
          id: 'metric-hours',
          colSpan: 'col-span-1 md:col-span-1',
          render: () => {
             const m = getCurrentMetrics();
             return renderMetricCard("Staff Hours Saved", m.hours, m.trendHours, false, Clock, "blue");
          }
      },
      'metric-success': {
          id: 'metric-success',
          colSpan: 'col-span-1 md:col-span-1',
          render: () => {
             const m = getCurrentMetrics();
             return renderMetricCard("Agent Success Rate", m.success, m.trendSuccess, true, CheckCircle, "purple");
          }
      },
      'chart-revenue': {
          id: 'chart-revenue',
          colSpan: 'col-span-1 md:col-span-2 lg:col-span-2',
          render: () => renderRevenueChart()
      },
      'chart-guests': {
          id: 'chart-guests',
          colSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
          render: () => renderGuestChart()
      },
      'table-arrivals': {
          id: 'table-arrivals',
          colSpan: 'col-span-1 md:col-span-3 lg:col-span-3',
          render: () => renderTable()
      }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                {/* Edit Button is now always available if not editing */}
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-gray-200 hover:text-primary-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
                        title="Edit Layout"
                    >
                        <Pencil size={14} />
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <p className="text-sm font-medium text-gray-500">{tickerMsg}</p>
            </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
            {isEditing ? (
                <>
                    <button 
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button 
                        onClick={handleSaveLayout}
                        className="px-4 py-2 bg-primary-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2 shadow-sm transition-all animate-in fade-in"
                    >
                        <Save size={16} /> Save Layout
                    </button>
                </>
            ) : (
                <>
                    {/* Time Range Selector (Hidden in Edit Mode for simpler UI) */}
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm h-[38px] items-center">
                        {(['7d', '30d', '12m'] as TimeRange[]).map((range) => (
                            <button 
                                key={range}
                                onClick={() => setTimeRange(range)} 
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all h-full flex items-center ${
                                    timeRange === range 
                                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'Year'}
                            </button>
                        ))}
                    </div>

                    <button className="px-4 py-2 bg-gray-900 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 shadow-sm transition-all h-[38px]">
                        <Download size={16} /> Export
                    </button>
                </>
            )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/50 backdrop-blur-sm p-1 rounded-xl inline-flex border border-gray-200">
          <button 
            onClick={() => setCurrentView('operations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                currentView === 'operations' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
              <LayoutDashboard size={16} />
              Operations
          </button>
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                currentView === 'analytics' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
              <ChartBar size={16} />
              Kitchen Intel
          </button>
          <button 
            onClick={() => setCurrentView('marketing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                currentView === 'marketing' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
              <TrendingUp size={16} />
              Growth Engine
          </button>
      </div>

      {/* View Content */}
      <div className="min-h-[500px]">
          {currentView === 'operations' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {widgetOrder.map((widgetId, index) => {
                    const widget = WIDGETS[widgetId];
                    return (
                        <div 
                            key={widgetId}
                            className={`${widget.colSpan} ${isEditing ? 'cursor-move' : ''}`}
                            draggable={isEditing}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {widget.render({})}
                        </div>
                    );
                })}
              </div>
          )}

          {currentView === 'analytics' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Analytics embedded isEditing={isEditing} />
              </div>
          )}

          {currentView === 'marketing' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CRM embedded isEditing={isEditing} />
              </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;