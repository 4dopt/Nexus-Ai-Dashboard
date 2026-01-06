import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Order } from '../types';
import { Clock, ChefHat, CheckCircle2, Utensils } from 'lucide-react';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = (id: string, newStatus: Order['status']) => {
    dataService.updateOrderStatus(id, newStatus);
  };

  // Filter logic
  const displayedOrders = orders.filter(o => 
    activeTab === 'active' 
      ? ['pending', 'preparing', 'ready'].includes(o.status)
      : ['served', 'paid'].includes(o.status)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-500 text-white border-amber-600';
      case 'preparing': return 'bg-blue-500 text-white border-blue-600';
      case 'ready': return 'bg-emerald-500 text-white border-emerald-600';
      case 'served': return 'bg-gray-200 text-gray-600 border-gray-300';
      case 'paid': return 'bg-gray-100 text-gray-400 border-gray-200';
    }
  };

  const getElapsedTime = (createdAt: string) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    return `${diff}m`;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kitchen Display</h1>
           <p className="text-gray-500 text-sm mt-1">Live order tracking and management.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-lg self-start md:self-auto">
             <button 
                onClick={() => setActiveTab('active')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'active' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                Active Orders
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'active' ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'}`}>
                  {orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length}
                </span>
             </button>
             <button 
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'completed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                History
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {displayedOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow animate-in fade-in zoom-in-95 duration-200">
                  {/* Ticket Header */}
                  <div className={`p-4 border-b flex justify-between items-start ${
                      order.status === 'pending' ? 'bg-amber-50 border-amber-100' : 
                      order.status === 'preparing' ? 'bg-blue-50 border-blue-100' :
                      order.status === 'ready' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'
                  }`}>
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-lg font-black text-gray-900">#{order.tableId}</span>
                             <span className="text-xs text-gray-500 font-medium">Server: {order.serverName}</span>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400">{order.id}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusStyle(order.status)}`}>
                                {order.status}
                           </span>
                           {activeTab === 'active' && (
                             <div className={`flex items-center gap-1 text-xs font-bold ${
                                 parseInt(getElapsedTime(order.createdAt)) > 20 ? 'text-red-600 animate-pulse' : 'text-gray-500'
                             }`}>
                                  <Clock size={12} /> {getElapsedTime(order.createdAt)}
                             </div>
                           )}
                      </div>
                  </div>

                  {/* Items List */}
                  <div className="p-4 space-y-4">
                      {order.items.map(item => (
                          <div key={item.id} className="flex justify-between items-start gap-3">
                              <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                                      {item.quantity}x
                                  </div>
                                  <div>
                                      <p className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</p>
                                      {item.notes && (
                                          <p className="text-xs text-amber-600 italic mt-0.5 font-medium">{item.notes}</p>
                                      )}
                                  </div>
                              </div>
                              <span className="text-xs font-medium text-gray-400">£{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                      ))}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</span>
                          <span className="text-lg font-bold text-gray-900">£{order.total.toFixed(2)}</span>
                      </div>
                      
                      {order.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
                          >
                              <ChefHat size={16} /> Start Preparing
                          </button>
                      )}
                      {order.status === 'preparing' && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
                          >
                              <Utensils size={16} /> Mark Ready
                          </button>
                      )}
                      {order.status === 'ready' && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'served')}
                            className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
                          >
                              <CheckCircle2 size={16} /> Complete Order
                          </button>
                      )}
                      {(order.status === 'served' || order.status === 'paid') && (
                         <div className="w-full py-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Completed {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                      )}
                  </div>
              </div>
          ))}
          
          {/* Empty State */}
          {displayedOrders.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <ChefHat size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">No {activeTab} orders found.</p>
                  {activeTab === 'active' && <p className="text-xs text-gray-400 mt-1">Great job! The kitchen is clear.</p>}
              </div>
          )}
      </div>
    </div>
  );
};

export default Orders;