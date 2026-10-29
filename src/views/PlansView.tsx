import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { InvestmentPlan } from '../server/db.ts';
import { ProfitCalculator } from '../components/ProfitCalculator.tsx';

interface PlansViewProps {
  plans: InvestmentPlan[];
  onSelectPlanAndInvest: (planId: string) => void;
  setCurrentView: (view: string) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  onSelectPlanAndInvest
}) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Plans (6)' },
    { id: 'Forex & Currencies', label: 'Forex' },
    { id: 'Cryptocurrency & DeFi', label: 'Crypto Arbitrage' },
    { id: 'Oil, Gas & Energy', label: 'Oil & Energy' },
    { id: 'Industrial Infrastructure', label: 'Real Estate' },
    { id: 'Institutional Multi-Asset', label: 'VIP Pool' }
  ];

  const filteredPlans = plans.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Curated Investment Vehicles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Algorithmic High-Yield Plans
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Daily return rates from 1.8% to 5.2% backed by automated risk limits, quantitative liquidity hedging, and 100% capital principal refund upon contract maturity.
          </p>

          {/* Category filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filter === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((p) => {
            const isVip = p.status === 'vip';
            const isPopular = p.status === 'popular';
            return (
              <div
                key={p.id}
                className={`bg-white border rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition relative shadow-sm hover:shadow-md ${
                  isPopular
                    ? 'border-blue-500 ring-2 ring-blue-500/10'
                    : isVip
                    ? 'border-amber-400 ring-2 ring-amber-400/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                {isVip && (
                  <span className="absolute -top-3 left-6 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    VIP Node
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {p.tier}
                    </span>
                    <span className="text-[11px] font-medium bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-slate-600">
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed min-h-[44px]">
                    {p.description}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Daily Return:</span>
                      <span className="text-2xl font-black text-blue-600 font-mono">
                        +{p.dailyRoiPercent}% / day
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Duration:</span>
                      <span className="text-slate-900 font-semibold">{p.durationDays} Days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Principal Capital:</span>
                      <span className="text-emerald-600 font-semibold">100% Refundable</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Min Deposit:</span>
                      <span className="font-mono font-bold text-slate-900">${p.minDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Max Deposit:</span>
                      <span className="font-mono font-bold text-slate-900">${p.maxDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-500">Risk Profile:</span>
                      <span className="text-blue-600 font-semibold">{p.riskLevel}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 text-[11px] text-slate-600">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlanAndInvest(p.id)}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm ${
                    isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                      : isVip
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Select & Invest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Embedded Profit Calculator */}
        <ProfitCalculator plans={plans} onSelectPlanAndInvest={onSelectPlanAndInvest} />

        {/* Plan Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Plan Specifications Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 pl-3">Strategy Name</th>
                  <th className="py-3">Min - Max Capital</th>
                  <th className="py-3">Daily ROI</th>
                  <th className="py-3">Term Duration</th>
                  <th className="py-3">Total Expected ROI</th>
                  <th className="py-3">Withdrawals</th>
                  <th className="py-3 text-right pr-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {plans.map((p) => {
                  const totalRoi = (p.dailyRoiPercent * p.durationDays).toFixed(1);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 pl-3 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3.5 font-mono text-slate-700">
                        ${p.minDeposit.toLocaleString()} - ${p.maxDeposit.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-mono font-bold text-blue-600">+{p.dailyRoiPercent}% / day</td>
                      <td className="py-3.5 text-slate-700">{p.durationDays} Days</td>
                      <td className="py-3.5 font-mono text-emerald-600">+{totalRoi}% + Principal</td>
                      <td className="py-3.5 text-slate-500">Instant Daily</td>
                      <td className="py-3.5 text-right pr-3">
                        <button
                          onClick={() => onSelectPlanAndInvest(p.id)}
                          className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg text-[11px] font-bold transition cursor-pointer"
                        >
                          Invest
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
