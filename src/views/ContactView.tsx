import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Partnership Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ id: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessInfo(null);

    if (!name || !email || !message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.submitSupport({ name, email, subject, message });
      if (res.success) {
        setSuccessInfo({ id: res.ticketId, message: res.message });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setErrorMsg(res.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setErrorMsg('Error contacting Express server: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Client Relations Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Get in Touch with QIP
          </h1>
          <p className="text-sm text-slate-600">
            Our global operations and London compliance desks are ready to assist with account funding, corporate escrow, or portfolio inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: London Office Info & Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">London Corporate HQ</h3>
                  <p className="text-xs text-slate-500">QUANTUM PLUS Industrial Partnership Limited</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Registered Office:</span>
                    <span className="text-slate-600">120 London Wall, London, EC2Y 5ET, United Kingdom</span>
                    <span className="text-[10px] text-blue-600 font-bold block mt-0.5">Companies House #13894210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Direct Email Desks:</span>
                    <p className="text-slate-600">support@quantumindustrialpartnership.net</p>
                    <p className="text-slate-600">compliance@quantumindustrialpartnership.net</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Direct Phone Line:</span>
                    <span className="text-slate-600 font-mono">+44 20 7946 0918 (UK Institutional)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Hours of Operation:</span>
                    <span className="text-slate-600">Monday - Friday: 08:00 - 20:00 GMT (Trading Desks 24/7)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Support Ticket Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Submit an Inquiry</h3>
            <p className="text-xs text-slate-500 mb-6">
              Inquiries are stored directly in our database and routed to your dedicated account officer.
            </p>

            {successInfo && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ticket #{successInfo.id} Submitted Successfully</span>
                </div>
                <p className="text-emerald-700 pl-6">{successInfo.message}</p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maximilian Vance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                >
                  <option value="General Partnership Inquiry">General Partnership Inquiry</option>
                  <option value="Deposit & Capital Funding Assistance">Deposit & Capital Funding Assistance</option>
                  <option value="Institutional VIP Node Allocation ($100k+)">Institutional VIP Node Allocation ($100k+)</option>
                  <option value="Withdrawal Settlement Status">Withdrawal Settlement Status</option>
                  <option value="Affiliate Network & Representative Application">Affiliate Network & Representative Application</option>
                  <option value="Corporate Compliance & UK Escrow">Corporate Compliance & UK Escrow</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide details regarding your question or capital investment plans..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to London Desk...' : 'Transmit Inquiry to Support Desk'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
