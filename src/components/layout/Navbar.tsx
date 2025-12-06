import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, User, Menu, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface NavbarProps {
  user: { id: string; email: string; name?: string } | null;
  onLogout?: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
              onClick={closeMobileMenu}
            >
              Research Gennie
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${
                isActivePath('/') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${
                isActivePath('/history') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              History
            </Link>
            <Link
              to="/about"
              className={`text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${
                isActivePath('/about') ? 'font-semibold text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              About
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
              )}
            </button>

            {/* User Account or Login - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <button
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`User account: ${user.name || user.email}`}
                  >
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.name || user.email}
                    </span>
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Logout from your account"
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Login to your account"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-gray-200 dark:border-gray-700 mt-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all ${
                isActivePath('/') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/history"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all ${
                isActivePath('/history') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              History
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all ${
                isActivePath('/about') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              About
            </Link>

            {/* Mobile User Section */}
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <>
                  <div className="px-4 py-3 flex items-center space-x-2 text-gray-700 dark:text-gray-300" role="status" aria-label={`Logged in as ${user.name || user.email}`}>
                    <User className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm font-medium">
                      {user.name || user.email}
                    </span>
                  </div>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        closeMobileMenu();
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Logout from your account"
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
