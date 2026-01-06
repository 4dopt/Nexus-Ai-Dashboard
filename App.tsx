import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reservations from './components/Reservations';
import Orders from './components/Orders';
import KnowledgeBase from './components/KnowledgeBase';
import Analytics from './components/Analytics';
import CRM from './components/CRM';
import Settings from './components/Settings';
import Security from './components/Security';
import HelpSupport from './components/HelpSupport';
import { NavigationItem } from './types';
import { Menu, X, Search, Command, ArrowRight, User, FileText, Settings as SettingsIcon, Calendar, UtensilsCrossed, File, LayoutDashboard } from 'lucide-react';
import { dataService, SearchResult } from './services/dataService';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationItem>('dashboard');
  const [alertActive, setAlertActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [session, setSession] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auth Check
  useEffect(() => {
    dataService.getSession().then(({ session }) => {
        setSession(session);
    });
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Search with Ctrl+F or Cmd+F or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'k')) {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      // Close with Escape
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search opens & Handle live search
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!searchOpen) {
        setSearchQuery('');
        setSearchResults([]);
    }
  }, [searchOpen]);

  // Debounced Search Effect
  useEffect(() => {
      const timer = setTimeout(async () => {
          if (searchQuery.trim()) {
            const results = await dataService.searchGlobal(searchQuery);
            setSearchResults(results);
          } else {
            setSearchResults([]);
          }
      }, 150); // 150ms debounce
      return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchResultClick = (tab: string) => {
      setCurrentTab(tab as NavigationItem);
      setSearchOpen(false);
  };

  const getIconForType = (type: SearchResult['type']) => {
      switch(type) {
          case 'Page': return LayoutDashboard;
          case 'Reservation': return Calendar;
          case 'Order': return UtensilsCrossed;
          case 'Guest': return User;
          case 'File': return FileText;
          default: return Command;
      }
  };

  // Render content based on current tab
  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onAlertTrigger={setAlertActive} />;
      case 'reservations':
        return <Reservations />;
      case 'orders':
        return <Orders />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'analytics':
        return <Analytics />;
      case 'growth':
        return <CRM />;
      case 'settings':
        return <Settings />;
      case 'security':
        return <Security />;
      case 'help':
        return <HelpSupport />;
      default:
        return <Dashboard onAlertTrigger={setAlertActive} />;
    }
  };

  if (!session) {
      // Simple Login Fallback
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
      );
  }

  return (
    <div className={`flex h-screen bg-background text-gray-900 overflow-hidden font-sans`}>
      
      {/* Sidebar (Desktop) */}
      <Sidebar 
        currentTab={currentTab} 
        onNavigate={setCurrentTab} 
        alertActive={alertActive} 
      />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-200 flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                    <span className="font-bold text-lg text-primary-600">RestoAI</span>
                    <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 mt-2">Menu</p>
                     {['dashboard', 'reservations', 'orders', 'knowledge', 'analytics', 'growth'].map((item) => (
                        <button 
                            key={item}
                            onClick={() => {
                                setCurrentTab(item as NavigationItem);
                                setMobileMenuOpen(false);
                            }}
                            className={`p-3 text-left rounded-lg capitalize font-medium ${currentTab === item ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        >
                            {item}
                        </button>
                     ))}
                     
                     <div className="h-px bg-gray-100 my-2"></div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System</p>
                     
                     {['settings', 'security', 'help'].map((item) => (
                        <button 
                            key={item}
                            onClick={() => {
                                setCurrentTab(item as NavigationItem);
                                setMobileMenuOpen(false);
                            }}
                            className={`p-3 text-left rounded-lg capitalize font-medium ${currentTab === item ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                        >
                            {item === 'help' ? 'Help & Support' : item}
                        </button>
                     ))}
                </div>
            </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
           <button onClick={() => setMobileMenuOpen(true)} className="text-gray-500">
               <Menu size={24} />
           </button>
           <span className="font-bold text-gray-900">RestoAI</span>
           {alertActive ? <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div> : <div className="w-3"></div>}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
            <Header onSearchClick={() => setSearchOpen(true)} />
        </div>

        {/* Alert Banner */}
        {alertActive && (
             <div className="bg-red-600 text-white px-6 py-2 flex items-center justify-between shadow-sm animate-in slide-in-from-top">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="animate-pulse">●</span>
                    ATTENTION: Angry Customer detected on Line 2. Immediate intervention required.
                </div>
                <button 
                    onClick={() => setAlertActive(false)} 
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
                >
                    Dismiss
                </button>
            </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
             <div className="max-w-7xl mx-auto h-full pb-10">
                {renderContent()}
             </div>
        </main>
      </div>

      {/* GLOBAL SEARCH MODAL (Floating) */}
      {searchOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
              {/* Backdrop */}
              <div 
                  className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                  onClick={() => setSearchOpen(false)}
              ></div>

              {/* Modal */}
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200 flex flex-col max-h-[60vh]">
                  
                  {/* Search Input Area */}
                  <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                      <Search size={24} className="text-primary-500" />
                      <input 
                          ref={searchInputRef}
                          type="text" 
                          placeholder="Search reservations, orders, guests, or commands..." 
                          className="flex-1 text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">ESC</span>
                      </div>
                  </div>

                  {/* Results List */}
                  <div className="overflow-y-auto p-2">
                      {searchResults.length > 0 ? (
                          <>
                              <h4 className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                  Top Results
                              </h4>
                              {searchResults.map((result) => {
                                  const Icon = getIconForType(result.type);
                                  return (
                                      <button
                                          key={result.id}
                                          onClick={() => handleSearchResultClick(result.route)}
                                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group transition-colors text-left"
                                      >
                                          <div className="flex items-center gap-4">
                                              <div className={`p-2 rounded-lg ${
                                                  result.type === 'Guest' ? 'bg-purple-50 text-purple-600' :
                                                  result.type === 'Reservation' ? 'bg-emerald-50 text-emerald-600' :
                                                  result.type === 'Order' ? 'bg-amber-50 text-amber-600' :
                                                  'bg-gray-100 text-gray-500'
                                              }`}>
                                                  <Icon size={18} />
                                              </div>
                                              <div>
                                                  <div className="flex items-center gap-2">
                                                      <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                                                          {result.title}
                                                      </p>
                                                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded border border-gray-200">{result.type}</span>
                                                  </div>
                                                  <p className="text-xs text-gray-500 capitalize">{result.subtitle}</p>
                                              </div>
                                          </div>
                                          <ArrowRight size={16} className="text-gray-300 group-hover:text-primary-500 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                      </button>
                                  );
                              })}
                          </>
                      ) : searchQuery.length > 0 ? (
                          <div className="py-12 text-center text-gray-400">
                              <Search size={48} className="mx-auto mb-4 opacity-20" />
                              <p className="text-sm">No results found for "{searchQuery}"</p>
                          </div>
                      ) : (
                          <div className="py-12 text-center text-gray-300">
                               <Command size={48} className="mx-auto mb-4 opacity-10" />
                               <p className="text-sm font-medium">Type to search across the entire dashboard</p>
                          </div>
                      )}
                  </div>
                  
                  {/* Footer */}
                  <div className="bg-gray-50 p-3 text-xs text-gray-400 flex justify-between items-center border-t border-gray-100">
                      <span>Pro Tip: Use <span className="font-bold font-mono">Cmd + K</span> to open anytime</span>
                      <div className="flex gap-4">
                          <span><span className="font-bold">Supabase</span> Connected</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;