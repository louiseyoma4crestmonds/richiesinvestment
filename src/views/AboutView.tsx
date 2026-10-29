import React from 'react';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Target,
  Globe2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  setCurrentView: (view: string) => void;
  onOpenInvest: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenInvest }) => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>About QUANTUM PLUS Industrial Partnership Limited</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Pioneering Algorithmic Multi-Market Liquidity
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Founded and headquartered in London, United Kingdom, we bridge institutional capital with next-generation algorithmic arbitrage, physical energy contracts, and resilient industrial assets.
          </p>
        </div>

        {/* Corporate Registration Highlight */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>UK Companies House Accreditation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Certified Corporate Standing in the United Kingdom
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              QUANTUM PLUS Industrial Partnership Limited operates under company registration #13894210. Our corporate headquarters are situated in the financial district at 120 London Wall, London, EC2Y 5ET.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full compliance with UK financial and commercial transparency laws</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Institutional multi-signature cold storage for client crypto capital</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated $5,500,000.00 capital reserve guarantee buffer</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 font-mono text-xs shadow-inner">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <span className="text-slate-500">Entity:</span>
              <span className="text-slate-900 font-bold text-right text-[11px] sm:text-xs">QUANTUM PLUS INDUSTRIAL PARTNERSHIP LIMITED</span>
            </div>
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <span className="text-slate-500">Company Number:</span>
              <span className="text-blue-600 font-bold">13894210</span>
            </div>
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <span className="text-slate-500">Incorporation Date:</span>
              <span className="text-slate-800 font-medium">14 February 2022</span>
            </div>
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <span className="text-slate-500">Registered Office:</span>
              <span className="text-slate-800 text-right font-medium">120 London Wall, London, EC2Y 5ET</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500">Nature of Business:</span>
              <span className="text-emerald-700 font-bold">66190 (Financial Intermediation)</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars of our Advantage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Quantum Algorithmic Speed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sub-millisecond execution times across global cryptocurrency order books and institutional currency exchanges, exploiting pricing divergences with zero slippage.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Industrial Commodity Swaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct hedging in Brent crude, natural gas pipelines, and tokenized logistics parks provides reliable baseline cashflow uncoupled from retail crypto volatility.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">International Liquidity Pools</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Serving over 32,000 verified clients across 142 nations with round-the-clock trading desks in London, Singapore, and Frankfurt.
            </p>
          </div>
        </div>

        {/* Executive Leadership */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">Executive Leadership</h3>
            <p className="text-xs text-slate-500 mt-1">Guiding quantum quantitative models and institutional capital governance</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Dr. Arthur Sterling',
                title: 'Chief Executive Officer',
                desc: 'Former Quantitative Lead at Barclays Capital with 18+ years in algorithmic currency arbitrage.',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              },
              {
                name: 'Elena Rostova, CFA',
                title: 'Chief Investment Officer',
                desc: 'Specializes in North Sea energy hedges, commodity swaps, and structured industrial yield vehicles.',
                img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
              },
              {
                name: 'Marcus Thorne',
                title: 'Head of Algorithmic Infrastructure',
                desc: 'Ex-DeepMind computational engineer overseeing latency reduction and quantum order routing engines.',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
              },
              {
                name: 'Sarah Chen, LLM',
                title: 'Director of Compliance & Escrow',
                desc: 'Barrister specializing in UK corporate regulatory standards and AML institutional procedures.',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
              }
            ].map((leader, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-xs hover:shadow-md transition">
                <img
                  src={leader.img}
                  alt={leader.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto border border-slate-200 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{leader.name}</h4>
                  <p className="text-[11px] text-blue-600 font-semibold">{leader.title}</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{leader.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#071426] border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 text-white shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black">Ready to Partner with QUANTUM PLUS?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Choose an investment strategy suited to your capital objectives and collect daily automated dividend distributions.
          </p>
          <button
            onClick={onOpenInvest}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 transition cursor-pointer shadow-lg shadow-blue-600/30"
          >
            <span>Activate Investment Strategy</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
