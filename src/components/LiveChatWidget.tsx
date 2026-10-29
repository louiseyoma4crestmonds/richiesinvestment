import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ShieldCheck, CheckCheck } from 'lucide-react';
import { UserProfile, ChatMessage } from '../server/db.ts';
import { apiClient } from '../services/apiClient.ts';

interface LiveChatWidgetProps {
  user?: UserProfile | null;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persistent guest identifier if not authenticated
  const [guestId] = useState<string>(() => {
    const existing = localStorage.getItem('qip_chat_guest_id');
    if (existing) return existing;
    const newId = 'guest-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('qip_chat_guest_id', newId);
    return newId;
  });

  const activeUserId = user?.uid || guestId;
  const activeUserName = user?.displayName || user?.username || 'Guest Investor';
  const activeUserEmail = user?.email || '';

  // Load chat messages from backend
  const loadMessages = async () => {
    try {
      const res = await apiClient.getChatMessages(undefined, activeUserId);
      if (res && res.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.warn('Could not load chat messages:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
      const interval = setInterval(loadMessages, 3500);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeUserId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    const userText = inputVal.trim();
    setInputVal('');
    setIsSending(true);

    try {
      const res = await apiClient.sendChatMessage({
        userId: activeUserId,
        userName: activeUserName,
        userEmail: activeUserEmail,
        text: userText
      });

      if (res && res.success && res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-[#0275d8] hover:bg-[#025aa5] text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-200 transform hover:scale-105 cursor-pointer font-semibold text-sm group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse"></span>
            <span>Live Chat</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 fill-white" />
            </div>
          </button>
        ) : (
          /* Chat Window */
          <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[480px] animate-fadeIn">
            {/* Header */}
            <div className="bg-[#0b1b36] p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs relative">
                  <span>QIP</span>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0b1b36] rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs">QUANTUM PLUS Support Desk</h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-semibold">
                      Live
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-200">London Institutional Desk</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {/* Default Welcome Notice */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0d3b66] text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Welcome, {activeUserName}!</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Messages sent here are received directly by our online account administrators on the management portal.
                </p>
              </div>

              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <p>How can our investment desk assist you today?</p>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5 px-1">
                    <span className="text-[9px] font-bold text-slate-400">
                      {m.sender === 'admin' ? '🛡️ Desk Admin' : m.senderName || 'You'}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs text-xs ${
                      m.sender === 'user'
                        ? 'bg-[#0275d8] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                    <span>{m.timeAgo || new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {m.sender === 'user' && (
                      <CheckCheck className={`w-3 h-3 ${m.read ? 'text-blue-500' : 'text-slate-400'}`} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your message to admin..."
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0275d8]"
              />
              <button
                type="submit"
                disabled={isSending || !inputVal.trim()}
                className="p-2 rounded-xl bg-[#0275d8] hover:bg-[#025aa5] disabled:opacity-50 text-white shrink-0 cursor-pointer transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
