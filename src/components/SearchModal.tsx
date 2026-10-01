import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { QUICK_PROMPTS, HERO_FEATURES } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredPrompts = QUICK_PROMPTS.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.samplePrompt.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFeatures = HERO_FEATURES.filter(
    (f) =>
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-blue-900/60 bg-[#081226] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-blue-900/40 px-4 py-3 bg-[#0a1630]">
          <Search className="h-5 w-5 text-blue-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ស្វែងរកមុខងារ សំណួរ ឬពាក្យគន្លឹះ..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onSelectPrompt(query);
                onClose();
              }
            }}
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700">
              ESC
            </kbd>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white sm:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[380px] overflow-y-auto p-4 space-y-4">
          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              សំណើពេញនិយម (Suggested Prompts)
            </p>
            <div className="space-y-1.5">
              {filteredPrompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPrompt(p.samplePrompt);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl p-2.5 text-left text-xs bg-[#0b1733]/60 hover:bg-blue-950 border border-transparent hover:border-blue-500/40 transition group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-200 group-hover:text-cyan-300">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-sm">
                        {p.samplePrompt}
                      </p>
                    </div>
                  </div>
                  <CornerDownLeft className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          {filteredFeatures.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                មុខងារស្នូល (Features)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {filteredFeatures.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectPrompt(`សូមពន្យល់ និងបង្ហាញការប្រើប្រាស់ ${f.title}`);
                      onClose();
                    }}
                    className="flex items-center gap-2 rounded-xl p-2 text-left text-xs bg-[#0b1733]/60 hover:bg-blue-950 border border-slate-800/60 hover:border-blue-500/40 transition"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                    <span className="font-medium text-slate-300">{f.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-blue-900/30 bg-[#070e1c] px-4 py-2.5 text-[11px] text-slate-400">
          <span>ជ្រើសរើសសំណួរដើម្បីចាប់ផ្តើម Chat ភ្លាមៗ</span>
          <button onClick={onClose} className="hover:text-white">
            បិទ
          </button>
        </div>

      </div>
    </div>
  );
};
