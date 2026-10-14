'use client';

import React from 'react';
import { ActiveTab } from './Navbar';
import {
  BrainCircuit,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Network,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart3
} from 'lucide-react';

interface OnboardingViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAF7F2] text-[#1B1B1E] min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-16 overflow-hidden border-b-2 border-[#1B1B1E]">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-[10px] font-extrabold uppercase tracking-widest text-[#1B1B1E]">
            <span>●</span>
            <span>Empirical Validation &bull; Peer-Reviewed Cognitive Theory</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.08] text-[#1B1B1E]">
              Don’t just test what they remember.{' '}
              <span className="italic font-normal underline decoration-[#2F54EB] decoration-4 underline-offset-8">
                See how they connect
              </span>{' '}
              what they know.
            </h1>
            <p className="text-base sm:text-lg text-[#444655] font-medium leading-relaxed max-w-3xl pt-2">
              Conventional exams test if students can recall facts in isolation. Maply turns syllabus
              knowledge graphs into interactive kit puzzles to reveal their true mental model in real-time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('student')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white font-bold text-sm border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] hover:shadow-[5px_5px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1B1B1E] transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Buka Student Workspace</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('teacher')}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFEAA7] hover:bg-[#FFDDB8] text-[#1B1B1E] font-bold text-sm border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] hover:shadow-[5px_5px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1B1B1E] transition-all"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Map Builder (Dosen)</span>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#1B1B1E] font-bold text-sm border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Lihat Analisis Kelas</span>
            </button>
          </div>

          {/* Interactive Hero Graphical Showcase */}
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[6px_6px_0px_#1B1B1E] relative overflow-hidden">
            {/* Background Dot Matrix Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#1B1B1E_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Proposition Card */}
              <div className="w-full md:w-3/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F0EDF1] border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] tracking-wider uppercase">
                    PROPOSITION #12 &bull; ROUNDTABLE SIMULATION
                  </span>
                  <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 94.8% Propositional Match
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-sm font-bold">
                    <span className="px-3 py-1.5 rounded-lg bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]">
                      [ALU]
                    </span>
                    <span className="text-xs font-bold text-[#0038D1] px-2 py-1 rounded-md bg-[#EEF2FF] border border-[#1B1B1E]">
                      ── stores temporary result in ──▶
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]">
                      [Register]
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#1B1B1E]/20 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] border border-[#1B1B1E] font-bold text-[#059669] text-[10px]">
                      ✓ Valid TP
                    </span>
                    <span className="text-[#444655] text-[11px]">
                      NetworkX mengonfirmasi relasi terverifikasi sesuai Master Map Dosen.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#444655]">
                  <span className="font-bold text-[#1B1B1E]">Taman Asesmen Mandiri:</span>
                  <span>Unit 04 &bull; FILKOM UB Smart System Lab</span>
                </div>
              </div>

              {/* Right Avatar Characters Group */}
              <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-4 bg-[#FBF8FC] rounded-xl border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E]">
                <span className="text-[10px] font-bold text-[#444655] uppercase tracking-wider mb-4">
                  Interactive Roundtable Session
                </span>
                <div className="flex items-center gap-3">
                  {/* Blue Character */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#0038D1] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-white font-bold text-xs">
                      👀
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-[#1B1B1E]">Prof. Blue</span>
                  </div>
                  {/* Yellow Character */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg bg-[#FFB95F] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-[#1B1B1E] font-bold text-xs">
                      👓
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-[#1B1B1E]">Mhs. Koko</span>
                  </div>
                  {/* Red Character */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md bg-[#DA3437] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-white font-bold text-xs">
                      🎓
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-[#1B1B1E]">TA. Riko</span>
                  </div>
                  {/* Green Character */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#059669] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-white font-bold text-xs">
                      🤖
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-[#1B1B1E]">Bot Valid</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#059669] mt-4 px-2.5 py-0.5 rounded-full bg-[#E6F4EA] border border-[#1B1B1E]">
                  ● Live Room Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-white border border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10px] font-extrabold uppercase tracking-widest text-[#0038D1]">
            KIT-BUILD CONCEPT MAP METHOD (F. HIRASHIMA FRAMEWORK)
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#1B1B1E]">
            How Kit-Build Evaluates Comprehension
          </h2>
          <p className="text-xs sm:text-sm text-[#444655]">
            Unlike multiple-choice guessing where grading is noisy, kit-build breaks the expert graph into
            pieces and asks learners to reconstruct the truth.
          </p>
        </div>

        {/* 3 Cards Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[5px_5px_0px_#1B1B1E] flex flex-col justify-between space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-[#FFEAA7] border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] uppercase tracking-wider inline-block">
                01 / Teacher Master Map
              </span>
              <h3 className="text-xl font-bold font-serif text-[#1B1B1E]">Dosen Unggah Materi</h3>
              <p className="text-xs text-[#444655] leading-relaxed">
                AI mengekstrak node konsep dan relasi dari silabus PDF, kemudian dosen memvalidasi graf acuan
                sebagai tolok ukur kebenaran kognitif.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1B1B1E] space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1B1B1E] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0038D1]" />
                  SAP_Arsitektur_Modul3.pdf
                </span>
                <span className="text-[10px] font-extrabold text-[#059669] bg-[#E6F4EA] px-1.5 py-0.5 rounded-sm border border-[#059669]">
                  Verified
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#444655]">
                <span>Ekstraksi: 18 Nodes</span>
                <span>24 Hubungan</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[5px_5px_0px_#1B1B1E] flex flex-col justify-between space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-[#FFDDB8] border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] uppercase tracking-wider inline-block">
                02 / Kit Decomposition
              </span>
              <h3 className="text-xl font-bold font-serif text-[#1B1B1E]">Didekonstruksi Jadi Kit</h3>
              <p className="text-xs text-[#444655] leading-relaxed">
                Sistem mencabut seluruh relasi antar-node dan mengacak potongan konsep. Siswa menerima kotak
                kepingan tanpa struktur jawaban.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1B1B1E] space-y-2">
              <span className="text-[10px] font-bold text-[#444655] uppercase block">
                Contoh Kepingan Teracak:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['CPU', 'ALU', 'Register', 'Page Table'].map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E]"
                  >
                    ■ [{tag}]
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[5px_5px_0px_#1B1B1E] flex flex-col justify-between space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-[#D1E9FF] border border-[#1B1B1E] text-[10px] font-bold text-[#0038D1] uppercase tracking-wider inline-block">
                03 / NetworkX Deterministic
              </span>
              <h3 className="text-xl font-bold font-serif text-[#1B1B1E]">Evaluasi Graf Matematis</h3>
              <p className="text-xs text-[#444655] leading-relaxed">
                Jawaban murid di-overlay ke master map. NetworkX menghitung True Positive (benar), False
                Positive (miskonsepsi), dan Missing link instan.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1B1B1E] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#059669]">✓ Valid TP (Benar)</span>
                <span className="text-[#DA3437]">⚠ Misconception (FP)</span>
              </div>
              <div className="text-[10px] font-bold text-[#0038D1] pt-1 border-t border-[#1B1B1E]/10">
                🛡️ Zero LLM Hallucinations on Scoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Picker Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-white border-t-2 border-[#1B1B1E]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-black text-[#1B1B1E]">Pilih Peran Anda di Maply</h2>
            <p className="text-xs sm:text-sm text-[#444655]">
              Pilih jalur kerja yang ingin Anda coba langsung. Apakah Anda seorang perancang materi kuliah
              atau mahasiswa yang merekonstruksi peta?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <button
              onClick={() => onNavigate('teacher')}
              className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] hover:shadow-[6px_6px_0px_#1B1B1E] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFEAA7] border-2 border-[#1B1B1E] flex items-center justify-center text-xl font-bold">
                👨‍🏫
              </div>
              <h3 className="text-lg font-bold font-serif text-[#1B1B1E] group-hover:text-[#0038D1] transition-colors">
                Mode Dosen & AI Builder →
              </h3>
              <p className="text-xs text-[#444655] leading-relaxed">
                Rancang Master Concept Map, unggah silabus dokumen untuk ekstraksi AI otomatis, dan atur
                konfigurasi asesmen kuis.
              </p>
            </button>

            <button
              onClick={() => onNavigate('student')}
              className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] hover:shadow-[6px_6px_0px_#1B1B1E] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D1E9FF] border-2 border-[#1B1B1E] flex items-center justify-center text-xl font-bold">
                🎓
              </div>
              <h3 className="text-lg font-bold font-serif text-[#1B1B1E] group-hover:text-[#0038D1] transition-colors">
                Mode Mahasiswa (Workspace) →
              </h3>
              <p className="text-xs text-[#444655] leading-relaxed">
                Terima Concept Kit yang diacak, hubungkan node pada kanvas digital, dan dapatkan umpan balik
                analisis graf instan.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Academic Footer */}
      <footer className="py-6 px-4 bg-[#FAF7F2] border-t-2 border-[#1B1B1E] text-center text-xs font-semibold text-[#444655]">
        <p>© 2025 Maply Cognitive Lab &bull; In academic partnership with FILKOM Universitas Brawijaya.</p>
      </footer>
    </div>
  );
};
