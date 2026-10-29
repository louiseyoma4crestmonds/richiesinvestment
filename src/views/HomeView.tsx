import React, { useState } from 'react';
import {
  Mountain,
  Globe,
  BarChart3,
  TrendingUp,
  Target,
  Play,
  X,
  Check,
  ChevronRight,
  Quote,
  Zap,
  ArrowRight
} from 'lucide-react';
import { InvestmentPlan, MarketAsset, PlatformStats, Transaction, Testimonial } from '../server/db.ts';

interface HomeViewProps {
  plans: InvestmentPlan[];
  assets: MarketAsset[];
  stats: PlatformStats;
  transactions: Transaction[];
  testimonials: Testimonial[];
  onSelectPlanAndInvest: (planId: string) => void;
  onOpenInvest: () => void;
  onOpenDeposit: () => void;
  setCurrentView: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  plans,
  onSelectPlanAndInvest,
  onOpenInvest,
  setCurrentView
}) => {
  const [planTab, setPlanTab] = useState<'daily' | 'longterm'>('daily');
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(2); // Center: Rohan Bhattacharya
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // 10 Comprehensive Investment Solutions Cards from screenshots
  const investmentSolutions = [
    {
      title: 'Financial Management',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      description:
        'Our financial management solutions are designed to optimize your wealth through strategic portfolio construction, disciplined asset allocation, and tax-efficient investment planning. We combine data-driven insights with market expertise to deliver consistent, risk-adjusted returns aligned with your financial goals.'
    },
    {
      title: 'Agribusiness',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
      description:
        'We provide access to sustainable agricultural investments including large-scale farming, commodity trading, and agritech innovations. This sector offers strong growth potential driven by global food demand, while supporting environmentally responsible and resource-efficient practices.'
    },
    {
      title: 'Real Estate',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      description:
        'Our real estate investments focus on high-growth residential and commercial markets, offering opportunities in property acquisition, development, and leasing. We target assets with strong appreciation potential and consistent income generation to ensure stable long-term returns.'
    },
    {
      title: 'Oil & Gas',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      description:
        'Gain exposure to the global energy market through investments in upstream exploration, midstream logistics, and downstream refining. Our strategy focuses on high-demand energy assets with strong revenue potential and resilience across economic cycles.'
    },
    {
      title: 'Diversified Investment',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      description:
        'Our diversified portfolios combine equities, fixed income, commodities, and alternative assets to balance risk and return across market cycles.'
    },
    {
      title: 'Pension Investment',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
      description:
        'Retirement-focused strategies designed to provide steady income, capital preservation, and long-term financial security.'
    },
    {
      title: 'Gold & Mining',
      image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80',
      description:
        'Invest in gold exploration, mineral extraction, and precious metals trading as a hedge against inflation and market volatility.'
    },
    {
      title: 'Tax Management',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
      description:
        'Strategic planning to minimize liabilities and maximize financial efficiency.'
    },
    {
      title: 'Economic Planning',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
      description:
        'Data-driven strategies to optimize investments and support sustainable growth.'
    },
    {
      title: 'Financial Advisory & Consulting',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
      description:
        'Expert guidance to optimize capital, manage risk, and drive long-term financial growth.'
    }
  ];

  // Testimonial Clients from screenshots
  const clientTestimonials = [
    {
      name: 'SARAH JENNINGS',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      quote:
        'The precision-driven portfolio strategies provided by QUANTUM PLUS Industrial have completely modernized our treasury yields.'
    },
    {
      name: 'MARCUS VOGEL',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      quote:
        'Automated daily settlements and exceptional capital security make QIP our preferred financial management partner.'
    },
    {
      name: 'ROHAN BHATTACHARYA',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      quote:
        'Investing through this platform has simplified our portfolio management. The returns are consistent, and the team\'s insights are invaluable.'
    },
    {
      name: 'ELENA ROSTOVA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      quote:
        'Their industrial commodity and energy infrastructure access gives our family office unmatched diversification.'
    },
    {
      name: 'DAVID CHEN',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      quote:
        'Transparent reporting, instant liquidity, and disciplined risk-adjusted returns across every single contract cycle.'
    }
  ];

  const currentTestimonial = clientTestimonials[activeTestimonialIdx];

  // Filter plans based on Daily vs Long-Term toggle
  const displayedPlans = plans.filter((p) => {
    if (planTab === 'daily') {
      return p.category === 'Daily Returns' || p.durationDays <= 20;
    } else {
      return p.category === 'Long-Term' || p.durationDays > 20;
    }
  });

  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* 1. HERO SECTION WITH SKYSCRAPER BACKGROUND */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Skyscraper background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85')`,
            backgroundPosition: 'center 35%'
          }}
        >
          {/* Architectural gradient overlay that lets the high rise building show through clearly while keeping text crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061426]/75 via-[#081a32]/80 to-[#040d18]/92"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-12 pb-28">
          <span className="inline-block text-[#00c2ff] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-4">
            FINANCIAL TRANSFORMATION
          </span>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Your path to lasting prosperity.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
            Tailored strategies to grow and protect your wealth through diversified investments and expert guidance.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('register')}
              className="px-8 py-3.5 rounded-md bg-[#0070f3] hover:bg-[#005cd2] text-white font-bold text-sm transition cursor-pointer shadow-lg shadow-blue-500/25"
            >
              Get Started
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className="px-8 py-3.5 rounded-md bg-transparent hover:bg-white/10 text-white font-semibold text-sm border border-white/80 transition cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* 2. THREE FLOATING HIGHLIGHT CARDS (OVERLAPPING HERO) */}
      <section className="relative z-20 -mt-16 sm:-mt-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
          {/* Card 1: Insightful Analysis */}
          <div className="p-8 sm:p-10 space-y-4">
            <div className="h-10 flex items-center">
              {/* Clean minimalist placeholder or icon */}
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0275d8]">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Insightful Analysis</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              At QUANTUM PLUS Industrial Partnership, we deliver deep, data-driven analysis that transforms complex market dynamics into clear, actionable insights.
            </p>
          </div>

          {/* Card 2: Strategic Advantages */}
          <div className="p-8 sm:p-10 space-y-4">
            <div className="h-10 flex items-center">
              <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0275d8] stroke-current fill-none stroke-2">
                <path d="M8 52 L32 14 L56 52 Z" />
                <path d="M24 38 L40 38" />
                <path d="M32 14 L32 8 L44 14 L32 20" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Strategic Advantages</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              At QUANTUM PLUS Industrial Partnership, we create meaningful advantages for our partners through precision-driven strategies, industry expertise, and a commitment to long-term value creation.
            </p>
          </div>

          {/* Card 3: Global Thinking */}
          <div className="p-8 sm:p-10 space-y-4">
            <div className="h-10 flex items-center">
              <svg viewBox="0 0 64 64" className="w-10 h-10 text-[#0275d8] stroke-current fill-none stroke-2">
                <circle cx="32" cy="32" r="18" />
                <ellipse cx="32" cy="32" rx="8" ry="18" />
                <line x1="14" y1="32" x2="50" y2="32" />
                <circle cx="16" cy="18" r="3" fill="currentColor" />
                <circle cx="48" cy="18" r="3" fill="currentColor" />
                <circle cx="16" cy="46" r="3" fill="currentColor" />
                <line x1="18" y1="20" x2="26" y2="28" />
                <line x1="46" y1="20" x2="38" y2="28" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Global Thinking</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We think beyond borders—identifying opportunities across international markets to drive growth and long-term value for our partners.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GLOBALLY RENOWNED & TRUSTED / INNOVATIVE RESEARCH */}
      <section className="py-20 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="w-8 h-0.5 bg-[#0275d8]"></span>
          <span className="text-xs font-bold tracking-[0.2em] text-[#0275d8] uppercase">
            GLOBALLY RENOWNED & TRUSTED
          </span>
          <span className="w-8 h-0.5 bg-[#0275d8]"></span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Innovative Research & Growth Solutions
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl mx-auto pt-2">
          We provide comprehensive research and tailored investment solutions for emerging corporates. By combining in-depth market analysis with strategic asset management, we help businesses optimize capital, uncover high-potential opportunities, and achieve sustainable financial growth. Every decision is driven by insight, precision, and a focus on long-term value creation.
        </p>
      </section>

      {/* 4. COMPREHENSIVE INVESTMENT SOLUTIONS GRID (ALL 10 SECTORS) */}
      <section className="bg-[#f6f9fc] py-20 sm:py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Investment Solutions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              QUANTUM PLUS Industrial Partnership delivers diversified, high-performing investment opportunities across multiple global sectors. Our solutions are carefully structured to help both institutional and individual investors achieve sustainable growth, capital preservation, and long-term wealth creation.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {investmentSolutions.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group cursor-pointer"
                onClick={() => onSelectPlanAndInvest('veteran-plan')}
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-[#0275d8] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Strategy</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DARK NAVY LEADERSHIP STRATEGY & VIDEO SECTION */}
      <section className="bg-[#0c0a3e] text-white py-20 sm:py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Video Preview Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Dotted grid decoration on the left */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 grid grid-cols-4 gap-2 opacity-30 pointer-events-none">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                ))}
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md w-full border border-blue-900/50">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&auto=format&fit=crop&q=80"
                  alt="Leadership Discussion"
                  className="w-full h-80 object-cover"
                />
                {/* Play Button Overlay */}
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-[#0275d8] flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-[#0275d8] ml-1" />
                </button>
              </div>
            </div>

            {/* Right: Leadership & Targeted Opportunities Items */}
            <div className="lg:col-span-7 space-y-10 pl-0 lg:pl-6">
              {/* Item 1 */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Leadership Strategy</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    We craft strategic leadership approaches that drive growth, optimize asset allocation, and ensure strong market positioning for sustained investment success.
                  </p>
                </div>
              </div>

              {/* Dotted separator */}
              <div className="border-b border-blue-900/60 border-dashed"></div>

              {/* Item 2 */}
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Target className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Targeted Opportunities</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Our team identifies high-potential investment opportunities, leveraging market insights and analytical precision to deliver measurable returns and long-term value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WORLD MAP GLOBAL STATISTICS COUNTER SECTION */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="w-8 h-1 bg-[#0275d8] mx-auto mb-10"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-6xl font-black text-[#0275d8] tracking-tight">
                10k
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Global Customers</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-6xl font-black text-[#0275d8] tracking-tight">
                5k+
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Projects Completed</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-6xl font-black text-[#0275d8] tracking-tight">
                370
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Expert Employees</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-6xl font-black text-[#0275d8] tracking-tight">
                75+
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPERIENCE OUR EXPERTISE & DATA-DRIVEN PROFIT INSIGHTS */}
      <section className="bg-[#0c0a3e] text-white py-20 sm:py-24 border-t border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold tracking-[0.2em] text-[#00c2ff] uppercase">
                EXPERIENCE OUR EXPERTISE —
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Insightful, Data-Driven Profit Insights
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                Leverage fact-based analysis to track performance, optimize investments, and maximize financial growth with precision and clarity.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3 rounded-md bg-[#0275d8] hover:bg-[#025aa5] text-white text-xs font-bold flex items-center gap-2 transition"
                >
                  <span>Access Platform Metrics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Chart Card from screenshot */}
            <div className="lg:col-span-7 bg-[#0b152d]/90 rounded-2xl border border-blue-900/80 p-6 sm:p-8">
              <div className="h-64 sm:h-72 w-full relative flex items-end">
                {/* Horizontal grid lines with Y axis values */}
                <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right">20K</span>
                    <div className="flex-1 border-b border-blue-900/40"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right">15K</span>
                    <div className="flex-1 border-b border-blue-900/40"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right">10K</span>
                    <div className="flex-1 border-b border-blue-900/40"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right">5K</span>
                    <div className="flex-1 border-b border-blue-900/40"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-right">0</span>
                    <div className="flex-1 border-b border-blue-900/40"></div>
                  </div>
                </div>

                {/* SVG Curves matching the screenshot */}
                <div className="w-full h-full pl-10 pt-2 pb-6">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Orange curve */}
                    <path
                      d="M 0 50 Q 80 180, 150 140 T 250 80 T 350 160 T 450 60 T 500 40"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                    {/* Blue curve */}
                    <path
                      d="M 0 160 Q 90 20, 170 110 T 280 40 T 380 180 T 470 70 T 500 20"
                      fill="none"
                      stroke="#00c2ff"
                      strokeWidth="2.5"
                    />
                    {/* Indigo curve */}
                    <path
                      d="M 0 100 Q 100 120, 180 80 T 300 150 T 400 90 T 500 130"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>

              {/* X-axis years */}
              <div className="flex justify-between pl-10 text-[11px] font-mono text-slate-400 border-t border-blue-900/60 pt-2">
                <span>2015</span>
                <span>2016</span>
                <span>2017</span>
                <span>2018</span>
                <span>2019</span>
                <span>2020</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INVESTMENT PLANS (EXACT MATCH TO SCREENSHOTS) */}
      <section className="py-24 bg-white relative overflow-hidden" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-[0.2em] text-[#0275d8] uppercase">
                CHOOSE YOUR PLAN —
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Investment Plans
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-xs text-slate-500 max-w-sm">
                Select the plan that suits your financial goals and start growing your assets with confidence.
              </p>

              {/* Toggle Pills: Daily Returns vs Long-Term */}
              <div className="inline-flex p-1 rounded-full bg-[#f0f4f8] border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPlanTab('daily')}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                    planTab === 'daily'
                      ? 'bg-[#0275d8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daily Returns
                </button>
                <button
                  type="button"
                  onClick={() => setPlanTab('longterm')}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                    planTab === 'longterm'
                      ? 'bg-[#0275d8] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Long-Term
                </button>
              </div>
            </div>
          </div>

          {/* 3 Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedPlans.slice(0, 3).map((plan, index) => {
              const isCenter = index === 1; // Master Plan
              const headerColors = [
                'bg-[#1963b8]', // Veteran Plan blue
                'bg-[#1c4ca0]', // Master Plan vibrant blue
                'bg-[#203a7a]'  // Ultimate Plan dark blue
              ];
              const headerBg = headerColors[index % headerColors.length];

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Plan Title */}
                    <div className="p-6 text-center border-b border-slate-100">
                      <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    </div>

                    {/* Blue Highlight Header Block with Daily ROI */}
                    <div className={`${headerBg} p-7 text-center text-white space-y-1`}>
                      <div className="text-4xl font-extrabold tracking-tight">
                        {plan.dailyRoiPercent}%
                      </div>
                      <span className="text-xs font-medium text-blue-100 uppercase tracking-wider block">
                        / Day
                      </span>
                    </div>

                    {/* Daily returns caption */}
                    <div className="py-3 px-4 bg-slate-50 border-b border-slate-100 text-center text-[11px] text-slate-500 font-medium">
                      Daily returns for {plan.durationDays} days, ${plan.minDeposit.toLocaleString()}–${plan.maxDeposit.toLocaleString()}
                    </div>

                    {/* Features list */}
                    <div className="p-7 space-y-3.5 text-xs text-slate-600">
                      <div className="flex justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500">Minimum:</span>
                        <span className="font-semibold text-slate-800">${plan.minDeposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500">Maximum:</span>
                        <span className="font-semibold text-slate-800">
                          {plan.maxDeposit >= 1000000 ? 'Unlimited' : `$${plan.maxDeposit.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500">Duration:</span>
                        <span className="font-semibold text-slate-800">{plan.durationDays} Days</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-slate-500">Referral:</span>
                        <span className="font-semibold text-slate-800">5%</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-slate-500">Support:</span>
                        <span className="font-semibold text-slate-800">24/7 Customer Support</span>
                      </div>
                    </div>
                  </div>

                  {/* Button at bottom */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => onSelectPlanAndInvest(plan.id)}
                      className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition cursor-pointer ${
                        isCenter
                          ? 'bg-[#0275d8] hover:bg-[#025aa5] text-white shadow-md'
                          : 'bg-white hover:bg-slate-50 text-[#0275d8] border border-[#0275d8]'
                      }`}
                    >
                      GET STARTED
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION (MATCHING SCREENSHOT) */}
      <section className="py-20 sm:py-24 bg-[#f8fafc] border-t border-slate-100 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-0.5 bg-[#0275d8]"></span>
            <span className="text-xs font-bold tracking-[0.2em] text-[#0275d8] uppercase">
              TESTIMONIALS
            </span>
            <span className="w-8 h-0.5 bg-[#0275d8]"></span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Our Clients Are Saying
          </h2>

          {/* Quotation Icon */}
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0275d8] flex items-center justify-center mx-auto mt-4">
            <Quote className="w-6 h-6 fill-[#0275d8]" />
          </div>

          {/* Testimonial Quote */}
          <p className="text-sm sm:text-base text-slate-600 italic max-w-2xl mx-auto leading-relaxed pt-2">
            "{currentTestimonial.quote}"
          </p>

          {/* Client Avatars Row */}
          <div className="flex items-center justify-center gap-3 pt-6">
            {clientTestimonials.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTestimonialIdx(i)}
                className={`transition-all duration-200 rounded-full cursor-pointer ${
                  activeTestimonialIdx === i
                    ? 'ring-4 ring-[#0275d8] scale-110'
                    : 'opacity-60 hover:opacity-100 scale-95'
                }`}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              </button>
            ))}
          </div>

          {/* Active Client Name */}
          <div className="pt-2">
            <h4 className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
              {currentTestimonial.name}
            </h4>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE VIDEO MODAL */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-100 mb-3">
              QUANTUM PLUS Industrial Partnership Corporate Overview
            </h3>
            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&auto=format&fit=crop&q=80"
                alt="Executive Overview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute text-center p-6 space-y-2">
                <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block">
                  Presentation Mode
                </span>
                <p className="text-sm text-slate-200 max-w-md">
                  Institutional Multi-Asset Arbitrage & Industrial Infrastructure Operations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
