import React from "react";
import { useProfile } from "../Components/ProfileContext";
import { Link } from "react-router-dom";



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
        <Link to="/settings">
  <img
    src={profile.image}
    alt="Profile"
    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 object-cover cursor-pointer
      transition-transform duration-200 ease-in-out hover:scale-105 hover:ring-2 hover:ring-violet-500"
  />
</Link>
      </div>
    </header>
  );
}
