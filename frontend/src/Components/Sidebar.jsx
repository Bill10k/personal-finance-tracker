import React, { useState, useEffect } from 'react';
import { Home, CreditCard, PieChart, Settings as SettingsIcon, History, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from './useIsMobile'; // ✅ Import custom hook

export default function Sidebar({ setIsLoggedIn }) {
  const isMobile = useIsMobile(); // ✅ Detect mobile
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Handle collapse state when switching between mobile & desktop
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true); // collapse on mobile
    } else {
      setIsOpen(true); // keep open on desktop
    }
  }, [isMobile]);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/budget', icon: PieChart, label: 'Budget' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
    { path: '/history', icon: History, label: 'History' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="fixed z-50 top-4 left-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Desktop Collapse Toggle */}
      {!isMobile && (
        <button
          className="absolute z-10 -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md border border-gray-200 dark:border-gray-600"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-40
          bg-white dark:bg-gray-800 shadow-lg
          flex flex-col p-4 ${isCollapsed ? 'w-16' : 'w-64'} 
          min-h-screen transition-all duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-8 p-2`}>
          <img src="/logo.svg" alt="Logo" className="w-10 h-10 rounded-full" />
          {!isCollapsed && (
            <span className="font-bold text-lg text-gray-900 dark:text-white">Susu App</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} 
                  py-3 rounded-xl transition relative
                  ${isActive
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }
                `}
                title={isCollapsed ? item.label : ''}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <button
          onClick={() => {
            setIsLoggedIn(false);
            navigate('/');
          }}
          className={`
            flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-4'} 
            py-3 rounded-xl transition mt-auto
            hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200
          `}
          title={isCollapsed ? "Sign Out" : ""}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
