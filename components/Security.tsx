import React from 'react';
import { Shield, Key, Smartphone, History, LogOut, Lock, AlertTriangle } from 'lucide-react';

const Security: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security & Access</h1>
            <p className="text-gray-500 text-sm">Protect your restaurant data and manage staff access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Password Change */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Key size={18} className="text-primary-600" /> Change Password
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                    </div>
                    <button className="w-full py-2 bg-white border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm shadow-sm">
                        Update Password
                    </button>
                </div>
            </div>

            {/* 2FA */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <Shield size={18} className="text-emerald-500" /> Two-Factor Authentication
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-[250px]">Secure your account by requiring a code from your phone when logging in.</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                             <input type="checkbox" defaultChecked className="sr-only peer" />
                             <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-emerald-900">2FA is Active</p>
                            <p className="text-xs text-emerald-700">Code sent to •••• 8829</p>
                        </div>
                    </div>
                </div>

                {/* Audit Log Warning */}
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                    <div className="flex gap-3">
                        <AlertTriangle size={20} className="text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-900">Sensitive Action</p>
                            <p className="text-xs text-amber-700 mt-1">Exporting the full guest database requires Manager approval. This action will be logged.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-card">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History size={18} className="text-primary-600" /> Active Sessions
                </h3>
                <div className="space-y-2">
                    {/* Current Session */}
                    <div className="flex items-center justify-between p-3 bg-primary-50/50 rounded-xl border border-primary-100">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white rounded-lg text-primary-600 border border-primary-100">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-900">Chrome on iPhone 13</p>
                                    <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-bold uppercase">Current</span>
                                </div>
                                <p className="text-xs text-gray-500">London, UK • 10.231.55.12</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
                        </span>
                    </div>

                    {/* Other Session */}
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                                <Lock size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Safari on iPad Pro (Host Stand)</p>
                                <p className="text-xs text-gray-500">London, UK • Last active 5m ago</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-red-600 hover:text-red-700 border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            <LogOut size={12} /> Revoke
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Security;