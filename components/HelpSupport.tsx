import React from 'react';
import { Search, MessageCircle, FileText, Phone, ExternalLink, Zap, LifeBuoy, CreditCard } from 'lucide-react';

const HelpSupport: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
        <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">How can we help you?</h1>
            <p className="text-gray-500 mt-2">Search our knowledge base or get in touch with our team.</p>
            
            <div className="max-w-xl mx-auto mt-6 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search articles (e.g., 'How to update menu', 'Billing')" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Getting Started</h3>
                <p className="text-sm text-gray-500 mb-4">Learn how to train your AI, upload menus, and manage reservations efficiently.</p>
                <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Tutorials <ExternalLink size={14} />
                </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Billing & Plan</h3>
                <p className="text-sm text-gray-500 mb-4">Manage your subscription, view invoices, or update payment methods.</p>
                <span className="text-sm font-bold text-purple-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Manage Billing <ExternalLink size={14} />
                </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LifeBuoy size={24} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Troubleshooting</h3>
                <p className="text-sm text-gray-500 mb-4">Facing issues with the AI? Find solutions to common problems here.</p>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Fix Issues <ExternalLink size={14} />
                </span>
            </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
             {/* Background decorative elements */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20"></div>
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20"></div>

             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="max-w-lg">
                     <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
                     <p className="text-gray-300 mb-6">Our support team is available 24/7 for critical restaurant issues. We typically respond within 15 minutes.</p>
                     
                     <div className="flex gap-4">
                         <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors">
                             <MessageCircle size={18} /> Chat with Us
                         </button>
                         <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors backdrop-blur-sm">
                             <Phone size={18} /> Emergency Line
                         </button>
                     </div>
                 </div>
                 
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md min-w-[280px]">
                     <div className="flex items-center gap-3 mb-4">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-sm font-medium text-gray-300">System Status</span>
                     </div>
                     <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-400">RestoAI Core</span>
                             <span className="text-emerald-400 font-bold">Operational</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-400">WhatsApp API</span>
                             <span className="text-emerald-400 font-bold">Operational</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-400">Booking Engine</span>
                             <span className="text-emerald-400 font-bold">Operational</span>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
  )
}

export default HelpSupport;