import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  KeyRound,
  Calculator,
  Shield,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Info,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { UserProfile } from '../server/db.ts';
import { apiClient } from '../services/apiClient.ts';

interface RegisterViewProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onGoToLogin: () => void;
  setCurrentView: (view: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onRegisterSuccess,
  onGoToLogin,
  setCurrentView
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple math verification state (e.g. 5 + 8)
  const [numA] = useState(5);
  const [numB] = useState(8);
  const expectedMath = numA + numB; // 13

  // Password requirements validation
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  const countriesList = [
    'United States',
    'United Kingdom',
    'Switzerland',
    'Germany',
    'France',
    'United Arab Emirates',
    'Singapore',
    'Canada',
    'Australia',
    'Japan',
    'South Africa',
    'Netherlands',
    'Sweden',
    'Norway',
    'Brazil',
    'India'
  ];

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('Please choose a username.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your contact phone number.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!country) {
      setErrorMsg('Please select your country of residence.');
      return;
    }
    setStep(3);
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg('Please create a password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }
    if (!hasMinLength || !hasUpperLower || !hasNumberOrSpecial) {
      setErrorMsg('Password does not meet all the required criteria.');
      return;
    }
    if (parseInt(mathAnswer.trim(), 10) !== expectedMath) {
      setErrorMsg(`Incorrect answer for simple math verification. Please solve ${numA} + ${numB}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.registerUser({
        username: username.trim(),
        email: email.trim(),
        fullName: fullName.trim(),
        password: password.trim(),
        phone: phone.trim(),
        country: country.trim()
      });

      if (res.success && res.user) {
        onRegisterSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Failed to complete registration.');
      }
    } catch (err: any) {
      setErrorMsg('Network error: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between items-center relative font-sans">
      {/* Centered Registration Card matching uploaded screenshots */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden relative p-8 sm:p-10 my-auto">
        {/* Top green line progress indicator */}
        <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mb-6"></div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-5 cursor-pointer" onClick={() => setCurrentView('home')}>
          <svg viewBox="0 0 100 100" className="w-9 h-9">
            <defs>
              <linearGradient id="qGradReg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7a7082" />
                <stop offset="100%" stopColor="#431c53" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="60" height="60" rx="14" fill="none" stroke="url(#qGradReg)" strokeWidth="12" />
            <path d="M55 55 L82 82" stroke="url(#qGradReg)" strokeWidth="13" strokeLinecap="round" />
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
            Join <span className="text-[#0d3b66]">QUANTUM PLUS</span> Industrial Partnership
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Start your professional journey
          </p>
        </div>

        {/* 3-Step Stepper Component */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-8 px-4 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step > 1
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#0b2d64] text-white shadow-md shadow-blue-900/20'
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '1'}
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">Personal Info</span>
            <span className="text-[10px] text-slate-400">Basic details</span>
          </div>

          {/* Line 1 */}
          <div
            className={`flex-1 h-0.5 mx-2 -mt-5 transition-all duration-300 ${
              step > 1 ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          ></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step > 2
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : step === 2
                  ? 'bg-[#0b2d64] text-white shadow-md shadow-blue-900/20'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > 2 ? <Check className="w-5 h-5 stroke-[2.5]" /> : '2'}
            </div>
            <span
              className={`text-xs mt-2 ${
                step >= 2 ? 'font-bold text-slate-800' : 'font-medium text-slate-500'
              }`}
            >
              Location
            </span>
            <span className="text-[10px] text-slate-400">Regional settings</span>
          </div>

          {/* Line 2 */}
          <div
            className={`flex-1 h-0.5 mx-2 -mt-5 transition-all duration-300 ${
              step > 2 ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          ></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step === 3
                  ? 'bg-[#0b2d64] text-white shadow-md shadow-blue-900/20'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span
              className={`text-xs mt-2 ${
                step === 3 ? 'font-bold text-slate-800' : 'font-medium text-slate-500'
              }`}
            >
              Security
            </span>
            <span className="text-[10px] text-slate-400">Account protection</span>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-6">
            {/* Banner card */}
            <div className="bg-[#eaf1fb] p-4 rounded-xl flex items-center gap-3 border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-[#cbe0fb] text-[#0b2d64] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Create your profile</p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Username <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose username"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Stepper Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-500">Step 1 of 3</span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0b2d64] hover:bg-[#072048] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Location */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-6">
            {/* Banner card */}
            <div className="bg-[#eaf1fb] p-4 rounded-xl flex items-center gap-3 border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-[#cbe0fb] text-[#0b2d64] flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Location</h3>
                <p className="text-xs text-slate-500">Set your regional preferences</p>
              </div>
            </div>

            {/* Country Selector Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Country <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white font-medium"
                >
                  {countriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Regional Information Info Callout */}
            <div className="bg-[#eef5fc] border border-blue-100/80 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-blue-900">Regional Information</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your location helps us provide region-specific features, compliance, and optimal server connections for faster execution.
                </p>
              </div>
            </div>

            {/* Stepper Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>

              <span className="text-xs font-medium text-slate-500">Step 2 of 3</span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0b2d64] hover:bg-[#072048] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Security & Math Verification */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-6">
            {/* Banner card */}
            <div className="bg-[#eaf1fb] p-4 rounded-xl flex items-center gap-3 border border-blue-100">
              <div className="w-10 h-10 rounded-xl bg-[#cbe0fb] text-[#0b2d64] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Account Security</h3>
                <p className="text-xs text-slate-500">Secure your account</p>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create strong password"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Simple Math Verification Box matching screenshot */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Simple Math Verification <span className="text-blue-600">*</span>
              </label>

              <div className="border border-slate-200 rounded-xl p-4 text-center bg-slate-50/50 max-w-xs mx-auto space-y-1">
                <span className="text-[11px] text-slate-500 font-medium block">
                  What is the answer to this simple math?
                </span>
                <div className="text-2xl font-black text-emerald-500 font-mono tracking-wider">
                  {numA} + {numB} = ?
                </div>
              </div>

              <div className="relative max-w-sm mx-auto">
                <Calculator className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="Enter the answer (numbers only)"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 text-center font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                  required
                />
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                ⓘ Just solve this simple math problem to verify you're human. Much easier than typing random codes!
              </p>
            </div>

            {/* Password Requirements Checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Password Requirements:</span>
              <ul className="space-y-1.5 text-xs">
                <li className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>At least 8 characters long</span>
                </li>
                <li className={`flex items-center gap-2 ${hasUpperLower ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasUpperLower ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>Contains uppercase and lowercase letters</span>
                </li>
                <li className={`flex items-center gap-2 ${hasNumberOrSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumberOrSpecial ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>Includes at least one number or special character</span>
                </li>
              </ul>
            </div>

            {/* Stepper Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>

              <span className="text-xs font-medium text-slate-500">Step 3 of 3</span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#0b2d64] hover:bg-[#072048] text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Portfolio...' : 'Complete Registration →'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Already have an account link */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onGoToLogin}
              className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
            >
              Sign in here
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
