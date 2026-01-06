import React, { useEffect, useState, useRef } from 'react';
import { dataService } from '../services/dataService';
import { CrmEntry } from '../types';
import { Phone, Ban, Send, Calendar, Star, Search, Filter, X, MessageSquare, PhoneCall, History, MapPin, ChefHat, GripVertical, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface CrmProps {
  embedded?: boolean;
  isEditing?: boolean;
}

type WidgetId = 'campaigns' | 'database';

const DEFAULT_ORDER: WidgetId[] = ['campaigns', 'database'];

const CRM: React.FC<CrmProps> = ({ embedded = false, isEditing = false }) => {
  const [customers, setCustomers] = useState<CrmEntry[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CrmEntry | null>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'Regular' | 'New' | 'No-Show' | 'VIP'>('all');
  const [dateRange, setDateRange] = useState<'all' | '30' | '90' | '180' | '365'>('all');
  const [minVisits, setMinVisits] = useState<string>(''); // string to handle empty input easily
  const [showFilters, setShowFilters] = useState(false);

  const [layoutOrder, setLayoutOrder] = useState<WidgetId[]>(() => {
    try {
      const saved = localStorage.getItem('restoai_crm_layout');
      return saved ? JSON.parse(saved) : DEFAULT_ORDER;
    } catch {
      return DEFAULT_ORDER;
    }
  });

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    dataService.getCrmData().then(setCustomers);
  }, []);

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
      localStorage.setItem('restoai_crm_layout', JSON.stringify(copyListItems));
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleBlock = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the modal when clicking the block button
    await dataService.toggleBlockUser(id);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, blocked: !c.blocked } : c));
    
    // Update selected customer if open
    if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer(prev => prev ? { ...prev, blocked: !prev.blocked } : null);
    }
  };

  const clearFilters = () => {
    setFilterTag('all');
    setDateRange('all');
    setMinVisits('');
    setSearchQuery('');
  };

  const filteredCustomers = customers.filter(c => {
      // 1. Text Search
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.phone.includes(searchQuery);

      // 2. Tag Filter
      const matchesTag = filterTag === 'all' || c.tags.includes(filterTag);

      // 3. Date Range Filter
      let matchesDate = true;
      if (dateRange !== 'all') {
          const days = parseInt(dateRange);
          const visitDate = new Date(c.lastVisit);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - visitDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          matchesDate = diffDays <= days;
      }

      // 4. Min Visits Filter
      let matchesVisits = true;
      if (minVisits !== '') {
          matchesVisits = c.totalVisits >= parseInt(minVisits);
      }

      return matchesSearch && matchesTag && matchesDate && matchesVisits;
  });

  const activeFilterCount = (filterTag !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0) + (minVisits !== '' ? 1 : 0);

  const renderCampaigns = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {isEditing && <div className="absolute top-2 right-2 z-20 text-white/50 bg-black/10 rounded p-1"><GripVertical size={20}/></div>}
        <div className={`group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 relative overflow-hidden text-white shadow-card hover:shadow-lg transition-all ${isEditing && 'border-2 border-dashed border-white/50'}`}>
            <span className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 z-20 shadow-sm tracking-wider">COMING SOON</span>
            <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Calendar size={120} />
            </div>
            <div className="relative z-10">
                <div className="bg-white/20 w-fit p-2 rounded-lg mb-4 backdrop-blur-sm">
                    <Calendar size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">Slow Tuesday Deal</h3>
                <p className="text-emerald-50 text-sm mb-6 max-w-xs leading-relaxed">Boost occupancy by targeting guests who previously visited on weekdays with a 20% off offer.</p>
                <button disabled className="bg-white/90 text-teal-900/60 cursor-not-allowed px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                    <Send size={16} /> Launch Campaign
                </button>
            </div>
        </div>
        
        <div className={`group bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-6 relative overflow-hidden text-white shadow-card hover:shadow-lg transition-all ${isEditing && 'border-2 border-dashed border-white/50'}`}>
            <span className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 z-20 shadow-sm tracking-wider">COMING SOON</span>
            <div className="absolute top-0 right-0 p-8 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Star size={120} />
            </div>
            <div className="relative z-10">
                <div className="bg-white/20 w-fit p-2 rounded-lg mb-4 backdrop-blur-sm">
                    <Star size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">Birthday Follow-up</h3>
                <p className="text-purple-100 text-sm mb-6 max-w-xs leading-relaxed">Automatically send a "Free Dessert" voucher to guests who mentioned a birthday in chat.</p>
                <button disabled className="bg-white/90 text-purple-900/60 cursor-not-allowed px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                    <Send size={16} /> Activate Automation
                </button>
            </div>
        </div>
      </div>
  );

  const renderDatabase = () => (
      <div className={`bg-white rounded-2xl border ${isEditing ? 'border-primary-300 border-dashed' : 'border-gray-100'} shadow-card overflow-hidden relative`}>
        {isEditing && <div className="absolute top-2 right-2 z-10 text-gray-400 p-2"><GripVertical size={20}/></div>}
        
        {/* Table Header Controls */}
        <div className="p-5 border-b border-gray-100 flex flex-col space-y-4 bg-gray-50/50">
            {/* Top Row: Search & Filter Toggle */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search guests by name or phone..." 
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border ${
                            showFilters || activeFilterCount > 0
                            ? 'bg-white border-primary-200 text-primary-700 shadow-sm' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-primary-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    {activeFilterCount > 0 && (
                        <button 
                            onClick={clearFilters}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">User Segment</label>
                        <div className="relative">
                            <select 
                                value={filterTag}
                                onChange={(e) => setFilterTag(e.target.value as any)}
                                className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-primary-500"
                            >
                                <option value="all">All Segments</option>
                                <option value="Regular">Regulars</option>
                                <option value="New">New Guests</option>
                                <option value="VIP">VIPs</option>
                                <option value="No-Show">No-Shows</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Last Visit</label>
                        <div className="relative">
                            <select 
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value as any)}
                                className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-primary-500"
                            >
                                <option value="all">Any Time</option>
                                <option value="30">Last 30 Days</option>
                                <option value="90">Last 3 Months</option>
                                <option value="180">Last 6 Months</option>
                                <option value="365">Last Year</option>
                            </select>
                            <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Min. Visits</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                min="0"
                                placeholder="e.g. 5"
                                value={minVisits}
                                onChange={(e) => setMinVisits(e.target.value)}
                                className="w-full pl-3 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">VISITS</div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* List Items */}
        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                    <div 
                        key={customer.id} 
                        onClick={() => setSelectedCustomer(customer)}
                        className={`group p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-all duration-200 cursor-pointer ${customer.blocked ? 'bg-gray-50/50' : ''}`}
                    >
                        <div className="flex items-center gap-4 mb-3 md:mb-0 w-full md:w-1/3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-gray-500 shadow-sm transition-transform group-hover:scale-110 ${customer.blocked ? 'bg-red-50 border-red-100 text-red-400' : 'bg-white border-gray-100'}`}>
                                {customer.blocked ? <Ban size={18} /> : <span className="font-bold text-sm">{customer.name.charAt(0)}</span>}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-bold text-sm ${customer.blocked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{customer.name}</h4>
                                    {customer.blocked && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Blocked</span>}
                                </div>
                                <p className="text-gray-400 text-xs font-mono mt-0.5 flex items-center gap-1">
                                    <Phone size={10} /> {customer.phone}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-1/3">
                            {customer.tags.map(tag => (
                                <span key={tag} className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                                    tag === 'Regular' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    tag === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    tag === 'No-Show' ? 'bg-red-50 text-red-600 border-red-100' :
                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-6 w-full md:w-1/3 mt-4 md:mt-0">
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Visits</p>
                                <p className="text-sm font-bold text-gray-900">{customer.totalVisits}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Last Seen</p>
                                <p className="text-sm font-bold text-gray-900">{customer.lastVisit}</p>
                            </div>
                            
                            <div className="w-px h-8 bg-gray-100 mx-2"></div>

                            <button 
                                onClick={(e) => handleBlock(e, customer.id)}
                                title={customer.blocked ? "Unblock User" : "Block User"}
                                className={`p-2 rounded-lg transition-colors z-10 relative ${
                                    customer.blocked 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                                }`}
                            >
                                <Ban size={18} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                    <Filter size={48} className="mb-4 opacity-10" />
                    <p className="text-sm font-medium">No customers found matching filters.</p>
                    <button onClick={clearFilters} className="mt-2 text-xs text-primary-600 font-bold hover:underline">
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
      </div>
  );

  const WIDGETS: Record<WidgetId, () => React.ReactNode> = {
      'campaigns': renderCampaigns,
      'database': renderDatabase
  };

  return (
    <div className={embedded ? "space-y-6" : "space-y-6 pb-12"}>
      {!embedded && (
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Growth Engine</h1>
              <p className="text-gray-500 text-sm mt-1">Turn past guests into loyal regulars.</p>
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

      {/* Floating User Profile Card */}
      {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div 
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Card Header */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
                      <button 
                          onClick={() => setSelectedCustomer(null)}
                          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                      >
                          <X size={20} />
                      </button>

                      <div className="flex flex-col items-center">
                          <div className={`w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center text-3xl font-bold shadow-xl mb-4 ${
                              selectedCustomer.blocked ? 'bg-red-500 text-white' : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                          }`}>
                              {selectedCustomer.blocked ? <Ban size={40} /> : selectedCustomer.name.charAt(0)}
                          </div>
                          <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                          <div className="flex items-center gap-2 mt-1 text-white/60 text-sm font-medium">
                              <Phone size={14} /> {selectedCustomer.phone}
                          </div>
                          <div className="flex gap-2 mt-4">
                              {selectedCustomer.tags.map(tag => (
                                  <span key={tag} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                      <div className="p-4 text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Visits</p>
                          <p className="text-xl font-black text-gray-900">{selectedCustomer.totalVisits}</p>
                      </div>
                      <div className="p-4 text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Avg Spend</p>
                          <p className="text-xl font-black text-gray-900">£45</p>
                      </div>
                      <div className="p-4 text-center">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Last Seen</p>
                          <p className="text-sm font-black text-gray-900 mt-1">{selectedCustomer.lastVisit}</p>
                      </div>
                  </div>

                  {/* Details List */}
                  <div className="p-6 space-y-4">
                      <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm">
                              <History size={18} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">Last Order</p>
                              <p className="text-xs text-gray-500 mt-0.5">Truffle Pasta, Red Wine (Glass)</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm">
                              <MapPin size={18} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">Preferred Table</p>
                              <p className="text-xs text-gray-500 mt-0.5">Table 4 (Window Seat)</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                          <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm">
                              <ChefHat size={18} />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">Dietary Preferences</p>
                              <p className="text-xs text-gray-500 mt-0.5">No specific restrictions noted.</p>
                          </div>
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20">
                          <MessageSquare size={16} /> Send Offer
                      </button>
                      <button 
                          onClick={(e) => handleBlock(e, selectedCustomer.id)}
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors border ${
                              selectedCustomer.blocked 
                              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                          {selectedCustomer.blocked ? (
                              <> <Ban size={16} /> Unblock User </>
                          ) : (
                              <> <Ban size={16} /> Block User </>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CRM;