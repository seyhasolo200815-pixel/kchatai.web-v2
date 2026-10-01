import React from 'react';
import { Crown, Check } from 'lucide-react';

interface ProAndHighlightsProps {
  onOpenPricing: () => void;
}

export const ProAndHighlights: React.FC<ProAndHighlightsProps> = ({ onOpenPricing }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* SkyPro Pro Card */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-600/30 bg-gradient-to-b from-[#0e1f3d] to-[#081226] p-5 shadow-[0_4px_25px_rgba(37,99,235,0.2)]">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">SkyPro Pro</h4>
            <p className="text-xs text-blue-200">ទទួលបានមុខងារបន្ថែម</p>
          </div>
        </div>

        <button
          onClick={onOpenPricing}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-2.5 text-center text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(56,189,248,0.35)] transition duration-200 hover:from-blue-500 hover:to-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"
        >
          មើលផែនការ
        </button>
      </div>

      {/* Key Highlights (លក្ខណៈពិសេស) */}
      <div className="rounded-2xl border border-blue-900/40 bg-[#070f20]/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <h4 className="text-base font-bold text-white tracking-tight mb-4">
          លក្ខណៈពិសេស
        </h4>

        <ul className="space-y-3">
          <li className="flex items-start gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mt-0.5">
              <Check className="h-3 w-3" />
            </div>
            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              ចម្លើយលឿន និងត្រឹមត្រូវ
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mt-0.5">
              <Check className="h-3 w-3" />
            </div>
            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              គាំទ្រភាសាខ្មែរ
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mt-0.5">
              <Check className="h-3 w-3" />
            </div>
            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              អាចប្រើបានលើទូរស័ព្ទដៃ និងកុំព្យូទ័រ
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mt-0.5">
              <Check className="h-3 w-3" />
            </div>
            <span className="text-xs sm:text-sm text-slate-300 font-medium">
              សុវត្ថិភាព និងឯកជនភាព
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
