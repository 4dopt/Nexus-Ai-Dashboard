import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Reservation } from '../types';
import { Search, Calendar, Filter, User, Clock, MoreHorizontal, Phone, CheckCircle2, Armchair, X, Plus, CalendarX, Loader2 } from 'lucide-react';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed' | 'seated' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // New Booking Form State
  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    partySize: 2,
    time: '19:00',
    notes: ''
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = dataService.subscribeToReservations((data) => {
        setReservations(data);
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    // UI updates optimistically via subscription, but we could add loading state per row if needed
    await dataService.updateReservationStatus(id, status);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate slight delay for "Processing" feel
    await dataService.addReservation({
        guestName: formData.guestName,
        phone: formData.phone,
        partySize: Number(formData.partySize),
        time: formData.time,
        notes: formData.notes
    });
    
    setIsSubmitting(false);
    setShowModal(false);
    // Reset form
    setFormData({ guestName: '', phone: '', partySize: 2, time: '19:00', notes: '' });
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'seated': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesFilter = activeFilter === 'all' || res.status === activeFilter;
    const matchesSearch = res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (res.notes && res.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
      return (
          <div className="flex h-96 items-center justify-center">
             <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reservations</h1>
           <p className="text-gray-500 text-sm mt-1">Manage bookings and guest allocations.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-primary-700 transition-colors flex items-center gap-2 active:scale-95"
        >
           <Plus size={18} /> New Booking
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             {['all', 'pending', 'confirmed', 'seated', 'cancelled'].map(status => (
                <button 
                    key={status}
                    onClick={() => setActiveFilter(status as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                        activeFilter === status 
                        ? 'bg-gray-900 text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    {status}
                </button>
             ))}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search guests..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                />
             </div>
             <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                <Filter size={18} />
             </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/50 text-xs uppercase font-semibold text-gray-400 tracking-wide border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-medium">Guest</th>
                        <th className="px-6 py-4 font-medium">Date & Time</th>
                        <th className="px-6 py-4 font-medium">Table</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Notes</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredReservations.map((res) => (
                        <tr key={res.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={res.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                    <div>
                                        <p className="font-bold text-gray-900">{res.guestName}</p>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                                            <span className="flex items-center gap-1"><User size={10} /> {res.partySize} ppl</span>
                                            {res.phone && <span className="hidden sm:inline">• {res.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900">{res.time}</span>
                                    <span className="text-xs text-gray-400">Today</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {res.table ? (
                                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                        {res.table}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(res.status)}`}>
                                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {res.notes ? (
                                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 font-medium inline-block max-w-[150px] truncate" title={res.notes}>
                                        {res.notes}
                                    </span>
                                ) : (
                                    <span className="text-gray-300">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {res.status !== 'cancelled' && res.status !== 'seated' && (
                                        <>
                                            {res.status === 'confirmed' ? (
                                                <button 
                                                    onClick={() => handleStatusUpdate(res.id, 'seated')}
                                                    title="Seat Guest" 
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Armchair size={18} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                                                    title="Confirm" 
                                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                                                title="Cancel" 
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <CalendarX size={18} />
                                            </button>
                                        </>
                                    )}
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredReservations.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                    <Search size={32} className="opacity-20" />
                                    <p>No reservations found matching your filters.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* New Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">New Reservation</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Guest Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    required
                                    type="text"
                                    value={formData.guestName}
                                    onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                                    placeholder="Jane Doe"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date & Time</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Party Size</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={formData.partySize}
                                        onChange={(e) => setFormData({...formData, partySize: Number(e.target.value)})}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="+1 555-0000"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Special Notes</label>
                            <textarea 
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                placeholder="Allergies, special occasion, etc."
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all h-24 resize-none"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={18} className="animate-spin" /> Processing...
                            </div>
                        ) : (
                            <>
                                <Calendar size={18} /> Confirm Booking
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;