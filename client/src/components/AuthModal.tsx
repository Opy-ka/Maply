'use client';

import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Sparkles,
  School,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: 'student' | 'teacher';
  onClose: () => void;
  onEnterExamWithToken: (token: string) => void;
  onLoginSuccess: (role: 'student' | 'teacher', userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'student',
  onClose,
  onEnterExamWithToken,
  onLoginSuccess
}) => {
  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);
  const [tokenInput, setTokenInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  if (!isOpen) return null;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError('Masukkan 6-karakter token ujian (misal: KBT-9428)');
      return;
    }
    const cleanToken = tokenInput.trim().toUpperCase();
    onEnterExamWithToken(cleanToken);
    onClose();
  };

  const handleSsoLogin = (provider: 'siakad' | 'google') => {
    const defaultName = role === 'student' ? 'M. Fadhil (Mahasiswa)' : 'Dr. Ir. Hendra (Dosen)';
    onLoginSuccess(role, defaultName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1B1B1E]/60 backdrop-blur-sm flex items-center justify-center p-4 py-8 animate-fadeIn">
      <div className="w-full max-w-xl bg-[#FBF8FC] rounded-2xl border-2 border-[#1B1B1E] shadow-[8px_8px_0px_#1B1B1E] overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] border-b-2 border-[#1B1B1E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#0038D1] border-2 border-[#1B1B1E] flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0px_#1B1B1E]">
              M
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0038D1]">
                Gerbang Masuk Multi-Peran Maply
              </span>
              <h3 className="text-base font-black text-[#1B1B1E]">
                {role === 'student' ? 'Portal Mahasiswa / Pelajar' : 'Portal Dosen / Pengajar'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-[#1B1B1E] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Pill Bar (Figma #53:8023) */}
        <div className="px-6 pt-4 pb-2 bg-[#FAF7F2]">
          <div className="flex rounded-full bg-[#EAE7EB] p-1 border-2 border-[#1B1B1E]">
            <button
              onClick={() => {
                setRole('student');
                setTokenError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-black transition-all ${
                role === 'student'
                  ? 'bg-[#0038D1] text-white shadow-[2px_2px_0px_#1B1B1E]'
                  : 'text-[#444655] hover:text-[#1B1B1E]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Mahasiswa / Pelajar</span>
            </button>
            <button
              onClick={() => {
                setRole('teacher');
                setTokenError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-black transition-all ${
                role === 'teacher'
                  ? 'bg-[#B61722] text-white shadow-[2px_2px_0px_#1B1B1E]'
                  : 'text-[#444655] hover:text-[#1B1B1E]'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Dosen / Pengajar</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* STUDENT ONLY: DIRECT ASSESSMENT FAST PIN BOX (Figma #53:8126 & PRD Section 4) */}
          {role === 'student' && (
            <div className="p-4 rounded-xl bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E]">
                  Akses Kilat Ujian via Token PIN (Tanpa Login SSO)
                </span>
              </div>
              <p className="text-xs text-[#444655]">
                Punya token dari Dosen di kelas atau laboratorium? Masukkan langsung untuk membuka lembar kerja kit.
              </p>

              <form onSubmit={handleTokenSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    setTokenError('');
                  }}
                  placeholder="Contoh: KBT-9428"
                  className="flex-1 px-3 py-2 rounded-lg bg-white border-2 border-[#1B1B1E] font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#0038D1]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0038D1] hover:bg-[#2F54EB] text-white font-black text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1.5"
                >
                  <span>Mulai Ujian</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {tokenError && <p className="text-[11px] font-bold text-red-600">{tokenError}</p>}
            </div>
          )}

          {/* SSO Options */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E] block">
              Masuk dengan Akun Kampus / Institusi
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSsoLogin('siakad')}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E] transition-all"
              >
                <School className="w-4 h-4 text-[#0038D1]" />
                <span>SSO SIAKAD Kampus</span>
              </button>
              <button
                type="button"
                onClick={() => handleSsoLogin('google')}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-slate-50 border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E] transition-all"
              >
                <span className="w-4 h-4 font-black text-xs text-[#EA4335]">G</span>
                <span>Google Workspace</span>
              </button>
            </div>
          </div>

          {/* Form Login Alternatif */}
          <div className="pt-2 border-t border-[#E5E7EB] space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1B1E]">
                {role === 'student' ? 'NIM atau Email Kampus' : 'NIP / NIDN atau Email Institusi'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
                <input
                  type="text"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={role === 'student' ? '215150201111001@student.ub.ac.id' : 'dosen@ub.ac.id'}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border-2 border-[#1B1B1E] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#1B1B1E]">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border-2 border-[#1B1B1E] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSsoLogin('siakad')}
              className="w-full py-2.5 rounded-xl bg-[#1B1B1E] text-white font-bold text-xs shadow-[3px_3px_0px_#0038D1] hover:bg-[#2F54EB] transition-all"
            >
              Masuk Portal {role === 'student' ? 'Mahasiswa' : 'Dosen'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-t-2 border-[#1B1B1E] flex items-center justify-between text-[11px] text-[#71717A]">
          <span>FILKOM UB &bull; Smart Learning Lab</span>
          <span className="font-bold text-[#1B1B1E]">NetworkX Deterministic v2.1</span>
        </div>
      </div>
    </div>
  );
};
