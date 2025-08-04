import React, { useState, useEffect } from 'react';
import { Home, CreditCard, PieChart, Settings as SettingsIcon, History, LogOut, Menu, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from './useIsMobile';

export default function Sidebar({ setIsLoggedIn }) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Start open on desktop, closed on mobile
  
  const location = useLocation();
  const navigate = useNavigate();

  // Handle mobile vs desktop behavior
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false); // Start collapsed on mobile
    } else {
      setIsSidebarOpen(true); // Start expanded on desktop
    }
  }, [isMobile]);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/budget', icon: PieChart, label: 'Budget' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
    { path: '/history', icon: History, label: 'History' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (isSidebarOpen ? 256 : 0) : (isSidebarOpen ? 256 : 64),
          left: isMobile && !isSidebarOpen ? -256 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed md:relative z-40
          bg-white dark:bg-gray-800 shadow-lg
          flex flex-col p-4 min-h-screen overflow-hidden
        `}
      >
        {/* Logo */}
        <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} mb-6 p-2`}>
          <img src="/logo.svg" alt="Logo" className="w-10 h-10 rounded-full flex-shrink-0" />
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap"
            >
              Susu App
            </motion.span>
          )}
        </div>

        {/* Toggle Button - Always visible, below logo */}
        <div className={`flex ${isSidebarOpen ? 'justify-end' : 'justify-center'} mb-6`}>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
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
                  flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center'} 
                  py-3 rounded-xl transition-all duration-200 relative
                  ${isActive
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }
                `}
                title={!isSidebarOpen ? item.label : ''}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: 0.1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button (only visible when sidebar is closed on mobile) */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed z-30 top-4 left-4 p-3 rounded-lg bg-violet-600 text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}