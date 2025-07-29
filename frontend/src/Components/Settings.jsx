import { useState } from 'react';
import { Bell, Palette, Shield, Trash2, ChevronRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-finset-bg">
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header - Dark blue with white text */}
        <div className="bg-finset-primary p-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-black-100">Manage your account preferences</p>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          {/* General Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">General Settings</h2>
            <div className="space-y-3">
              <SettingItem 
                icon={<Bell size={18} className="text-finset-primary" />}
                title="Notifications"
                subtitle="Manage notification preferences"
                action={<ToggleSwitch enabled={notifications} onChange={setNotifications} />}
                accent
              />
              <SettingItem 
                icon={<Palette size={18} className="text-finset-primary" />}
                title="Appearance"
                subtitle="Customize look and feel"
                action={<ChevronRight size={18} className="text-gray-500" />}
              />
              <SettingItem 
                icon={<Shield size={18} className="text-finset-primary" />}
                title="Security"
                subtitle="Change password and security settings"
                action={<ChevronRight size={18} className="text-gray-500" />}
              />
            </div>
          </div>

          {/* Language Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Language & Region</h2>
            <SettingItem 
              icon={<Globe size={18} className="text-finset-primary" />}
              title="App Language"
              subtitle="Select your preferred language"
              action={
                <motion.select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  whileFocus={{ scale: 1.05 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-gray-800 focus:ring-2 focus:ring-finset-primary"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </motion.select>
              }
            />
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h2>
            <div className="border border-red-200 rounded-lg overflow-hidden">
              <SettingItem 
                icon={<Trash2 size={18} className="text-red-600" />}
                title="Delete Account"
                subtitle="Permanently remove your account and data"
                action={
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                  >
                    Delete
                  </motion.button>
                }
                danger
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// SettingItem with proper contrast
const SettingItem = ({ icon, title, subtitle, action, accent, danger }) => (
  <motion.div
    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg transition-all ${
      danger ? 'bg-red-50 hover:bg-red-100' : 
      accent ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 200 }}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-lg ${
        danger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-finset-primary'
      }`}>
        {icon}
      </div>
      <div>
        <p className={`font-medium ${
          danger ? 'text-red-800' : 'text-gray-800'
        }`}>{title}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center">{action}</div>
  </motion.div>
);

// ToggleSwitch
const ToggleSwitch = ({ enabled, onChange }) => (
  <motion.button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      enabled ? 'bg-finset-primary' : 'bg-gray-300'
    }`}
    whileTap={{ scale: 0.9 }}
  >
    <motion.span
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`inline-block h-4 w-4 transform rounded-full bg-white ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </motion.button>
);

export default Settings;