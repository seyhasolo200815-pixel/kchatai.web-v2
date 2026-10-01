import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  History,
  FileText,
  Settings,
  Send,
  Paperclip,
  Image as ImageIcon,
  Globe,
  User,
  Copy,
  Check,
  Volume2,
  Trash2,
  FileEdit,
  Lightbulb,
  Languages,
  Code2,
  Sparkles,
  Bot
} from 'lucide-react';
import { ChatMessage } from '../types';
import { QUICK_PROMPTS } from '../data/mockData';
import { askSkyProAI } from '../services/aiService';
import { SKYPRO_MASCOT } from '../assets/mascot';
import { MarkdownRenderer } from './MarkdownRenderer';

interface InteractiveChatProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  selectedFeatureTrigger?: string;
}

export const InteractiveChat: React.FC<InteractiveChatProps> = ({
  onOpenAuth,
  selectedFeatureTrigger,
}) => {
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chat' | 'history' | 'docs' | 'settings'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [webSearchActive, setWebSearchActive] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle feature click from parent
  useEffect(() => {
    if (selectedFeatureTrigger) {
      const match = QUICK_PROMPTS.find(p => p.id.includes(selectedFeatureTrigger) || selectedFeatureTrigger.includes(p.id));
      if (match) {
        handleSendPrompt(match.samplePrompt, match.id);
      }
    }
  }, [selectedFeatureTrigger]);

  const handleSendPrompt = async (promptText: string, categoryId?: string) => {
    if (!promptText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await askSkyProAI(promptText);
      const botMsg: ChatMessage = {
        id: 'bot-' + (Date.now() + 1),
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' }),
        codeSnippet: response.codeSnippet
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: `⚠️ ${err?.message || 'មានបញ្ហាក្នុងការតភ្ជាប់ សូមព្យាយាមម្តងទៀត។'}`,
        timestamp: new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleSendPrompt(inputVal);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try khmer voice if present, otherwise default
      const voices = window.speechSynthesis.getVoices();
      const kmVoice = voices.find(v => v.lang.includes('km') || v.lang.includes('kh'));
      if (kmVoice) utterance.voice = kmVoice;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getQuickIcon = (iconName: string) => {
    const props = { className: "h-4 w-4 text-blue-400 group-hover:text-cyan-300" };
    switch (iconName) {
      case 'FileEdit':
        return <FileEdit {...props} />;
      case 'Globe':
        return <Globe {...props} />;
      case 'Lightbulb':
        return <Lightbulb {...props} />;
      case 'Languages':
        return <Languages {...props} />;
      case 'Code2':
        return <Code2 {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div id="interactive-chat" className="flex flex-col lg:flex-row h-[590px] w-full rounded-2xl border border-blue-900/50 bg-[#070e1c] shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
      
      {/* Left Chat Sidebar (SkyPro App style) */}
      <div className="hidden md:flex w-52 flex-col justify-between border-r border-blue-900/40 bg-[#060b17] p-4">
        <div>
          {/* Sidebar App Logo */}
          <div className="flex items-center gap-2 px-2 py-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#071120]">
                <span className="font-black text-xs text-cyan-300">S</span>
              </div>
            </div>
            <span className="text-base font-bold text-white tracking-tight">SkyPro</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveSidebarTab('chat')}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                activeSidebarTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('history')}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                activeSidebarTab === 'history'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <History className="h-4 w-4" />
              <span>ប្រវត្តិ Chat</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('docs')}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                activeSidebarTab === 'docs'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>ឯកសារ</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('settings')}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                activeSidebarTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>ការកំណត់</span>
            </button>
          </nav>
        </div>

        {/* User Card at Bottom of Sidebar */}
        <div className="rounded-xl border border-blue-950 bg-[#081326] p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/60 text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">Guest User</p>
              <p className="text-[10px] text-slate-400 truncate">សូមស្វាគមន៍!</p>
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('login')}
            className="mt-2.5 w-full rounded-md border border-blue-800/60 bg-blue-950/40 py-1 text-center text-[11px] font-semibold text-blue-300 transition hover:bg-blue-900/40 hover:text-white"
          >
            ចូលគណនី
          </button>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="flex flex-1 flex-col justify-between bg-[#081224]/80">
        
        {/* Workspace Header */}
        <div className="flex h-14 items-center justify-between border-b border-blue-900/40 px-4 bg-[#070f1e]/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={SKYPRO_MASCOT}
                alt="SkyPro Avatar"
                className="h-9 w-9 rounded-full object-cover border border-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070f1e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">SkyPro AI</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                title="សម្អាតសារ (Clear Chat)"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">សម្អាត</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Scrollable Area */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Default Welcome Message from SkyPro Bot */}
          <div className="flex items-start gap-3">
            <img
              src={SKYPRO_MASCOT}
              alt="Bot"
              className="h-8 w-8 rounded-full object-cover border border-blue-400/30 shrink-0"
            />
            <div className="rounded-2xl rounded-tl-sm border border-blue-900/50 bg-[#0d1c38]/90 px-4 py-3 text-sm text-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.2)] max-w-[85%]">
              <p className="font-semibold text-white">
                សួស្តី! 👋 ខ្ញុំជា SkyPro AI
              </p>
              <p className="text-slate-300 mt-1">
                ខ្ញុំអាចជួយអ្នកបានអ្វីខ្លះ?
              </p>
            </div>
          </div>

          {/* Quick Action Prompt Cards (Visible when conversation is fresh) */}
          {messages.length === 0 && (
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSendPrompt(prompt.samplePrompt, prompt.id)}
                    className="group flex items-start gap-3 rounded-xl border border-blue-950 bg-[#0a152d]/90 p-3 text-left transition hover:border-blue-500/50 hover:bg-[#0f2144] hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-800/40 shrink-0 group-hover:scale-105 transition">
                      {getQuickIcon(prompt.icon)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {prompt.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {prompt.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render Active Conversation Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <img
                  src={SKYPRO_MASCOT}
                  alt="Bot"
                  className="h-8 w-8 rounded-full object-cover border border-cyan-400/30 shrink-0"
                />
              )}

              <div
                className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md ${
                  msg.sender === 'user'
                    ? 'rounded-tr-sm bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                    : 'rounded-tl-sm border border-blue-900/50 bg-[#0d1c38]/90 text-slate-100'
                }`}
              >
                {msg.sender === 'bot' ? (
                  <MarkdownRenderer content={msg.text} />
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                    {msg.text}
                  </div>
                )}

                {/* Optional Code Snippet block */}
                {msg.codeSnippet && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-700 bg-[#050b14] text-left">
                    <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5 text-[11px] text-slate-400">
                      <span className="font-mono uppercase">{msg.codeSnippet.language}</span>
                      <button
                        onClick={() => handleCopy(msg.codeSnippet!.code, msg.id + '-code')}
                        className="flex items-center gap-1 text-blue-400 hover:text-cyan-300"
                      >
                        {copiedId === msg.id + '-code' ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px]">បានចម្លង</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span className="text-[10px]">ចម្លងកូដ</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-3 text-[11px] font-mono text-cyan-200">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Message Footer / Actions */}
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-cyan-300"
                        title="ចម្លងអត្ថបទ"
                      >
                        {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-cyan-300"
                        title="ស្តាប់សំឡេង"
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-white shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <img
                src={SKYPRO_MASCOT}
                alt="Bot"
                className="h-8 w-8 rounded-full object-cover border border-cyan-400/30"
              />
              <div className="rounded-2xl rounded-tl-sm border border-blue-900/50 bg-[#0d1c38]/90 px-4 py-3">
                <div className="flex items-center space-x-1.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-sky-300 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar (Matches Image Bottom Toolbar) */}
        <form onSubmit={handleFormSubmit} className="border-t border-blue-900/40 bg-[#070f1e] p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-xl border border-blue-900/60 bg-[#0c1830] px-3 py-2 shadow-inner focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            
            {/* Attachment Icons */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-slate-800 hover:text-slate-200"
                title="ភ្ជាប់ឯកសារ"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-slate-800 hover:text-slate-200"
                title="បញ្ចូលរូបភាព"
              >
                <ImageIcon className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setWebSearchActive(!webSearchActive)}
                className={`rounded-lg p-1.5 transition ${
                  webSearchActive
                    ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={webSearchActive ? "ស្វែងរកបណ្តាញអ៊ីនធឺណិត (បើក)" : "ស្វែងរកបណ្តាញអ៊ីនធឺណិត (បិទ)"}
              >
                <Globe className="h-4 w-4" />
              </button>
            </div>

            {/* Input field */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="សួរអ្វីក៏បាន..."
              className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none"
            />

            {/* Blue Send Button (Airplane / Arrow) */}
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition duration-200 ${
                inputVal.trim() && !isTyping
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)] hover:bg-blue-500 hover:scale-105 active:scale-95'
                  : 'bg-blue-900/30 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
