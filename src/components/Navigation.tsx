import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, LogOut, PlayCircle, Shield, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isHome = location.pathname === '/';

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-2xl font-bold text-white">HiveTrade</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
                  Profile
                </Link>
                <Link to="/trade" className="text-gray-300 hover:text-white transition">
                  Market
                </Link>
                <Link to="/simulation" className="text-gray-300 hover:text-white transition">
                  <PlayCircle className="h-4 w-4 inline mr-1" />
                  Simulation
                </Link>
                <Link to="/social" className="text-gray-300 hover:text-white transition">
                  Social
                </Link>
                <Link to="/leaderboard" className="text-gray-300 hover:text-white transition">
                  <Trophy className="h-4 w-4 inline mr-1" />
                  Leaderboard
                </Link>
                <Link to="/admin" className="text-gray-300 hover:text-white transition">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Admin
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              isHome ? (
                <>
                  <a href="#features" className="text-gray-300 hover:text-white transition">
                    Features
                  </a>
                  <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
                    How it Works
                  </a>
                  <Link
                    to="/signup"
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to="/"
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}