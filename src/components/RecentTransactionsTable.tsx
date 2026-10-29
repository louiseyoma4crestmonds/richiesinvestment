import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { Transaction } from '../server/db.ts';

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Live Settlement Ledger
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            Real-Time Platform Transactions
          </h3>
          <p className="text-xs text-slate-400">
            Verified blockchain transactions and automated liquidity disbursements
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilter('deposit')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'deposit' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setFilter('withdrawal')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filter === 'withdrawal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Withdrawals
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-2">Type</th>
              <th className="pb-3">Client</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Asset</th>
              <th className="pb-3">Transaction Hash</th>
              <th className="pb-3 text-right pr-2">Status & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.slice(0, 8).map((tx) => {
              const isDeposit = tx.type === 'deposit';
              return (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 pl-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                        isDeposit
                          ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {isDeposit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      <span className="capitalize">{tx.type}</span>
                    </span>
                  </td>
                  <td className="py-3 font-medium text-slate-200">
                    {tx.userName || 'Verified Investor'}
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-100">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">
                      {tx.asset}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-400 text-[11px]">
                    <span className="text-cyan-400/90">{tx.txHash}</span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-300 font-medium capitalize">{tx.status}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({tx.timestamp})</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
