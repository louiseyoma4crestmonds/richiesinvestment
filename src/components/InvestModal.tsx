import React, { useState, useEffect } from 'react';
import { X, TrendingUp, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { InvestmentPlan, UserProfile } from '../server/db.ts';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: InvestmentPlan[];
  selectedPlanId?: string;
  user: UserProfile;
  onInvestSuccess: (message: string) => void;
  onOpenDeposit: () => void;
}

export const InvestModal: React.FC<InvestModalProps> = ({
  isOpen,
  onClose,
  plans,
  selectedPlanId,
  user,
  onInvestSuccess,
  onOpenDeposit
}) => {
  const [currentPlanId, setCurrentPlanId] = useState(selectedPlanId || plans[0]?.id || 'starter-forex');
  const [amount, setAmount] = useState('1000');
  const [paymentSource, setPaymentSource] = useState<'balance' | 'crypto'>('balance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedPlanId) {
      setCurrentPlanId(selectedPlanId);
      const plan = plans.find(p => p.id === selectedPlanId);
      if (plan) {
        setAmount(String(plan.minDeposit));
      }
    }
  }, [selectedPlanId, plans]);

  if (!isOpen) return null;

  const plan = plans.find(p => p.id === currentPlanId) || plans[0];
  const numAmount = parseFloat(amount) || 0;
  const dailyProfit = (numAmount * (plan?.dailyRoiPercent || 0)) / 100;
  const totalProfit = dailyProfit * (plan?.durationDays || 0);
  const totalReturn = totalProfit + (plan?.capitalBack ? numAmount : 0);

  const isBalanceSufficient = paymentSource === 'crypto' || user.balance >= numAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount < plan.minDeposit || numAmount > plan.maxDeposit) {
      setErrorMsg(`Amount must be between $${plan.minDeposit.toLocaleString()} and $${plan.maxDeposit.toLocaleString()}`);
      return;
    }

    if (paymentSource === 'balance' && user.balance < numAmount) {
      setErrorMsg(`Insufficient balance. You have $${user.balance.toFixed(2)}. Please deposit or choose direct crypto.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          planId: plan.id,
          amount: numAmount,
          paymentSource
        })
      });

      const data = await res.json();
      if (data.success) {
        onInvestSuccess(data.message);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to open contract');
      }
    } catch (err: any) {
      setErrorMsg('Error connecting to backend: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Activate Investment Contract</h3>
            <p className="text-xs text-slate-400">QUANTUM PLUS Industrial Algorithmic Portfolio</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Investment Strategy
            </label>
            <select
              value={currentPlanId}
              onChange={(e) => {
                setCurrentPlanId(e.target.value);
                const p = plans.find(pl => pl.id === e.target.value);
                if (p) setAmount(String(p.minDeposit));
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-500"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.dailyRoiPercent}% Daily / {p.durationDays} Days &bull; Min ${p.minDeposit.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Investment Amount (USD)
              </label>
              <span className="text-[11px] text-slate-400">
                Limit: ${plan.minDeposit.toLocaleString()} - ${plan.maxDeposit.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min={plan.minDeposit}
                max={plan.maxDeposit}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Payment Source */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Funding Source
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentSource('balance')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  paymentSource === 'balance'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">Account Balance</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Available: ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentSource('crypto')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  paymentSource === 'crypto'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">Direct Crypto Funding</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  BTC, ETH, USDT Node
                </div>
              </button>
            </div>
          </div>

          {/* Return Breakdown Summary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Yield Breakdown Projection
            </h4>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Daily ROI Rate:</span>
              <span className="font-bold text-emerald-400 font-mono">+{plan.dailyRoiPercent}% / day</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Daily Payout:</span>
              <span className="font-bold text-slate-200 font-mono">${dailyProfit.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Contract Duration:</span>
              <span className="text-slate-200">{plan.durationDays} Days</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Total Net Profit:</span>
              <span className="font-bold text-cyan-400 font-mono">${totalProfit.toFixed(2)} USD</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-semibold">
              <span className="text-slate-200">Total Return at Maturity:</span>
              <span className="text-emerald-400 font-mono text-sm">${totalReturn.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="pt-2">
            {!isBalanceSufficient ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeposit();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  Deposit Funds First (Need ${(numAmount - user.balance).toFixed(2)} more)
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Signing Contract & Allocating Capital...</span>
                ) : (
                  <>
                    <span>Confirm & Lock In Contract</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
