import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (uid: string, email: string, displayName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = (role: 'vip' | 'active') => {
    if (role === 'vip') {
      onAuthSuccess('demo-investor', 'investor@quantumindustrial.net', 'James Harrison');
    } else {
      onAuthSuccess('sarah-trader', 'sarah.lin@quantumindustrial.net', 'Sarah Lin');
    }
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      onAuthSuccess(user.uid, user.email || '', user.displayName || 'Investor');
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Google Sign-In failed: ' + (err.message || 'Please use test login'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Email is required');
      return;
    }
    const name = fullName || email.split('@')[0];
    const uid = 'user-' + email.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    onAuthSuccess(uid, email, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-cyan-500/20 mb-3">
            QIP
          </div>
          <h3 className="text-xl font-bold text-slate-100">QUANTUM PLUS Industrial Portal</h3>
          <p className="text-xs text-slate-400 mt-1">Access your multi-asset institutional portfolio</p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant 1-Click Test Access (No signup required):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('vip')}
              className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition text-xs"
            >
              <div className="font-semibold text-slate-200">James Harrison</div>
              <div className="text-[10px] text-cyan-400">$14,250 Balance (VIP)</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('active')}
              className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition text-xs"
            >
              <div className="font-semibold text-slate-200">Sarah Lin</div>
              <div className="text-[10px] text-emerald-400">$5,800 Balance</div>
            </button>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-[11px] uppercase tracking-wider">Or with email</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 pb-2 text-center transition ${
              tab === 'login' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 pb-2 text-center transition ${
              tab === 'register' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Investor Account
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded-lg border border-rose-800/60 mb-3">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="investor@example.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <span>{tab === 'login' ? 'Sign In to Portal' : 'Open Portfolio ($5,000 Starting Balance)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
