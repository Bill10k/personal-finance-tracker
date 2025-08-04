import React from "react";
import { useProfile } from "../Components/ProfileContext";

export default function Header() {
  const { profile } = useProfile();

  return (
    <header className="flex items-center mb-8">
      <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
        Personal Finance Tracker
      </h1>
      <div className="flex items-center space-x-4 ml-auto">
        <span className="text-gray-700 dark:text-gray-200">
          Welcome, <span className="font-semibold text-gray-800 dark:text-white">
            {profile.name.split(" ")[0]}
          </span>
        </span>
        <img
          src={profile.image}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
        />
      </div>
    </header>
  );
}
