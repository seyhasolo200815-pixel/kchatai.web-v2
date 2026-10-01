import React, { useState } from 'react';
import {
  Menu,
  Home,
  MessageSquare,
  FileText,
  User,
  Send,
  Sparkles,
  ArrowLeft,
  X,
  Plus
} from 'lucide-react';
import { SKYPRO_MASCOT } from '../assets/mascot';
import { QUICK_PROMPTS, HERO_FEATURES } from '../data/mockData';
import { askSkyProAI } from '../services/aiService';

interface MobileViewProps {
  onBackToDesktop: () => void;
  onOpenPricing: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  onBackToDesktop,
  onOpenPricing,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'chat' | 'docs' | 'account'>('home');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'សួស្តី! 👋 ខ្ញុំជា SkyPro AI តើខ្ញុំអាចជួយអ្នកបានអ្វីខ្លះ?',
      time: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const now = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, time: now }]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await askSkyProAI(text);
      setMessages(prev => [...prev, { sender: 'bot', text: res.text, time: now }]);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'សូមអភ័យទោស មានបញ្ហាបន្តិចបន្តួច សូមសាកម្តងទៀត។', time: now }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col justify-between bg-[#050b14] text-slate-100 shadow-2xl relative select-none">
      
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-blue-900/40 bg-[#070e1c]/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#071120]">
              <span className="font-extrabold text-xs text-cyan-300">S</span>
            </div>
          </div>
          <span className="text-base font-bold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Sky<span className="text-blue-400">Pro</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Back to desktop showcase button */}
          <button
            onClick={onBackToDesktop}
            className="flex items-center gap-1 rounded-lg border border-blue-900/60 bg-blue-950/40 px-2 py-1 text-xs text-cyan-300 hover:bg-blue-900/60"
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="text-[11px]">Showcase</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-14 inset-x-0 z-50 border-b border-blue-900/50 bg-[#070f22] p-4 shadow-2xl">
          <div className="flex flex-col space-y-2 text-sm">
            <button
              onClick={() => { setMobileTab('home'); setMenuOpen(false); }}
              className="rounded-lg p-2 text-left text-slate-200 hover:bg-blue-950/60"
            >
              ទំព័រដើម
            </button>
            <button
              onClick={() => { setMobileTab('chat'); setMenuOpen(false); }}
              className="rounded-lg p-2 text-left text-slate-200 hover:bg-blue-950/60"
            >
              Chat AI
            </button>
            <button
              onClick={() => { onOpenPricing(); setMenuOpen(false); }}
              className="rounded-lg p-2 text-left text-slate-200 hover:bg-blue-950/60"
            >
              តម្លៃកញ្ចប់ Pro
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        
        {/* Tab 1: Home View (Exact match to screenshot phone mockup!) */}
        {mobileTab === 'home' && (
          <div className="flex flex-col items-center justify-center text-center py-4">
            
            {/* Mascot Robot with Speech Bubble */}
            <div className="relative mb-4 mt-2">
              <div className="absolute -top-2 -right-4 z-10 rounded-xl border border-cyan-400/40 bg-[#0a1426]/95 px-3 py-1.5 shadow-[0_0_15px_rgba(34,211,238,0.25)] text-left">
                <p className="text-[10px] font-bold text-white leading-tight font-['Plus_Jakarta_Sans',sans-serif]">Hello!</p>
                <p className="text-[9px] text-blue-200 leading-tight font-['Plus_Jakarta_Sans',sans-serif]">I'm SkyPro</p>
                <p className="text-[9px] text-slate-300 leading-tight font-['Plus_Jakarta_Sans',sans-serif]">How can I help you?</p>
              </div>

              <div className="h-44 w-44 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-900/30 to-[#071120] p-2 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                <img
                  src={SKYPRO_MASCOT}
                  alt="SkyPro AI Mascot"
                  className="h-full w-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              SkyPro <span className="text-blue-400">AI</span>
            </h2>

            {/* Subtitle in Khmer */}
            <p className="mt-2 text-sm font-bold text-slate-100">
              សួរអ្វីក៏បាន... ខ្ញុំនឹងឆ្លើយតបជូនអ្នក!
            </p>

            {/* Description */}
            <p className="mt-2 text-xs text-slate-400 px-4 leading-relaxed">
              SkyPro AI ជាជំនួយការបញ្ញាសិប្បនិម្មិត ឆ្លើយតបជាភាសាខ្មែរ ជួយសរសេរអត្ថបទ សរសេរកូដ និងស្វែងរកចំណេះដឹង។
            </p>

            {/* Blue CTA button */}
            <button
              onClick={() => setMobileTab('chat')}
              className="mt-6 w-full max-w-xs rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] transition hover:bg-blue-500 active:scale-95"
            >
              ចាប់ផ្តើម Chat ឥឡូវនេះ
            </button>

            {/* Quick Action Prompt Shortcuts */}
            <div className="mt-8 w-full space-y-2 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-300">សំណើពេញនិយម</span>
                <span className="text-[11px] text-blue-400">ចុចដើម្បីសាកល្បង</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setMobileTab('chat');
                      handleSend(p.samplePrompt);
                    }}
                    className="flex flex-col rounded-xl border border-blue-900/40 bg-[#091326] p-2.5 text-left transition hover:border-blue-500/50"
                  >
                    <span className="text-xs font-bold text-white truncate">{p.title}</span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Mobile Chat */}
        {mobileTab === 'chat' && (
          <div className="flex flex-col h-full justify-between pb-1">
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-190px)] pr-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <img
                      src={SKYPRO_MASCOT}
                      alt="Bot"
                      className="h-7 w-7 rounded-full object-cover border border-cyan-400/40 shrink-0 mt-0.5"
                    />
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed max-w-[85%] ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'border border-blue-900/50 bg-[#0d1c38] text-slate-100 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span className="mt-1 block text-[9px] text-slate-400 opacity-70 text-right">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <img
                    src={SKYPRO_MASCOT}
                    alt="Bot"
                    className="h-7 w-7 rounded-full object-cover border border-cyan-400/40"
                  />
                  <div className="rounded-2xl rounded-tl-sm border border-blue-900/50 bg-[#0d1c38] px-3 py-2 text-xs text-blue-300">
                    <span className="animate-pulse">SkyPro កំពុងឆ្លើយតប...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Input */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-blue-900/60 bg-[#0a152d] px-3 py-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="សួរអ្វីក៏បាន..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend(inputVal);
                    }
                  }}
                />
                <button
                  onClick={() => handleSend(inputVal)}
                  disabled={!inputVal.trim() || isTyping}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Documents */}
        {mobileTab === 'docs' && (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-950 border border-blue-800/40 text-blue-400 mb-3">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-white">ឯកសាររបស់អ្នក</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              អ្នកអាចរក្សាទុកកំណត់ចំណាំ ការសរសេរកូដ និងអត្ថបទដែលបានបង្កើតដោយ AI នៅទីនេះ។
            </p>
            <button
              onClick={() => setMobileTab('chat')}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>បង្កើតឯកសារថ្មី</span>
            </button>
          </div>
        )}

        {/* Tab 4: Account */}
        {mobileTab === 'account' && (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-950 border border-blue-800/50 text-blue-400 mb-3">
              <User className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Guest User</h3>
            <p className="text-xs text-slate-400 mt-0.5">សូមស្វាគមន៍មកកាន់ SkyPro AI</p>

            <div className="mt-6 flex flex-col gap-2.5 px-4">
              <button
                onClick={onOpenPricing}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-md"
              >
                ដំឡើងទៅ SkyPro Pro
              </button>
              <button className="rounded-xl border border-slate-700 py-2.5 text-xs text-slate-300">
                ការកំណត់គណនី
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="sticky bottom-0 z-40 flex h-16 items-center justify-around border-t border-blue-900/40 bg-[#070f20] px-2 pb-1">
        <button
          onClick={() => setMobileTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            mobileTab === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-1">ទំព័រដើម</span>
        </button>

        <button
          onClick={() => setMobileTab('chat')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            mobileTab === 'chat' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] mt-1">Chat</span>
        </button>

        <button
          onClick={() => setMobileTab('docs')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            mobileTab === 'docs' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-[10px] mt-1">ឯកសារ</span>
        </button>

        <button
          onClick={() => setMobileTab('account')}
          className={`flex flex-col items-center justify-center py-1 transition ${
            mobileTab === 'account' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-1">គណនី</span>
        </button>
      </nav>

    </div>
  );
};
