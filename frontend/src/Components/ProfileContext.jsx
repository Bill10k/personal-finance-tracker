import React, { createContext, useContext, useState, useEffect } from "react";
import defaultProfilePic from "../assets/user-pfp.JPG";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("profileName") || "John Doe",
    email: localStorage.getItem("profileEmail") || "johndoe@email.com",
    image: localStorage.getItem("profileImage") || defaultProfilePic,
  });

  // ✅ Persist to localStorage
  useEffect(() => {
    localStorage.setItem("profileName", profile.name);
    localStorage.setItem("profileEmail", profile.email);
    
    // Only store custom images in localStorage, not the default
    if (profile.image !== defaultProfilePic) {
      localStorage.setItem("profileImage", profile.image);
    } else {
      // Remove custom image from localStorage when using default
      localStorage.removeItem("profileImage");
    }
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);