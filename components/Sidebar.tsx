import React from 'react';
import { NAV_ITEMS } from '../constants';
import { NavigationItem } from '../types';
import { ChefHat, Command, Settings, Shield, HelpCircle, LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationItem;
  onNavigate: (tab: NavigationItem) => void;
  alertActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, alertActive }) => {
  
  // Group 1: Operations
  const MAIN_MENU_IDS = ['dashboard', 'reservations', 'orders'];
  // Group 2: Management/Tools
  const MANAGEMENT_IDS = ['knowledge', 'analytics', 'growth'];

  const getNavItem = (id: string) => NAV_ITEMS.find(item => item.id === id);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-gray-200 h-screen sticky top-0 z-40">
      {/* Logo Section */}
      <div className="h-16 shrink-0 flex items-center px-6 border-b border-gray-100 bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-primary-600 group cursor-pointer">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
            <Command size={18} strokeWidth={3} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-gray-900 block leading-tight">RestoAI</span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Command Center</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
        {/* MAIN MENU */}
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Main Menu</h3>
          <div className="space-y-0.5">
            {MAIN_MENU_IDS.map(id => {
              const item = getNavItem(id);
              if (!item) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as NavigationItem)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    currentTab === item.id
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon 
                    size={18} 
                    className={`transition-colors duration-200 ${currentTab === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* MANAGEMENT */}
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Management</h3>
          <div className="space-y-0.5">
            {MANAGEMENT_IDS.map(id => {
              const item = getNavItem(id);
              if (!item) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as NavigationItem)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    currentTab === item.id
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon 
                    size={18} 
                    className={`transition-colors duration-200 ${currentTab === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} 
                  />
                  {item.label}
                </button>
              );
            })}
             <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed opacity-60">
                <Settings size={18} />
                <span className="flex-1">Automation</span>
                <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 font-bold tracking-wide">SOON</span>
             </div>
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">System</h3>
          <div className="space-y-0.5">
            <button 
              onClick={() => onNavigate('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                currentTab === 'settings'
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings size={18} className={`transition-colors duration-200 ${currentTab === 'settings' ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              Settings
            </button>
            <button 
              onClick={() => onNavigate('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                currentTab === 'security'
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Shield size={18} className={`transition-colors duration-200 ${currentTab === 'security' ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              Security
            </button>
            <button 
              onClick={() => onNavigate('help')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                currentTab === 'help'
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <HelpCircle size={18} className={`transition-colors duration-200 ${currentTab === 'help' ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              Help & Support
            </button>
          </div>
        </div>
      </div>

      {/* User / Alert Section */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-3">
        {/* Alert Status */}
        {alertActive && (
             <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 shadow-sm">
                <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-red-700">Action Required</p>
                    <p className="text-[10px] text-red-600 truncate">Customer waiting...</p>
                </div>
             </div>
        )}
        
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm overflow-hidden">
                <ChefHat size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Resto Team</p>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-[11px] text-gray-500 truncate">Pro Plan Active</p>
                </div>
            </div>
            <div className="text-gray-300 group-hover:text-gray-500 transition-colors">
                <LogOut size={16} />
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;