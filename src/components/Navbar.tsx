import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../server/db.ts';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'faq', label: 'FAQ' },
    { id: 'plans', label: 'Plan' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo matching exact branding in screenshots */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-9 h-9">
                  <defs>
                    <linearGradient id="qGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7a7082" />
                      <stop offset="100%" stopColor="#431c53" />
                    </linearGradient>
                  </defs>
                  {/* Stylized geometric Q logo */}
                  <rect x="20" y="20" width="60" height="60" rx="14" fill="none" stroke="url(#qGrad)" strokeWidth="12" />
                  <path d="M55 55 L82 82" stroke="url(#qGrad)" strokeWidth="13" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[#3a204d] tracking-wider text-xl leading-none">
                  QUANTUM PLUS
                </span>
                <span className="text-[8px] font-semibold tracking-[0.2em] text-slate-500 uppercase leading-tight mt-0.5">
                  INDUSTRIAL PARTNERSHIP
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id === 'services' ? 'home' : link.id)}
                className={`text-sm font-medium transition cursor-pointer ${
                  currentView === (link.id === 'services' ? 'home' : link.id)
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                {/* Admin Console shortcut - only visible to admin users */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-3.5 py-2 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Console</span>
                  </button>
                )}

                {/* Portal Button - only visible when authenticated */}
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Portal</span>
                </button>

                {/* User Name Badge */}
                <div className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{user.displayName || user.username}</span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Exact Sign Up & Login Buttons from screenshots (unauthenticated) */}
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-5 py-2 rounded-md bg-[#484848] hover:bg-[#333333] text-white text-sm font-semibold transition cursor-pointer shadow-xs"
                >
                  Sign Up
                </button>

                <button
                  onClick={() => setCurrentView('login')}
                  className="px-5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-sm font-semibold transition cursor-pointer shadow-xs"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id === 'services' ? 'home' : link.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Console</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-md bg-blue-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Portal</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentView('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-md bg-[#484848] text-white text-xs font-bold text-center"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-md border border-slate-300 text-slate-800 text-xs font-bold text-center"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
