import React from 'react';
import { X, Bot, Shield, Globe, Award } from 'lucide-react';
import { SKYPRO_MASCOT } from '../assets/mascot';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-3xl border border-blue-900/60 bg-[#081226] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <img
            src={SKYPRO_MASCOT}
            alt="SkyPro AI"
            className="h-28 w-28 rounded-2xl object-cover border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.3)]"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-950/80 px-2.5 py-0.5 text-xs text-blue-300 border border-blue-800/40 mb-2">
              <Bot className="h-3.5 w-3.5" />
              <span>អំពី K-Chat AI</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              K-Chat AI Intelligence
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              ដំណោះស្រាយបញ្ញាសិប្បនិម្មិតទំនើប ឆ្លើយតបជាភាសាខ្មែរយ៉ាងរហ័សទាន់ចិត្ត និងត្រឹមត្រូវ។
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-blue-900/40 pt-4">
          <p>
            <strong>K-Chat AI</strong> គឺជាប្រព័ន្ធបញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់ ដែលគាំទ្រការសន្ទនាជាភាសាខ្មែរយ៉ាងពេញលេញ និងត្រឹមត្រូវ ជួយអ្នកក្នុងការដោះស្រាយលំហាត់វិទ្យាសាស្ត្រពិត គណិតវិទ្យា សរសេរអត្ថបទ សរសេរកូដ បកប្រែ និងបង្កើតរូបភាព AI ស្អាតៗ។
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-blue-900/50 bg-[#0c1834] p-3.5 flex items-start gap-3">
              <Globe className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-xs">ការយល់ដឹងភាសាខ្មែរ</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ឆ្លើយតបយ៉ាងត្រឹមត្រូវតាមក្បួនវេយ្យាករណ៍ខ្មែរ
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-blue-900/50 bg-[#0c1834] p-3.5 flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-white text-xs">សុវត្ថិភាពខ្ពស់</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ទិន្នន័យត្រូវបានរក្សាទុកដោយការការពារកម្រិតខ្ពស់
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-blue-900/40 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 transition"
          >
            យល់ព្រម
          </button>
        </div>

      </div>
    </div>
  );
};
