import React, { useState } from 'react';
import {
  Menu,
  Home,
  MessageSquare,
  FileText,
  User,
  Send,
  Sparkles,
  Wifi,
  Battery,
  Maximize2
} from 'lucide-react';
import { SKYPRO_MASCOT } from '../assets/mascot';
import { QUICK_PROMPTS } from '../data/mockData';
import { askSkyProAI } from '../services/aiService';

interface PhoneMockupProps {
  onExpandMobileView?: () => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ onExpandMobileView }) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'chat' | 'docs' | 'account'>('home');
  const [mobileChatMessages, setMobileChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'សួស្តី! 👋 ខ្ញុំគឺ K-Chat AI តើខ្ញុំអាចជួយអ្វីអ្នកបានថ្ងៃនេះ?' }
  ]);
  const [mobileInput, setMobileInput] = useState('');
  const [mobileIsTyping, setMobileIsTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileSend = async (text: string) => {
    if (!text.trim() || mobileIsTyping) return;
    setMobileChatMessages(prev => [...prev, { sender: 'user', text }]);
    setMobileInput('');
    setMobileIsTyping(true);

    try {
      const res = await askSkyProAI(text);
      setMobileChatMessages(prev => [...prev, { sender: 'bot', text: res.text }]);
    } catch (err: any) {
      setMobileChatMessages(prev => [...prev, { sender: 'bot', text: `⚠️ ${err?.message || 'មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Gemini API'}` }]);
    } finally {
      setMobileIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header bar above phone mockup with controls */}
      <div className="mb-2 flex w-full max-w-[285px] items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ទម្រង់ទូរស័ព្ទ (Live Mobile)
        </span>
        {onExpandMobileView && (
          <button
            onClick={onExpandMobileView}
            className="flex items-center gap-1 rounded-md bg-blue-900/40 px-2 py-0.5 text-[10px] text-cyan-300 border border-blue-500/30 hover:bg-blue-800/50 transition"
            title="ពង្រីកពេញអេក្រង់"
          >
            <Maximize2 className="h-2.5 w-2.5" />
            <span>ពង្រីក</span>
          </button>
        )}
      </div>

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-[285px] h-[585px] rounded-[44px] bg-[#0c1424] p-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(37,99,235,0.25)] border-2 border-slate-700/80 transition-transform duration-300 hover:scale-[1.01]">
        
        {/* Subtle Side Button notches */}
        <div className="absolute -left-[5px] top-24 h-9 w-[3px] rounded-l-md bg-slate-600" />
        <div className="absolute -left-[5px] top-36 h-9 w-[3px] rounded-l-md bg-slate-600" />
        <div className="absolute -right-[5px] top-28 h-12 w-[3px] rounded-r-md bg-slate-600" />

        {/* Inner Phone Screen Container */}
        <div className="relative h-full w-full rounded-[38px] bg-[#050b14] overflow-hidden flex flex-col justify-between border border-slate-900 select-none">
          
          {/* Top Status Bar (9:41, Dynamic Island, Network, Battery) */}
          <div className="relative z-30 flex h-7 items-center justify-between px-5 pt-1.5 text-white">
            <span className="text-[10px] font-bold tracking-tight">9:41</span>
            
            {/* Dynamic Island pill */}
            <div className="h-3.5 w-20 rounded-full bg-black flex items-center justify-end px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#111c30] ring-1 ring-slate-800" />
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <span className="text-[9px] font-semibold">5G</span>
              <Wifi className="h-2.5 w-2.5" />
              <Battery className="h-2.5 w-2.5" />
            </div>
          </div>

          {/* App Header inside phone */}
          <div className="relative z-20 flex h-11 items-center justify-between px-3 border-b border-blue-900/30 bg-[#070e1c]/90">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[5px] bg-[#071120]">
                  <span className="font-black text-[9px] text-cyan-300">S</span>
                </div>
              </div>
              <span className="text-xs font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Sky<span className="text-blue-400">Pro</span>
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-slate-300 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Dropdown Menu if toggled */}
          {mobileMenuOpen && (
            <div className="absolute top-[72px] inset-x-0 z-40 bg-[#070f22] border-b border-blue-900/50 p-3 shadow-xl">
              <div className="flex flex-col space-y-1.5 text-xs">
                <button
                  onClick={() => { setMobileTab('home'); setMobileMenuOpen(false); }}
                  className="rounded px-2 py-1 text-left text-slate-200 hover:bg-blue-950/60"
                >
                  ទំព័រដើម
                </button>
                <button
                  onClick={() => { setMobileTab('chat'); setMobileMenuOpen(false); }}
                  className="rounded px-2 py-1 text-left text-slate-200 hover:bg-blue-950/60"
                >
                  Chat ជាមួយ AI
                </button>
                <button
                  onClick={() => { setMobileTab('docs'); setMobileMenuOpen(false); }}
                  className="rounded px-2 py-1 text-left text-slate-200 hover:bg-blue-950/60"
                >
                  ឯកសារ
                </button>
              </div>
            </div>
          )}

          {/* Main Mobile Screen Content */}
          <div className="relative flex-1 overflow-y-auto px-3 py-2">
            
            {/* Screen View: Home (Matches Phone in Screenshot exactly!) */}
            {mobileTab === 'home' && (
              <div className="flex flex-col items-center justify-center pt-2 pb-3 text-center">
                
                {/* Robot Mascot with Speech Bubble (Matches image!) */}
                <div className="relative mb-2 mt-1">
                  {/* Floating speech bubble */}
                  <div className="absolute -top-1 -right-3 z-10 rounded-lg border border-cyan-400/40 bg-[#0a1426]/95 px-2 py-1 shadow-md text-left">
                    <p className="text-[8px] font-bold text-white leading-none">Hello!</p>
                    <p className="text-[7px] text-blue-200 leading-none">I'm K-Chat</p>
                    <p className="text-[7px] text-cyan-300 leading-none">AI Assistant</p>
                  </div>

                  {/* Mascot circle image */}
                  <div className="relative h-24 w-24 rounded-2xl border border-blue-500/30 bg-[#0b162c] p-1 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                    <img
                      src={SKYPRO_MASCOT}
                      alt="K-Chat Mobile Mascot"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Big Title */}
                <h3 className="text-lg font-extrabold text-white tracking-tight mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                  K-Chat <span className="text-blue-400">AI</span>
                </h3>

                {/* Subtitle in Khmer */}
                <p className="mt-1 text-xs font-bold text-slate-100 px-2 leading-tight">
                  សួរអ្វីក៏បាន... ខ្ញុំនឹងឆ្លើយតបជូនអ្នក!
                </p>

                {/* Blue CTA button (Starts Chat inside phone!) */}
                <button
                  onClick={() => setMobileTab('chat')}
                  className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-center text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition hover:bg-blue-500 active:scale-95"
                >
                  ចាប់ផ្តើម Chat ឥឡូវនេះ
                </button>

                {/* Mini Quick Prompts on Mobile */}
                <div className="mt-4 w-full space-y-1.5 text-left">
                  <p className="text-[10px] font-semibold text-slate-400">សំណើពេញនិយម៖</p>
                  {QUICK_PROMPTS.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setMobileTab('chat');
                        handleMobileSend(p.samplePrompt);
                      }}
                      className="w-full rounded-lg border border-blue-950/60 bg-[#091224]/80 px-2.5 py-1.5 text-[10px] text-slate-200 hover:border-blue-500/40 hover:bg-[#0c1830] transition truncate text-left"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {/* Screen View: Mobile Chat View */}
            {mobileTab === 'chat' && (
              <div className="flex flex-col h-full justify-between pb-1">
                <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1">
                  {mobileChatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`rounded-xl px-2.5 py-1.5 text-[11px] leading-relaxed max-w-[88%] ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'border border-blue-900/50 bg-[#0d1c38] text-slate-200'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}

                  {mobileIsTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-xl border border-blue-900/50 bg-[#0d1c38] px-2.5 py-1.5 text-[10px] text-blue-300">
                        SkyPro កំពុងវាយ...
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Chat Input Form */}
                <div className="pt-2">
                  <div className="flex items-center gap-1 rounded-lg border border-blue-900/60 bg-[#0a152d] px-2 py-1">
                    <input
                      type="text"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      placeholder="សួរអ្វីក៏បាន..."
                      className="flex-1 bg-transparent text-[11px] text-white placeholder-slate-500 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleMobileSend(mobileInput);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleMobileSend(mobileInput)}
                      className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white"
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Screen View: Docs */}
            {mobileTab === 'docs' && (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 mb-2">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white">ឯកសាររបស់អ្នក</h4>
                <p className="text-[10px] text-slate-400 mt-1">គ្មានឯកសារនៅឡើយទេ</p>
                <button
                  onClick={() => setMobileTab('chat')}
                  className="mt-3 rounded-lg bg-blue-600/30 border border-blue-500/40 px-3 py-1 text-[10px] text-blue-200"
                >
                  បង្កើតឯកសារថ្មីជាមួយ AI
                </button>
              </div>
            )}

            {/* Screen View: Account */}
            {mobileTab === 'account' && (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950/80 text-blue-400 mb-2">
                  <User className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white">Guest User</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">សូមស្វាគមន៍មកកាន់ SkyPro AI</p>
                <div className="mt-3 flex flex-col gap-1.5 px-3">
                  <button className="rounded-lg bg-blue-600 py-1.5 text-[10px] font-bold text-white">
                    ចូលគណនី
                  </button>
                  <button className="rounded-lg border border-slate-700 py-1.5 text-[10px] text-slate-300">
                    ចុះឈ្មោះគណនីថ្មី
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Mobile Tab Bar (Matches Screenshot Exactly!) */}
          <div className="relative z-30 flex h-12 items-center justify-around border-t border-blue-900/40 bg-[#070f20] px-1">
            
            {/* 1. Home Tab */}
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center justify-center py-1 transition ${
                mobileTab === 'home' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-[9px] mt-0.5">ទំព័រដើម</span>
            </button>

            {/* 2. Chat Tab */}
            <button
              onClick={() => setMobileTab('chat')}
              className={`flex flex-col items-center justify-center py-1 transition ${
                mobileTab === 'chat' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-[9px] mt-0.5">Chat</span>
            </button>

            {/* 3. Docs Tab */}
            <button
              onClick={() => setMobileTab('docs')}
              className={`flex flex-col items-center justify-center py-1 transition ${
                mobileTab === 'docs' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="text-[9px] mt-0.5">ឯកសារ</span>
            </button>

            {/* 4. Account Tab */}
            <button
              onClick={() => setMobileTab('account')}
              className={`flex flex-col items-center justify-center py-1 transition ${
                mobileTab === 'account' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="text-[9px] mt-0.5">គណនី</span>
            </button>
          </div>

          {/* iPhone Home Indicator bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-24 rounded-full bg-slate-600" />
        </div>
      </div>
    </div>
  );
};
