import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { InvestmentPlan } from '../server/db.ts';

interface ProfitCalculatorProps {
  plans: InvestmentPlan[];
  onSelectPlanAndInvest: (planId: string) => void;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  plans,
  onSelectPlanAndInvest
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 'starter-forex');
  const plan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const [amount, setAmount] = useState<number>(plan ? plan.minDeposit : 1000);

  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const selected = plans.find((p) => p.id === planId);
    if (selected) {
      setAmount(selected.minDeposit);
    }
  };

  const numAmount = amount || (plan?.minDeposit ?? 100);
  const dailyProfit = (numAmount * (plan?.dailyRoiPercent || 0)) / 100;
  const weeklyProfit = dailyProfit * 7;
  const totalProfit = dailyProfit * (plan?.durationDays || 0);
  const totalReturn = totalProfit + (plan?.capitalBack ? numAmount : 0);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Profit Calculator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Calculate Your Projected Returns
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Simulate your algorithmic yield across Forex, Crypto, Energy, and Industrial Real Estate strategies.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Capital Principal 100% Refundable at Maturity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs: Plan Selection & Slider */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Choose Investment Strategy
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {plans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handlePlanChange(p.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    selectedPlanId === p.id
                      ? 'bg-blue-50 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {p.tier}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 font-mono">
                      +{p.dailyRoiPercent}%/d
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ${p.minDeposit.toLocaleString()} min &bull; {p.durationDays}d
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Slider & Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Deposit Capital Amount (USD)
              </label>
              <div className="text-xs text-slate-500 font-mono">
                Min ${plan.minDeposit.toLocaleString()} &bull; Max ${plan.maxDeposit.toLocaleString()}
              </div>
            </div>

            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-lg">$</span>
              <input
                type="number"
                min={plan.minDeposit}
                max={plan.maxDeposit}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-slate-900 text-lg font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <input
              type="range"
              min={plan.minDeposit}
              max={plan.maxDeposit}
              step={plan.minDeposit > 10000 ? 5000 : 250}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>${plan.minDeposit.toLocaleString()}</span>
              <span>${Math.round((plan.minDeposit + plan.maxDeposit) / 2).toLocaleString()}</span>
              <span>${plan.maxDeposit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Calculated Returns Box */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs text-slate-500 font-medium">Selected Package:</span>
              <span className="text-xs font-bold text-blue-600">{plan.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block mb-1">Daily Profit ({plan.dailyRoiPercent}%)</span>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  ${dailyProfit.toFixed(2)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block mb-1">Weekly Profit (7 Days)</span>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  ${weeklyProfit.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Contract Holding Term:</span>
                <span className="text-slate-900 font-semibold">{plan.durationDays} Days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Net Profit Earned:</span>
                <span className="text-emerald-600 font-bold font-mono">+${totalProfit.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Principal Capital Refund:</span>
                <span className="text-blue-600 font-semibold">100% Returned</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
                Projected Total Return
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono mt-0.5">
                ${totalReturn.toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => onSelectPlanAndInvest(plan.id)}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition cursor-pointer"
            >
              <span>Invest in {plan.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
