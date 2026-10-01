import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SKYPRO_MASCOT } from '../assets/mascot';

interface HeroSectionProps {
  onStartChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartChat }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pb-20">
      {/* Background ambient neon glow spheres */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-10 right-1/4 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Text & CTA */}
          <div className="flex flex-col items-start lg:col-span-7">
            
            {/* AI Assistant Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md mb-6">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>AI ជំនួយការរបស់អ្នក</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl font-['Plus_Jakarta_Sans',sans-serif]">
              K-Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">AI</span>
            </h1>

            {/* Tagline */}
            <p className="mt-2 text-xs font-mono font-semibold text-sky-400">
              ⚡ បញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់ ឆ្លើយតបរហ័សទាន់ចិត្ត
            </p>

            {/* Khmer Subtitle */}
            <p className="mt-3 text-xl sm:text-2xl font-bold text-slate-100 sm:mt-4">
              សួរអ្វីក៏បាន... ខ្ញុំនឹងឆ្លើយតបជូនអ្នក!
            </p>

            {/* Khmer Paragraph */}
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              K-Chat AI ជាជំនួយការបញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់ ដែលអាចជួយអ្នកក្នុងការដោះស្រាយលំហាត់គណិត-វិទ្យាសាស្ត្រពិត សរសេរកូដ បង្កើតរូបភាព AI និងស្វែងរកចំណេះដឹង...
            </p>

            {/* CTA Button */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartChat}
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.45)] transition duration-200 hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.65)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>ចាប់ផ្តើម Chat ឥឡូវនេះ</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Mascot with Speech Bubble */}
          <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-md">
              
              {/* Radial Cyan Aura behind the Mascot */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-transparent blur-3xl" />

              {/* Speech Bubble floating top-right */}
              <div className="absolute -top-3 right-4 sm:-top-5 sm:right-6 z-20 animate-bounce duration-1000">
                <div className="rounded-2xl border border-cyan-400/40 bg-[#0a1426]/95 px-4 py-2.5 shadow-[0_0_20px_rgba(34,211,238,0.25)] backdrop-blur-md">
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs sm:text-sm font-bold text-white">
                    Hello!
                  </p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-blue-200">
                    I'm SkyPro
                  </p>
                  <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-slate-300">
                    How can I help you?
                  </p>
                </div>
              </div>

              {/* Mascot Image Container with Cyber Frame */}
              <div className="relative mx-auto flex items-center justify-center p-2">
                <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-900/20 to-[#071120] p-3 shadow-[0_0_35px_rgba(56,189,248,0.25)]">
                  <img
                    src={SKYPRO_MASCOT}
                    alt="SkyPro AI 3D Mascot"
                    className="h-72 w-72 sm:h-80 sm:w-80 object-cover rounded-2xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition duration-300 hover:scale-105"
                  />
                  {/* Subtle corner tech decals */}
                  <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
