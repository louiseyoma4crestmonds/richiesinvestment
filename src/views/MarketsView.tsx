import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight
} from 'lucide-react';
import { MarketAsset } from '../server/db.ts';

interface MarketsViewProps {
  assets: MarketAsset[];
  onOpenInvest: () => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({ assets, onOpenInvest }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(assets[0]?.symbol || 'BTC/USD');
  const [activeCategory, setActiveCategory] = useState<'all' | 'crypto' | 'forex' | 'commodity' | 'stocks'>('all');
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '1M'>('24H');

  const asset = assets.find((a) => a.symbol === selectedSymbol) || assets[0];
  const isPos = (asset?.change24h || 0) >= 0;

  const filteredAssets = assets.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  const spark = asset?.sparkline || [100, 102, 105, 103, 107, 109];
  const minVal = Math.min(...spark);
  const maxVal = Math.max(...spark);
  const range = maxVal - minVal || 1;

  const points = spark
    .map((val, idx) => {
      const x = (idx / (spark.length - 1)) * 600;
      const y = 170 - ((val - minVal) / range) * 130;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Liquidity Quotations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Multi-Asset Trading Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Real-time feeds across Tier-1 liquidity providers, crypto venues, and energy clearing houses.
            </p>
          </div>

          <button
            onClick={onOpenInvest}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 self-start md:self-auto transition cursor-pointer shadow-md shadow-blue-500/20"
          >
            <span>Allocate Capital to Market</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Chart Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-extrabold text-sm">
                {asset?.symbol.split('/')[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{asset?.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">({asset?.symbol})</span>
                  <span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    {asset?.category}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                    ${asset?.category === 'forex' ? asset?.price.toFixed(4) : asset?.price.toLocaleString()}
                  </span>
                  <span className={`inline-flex items-center text-xs font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isPos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {isPos ? '+' : ''}{asset?.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-auto">
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-mono">
                {(['1H', '24H', '7D', '1M'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      timeframe === tf ? 'bg-white text-blue-600 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Large SVG Chart */}
          <div className="relative h-64 sm:h-72 bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-end overflow-hidden mb-6">
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
              <div className="border-b border-blue-400 border-dashed"></div>
              <div className="border-b border-blue-400 border-dashed"></div>
              <div className="border-b border-blue-400 border-dashed"></div>
              <div className="border-b border-blue-400 border-dashed"></div>
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`grad-main-${asset?.symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPos ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isPos ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,180 ${points} 600,180`}
                fill={`url(#grad-main-${asset?.symbol})`}
              />
              <polyline
                fill="none"
                stroke={isPos ? '#059669' : '#e11d48'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>

            <div className="absolute top-4 left-4 text-xs font-mono text-slate-600 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              High: ${asset?.high24h.toLocaleString()} &bull; Low: ${asset?.low24h.toLocaleString()} &bull; Volume: {asset?.volume}
            </div>
          </div>

          {/* Order Book Depth Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bids */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <span>Order Book: Bids (Buy Depth)</span>
                <span className="text-emerald-700">Total: 48.2 BTC</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {[
                  { price: (asset?.price * 0.9995).toFixed(2), size: '12.45', total: '$852,100' },
                  { price: (asset?.price * 0.9988).toFixed(2), size: '8.12', total: '$555,200' },
                  { price: (asset?.price * 0.9975).toFixed(2), size: '19.80', total: '$1,354,120' },
                  { price: (asset?.price * 0.9960).toFixed(2), size: '7.85', total: '$536,250' }
                ].map((b, i) => (
                  <div key={i} className="flex justify-between text-emerald-700 py-0.5">
                    <span className="font-semibold">${b.price}</span>
                    <span className="text-slate-600">{b.size}</span>
                    <span className="text-slate-400">{b.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asks */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <span>Order Book: Asks (Sell Depth)</span>
                <span className="text-rose-700">Total: 52.8 BTC</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {[
                  { price: (asset?.price * 1.0005).toFixed(2), size: '9.40', total: '$643,500' },
                  { price: (asset?.price * 1.0012).toFixed(2), size: '14.60', total: '$999,200' },
                  { price: (asset?.price * 1.0028).toFixed(2), size: '18.15', total: '$1,242,100' },
                  { price: (asset?.price * 1.0040).toFixed(2), size: '10.65', total: '$728,400' }
                ].map((a, i) => (
                  <div key={i} className="flex justify-between text-rose-700 py-0.5">
                    <span className="font-semibold">${a.price}</span>
                    <span className="text-slate-600">{a.size}</span>
                    <span className="text-slate-400">{a.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Asset Explorer Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900">Live Asset Catalog</h3>
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              {(['all', 'crypto', 'forex', 'commodity', 'stocks'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] transition cursor-pointer ${
                    activeCategory === cat ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 pl-3">Asset</th>
                  <th className="py-3">Class</th>
                  <th className="py-3">Price (USD)</th>
                  <th className="py-3">24h Change</th>
                  <th className="py-3">24h High / Low</th>
                  <th className="py-3">24h Volume</th>
                  <th className="py-3 text-right pr-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAssets.map((a) => {
                  const aPos = a.change24h >= 0;
                  return (
                    <tr
                      key={a.symbol}
                      onClick={() => setSelectedSymbol(a.symbol)}
                      className={`hover:bg-slate-50 transition cursor-pointer ${
                        selectedSymbol === a.symbol ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">{a.symbol}</span>
                          <span className="text-slate-500 text-[11px]">({a.name})</span>
                        </div>
                      </td>
                      <td className="py-3.5 uppercase text-[10px] font-bold text-slate-500">{a.category}</td>
                      <td className="py-3.5 font-mono font-bold text-slate-900">
                        ${a.category === 'forex' ? a.price.toFixed(4) : a.price.toLocaleString()}
                      </td>
                      <td className={`py-3.5 font-mono font-bold ${aPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {aPos ? '+' : ''}{a.change24h.toFixed(2)}%
                      </td>
                      <td className="py-3.5 font-mono text-slate-500 text-[11px]">
                        ${a.high24h.toLocaleString()} / ${a.low24h.toLocaleString()}
                      </td>
                      <td className="py-3.5 font-mono text-slate-700">{a.volume}</td>
                      <td className="py-3.5 text-right pr-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSymbol(a.symbol);
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          Inspect Chart
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
