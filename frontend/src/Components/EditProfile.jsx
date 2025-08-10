import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../Components/ProfileContext";
import defaultProfilePic from "../assets/user-pfp.JPG";

const EditProfile = () => {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    navigate("/settings");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <button
        onClick={() => navigate("/settings")}
        className="mb-4 text-violet-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
  src={profile.image || defaultProfilePic}
  alt="Profile"
  className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600 object-cover mb-4"
/>

          <div className="flex gap-2">
            <label
              htmlFor="profile-upload"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-violet-700"
            >
              Change Picture
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => updateProfile({ image: reader.result });
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => updateProfile({ image: defaultProfilePic })}
              className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Remove Picture
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
