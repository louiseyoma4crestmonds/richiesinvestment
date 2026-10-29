import React, { useState } from 'react';
import { MarketAsset } from '../server/db.ts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react';

interface MarketMiniChartProps {
  assets: MarketAsset[];
  onOpenInvest: () => void;
}

export const MarketMiniChart: React.FC<MarketMiniChartProps> = ({ assets, onOpenInvest }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(assets[0]?.symbol || 'BTC/USD');
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D'>('24H');

  const asset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  if (!asset) return null;

  const isPos = asset.change24h >= 0;
  const spark = asset.sparkline || [100, 102, 101, 104, 103, 106, 108];
  const minVal = Math.min(...spark);
  const maxVal = Math.max(...spark);
  const range = maxVal - minVal || 1;

  // Build SVG path points
  const points = spark
    .map((val, idx) => {
      const x = (idx / (spark.length - 1)) * 500;
      const y = 140 - ((val - minVal) / range) * 110;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        {/* Asset tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {assets.slice(0, 6).map((a) => (
            <button
              key={a.symbol}
              onClick={() => setSelectedSymbol(a.symbol)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSymbol === a.symbol
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {a.symbol}
            </button>
          ))}
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          {(['1H', '24H', '7D', '30D'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded transition ${
                timeframe === tf ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Price Header & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <span className="text-xs text-slate-400 block font-medium">{asset.name} Price</span>
          <div className="text-2xl font-extrabold text-slate-100 font-mono mt-0.5">
            ${asset.category === 'forex' ? asset.price.toFixed(4) : asset.price.toLocaleString()}
          </div>
          <span className={`inline-flex items-center text-xs font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {isPos ? '+' : ''}{asset.change24h.toFixed(2)}% (24h)
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">24h High</span>
          <span className="text-sm font-bold text-slate-200 font-mono mt-0.5">
            ${asset.category === 'forex' ? asset.high24h.toFixed(4) : asset.high24h.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">24h Low</span>
          <span className="text-sm font-bold text-slate-200 font-mono mt-0.5">
            ${asset.category === 'forex' ? asset.low24h.toFixed(4) : asset.low24h.toLocaleString()}
          </span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">24h Market Volume</span>
          <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
            {asset.volume}
          </span>
        </div>
      </div>

      {/* Interactive SVG Chart representation */}
      <div className="relative h-44 bg-slate-950/80 rounded-2xl border border-slate-800 p-2 overflow-hidden flex items-end">
        {/* Background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
          <div className="border-b border-cyan-400 border-dashed"></div>
          <div className="border-b border-cyan-400 border-dashed"></div>
          <div className="border-b border-cyan-400 border-dashed"></div>
        </div>

        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${asset.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPos ? '#10b981' : '#f43f5e'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isPos ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,150 ${points} 500,150`}
            fill={`url(#grad-${asset.symbol})`}
          />
          <polyline
            fill="none"
            stroke={isPos ? '#10b981' : '#f43f5e'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>

        <div className="absolute top-3 right-3 text-[11px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Quantum Arbitrage Spread: &plusmn;0.012%
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Our liquidity algorithms route orders dynamically across LMAX, Binance, and CME futures.
        </p>
        <button
          onClick={onOpenInvest}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <span>Invest in Strategies</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
