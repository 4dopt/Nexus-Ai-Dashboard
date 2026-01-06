import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Moon, DollarSign, MessageSquare, TrendingUp, Users, Clock, ArrowUpRight, ArrowRight, MoreHorizontal, GripVertical } from 'lucide-react';

// --- MOCK DATA ---

const LEAD_TIME_DATA = [
  { range: 'Same Day', count: 45, fill: '#8b5cf6' },
  { range: '1-2 Days', count: 120, fill: '#a78bfa' },
  { range: '3-7 Days', count: 80, fill: '#c4b5fd' },
  { range: '> 7 Days', count: 35, fill: '#ddd6fe' },
];

const SENTIMENT_DATA = [
  { name: 'Positive', value: 72, color: '#10b981' },
  { name: 'Neutral', value: 24, color: '#94a3b8' },
  { name: 'Negative', value: 4, color: '#f43f5e' },
];

// Occupancy Pattern Data
const TIME_LABELS = ['5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Intensity 0-100
const BUSY_TIMES = [
    [10, 20, 15, 25, 45, 60, 40],
    [20, 30, 35, 50, 80, 90, 60],
    [30, 40, 50, 75, 100, 100, 70],
    [25, 35, 45, 70, 100, 100, 65],
    [15, 20, 25, 40, 70, 85, 40],
    [5, 10, 15, 20, 40, 50, 20]
];

const UNMET_REQUESTS = [
    { item: "Vegan Pizza", count: 18, category: "Menu Gap", potential: "$360" },
    { item: "Patio Heaters", count: 12, category: "Facility", potential: "Risk" },
    { item: "Soju", count: 7, category: "Drink Request", potential: "$140" },
];

interface AnalyticsProps {
  embedded?: boolean;
  isEditing?: boolean;
}

type WidgetId = 'revenue-opportunity' | 'occupancy-stats' | 'health-metrics';

const DEFAULT_ORDER: WidgetId[] = ['revenue-opportunity', 'occupancy-stats', 'health-metrics'];

const Analytics: React.FC<AnalyticsProps> = ({ embedded = false, isEditing = false }) => {
  const [layoutOrder, setLayoutOrder] = useState<WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('restoai_analytics_layout');
      return saved ? JSON.parse(saved) : DEFAULT_ORDER;
    } catch {
      return DEFAULT_ORDER;
    }
  });

  const [hoveredCell, setHoveredCell] = useState<{ day: number, time: number } | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

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
      const copyListItems = [...layoutOrder];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      setLayoutOrder(copyListItems);
      // Auto-save on drop
      localStorage.setItem('restoai_analytics_layout', JSON.stringify(copyListItems));
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const renderRevenueOpportunity = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Recovered Revenue */}
          <div className={`bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-800'} shadow-card relative overflow-hidden flex flex-col justify-between text-white group`}>
               {isEditing && <div className="absolute top-2 right-2 text-white/50"><GripVertical size={20}/></div>}
              <div className="absolute -right-6 -top-6 text-indigo-500/20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Moon size={160} />
              </div>
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                          <Moon size={16} />
                      </div>
                      <span className="text-xs font-bold text-indigo-200 uppercase tracking-wide">After-Hours Earnings</span>
                  </div>
                  <h3 className="text-indigo-100 text-sm font-medium mt-4">Recovered Revenue</h3>
                  <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-4xl font-bold text-white tracking-tight">£580</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center border border-emerald-500/30">
                         <ArrowUpRight size={12} className="mr-1"/> 12 Bookings
                      </span>
                  </div>
                  <p className="text-xs text-indigo-200/80 mt-4 leading-relaxed max-w-[85%]">
                      Revenue secured by AI between 11 PM and 9 AM while the restaurant was closed.
                  </p>
              </div>
              <div className="mt-6 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{width: '65%'}}></div>
              </div>
          </div>

          {/* Unmet Requests */}
          <div className={`lg:col-span-2 bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card relative`}>
               {isEditing && <div className="absolute top-2 right-2 text-gray-400"><GripVertical size={20}/></div>}
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <AlertTriangle size={20} className="text-amber-500" />
                          Missed Revenue Opportunities
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Items guests asked for that you don't offer.</p>
                  </div>
                  <button className="text-primary-600 text-sm font-bold hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                      View Chat Logs
                  </button>
              </div>
              <div className="space-y-3">
                  {UNMET_REQUESTS.map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:border-gray-200">
                          <div className="flex items-center gap-5">
                              <div className="flex flex-col items-center justify-center w-12 h-12 bg-white text-amber-600 rounded-xl border border-gray-200 shadow-sm">
                                  <span className="text-lg font-bold">{req.count}</span>
                              </div>
                              <div>
                                  <p className="font-bold text-gray-900">{req.item}</p>
                                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-0.5">{req.category}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">{req.potential}</p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Est. Value</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderOccupancyStats = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Occupancy Heatmap */}
          <div className={`lg:col-span-2 bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card relative`}>
               {isEditing && <div className="absolute top-2 right-2 text-gray-400"><GripVertical size={20}/></div>}
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="font-bold text-gray-900">Occupancy Patterns</h3>
                      <p className="text-sm text-gray-500 mt-1">Real-time density tracking by hour.</p>
                  </div>
                  <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
                      <MoreHorizontal size={20} />
                  </button>
              </div>

              <div className="flex flex-col xl:flex-row gap-8">
                  <div className="flex-1">
                       <div className="flex">
                          {/* Row Labels (Times) */}
                          <div className="flex flex-col justify-between mr-4 py-1.5">
                              {TIME_LABELS.map((time, i) => (
                                  <span 
                                    key={time} 
                                    className={`text-[11px] font-bold h-8 flex items-center transition-all duration-200 ${
                                        hoveredCell?.time === i 
                                        ? 'text-primary-700 bg-primary-50 rounded px-2 -ml-2' 
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {time}
                                  </span>
                              ))}
                          </div>
                          <div className="flex-1">
                              {/* Column Labels (Days) */}
                              <div className="grid grid-cols-7 mb-2 gap-2">
                                  {DAY_LABELS.map((day, i) => (
                                      <span 
                                        key={day} 
                                        className={`text-[11px] font-bold text-center transition-all duration-200 ${
                                            hoveredCell?.day === i
                                            ? 'text-primary-700 bg-primary-50 rounded py-0.5'
                                            : 'text-gray-400'
                                        }`}
                                      >
                                        {day}
                                      </span>
                                  ))}
                              </div>
                              {/* Grid */}
                              <div className="grid grid-cols-7 gap-2">
                                  {BUSY_TIMES.map((row, timeIndex) => (
                                       <React.Fragment key={timeIndex}>
                                          {row.map((intensity, dayIndex) => (
                                              <div 
                                                  key={`${timeIndex}-${dayIndex}`}
                                                  onMouseEnter={() => setHoveredCell({ time: timeIndex, day: dayIndex })}
                                                  onMouseLeave={() => setHoveredCell(null)}
                                                  className={`h-8 rounded-md transition-all duration-200 cursor-help relative ${
                                                      intensity < 10 ? 'bg-gray-50' :
                                                      intensity < 30 ? 'bg-purple-100' :
                                                      intensity < 50 ? 'bg-purple-300' :
                                                      intensity < 70 ? 'bg-purple-500' :
                                                      intensity < 90 ? 'bg-purple-700' : 'bg-purple-900'
                                                  } ${
                                                      hoveredCell?.time === timeIndex && hoveredCell?.day === dayIndex 
                                                      ? 'scale-110 shadow-lg ring-2 ring-white z-10' 
                                                      : 'hover:scale-105 hover:shadow-sm'
                                                  }`}
                                              >
                                                  {/* Interactive Tooltip */}
                                                  {hoveredCell?.time === timeIndex && hoveredCell?.day === dayIndex && (
                                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200 min-w-[120px]">
                                                          <div className="flex items-center justify-between gap-3 mb-1">
                                                              <span className="text-gray-400 font-medium">{DAY_LABELS[dayIndex]}</span>
                                                              <span className="text-gray-400 font-medium">{TIME_LABELS[timeIndex]}</span>
                                                          </div>
                                                          <div className="flex items-center gap-2">
                                                              <div className={`w-2 h-2 rounded-full ${intensity > 80 ? 'bg-red-500' : intensity > 50 ? 'bg-purple-400' : 'bg-emerald-400'}`}></div>
                                                              <span className="font-bold text-lg leading-none">{intensity}%</span>
                                                              <span className="text-gray-400">Full</span>
                                                          </div>
                                                          
                                                          {/* Triangle */}
                                                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
                                                      </div>
                                                  )}
                                              </div>
                                          ))}
                                       </React.Fragment>
                                  ))}
                              </div>
                          </div>
                       </div>
                  </div>
                  <div className="w-full xl:w-48 flex flex-col justify-center space-y-8 border-t xl:border-t-0 xl:border-l border-gray-100 pt-6 xl:pt-0 xl:pl-8">
                      <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Today's Peak</span>
                          <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-gray-900">8:00 PM</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                              <ArrowUpRight size={10} /> 94% Full
                          </span>
                      </div>
                      <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">This Week</span>
                          <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-gray-900">482</span>
                              <span className="text-sm text-gray-500 font-medium">covers</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-2">
                              <ArrowUpRight size={10} className="rotate-90" /> 12% vs last wk
                          </span>
                      </div>
                      <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Busiest Day</span>
                          <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-gray-900">Friday</span>
                          </div>
                           <span className="text-xs text-gray-500 mt-1 block font-medium">
                              Avg. 98% capacity
                          </span>
                      </div>
                  </div>
              </div>
          </div>

          {/* Lead Time */}
          <div className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card flex flex-col relative`}>
               {isEditing && <div className="absolute top-2 right-2 text-gray-400"><GripVertical size={20}/></div>}
              <h3 className="font-bold text-gray-900 mb-1">Booking Lead Time</h3>
              <p className="text-sm text-gray-500 mb-6">When do guests book?</p>
              
              <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={LEAD_TIME_DATA} layout="vertical" margin={{ left: 0, right: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="range" type="category" width={70} tick={{fontSize: 11, fontWeight: 500, fill: '#64748b'}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32} animationDuration={1000}>
                            {
                                LEAD_TIME_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))
                            }
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-xl text-xs font-medium flex gap-3 border border-blue-100">
                  <Clock size={16} className="shrink-0 text-blue-600" />
                  <p>Most bookings happen <span className="font-bold">1-2 days prior</span>. Send marketing blasts on Wednesday for Friday tables.</p>
              </div>
          </div>
      </div>
  );

  const renderHealthMetrics = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Repeat Rate */}
          <div className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card hover:border-emerald-100 transition-colors group relative`}>
               {isEditing && <div className="absolute top-2 right-2 text-gray-400"><GripVertical size={20}/></div>}
              <div className="flex items-center gap-3 mb-4 text-gray-500">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Repeat Rate</span>
              </div>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">38.4%</p>
              <div className="flex items-center gap-2 mt-2 text-emerald-600 text-sm font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                  <TrendingUp size={14} />
                  <span>+4.2%</span>
              </div>
          </div>

          {/* AI Resolution */}
          <div className={`bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card hover:border-primary-100 transition-colors group relative`}>
               {isEditing && <div className="absolute top-2 right-2 text-gray-400"><GripVertical size={20}/></div>}
               <div className="flex items-center gap-3 mb-4 text-gray-500">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-lg group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">Auto-Resolve</span>
              </div>
              <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-gray-900 tracking-tight">94%</p>
                  <span className="text-sm text-gray-400 font-medium">of chats</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-5 overflow-hidden">
                  <div className="bg-primary-500 h-full rounded-full" style={{width: '94%'}}></div>
              </div>
          </div>

          {/* Sentiment */}
          <div className={`lg:col-span-2 bg-white p-6 rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card flex flex-col sm:flex-row items-center gap-8 relative`}>
               {isEditing && <div className="absolute top-2 right-2 text-gray-400"><GripVertical size={20}/></div>}
              <div className="h-32 w-32 shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={SENTIMENT_DATA}
                              innerRadius={40}
                              outerRadius={55}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                          >
                              {SENTIMENT_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-gray-900">72%</span>
                  </div>
              </div>
              <div className="flex-1 w-full">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    Guest Sentiment
                    <span className="text-xs font-normal text-gray-400 px-2 py-0.5 bg-gray-50 rounded-full">Last 7 Days</span>
                  </h4>
                  <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Positive</span>
                          <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '72%'}}></div></div>
                              <span className="font-bold text-gray-900 w-8 text-right">72%</span>
                          </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Neutral</span>
                           <div className="flex items-center gap-3">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-slate-400 rounded-full" style={{width: '24%'}}></div></div>
                              <span className="font-bold text-gray-900 w-8 text-right">24%</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const WIDGETS: Record<WidgetId, () => React.ReactNode> = {
    'revenue-opportunity': renderRevenueOpportunity,
    'occupancy-stats': renderOccupancyStats,
    'health-metrics': renderHealthMetrics
  };

  return (
    <div className={embedded ? "space-y-6" : "space-y-6 pb-12"}>
      
      {/* Header */}
      {!embedded && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kitchen Intel & Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Strategic insights to grow revenue and optimize operations.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                  Last 30 Days
              </span>
            </div>
        </div>
      )}

      {layoutOrder.map((widgetId, index) => (
        <div
          key={widgetId}
          draggable={isEditing}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={isEditing ? 'cursor-move' : ''}
        >
          {WIDGETS[widgetId]()}
        </div>
      ))}

    </div>
  );
};

export default Analytics;