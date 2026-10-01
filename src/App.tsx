/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Paperclip, ArrowUp, ArrowDown, Mic, MicOff, X, FileText, Image as ImageIcon, 
  Copy, Check, Plus, MessageSquare, Trash2, Menu, AlertCircle, Sparkles
} from "lucide-react";
import { MarkdownRenderer } from "./components/MarkdownRenderer";

// SkyPro AI SVG Logo
export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        <path d="M6 38L24 6L42 38L24 30L6 38Z" fill="url(#skypro-grad-primary)" stroke="#0284C7" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 28L24 14L32 28L24 24L16 28Z" fill="url(#skypro-grad-core)" />
        <circle cx="24" cy="23" r="3" fill="#FFFFFF" />
        <defs>
          <linearGradient id="skypro-grad-primary" x1="6" y1="6" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="0.5" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="skypro-grad-core" x1="16" y1="14" x2="32" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

interface Attachment {
  name: string;
  mimeType: string;
  base64: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  isError?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [apiErrorBanner, setApiErrorBanner] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Web Speech API Voice Transcription Handler
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("កម្មវិធីរុករក (Browser) របស់អ្នកមិនទាន់គាំទ្រ Web Speech API ទេ។ សូមប្រើ Google Chrome ឬ Safari។");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // Try Khmer first, fallback to browser default if not supported
      recognition.lang = "km-KH";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const newText = (final || interim).trim();
        if (newText) {
          setInputPrompt((prev) => {
            const base = prev.trim();
            if (!base) return newText;
            if (base.endsWith(newText)) return base;
            return `${base} ${newText}`;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Monitor scroll in message feed container to show/hide scroll to bottom button
  const handleMessagesScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // Show button when scrolled up more than 120px from bottom
    const isAwayFromBottom = scrollHeight - scrollTop - clientHeight > 120;
    setShowScrollBottom(isAwayFromBottom);
  };

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollBottom(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("skypro_saved_sessions");
    if (saved) {
      try {
        const parsed: ChatSession[] = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) setCurrentSessionId(parsed[0].id);
        else initNewChat();
      } catch {
        initNewChat();
      }
    } else {
      initNewChat();
    }
  }, []);

  useEffect(() => {
    // Only auto scroll down if user is near the bottom
    if (!messagesContainerRef.current || !showScrollBottom) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sessions, isLoading]);

  const saveSessions = (data: ChatSession[]) => {
    setSessions(data);
    localStorage.setItem("skypro_saved_sessions", JSON.stringify(data));
  };

  const initNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "ការសន្ទនាថ្មី",
      messages: [],
    };
    const updated = [newChat, ...sessions];
    saveSessions(updated);
    setCurrentSessionId(newChat.id);
  };

  const deleteChat = (id: string) => {
    const filtered = sessions.filter((s) => s.id !== id);
    saveSessions(filtered);
    if (currentSessionId === id) {
      if (filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
      } else {
        initNewChat();
      }
    }
  };

  const activeChat = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            base64: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt !== undefined ? overridePrompt : inputPrompt;
    if ((!promptToSend.trim() && attachments.length === 0) || isLoading || !activeChat) return;

    setApiErrorBanner(null);

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Generous fallback timeout (90s) only if network completely drops, allowing full long answers and code
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 90000);

    const userMessage: Message = {
      role: "user",
      content: promptToSend,
      attachments: attachments,
    };

    const lowerPrompt = promptToSend.toLowerCase();
    const isImgTask =
      lowerPrompt.includes("គូរ") ||
      lowerPrompt.includes("បង្កើតរូប") ||
      lowerPrompt.includes("ចង់បានរូប") ||
      lowerPrompt.includes("draw") ||
      lowerPrompt.includes("generate image") ||
      lowerPrompt.includes("create image") ||
      lowerPrompt.includes("picture of") ||
      lowerPrompt.includes("wallpaper") ||
      lowerPrompt.includes("photo of") ||
      (attachments.length > 0 &&
        (lowerPrompt.includes("ស្ទីល") ||
          lowerPrompt.includes("style") ||
          lowerPrompt.includes("recreate") ||
          lowerPrompt.includes("រូប")));
    setIsGeneratingImage(isImgTask);

    const updatedMessages = [...activeChat.messages, userMessage];
    const newTitle = activeChat.messages.length === 0 
      ? (promptToSend.slice(0, 24) || "ការវិភាគឯកសារ/រូបភាព") 
      : activeChat.title;

    // Immediately show user message + streaming placeholder
    const withReplyMessages = [...updatedMessages, { role: "assistant" as const, content: "" }];

    const newSessions = sessions.map((s) =>
      s.id === activeChat.id ? { ...s, title: newTitle, messages: withReplyMessages } : s
    );
    saveSessions(newSessions);

    const sentAttachments = [...attachments];
    setInputPrompt("");
    setAttachments([]);
    setIsLoading(true);

    try {
      // Connect to fast streaming endpoint with AbortController signal
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments
          })),
          attachments: sentAttachments,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        let errMsg = errJson.error;
        if (!errMsg) {
          if (res.status === 404) {
            errMsg = "មិនអាចស្វែងរក API Route (/api/chat) បានទេ (HTTP 404)។ សូមពិនិត្យមើល Vercel Serverless Function ឬ Environment Variables។";
          } else if (res.status === 401) {
            errMsg = "មិនទាន់កំណត់ API Key នៅឡើយទេ។ សូមកំណត់ GEMINI_API_KEY នៅក្នុង Vercel Project Settings។";
          } else {
            errMsg = `HTTP ${res.status}: បរាជ័យក្នុងការតភ្ជាប់`;
          }
        }
        throw new Error(errMsg);
      }

      if (!res.body) {
        throw new Error("មិនអាចទទួល Response Stream បានទេ");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamAccumulator = "";
      let hasReceivedFirstToken = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          streamAccumulator += chunk;

          if (!hasReceivedFirstToken) {
            hasReceivedFirstToken = true;
            // Immediately append first token and clear thinking indicator the millisecond it arrives
            setIsLoading(false);
            setIsGeneratingImage(false);
          }

          setSessions((prev) =>
            prev.map((s) => {
              if (s.id === activeChat.id) {
                const msgs = [...s.messages];
                msgs[msgs.length - 1] = {
                  role: "assistant",
                  content: streamAccumulator,
                };
                return { ...s, messages: msgs };
              }
              return s;
            })
          );
        }
      }

      // Finalize and save
      setSessions((currentSessions) => {
        localStorage.setItem("skypro_saved_sessions", JSON.stringify(currentSessions));
        return currentSessions;
      });

    } catch (err: any) {
      console.error("Chat Error:", err);
      let rawMsg = err?.message || "";
      let errorMessage = "សូមអភ័យទោស ប្រព័ន្ធកំពុងមមាញឹកបន្តិច។ សូមមេត្តាសាកល្បងម្ដងទៀតនៅបន្តិចក្រោយនេះ។";

      if (err?.name === "AbortError") {
        errorMessage = "ការតភ្ជាប់ត្រូវបានកាត់ផ្តាច់ ឬផុតកំណត់។ សូមសាកល្បងម្តងទៀត។";
      } else if (
        rawMsg &&
        !rawMsg.includes("{") &&
        !rawMsg.includes("ApiError") &&
        !rawMsg.includes("503") &&
        !rawMsg.includes("429") &&
        !rawMsg.includes("UNAVAILABLE")
      ) {
        errorMessage = rawMsg;
      }

      setApiErrorBanner(errorMessage);

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeChat.id) {
            const msgs = [...s.messages];
            const lastMsg = msgs[msgs.length - 1];
            // If some content was already streamed, keep it!
            if (!lastMsg.content) {
              msgs[msgs.length - 1] = {
                role: "assistant",
                content: errorMessage,
                isError: true,
              };
            }
            return { ...s, messages: msgs };
          }
          return s;
        })
      );
    } finally {
      clearTimeout(timeoutId);
      abortControllerRef.current = null;
      setIsLoading(false);
      setIsGeneratingImage(false);
    }
  };

  const copyText = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleQuickPromptClick = (promptText: string) => {
    sendMessage(promptText);
  };

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-white text-slate-800 font-['Kantumruy_Pro',sans-serif]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static top-0 bottom-0 left-0 z-50 w-72 bg-[#F0F4F9] border-r border-slate-200/80 flex flex-col transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                K-Chat AI
              </span>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider">AI ASSISTANT</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => {
              initNewChat();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2 justify-center py-2.5 px-4 rounded-2xl bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 text-slate-800 text-sm font-medium transition shadow-2xs cursor-pointer"
          >
            <Plus size={16} className="text-blue-600" /> ការសន្ទនាថ្មី
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {sessions.map((item) => (
            <div
              key={item.id}
              onClick={() => { 
                setCurrentSessionId(item.id); 
                setSidebarOpen(false); 
              }}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-sm transition ${
                item.id === currentSessionId
                  ? "bg-[#D3E3FD]/70 text-blue-900 font-medium border border-blue-200"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MessageSquare size={15} className={`shrink-0 ${item.id === currentSessionId ? "text-blue-600" : "text-slate-400"}`} />
                <span className="truncate">{item.title}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteChat(item.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 transition"
                title="លុបការសន្ទនា"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CHAT WORKSPACE */}
      <main className="flex-1 flex flex-col h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-white relative">
        {/* Top Header - Sticky Top */}
        <header className="sticky top-0 z-30 shrink-0 h-14 border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-4 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="បើកម៉ឺនុយ"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm md:text-base font-semibold text-slate-800 truncate max-w-xs md:max-w-md">
              {activeChat?.title || "K-Chat AI"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => initNewChat()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition shadow-2xs"
              title="ការសន្ទនាថ្មី"
            >
              <Plus size={14} className="text-blue-600" />
              <span className="hidden sm:inline">ការសន្ទនាថ្មី</span>
            </button>
          </div>
        </header>

        {apiErrorBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <span>{apiErrorBanner}</span>
            </div>
            <button onClick={() => setApiErrorBanner(null)} className="text-amber-600 hover:text-amber-800">
              <X size={14} />
            </button>
          </div>
        )}

        {/* MESSAGES FEED CONTAINER */}
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="flex-1 overflow-y-auto overscroll-y-contain px-3 sm:px-4 md:px-8 py-4 relative scroll-smooth bg-white"
        >
          {activeChat && activeChat.messages.length > 0 ? (
            activeChat.messages.map((m, idx) => (
              <div key={idx} className="w-full">
                {m.role === "user" ? (
                  /* USER MESSAGE BUBBLE */
                  <div className="py-2.5 sm:py-3 px-2 sm:px-6 md:px-12 flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl bg-[#F0F4F9] text-slate-900 px-4 sm:px-5 py-3 shadow-2xs border border-slate-200/60">
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-2">
                          {m.attachments.map((f, i) => (
                            <span key={i} className="text-xs bg-white text-blue-700 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                              {f.mimeType.startsWith("image/") ? <ImageIcon size={13} /> : <FileText size={13} />}
                              {f.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ) : (
                  /* ASSISTANT MESSAGE */
                  <div className="py-4 px-2 sm:px-6 md:px-12 flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0 pt-0.5">
                      <BrandLogo className="w-7 h-7" />
                    </div>

                    <div className="flex-1 space-y-2 overflow-hidden max-w-3xl">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 font-mono">
                        K-Chat AI
                      </div>

                      {m.attachments && m.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 pb-2">
                          {m.attachments.map((f, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-blue-700 border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                              {f.mimeType.startsWith("image/") ? <ImageIcon size={13} /> : <FileText size={13} />}
                              {f.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* AI Markdown / Text Output */}
                      <div className="text-slate-800 leading-relaxed font-sans">
                        {m.isError ? (
                          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{m.content}</span>
                          </div>
                        ) : m.content ? (
                          <MarkdownRenderer content={m.content} />
                        ) : (
                          isLoading && idx === activeChat.messages.length - 1 && (
                            <div className="flex items-center gap-2 text-xs text-blue-600 animate-pulse py-1">
                              {isGeneratingImage ? (
                                <>
                                  <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                                  <span className="text-blue-600 font-medium">K-Chat កំពុងគូររូបភាព...</span>
                                </>
                              ) : (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                                  <span>K-Chat AI កំពុងវិភាគ...</span>
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>

                      {m.content && (
                        <div className="flex items-center gap-4 pt-1">
                          <button
                            onClick={() => copyText(m.content, idx)}
                            className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
                          >
                            {copiedIndex === idx ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                            <span>{copiedIndex === idx ? "បានចម្លង" : "ចម្លង"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            /* GEMINI STYLE WELCOME SCREEN */
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 max-w-3xl mx-auto">
              <div className="mb-4 p-3 rounded-2xl bg-blue-50/80 border border-blue-100 shadow-2xs">
                <BrandLogo className="w-12 h-12" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent mb-2">
                សួស្តី! ខ្ញុំគឺ K-Chat AI
              </h2>
              <p className="text-slate-500 text-sm sm:text-base font-normal mb-8 max-w-md">
                តើខ្ញុំអាចជួយដោះស្រាយលំហាត់, សរសេរកូដ ឬបង្កើតគំនិតអ្វីដល់អ្នកនៅថ្ងៃនេះ?
              </p>

              {/* Fast Starter Prompts Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                <button
                  onClick={() => handleQuickPromptClick("សូមសរសេរកូដ JavaScript បង្កើត Countdown Timer ដ៏ស្រស់ស្អាត ជាមួយ CSS និងពន្យល់គ្រប់ជំហានជាភាសាខ្មែរ")}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-[#F0F4F9] hover:bg-[#E5EDF8] hover:border-blue-300 transition-all shadow-2xs group text-left cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">💻 សរសេរកូដ JavaScript</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">Countdown Timer + ពន្យល់លម្អិត</p>
                </button>

                <button
                  onClick={() => handleQuickPromptClick("សូមជួយសរសេរគំរូអ៊ីមែលផ្លូវការជាភាសាខ្មែរ សម្រាប់ស្នើសុំកិច្ចសហការអាជីវកម្មជាមួយក្រុមហ៊ុនដៃគូ")}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-[#F0F4F9] hover:bg-[#E5EDF8] hover:border-blue-300 transition-all shadow-2xs group text-left cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">📝 សរសេរអត្ថបទផ្លូវការ</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">អ៊ីមែលស្នើសុំកិច្ចសហការអាជីវកម្ម</p>
                </button>

                <button
                  onClick={() => handleQuickPromptClick("សូមពន្យល់ពីដំណើរការនៃ Artificial Intelligence (AI) និង Machine Learning ឱ្យបានក្បោះក្បាយជាភាសាខ្មែរ")}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-[#F0F4F9] hover:bg-[#E5EDF8] hover:border-blue-300 transition-all shadow-2xs group text-left cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">🧠 ពន្យល់វិទ្យាសាស្ត្រ AI</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">របៀបដែល AI គិត និងរៀនសូត្រ</p>
                </button>

                <button
                  onClick={() => handleQuickPromptClick("សូមបង្កើតរូបភាព AI ដ៏ស្រស់ស្អាត: ប្រាសាទអង្គរវត្តពេលថ្ងៃលិច ឆ្លុះលើផ្ទៃទឹកបែប 3D Cinematic 8K")}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-[#F0F4F9] hover:bg-[#E5EDF8] hover:border-blue-300 transition-all shadow-2xs group text-left cursor-pointer"
                >
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">
                    🎨 គូររូបភាព AI
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">ប្រាសាទអង្គរវត្តពេលថ្ងៃលិច 3D Cinematic</p>
                </button>
              </div>
            </div>
          )}
          
          {isLoading && activeChat && activeChat.messages.length > 0 && activeChat.messages[activeChat.messages.length - 1].content === "" && (
            <div className="py-4 px-2 sm:px-6 md:px-12 flex items-center gap-2 text-slate-500 text-xs animate-pulse">
              {isGeneratingImage ? (
                <>
                  <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-blue-600">K-Chat កំពុងគូររូបភាព...</span>
                </>
              ) : (
                <>
                  <BrandLogo className="w-4 h-4 animate-spin" />
                  <span>K-Chat AI កំពុងវិភាគ...</span>
                </>
              )}
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* FLOATING SCROLL TO BOTTOM BUTTON */}
        {showScrollBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="ចុះទៅសារចុងក្រោយ"
            className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 sm:right-8 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer animate-in fade-in zoom-in-75"
          >
            <ArrowDown size={18} />
          </button>
        )}

        {/* INPUT BAR - Sticky Bottom with Safe Area Inset */}
        <div className="sticky bottom-0 z-20 shrink-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent pt-2 px-3 sm:px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))]">
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-[#F0F4F9] border border-slate-200/80 hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white rounded-[28px] p-2 sm:p-2.5 shadow-sm focus-within:shadow-md transition-all duration-200">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-1">
                  {attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white text-xs text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {file.mimeType.startsWith("image/") ? <ImageIcon size={13} className="text-blue-600" /> : <FileText size={13} className="text-slate-600" />}
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))} className="hover:text-red-500 text-slate-400">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Voice Listening Banner */}
              {isListening && (
                <div className="flex items-center justify-between mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-medium">កំពុងស្ដាប់សំឡេង...</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className="text-[11px] font-medium text-red-600 hover:underline"
                  >
                    បញ្ឈប់
                  </button>
                </div>
              )}

              <div className="flex items-end gap-1.5 sm:gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFiles}
                  multiple
                  accept="image/*,application/pdf,text/plain"
                  className="hidden"
                />

                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-200/50 rounded-full transition cursor-pointer"
                  title="ភ្ជាប់រូបភាព ឬឯកសារ"
                >
                  <Paperclip size={19} />
                </button>

                {/* Microphone Voice Input */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-full transition flex items-center justify-center relative cursor-pointer ${
                    isListening
                      ? "text-red-600 bg-red-100 ring-2 ring-red-400"
                      : "text-slate-500 hover:text-blue-600 hover:bg-slate-200/50"
                  }`}
                  title={isListening ? "កំពុងស្ដាប់... ចុចដើម្បីបញ្ឈប់" : "ចុចដើម្បីនិយាយ"}
                >
                  {isListening ? (
                    <>
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      <MicOff size={19} className="animate-pulse text-red-600" />
                    </>
                  ) : (
                    <Mic size={19} />
                  )}
                </button>

                {/* Clean Gemini Input */}
                <textarea
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="សួរ K-Chat AI..."
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 resize-none max-h-36 py-2 px-1 text-sm sm:text-base leading-relaxed touch-manipulation"
                />

                {/* Send Button */}
                <button
                  type="button"
                  disabled={(!inputPrompt.trim() && attachments.length === 0) || isLoading}
                  onClick={() => sendMessage()}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    (inputPrompt.trim() || attachments.length > 0) && !isLoading
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                  aria-label="ផ្ញើសារ"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
