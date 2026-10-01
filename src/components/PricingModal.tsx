import React from 'react';
import { X, Check, Crown, Zap } from 'lucide-react';
import { PRICING_PLANS } from '../data/mockData';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planName: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-blue-900/60 bg-[#081226] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-3">
            <Crown className="h-3.5 w-3.5" />
            <span>កញ្ចប់តម្លៃ SkyPro AI</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            ជ្រើសរើសកញ្ចប់ដែលស័ក្តិសមសម្រាប់អ្នក
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            ចាប់ផ្តើមដោយឥតគិតថ្លៃ ឬជ្រើសរើស SkyPro Pro ដើម្បីទទួលបានមុខងារបញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
                  isPopular
                    ? 'border-2 border-blue-500 bg-gradient-to-b from-[#0f244c] to-[#09152b] shadow-[0_0_30px_rgba(59,130,246,0.3)] md:-translate-y-2'
                    : 'border border-blue-950 bg-[#091326]/80 hover:border-blue-900'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-0.5 text-[11px] font-bold text-white shadow-md">
                    ពេញនិយមបំផុត
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                    {isPopular && <Zap className="h-5 w-5 text-amber-300" />}
                  </div>

                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onSelectPlan(plan.name);
                    onClose();
                  }}
                  className={`w-full rounded-xl py-2.5 text-xs sm:text-sm font-bold transition duration-200 ${
                    isPopular
                      ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {plan.id === 'free' ? 'ប្រើប្រាស់ឥតគិតថ្លៃ' : 'ជ្រើសរើសកញ្ចប់នេះ'}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
