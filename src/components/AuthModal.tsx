import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitted(true);
    setTimeout(() => {
      onSuccess(email);
      onClose();
      setSubmitted(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-blue-900/60 bg-[#081226] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#071120]">
              <span className="font-black text-xl text-cyan-300">S</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'ចូលប្រើប្រាស់ SkyPro AI' : 'បង្កើតគណនី SkyPro AI'}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {mode === 'login'
              ? 'សូមបញ្ចូលព័ត៌មានរបស់អ្នកដើម្បីចូលប្រើប្រាស់'
              : 'ចុះឈ្មោះដើម្បីទទួលបានការឆ្លើយតប AI គ្មានដែនកំណត់'}
          </p>
        </div>

        {/* Success Feedback */}
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
            <p className="mt-3 text-sm font-bold text-white">
              {mode === 'login' ? 'ចូលគណនីជោគជ័យ!' : 'បង្កើតគណនីជោគជ័យ!'}
            </p>
            <p className="text-xs text-slate-400 mt-1">សូមរង់ចាំបន្តិច...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  ឈ្មោះពេញ
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-blue-900/60 bg-[#0a152d] px-3 py-2.5 focus-within:border-blue-500">
                  <User className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ឈ្មោះរបស់អ្នក"
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                អ៊ីមែល
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-900/60 bg-[#0a152d] px-3 py-2.5 focus-within:border-blue-500">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ពាក្យសម្ងាត់
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-blue-900/60 bg-[#0a152d] px-3 py-2.5 focus-within:border-blue-500">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition hover:bg-blue-500"
            >
              <span>{mode === 'login' ? 'ចូលគណនី' : 'ចុះឈ្មោះឥឡូវនេះ'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Switch Mode */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-blue-400 hover:text-cyan-300 transition"
              >
                {mode === 'login'
                  ? 'មិនទាន់មានគណនី? ចុះឈ្មោះនៅទីនេះ'
                  : 'មានគណនីរួចហើយ? ចូលគណនី'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
