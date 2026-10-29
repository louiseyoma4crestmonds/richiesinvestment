import React, { useState } from 'react';
import { MapPin, Mail, User, ChevronRight, Check } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubscribed(true);
    setSubName('');
    setSubEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#071426] text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Office */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <defs>
                  <linearGradient id="qGradFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9a8ca6" />
                    <stop offset="100%" stopColor="#693082" />
                  </linearGradient>
                </defs>
                <rect x="20" y="20" width="60" height="60" rx="14" fill="none" stroke="url(#qGradFooter)" strokeWidth="12" />
                <path d="M55 55 L82 82" stroke="url(#qGradFooter)" strokeWidth="13" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col">
                <span className="font-extrabold text-white tracking-wider text-base leading-none">
                  QUANTUM PLUS
                </span>
                <span className="text-[7px] font-semibold tracking-[0.2em] text-slate-400 uppercase leading-tight mt-0.5">
                  INDUSTRIAL PARTNERSHIP
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Providing expert financial guidance and strategic investment solutions to help businesses and investors achieve sustainable growth and long-term success.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Swiss RE, Dufourstrasse 25, 3000 Bern 11, Switzerland</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@quantumindustrialpartnership.net</span>
              </div>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider relative inline-block">
              Useful Links
              <span className="block h-0.5 w-8 bg-blue-500 mt-1"></span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span className="text-blue-500 font-bold">&raquo;</span> About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span className="text-blue-500 font-bold">&raquo;</span> Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span className="text-blue-500 font-bold">&raquo;</span> Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span className="text-blue-500 font-bold">&raquo;</span> FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('plans')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <span className="text-blue-500 font-bold">&raquo;</span> Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: What We Do */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider relative inline-block">
              What We Do
              <span className="block h-0.5 w-8 bg-blue-500 mt-1"></span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> Financial Advice
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> Business Planning
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> Startup Help
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> Investment Strategy
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> Management Services
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> Market Research
              </li>
              <li className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition">
                <span className="text-blue-500 font-bold">&raquo;</span> SEO Optimization
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider relative inline-block">
              Newsletter
              <span className="block h-0.5 w-8 bg-blue-500 mt-1"></span>
            </h4>
            <p className="text-xs text-slate-400">Get in your inbox the latest News</p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <input
                    type="text"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-[#0b1c34] border border-slate-700/80 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-[#0b1c34] border border-slate-700/80 rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-[#0275d8] hover:bg-[#025aa5] text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          <p>&copy; 2006 QUANTUM PLUS Industrial Partnership - Business & Investment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
