import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Trash2, Globe, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../Components/ProfileContext";

const Settings = ({ setIsLoggedIn }) => {
  const { profile, updateProfile } = useProfile();
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("GHS");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => updateProfile({ image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
      <motion.div
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="bg-violet-600 p-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-violet-200 text-sm">
            Manage your account and preferences
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          {/* ✅ Profile Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Profile
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-4 relative">
              <div className="relative">
                <img
                  src={profile.image}
                  alt="Profile"
                  onClick={() => setIsImagePreviewOpen(true)}
                  className="w-20 h-20 rounded-full border border-gray-300 dark:border-gray-600 object-cover cursor-pointer hover:opacity-80 transition"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-violet-600 p-1 rounded-full cursor-pointer hover:bg-violet-700 transition"
                >
                  <Plus size={14} color="#fff" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {profile.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {profile.email}
                </p>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="mt-2 text-violet-600 hover:underline"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </section>

          {/* ✅ Preferences */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Preferences
            </h2>
            <div className="space-y-4">
              {/* Currency */}
              <SettingItem
                icon={<DollarSign size={18} />}
                title="Currency"
                action={
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      localStorage.setItem("currency", e.target.value);
                    }}
                    className="bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-1 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500"
                  >
                    <option>GHS</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                }
              />
              {/* Language */}
              <SettingItem
                icon={<Globe size={18} />}
                title="Language"
                action={
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      localStorage.setItem("language", e.target.value);
                    }}
                    className="bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-1 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                }
              />
            </div>
          </section>

          {/* ✅ Account Actions */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Account
            </h2>
            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition"
            >
              <LogOut className="inline mr-2" /> Sign Out
            </button>
          </section>

          {/* ✅ Danger Zone */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Danger Zone
            </h2>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              <Trash2 className="inline mr-2" /> Delete Account
            </button>
          </section>
        </div>
      </motion.div>

      {/* ✅ Image Preview Modal */}
      <AnimatePresence>
        {isImagePreviewOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImagePreviewOpen(false)}
          >
            <motion.img
              src={profile.image}
              alt="Profile Large"
              className="w-64 h-64 rounded-full shadow-2xl border-4 border-white object-cover"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingItem = ({ icon, title, action }) => (
  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
    <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
      {icon}
      <span>{title}</span>
    </div>
    <div>{action}</div>
  </div>
);

export default Settings;
