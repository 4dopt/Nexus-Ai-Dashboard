import React, { useState } from 'react';
import { Bell, User, Store, Smartphone, Mail, Globe, Clock, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    vipArrival: true,
    badReview: true
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your restaurant profile and notification preferences.</p>
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <Save size={16} /> Save Changes
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Navigation/Profile Summary */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden relative group cursor-pointer">
                            <img src="https://picsum.photos/seed/restaurant/200/200" alt="Restaurant Logo" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">Change</span>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">La Trattoria</h2>
                        <p className="text-sm text-gray-500">Premium Italian • London, UK</p>
                        <div className="mt-4 flex gap-2">
                             <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded border border-emerald-100">Verified</span>
                             <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded border border-primary-100">Pro Plan</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                    <div className="p-4 border-b border-gray-100 font-bold text-gray-900 text-sm">Quick Links</div>
                    <div className="divide-y divide-gray-50">
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between group">
                            Business Hours <Clock size={16} className="text-gray-400 group-hover:text-primary-600" />
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-between group">
                            Integrations <Globe size={16} className="text-gray-400 group-hover:text-primary-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* General Info */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Store size={18} className="text-primary-600" /> Restaurant Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Restaurant Name</label>
                            <input type="text" defaultValue="La Trattoria" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Manager Name</label>
                            <input type="text" defaultValue="James Martin" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Public Email (for reservations)</label>
                            <input type="email" defaultValue="bookings@latrattoria.com" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-primary-600" /> Notification Preferences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm"><Mail size={18} /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Email Digests</p>
                                    <p className="text-xs text-gray-500">Daily summary of performance</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg text-gray-500 shadow-sm"><Smartphone size={18} /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">SMS Alerts (Urgent)</p>
                                    <p className="text-xs text-gray-500">Only for emergencies or VIPs</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                        
                        <div className="h-px bg-gray-100 my-2"></div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Notify me when:</p>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifications.vipArrival ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300'}`}>
                                        {notifications.vipArrival && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={notifications.vipArrival} onChange={() => setNotifications({...notifications, vipArrival: !notifications.vipArrival})} />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">A VIP guest makes a reservation</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifications.badReview ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-300'}`}>
                                        {notifications.badReview && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={notifications.badReview} onChange={() => setNotifications({...notifications, badReview: !notifications.badReview})} />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">AI detects negative sentiment in chat</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Settings;