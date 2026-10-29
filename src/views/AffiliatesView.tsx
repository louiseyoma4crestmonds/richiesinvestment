import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check
} from 'lucide-react';
import { UserProfile } from '../server/db.ts';

interface AffiliatesViewProps {
  user: UserProfile | null;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
}

export const AffiliatesView: React.FC<AffiliatesViewProps> = ({
  user
}) => {
  const [calculatorVolume, setCalculatorVolume] = useState<number>(25000);
  const [copied, setCopied] = useState(false);

  const referralCode = user?.referralCode || 'QIP-DEMO77';
  const referralLink = `https://quantumindustrialpartnership.net/?ref=${referralCode}`;

  const l1Commission = (calculatorVolume * 0.05);
  const l2Commission = (calculatorVolume * 0.4 * 0.02);
  const l3Commission = (calculatorVolume * 0.2 * 0.01);
  const totalCommission = l1Commission + l2Commission + l3Commission;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Affiliate & Partner Network</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Earn Generous Multi-Tier Commissions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Introduce investors, family offices, and trading communities to QUANTUM PLUS Industrial Partnership. Earn up to 8% lifetime rewards with automated instant payouts.
          </p>
        </div>

        {/* 3 Tiers Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Level 1 Direct Referrals
            </span>
            <div className="text-5xl font-black text-slate-900 font-mono">5.0%</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn 5% on every deposit made directly by your invited clients. Credited instantly to your account balance.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-emerald-600">
              Unlimited Direct Earning Potential
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Level 2 Network Downline
            </span>
            <div className="text-5xl font-black text-slate-900 font-mono">2.0%</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn 2% whenever your direct referrals introduce new investors to the platform.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-blue-600">
              Secondary Multiplier Tier
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Level 3 Extended Downline
            </span>
            <div className="text-5xl font-black text-slate-900 font-mono">1.0%</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Earn 1% on tertiary network volume. Builds deep passive income as your institutional tree expands.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-purple-600">
              Tertiary Residual Flow
            </div>
          </div>
        </div>

        {/* Your Personal Referral Link Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Your Exclusive Affiliate Link</h3>
              <p className="text-xs text-slate-600">
                Share this link across Telegram, Twitter/X, YouTube, or direct email to automatically attach referred capital to your profile.
              </p>
            </div>

            <div className="flex-1 max-w-lg">
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs font-mono text-blue-700 truncate select-all px-2 font-semibold">
                  {referralLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Calculator */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Affiliate Commission Calculator</h3>
          <p className="text-xs text-slate-500 mb-6">
            Estimate your monthly earnings based on network deposit volume
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Projected Monthly Network Deposits:</span>
                <span className="font-mono font-bold text-blue-600 text-base">${calculatorVolume.toLocaleString()} USD</span>
              </div>

              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={calculatorVolume}
                onChange={(e) => setCalculatorVolume(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>$5,000</span>
                <span>$100,000</span>
                <span>$200,000+</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Level 1 (5% on Direct):</span>
                <span className="font-mono text-slate-900 font-semibold">${l1Commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Level 2 (2% on Sub-team):</span>
                <span className="font-mono text-slate-900 font-semibold">${l2Commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Level 3 (1% on Extended):</span>
                <span className="font-mono text-slate-900 font-semibold">${l3Commission.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold">
                <span className="text-slate-900">Total Monthly Reward:</span>
                <span className="text-emerald-600 font-mono text-base">+${totalCommission.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
