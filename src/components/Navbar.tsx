import React from 'react';
import { Home, Search, Sun, Moon, Menu, X, Smartphone, Monitor } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenPricing: () => void;
  onOpenAbout: () => void;
  isMobileOnlyView: boolean;
  setIsMobileOnlyView: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAuth,
  onOpenPricing,
  onOpenAbout,
  isMobileOnlyView,
  setIsMobileOnlyView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isLightMode, setIsLightMode] = React.useState(false);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-blue-900/30 bg-[#050b14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            {/* Stylized Glowing S Logo */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-500 to-cyan-400 p-[1.5px] shadow-[0_0_18px_rgba(56,189,248,0.45)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#071120]">
                <span className="font-extrabold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-200">
                  S
                </span>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              Sky<span className="text-blue-400">Pro</span>
            </span>
          </button>
        </div>

        {/* Center Nav Links (Khmer) */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'home'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>ទំព័រដើម</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('features');
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            មុខងារ
          </button>

          <button
            onClick={onOpenPricing}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            តម្លៃកញ្ចប់
          </button>

          <button
            onClick={onOpenAbout}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white"
          >
            អំពីយើង
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle: Desktop Showcase vs Mobile Frame */}
          <button
            onClick={() => setIsMobileOnlyView(!isMobileOnlyView)}
            title={isMobileOnlyView ? "ប្តូរទៅកាន់ផ្ទាំងធំ (Desktop View)" : "ប្តូរទៅកាន់ទូរស័ព្ទដៃ (Mobile View)"}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-blue-900/60 bg-blue-950/40 px-2.5 py-1.5 text-xs text-blue-300 transition hover:border-blue-500/60 hover:bg-blue-900/40"
          >
            {isMobileOnlyView ? (
              <>
                <Monitor className="h-3.5 w-3.5" />
                <span>Showcase</span>
              </>
            ) : (
              <>
                <Smartphone className="h-3.5 w-3.5" />
                <span>ទូរស័ព្ទដៃ</span>
              </>
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 transition hover:border-blue-500/40 hover:text-white"
            title="ស្វែងរក"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Toggle (Sun icon) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-amber-300/90 transition hover:border-blue-500/40 hover:text-amber-200"
            title="ពន្លឺ / ងងឹត"
          >
            {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Login Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="hidden sm:inline-flex items-center justify-center rounded-lg border border-blue-800/50 bg-[#0c1930] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:bg-blue-900/40 hover:border-blue-500/60 hover:text-white"
          >
            ចូលគណនី
          </button>

          {/* Register Button (Electric Blue Pill) */}
          <button
            onClick={() => onOpenAuth('register')}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          >
            ចុះឈ្មោះ
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 md:hidden text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-blue-900/40 bg-[#070e1c] px-4 py-3 md:hidden">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-400 bg-blue-950/40"
            >
              <Home className="h-4 w-4" />
              <span>ទំព័រដើម</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('features');
                setMobileMenuOpen(false);
                const el = document.getElementById('features-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-800/40"
            >
              មុខងារ
            </button>
            <button
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-800/40"
            >
              តម្លៃកញ្ចប់
            </button>
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 hover:bg-slate-800/40"
            >
              អំពីយើង
            </button>
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 rounded-lg border border-blue-900/60 py-2 text-center text-xs font-medium text-slate-200"
              >
                ចូលគណនី
              </button>
              <button
                onClick={() => {
                  setIsMobileOnlyView(!isMobileOnlyView);
                  setMobileMenuOpen(false);
                }}
                className="flex-1 rounded-lg bg-blue-900/50 border border-blue-500/40 py-2 text-center text-xs font-medium text-blue-200"
              >
                {isMobileOnlyView ? "ផ្ទាំង Showcase" : "ទម្រង់ទូរស័ព្ទ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
