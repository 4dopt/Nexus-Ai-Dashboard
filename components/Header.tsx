import React from 'react';
import { Search, Bell, Gift } from 'lucide-react';

interface HeaderProps {
  onSearchClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  return (
    <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
            </div>
            <input 
                type="text" 
                readOnly
                onClick={onSearchClick}
                placeholder="Search" 
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 focus:border-gray-200 sm:text-sm transition-colors cursor-text"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xs font-mono border border-gray-200 bg-white px-1.5 py-0.5 rounded shadow-sm">Ctrl F</span>
            </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Gift size={20} />
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/4 -translate-y-1/4"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
            <img 
                src="https://picsum.photos/seed/manager/40/40" 
                alt="Profile" 
                className="h-9 w-9 rounded-full border border-gray-200"
            />
            <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">James Martin</p>
                <p className="text-xs text-gray-500">Manager</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;