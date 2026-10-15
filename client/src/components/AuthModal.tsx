'use client';

import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  KeyRound,
  ArrowRight,
  School,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase
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
  const [studentMode, setStudentMode] = useState<'token' | 'account'>('token');

  // Form states
  const [tokenInput, setTokenInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  if (!isOpen) return null;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError('Masukkan 6-karakter token ujian (contoh: KBT-9428)');
      return;
    }
    const cleanToken = tokenInput.trim().toUpperCase();
    onEnterExamWithToken(cleanToken);
    onClose();
  };

  const handleQuickDemoToken = () => {
    setTokenInput('KBT-9428');
    setTokenError('');
  };

  const handleSsoLogin = (provider: 'siakad' | 'google') => {
    const defaultName = role === 'student' ? 'M. Fadhil (Mahasiswa)' : 'Dr. Ir. Hendra (Dosen)';
    onLoginSuccess(role, defaultName);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = emailInput ? emailInput.split('@')[0] : (role === 'student' ? 'Mahasiswa FILKOM' : 'Dosen FILKOM');
    onLoginSuccess(role, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1B1B1E]/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl border-2 border-[#1B1B1E] shadow-[8px_8px_0px_#1B1B1E] overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-white border-b-2 border-[#1B1B1E] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0038D1] border-2 border-[#1B1B1E] flex items-center justify-center text-white font-serif font-black text-sm shadow-[2px_2px_0px_#1B1B1E]">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none mb-0.5">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#0038D1]">
                  Pintu Masuk Portal
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#EEF2FF] border border-[#C7D2FE] text-[9px] font-mono font-bold text-[#0038D1]">
                  FILKOM UB
                </span>
              </div>
              <h3 className="text-base font-serif font-black text-[#1B1B1E] leading-tight">
                {role === 'student' ? 'Gerbang Masuk Mahasiswa' : 'Gerbang Masuk Dosen & Pengajar'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-[#F0ECE1] border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] active:translate-x-[1px] active:translate-y-[1px] text-[#1B1B1E] flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Tutup Modal"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Role Switcher Pill Bar (Mahasiswa vs Dosen) */}
        <div className="px-4 sm:px-5 py-2.5 bg-white border-b border-[#EAE7EB] shrink-0">
          <div className="flex rounded-full bg-[#EAE7EB] p-1 border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E]">
            <button
              onClick={() => {
                setRole('student');
                setTokenError('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${role === 'student'
                  ? 'bg-[#0038D1] text-white shadow-[1.5px_1.5px_0px_#1B1B1E]'
                  : 'text-[#4B5563] hover:text-[#1B1B1E]'
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
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer ${role === 'teacher'
                  ? 'bg-[#1B1B1E] text-white shadow-[1.5px_1.5px_0px_#8E5900]'
                  : 'text-[#4B5563] hover:text-[#1B1B1E]'
                }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Dosen / Pengajar</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* ===================== MAHASISWA FLOW ===================== */}
          {role === 'student' && (
            <div className="space-y-4">
              {/* Sub-mode selector (Symmetrical 50/50 Balanced Tab Bar) */}
              <div className="grid grid-cols-2 border-b-2 border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setStudentMode('token')}
                  className={`pb-2.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 sm:gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${studentMode === 'token'
                      ? 'border-[#0038D1] text-[#0038D1]'
                      : 'border-transparent text-[#71717A] hover:text-[#1B1B1E] hover:border-[#CBD5E1]'
                    }`}
                >
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  <span>Akses Cepat Token Ujian</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentMode('account')}
                  className={`pb-2.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 sm:gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${studentMode === 'account'
                      ? 'border-[#0038D1] text-[#0038D1]'
                      : 'border-transparent text-[#71717A] hover:text-[#1B1B1E] hover:border-[#CBD5E1]'
                    }`}
                >
                  <School className="w-3.5 h-3.5 shrink-0" />
                  <span>Masuk Akun Kampus (SSO)</span>
                </button>
              </div>

              {/* Sub-mode 1: Token PIN Ujian */}
              {studentMode === 'token' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0038D1] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                        Token PIN dari Dosen
                      </span>
                      <button
                        type="button"
                        onClick={handleQuickDemoToken}
                        className="text-[10.5px] font-mono font-bold text-[#0038D1] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#D97706]" />
                        <span>Isi Demo: KBT-9428</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#555] leading-relaxed">
                      Masukkan 6-karakter token asesmen yang dibagikan oleh Dosen pengampu di kelas atau laboratorium:
                    </p>

                    <form onSubmit={handleTokenSubmit} className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={tokenInput}
                          onChange={(e) => {
                            setTokenInput(e.target.value);
                            setTokenError('');
                          }}
                          placeholder="KBT-9428"
                          maxLength={10}
                          className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] font-mono font-black text-center text-lg tracking-widest uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0038D1] shadow-[inset_1px_1px_0px_rgba(27,27,30,0.06)]"
                        />
                      </div>

                      {tokenError && (
                        <p className="text-[11.5px] font-bold text-[#DC2626] flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{tokenError}</span>
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-[#0038D1] hover:bg-[#1A4BDB] text-white font-serif font-black text-sm border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Mulai Sesi Asesmen Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#065F46] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Akses token PIN langsung membuka sesi pengerjaan kanvas Kit-Build tanpa perlu login akun.</span>
                  </div>
                </div>
              )}

              {/* Sub-mode 2: Akun Kampus / SSO */}
              {studentMode === 'account' && (
                <div className="space-y-4">
                  {/* 1-Click SSO Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSsoLogin('siakad')}
                      className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#F4F4F6] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E] transition-all cursor-pointer"
                    >
                      <School className="w-4 h-4 text-[#0038D1]" />
                      <span>SSO SIAM UB</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSsoLogin('google')}
                      className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#F4F4F6] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E] transition-all cursor-pointer"
                    >
                      <span className="w-4 h-4 font-black text-xs text-[#EA4335] flex items-center justify-center">G</span>
                      <span>Google Workspace</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-[#E5E7EB] w-full"></div>
                    <span className="bg-[#FAF7F2] px-2 text-[10px] font-mono text-[#71717A] uppercase shrink-0">
                      atau NIM / Email Mahasiswa
                    </span>
                  </div>

                  {/* Manual Form */}
                  <form onSubmit={handleManualLogin} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-[#1B1B1E] block">
                        NIM atau Email Kampus (@student.ub.ac.id)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="215150201111001@student.ub.ac.id"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-[#1B1B1E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0038D1]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono font-bold text-[#1B1B1E] block">Kata Sandi</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-[#1B1B1E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0038D1]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#0038D1] hover:bg-[#1A4BDB] text-white font-bold text-xs border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Masuk ke Dashboard Mahasiswa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ===================== DOSEN FLOW ===================== */}
          {role === 'teacher' && (
            <div className="space-y-4">
              {/* 1-Click SSO Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1B1B1E] block">
                  Autentikasi Akun Dosen / Pengajar
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('siakad')}
                    className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#F4F4F6] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E] transition-all cursor-pointer"
                  >
                    <School className="w-4 h-4 text-[#0038D1]" />
                    <span>SSO SIAKAD Dosen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSsoLogin('google')}
                    className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white hover:bg-[#F4F4F6] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E] transition-all cursor-pointer"
                  >
                    <span className="w-4 h-4 font-black text-xs text-[#EA4335] flex items-center justify-center">G</span>
                    <span>Google Workspace UB</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E5E7EB] w-full"></div>
                <span className="bg-[#FAF7F2] px-2 text-[10px] font-mono text-[#71717A] uppercase shrink-0">
                  atau NIP / Email Dosen
                </span>
              </div>

              {/* Manual Form */}
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1B1B1E] block">
                    NIP / NIDN atau Email Institusi (@ub.ac.id)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="hendra@ub.ac.id"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-[#1B1B1E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1B1B1E]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1B1B1E] block">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-[#1B1B1E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1B1B1E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1B1B1E] hover:bg-[#333] text-white font-bold text-xs shadow-[3px_3px_0px_#8E5900] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#FFDDB8]" />
                  <span>Masuk Portal Dosen & Peneliti</span>
                </button>
              </form>

              {/* Fast Demo Mode Shortcut */}
              <div className="pt-2 border-t border-dashed border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => handleSsoLogin('siakad')}
                  className="w-full py-2 px-3 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#F59E0B] text-[#92400E] font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Masuk Mode Demo Dosen (Langsung Akses Editor Kit)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 py-3 bg-white border-t-2 border-[#1B1B1E] flex items-center justify-between text-[11px] text-[#71717A] shrink-0 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>UB Single Sign-On Safe</span>
          </span>
          <span className="font-bold text-[#1B1B1E]">NetworkX Core v2.1</span>
        </div>
      </div>
    </div>
  );
};
