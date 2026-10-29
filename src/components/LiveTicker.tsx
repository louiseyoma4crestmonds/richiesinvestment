import React from 'react';
import { MarketAsset, Transaction } from '../server/db.ts';
import { ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

interface LiveTickerProps {
  assets: MarketAsset[];
  recentTx: Transaction[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ assets, recentTx }) => {
  const latestTx = recentTx[0];

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 text-xs text-slate-300 py-1.5 px-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Live Market Assets Ticker */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-0.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider text-[11px] uppercase mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE MARKETS
          </div>
          {assets.map((asset) => {
            const isPos = asset.change24h >= 0;
            return (
              <div key={asset.symbol} className="inline-flex items-center gap-1.5 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                <span className="font-medium text-slate-200">{asset.symbol}</span>
                <span className="text-slate-100 font-mono">
                  ${asset.category === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                </span>
                <span className={`inline-flex items-center text-[10px] font-medium ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {isPos ? '+' : ''}{asset.change24h.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Real-time Latest Transaction badge */}
        {latestTx && (
          <div className="hidden lg:flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-0.5 rounded text-emerald-300 text-[11px] whitespace-nowrap">
            <Zap className="w-3 h-3 text-emerald-400 animate-bounce" />
            <span className="font-semibold">{latestTx.type === 'deposit' ? 'Deposit' : 'Payout'}:</span>
            <span className="font-mono">${latestTx.amount.toLocaleString()}</span>
            <span className="text-slate-400">({latestTx.userName || 'Investor'})</span>
            <span className="text-emerald-500/80 font-mono text-[10px]">{latestTx.timestamp}</span>
          </div>
        )}
      </div>
    </div>
  );
};
