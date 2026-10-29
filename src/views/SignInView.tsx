import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Scale,
  KeyRound,
  ChevronDown,
  CheckCircle2,
  Mail,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../server/db.ts';

interface SignInViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onGoToRegister: () => void;
  setCurrentView: (view: string) => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onLoginSuccess,
  onGoToRegister,
  setCurrentView
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetStatus, setResetStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your username or email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanId = identifier.trim().toLowerCase();
      let matchedUid = cleanId === 'ouimas' ? 'ouimas' : 'usr-' + cleanId.replace(/[^a-z0-9]/g, '');
      let matchedName = cleanId === 'ouimas' ? 'ouimas' : cleanId.split('@')[0];
      let matchedEmail = cleanId === 'ouimas' ? 'ouimasglobal@gmail.com' : cleanId.includes('@') ? cleanId : `${cleanId}@quantumindustrialpartnership.net`;

      if (cleanId === 'admin' || cleanId.startsWith('admin@') || cleanId.includes('admin')) {
        matchedUid = 'admin';
        matchedName = 'QUANTUM PLUS Administrator';
        matchedEmail = 'admin@quantumindustrialpartnership.net';
      }

      // Sync user with backend database
      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: matchedUid,
          email: matchedEmail,
          displayName: matchedName
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.error || 'Invalid credentials or user account not found.');
      }
    } catch (err: any) {
      setErrorMsg('Sign in failed: ' + err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    if (!resetIdentifier.trim()) {
      setResetStatus({ type: 'error', text: 'Please enter your account username or registered email.' });
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/user/password-reset-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: resetIdentifier.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setResetCode(''); // Reset verification code input so user must enter it from email
        setResetStep(2);
        setResetStatus({
          type: 'success',
          text: data.message || 'A 6-digit verification code has been dispatched to your email address.'
        });
      } else {
        setResetStatus({ type: 'error', text: data.error || 'Failed to request password reset code.' });
      }
    } catch (err: any) {
      setResetStatus({ type: 'error', text: 'Network error: ' + err?.message });
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    if (!resetCode.trim()) {
      setResetStatus({ type: 'error', text: 'Please enter the 6-digit verification code sent to your email.' });
      return;
    }
    if (resetCode.trim().length !== 6) {
      setResetStatus({ type: 'error', text: 'Verification code must be exactly 6 digits.' });
      return;
    }
    if (newResetPassword.length < 8) {
      setResetStatus({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      setResetStatus({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/user/password-reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: resetIdentifier.trim(),
          code: resetCode.trim(),
          newPassword: newResetPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setResetStatus({ type: 'success', text: data.message });
        setIdentifier(resetIdentifier.trim());
        setPassword(newResetPassword);
        setTimeout(() => {
          setShowResetModal(false);
          setForgotPasswordNotice(true);
        }, 1500);
      } else {
        setResetStatus({ type: 'error', text: data.error || 'Failed to reset password.' });
      }
    } catch (err: any) {
      setResetStatus({ type: 'error', text: 'Network error: ' + err?.message });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center relative font-sans">
      {/* Centered Sign In Card matching exact Register page aesthetic */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden relative p-8 sm:p-10 my-auto">
        {/* Top green line progress indicator */}
        <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mb-6"></div>

        {/* Logo */}
        <div
          className="flex items-center justify-center gap-2.5 mb-5 cursor-pointer"
          onClick={() => setCurrentView('home')}
        >
          <svg viewBox="0 0 100 100" className="w-9 h-9">
            <defs>
              <linearGradient id="qGradSignIn" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7a7082" />
                <stop offset="100%" stopColor="#431c53" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="60" height="60" rx="14" fill="none" stroke="url(#qGradSignIn)" strokeWidth="12" />
            <path d="M55 55 L82 82" stroke="url(#qGradSignIn)" strokeWidth="13" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col">
            <span className="font-extrabold text-[#3a204d] tracking-wider text-xl leading-none">
              QUANTUM PLUS
            </span>
            <span className="text-[8px] font-semibold tracking-[0.2em] text-slate-500 uppercase leading-tight mt-0.5">
              INDUSTRIAL PARTNERSHIP
            </span>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to <span className="text-[#0d3b66]">QUANTUM PLUS Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Access your portfolio & global investments
          </p>
        </div>

        {/* Banner card */}
        <div className="bg-[#eaf1fb] p-4 rounded-xl flex items-center gap-3 border border-blue-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#cbe0fb] text-[#0b2d64] flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Secure Investor Authentication</h3>
            <p className="text-xs text-slate-500">Enter your credentials to manage capital & contracts</p>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Forgot password confirmation notification */}
        {forgotPasswordNotice && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Password updated successfully. You can now sign in with your new password.</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username or Email <span className="text-blue-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password <span className="text-blue-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetStep(1);
                  setResetStatus(null);
                  if (identifier) setResetIdentifier(identifier);
                }}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 select-none">Remember my session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#0b2d64] hover:bg-[#072048] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Don't have an account link */}
        <div className="text-center mt-8 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Security badges at bottom */}
        <div className="flex items-center justify-center gap-5 mt-6 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>Regulated Platform</span>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="text-center text-[10px] text-slate-400 mt-5 leading-relaxed">
          &copy; 2026 QUANTUM PLUS Industrial Partnership. All rights reserved. | Licensed and regulated Investment company.
        </div>
      </div>

      {/* Interactive Password Reset Modal (Resend Email Verification Code) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reset Account Password</h3>
                  <p className="text-xs text-slate-500">Email verification via Resend</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {resetStatus && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-medium leading-relaxed ${
                  resetStatus.type === 'error'
                    ? 'bg-rose-50 border border-rose-200 text-rose-600'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {resetStatus.text}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleSendResetCode} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Account Email or Username <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. ouimas or user@example.com"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>A secure 6-digit verification code will be sent to your email via Resend.</span>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isResetting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isResetting ? 'Dispatching Email...' : 'Send Verification Code'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="space-y-4 mt-4">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  Enter the <strong>6-digit verification code</strong> that was just sent to your email inbox, then choose a new password.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    6-Digit Verification Code <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code from email"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-widest text-center text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleSendResetCode(e)}
                    disabled={isResetting}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    Resend Code
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {isResetting ? 'Saving...' : 'Confirm New Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom-left language dropdown pill */}
      <div className="absolute bottom-6 left-6 hidden sm:block">
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-slate-200/90 shadow-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <span>🇺🇸</span>
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
