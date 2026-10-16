'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  KeyRound,
  BarChart3,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Lock,
  Lightbulb
} from 'lucide-react';
import { AssessmentConfig, ConceptKit } from '../types/maply';

interface StudentDashboardViewProps {
  assessmentConfig: AssessmentConfig;
  kit: ConceptKit;
  onStartWorkspace: () => void;
  onEnterToken: (token: string) => void;
  onViewResults: () => void;
}

const KIT_BUILD_TIPS = [
  {
    id: 1,
    category: 'Relasi Kausalitas',
    title: 'Perhatikan Orientasi Panah Berarah (Directed Proposition)',
    desc: 'Kaidah Kit-Build mengevaluasi subjek, predikat, dan objek secara eksak. Pastikan panah mengalir dari konsep penyebab ke akibat (misal:',
    highlight: '[CU] controls [Register]',
    postDesc: 'bukan sebaliknya). Relasi kausal berarah berbeda dengan relasi komutatif simetris.',
    badge: 'Arah Kausal',
    color: '#0038D1'
  },
  {
    id: 2,
    category: 'Struktur Hirashima',
    title: 'Bangun Net Structure, Hindari Sekadar Rantai Linier Tunggal',
    desc: 'Teori Hirashima membuktikan pemahaman konseptual mendalam tercermin dari Jejaring Kompleks (Net Structure) dengan keterkaitan silang antar cabang, bukan sekadar hafalan sekuensial satu arah (',
    highlight: 'Net Structure > Single Chain',
    postDesc: '). Buat proposisi relasional antar cabang konsep.',
    badge: 'Hirashima Topologi',
    color: '#059669'
  },
  {
    id: 3,
    category: 'Root Anchors',
    title: 'Mulai dari Keping Konsep Utama (Top-Level Nodes)',
    desc: 'Letakkan konsep hierarki inti terlebih dahulu di kanvas (misal: CPU, ALU, Memory Hierarchy), lalu sambungkan periferal. Cara ini terbukti meminimalkan kesalahan proposisi terbalik hingga',
    highlight: '40% Akurasi Lebih Tinggi',
    postDesc: 'pada evaluasi graf otomatis.',
    badge: 'Scaffolding',
    color: '#D97706'
  },
  {
    id: 4,
    category: 'Umpan Balik Graf',
    title: 'Tinjau Garis Merah pada Graf Komparatif Setelah Ujian',
    desc: 'Garis merah pada visualisasi evaluasi menandakan titik miskonsepsi terhadap Master Map Dosen. Pelajari koreksi pedagogisnya di tab',
    highlight: 'Hasil & Diagnosa Graf',
    postDesc: 'sebelum membuka asesmen modul berikutnya.',
    badge: 'Diagnosa Kognitif',
    color: '#DA3437'
  },
  {
    id: 5,
    category: 'Kelengkapan Graf',
    title: 'Kepingan Konsep Terbengkalai Dihitung sebagai False Negative',
    desc: 'Pastikan seluruh keping konsep penting telah dirangkai ke dalam graf. Kepingan yang tertinggal di nampan kanvas tanpa relasi akan menurunkan rasio kelengkapan kognitif Anda (',
    highlight: 'Recall Score < 100%',
    postDesc: '). Periksa kembali kanvas sebelum submit final.',
    badge: 'Kelengkapan Kit',
    color: '#7C3AED'
  }
];

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  assessmentConfig,
  kit,
  onStartWorkspace,
  onEnterToken,
  onViewResults
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Interactive rotating tips & tricks carousel state (pure slide geser)
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [tipProgress, setTipProgress] = useState(0);
  const [isTipPaused, setIsTipPaused] = useState(false);

  useEffect(() => {
    if (isTipPaused) return;

    const DURATION_MS = 6000; // 6s per tip
    const TICK_MS = 50;

    const interval = setInterval(() => {
      setTipProgress((prev) => {
        if (prev >= 100) {
          setActiveTipIndex((curr) => (curr + 1) % KIT_BUILD_TIPS.length);
          return 0;
        }
        return prev + (TICK_MS / DURATION_MS) * 100;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isTipPaused, activeTipIndex]);

  const handleManualTipChange = (newIndex: number) => {
    setActiveTipIndex(newIndex);
    setTipProgress(0);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError('Masukkan 6-karakter token ujian (misal: KBT-9428)');
      return;
    }
    onEnterToken(tokenInput.trim().toUpperCase());
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1B1B1E] min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Student Greeting Card & Cognitive Persona (Figma #57:12175) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left side: Greeting, Context & Academic Persona */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DEE1FF] border border-[#1B1B1E] text-xs font-bold text-[#001257]">
                  <span className="w-2 h-2 rounded-full bg-[#0038D1]"></span>
                  <span>SEMESTER GANJIL 2026/2027 &bull; FILKOM UB</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#059669] text-[10px] font-mono font-bold text-[#065F46]">
                  Mahasiswa Aktif
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#1B1B1E] tracking-tight">
                Halo, Ahmad Rizky 👋
              </h1>

              <p className="text-xs sm:text-sm text-[#444655] max-w-xl leading-relaxed">
                Bukan sekadar mengingat fakta, tapi merangkai <strong className="text-[#1B1B1E] underline decoration-[#1B1B1E] decoration-2">struktur logika pengetahuan</strong> secara terpadu dan bermakna.
              </p>

              {/* Student Personification Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#1B1B1E] font-mono text-[11px] font-bold text-[#1B1B1E]">
                  NIM: 235150201111048
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#1B1B1E] font-bold text-[11px] text-[#1B1B1E]">
                  Teknik Informatika
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#F6F2F7] border border-[#1B1B1E] font-mono font-bold text-[10.5px] text-[#0038D1]">
                  Personifikasi: Relational Thinker
                </span>
              </div>
            </div>

            {/* Right side: Karakteristik Struktur Hirashima (Personifikasi Kognitif Topologi) */}
            <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-3">
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#1B1B1E]/10">
                <div className="min-w-0 pr-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1B1B1E] leading-snug">
                    Karakteristik Struktur Hirashima
                  </h3>
                  <span className="text-[10px] text-[#71717A] block mt-0.5">
                    Personifikasi model mental akumulatif
                  </span>
                </div>
                <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10px] font-mono font-bold text-[#0038D1] whitespace-nowrap select-none">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0038D1] shrink-0" />
                  <span>6 Modul Tervalidasi</span>
                </div>
              </div>

              <div className="space-y-2">
                {/* Net Structure */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#1B1B1E]">Net Structure (Jejaring Kompleks)</span>
                    <span className="font-mono text-[#0038D1]">68%</span>
                  </div>
                  <div className="w-full bg-white border border-[#1B1B1E] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#0038D1] h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                {/* Chain Structure */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#1B1B1E]">Chain Structure (Rantai Linier)</span>
                    <span className="font-mono text-[#059669]">24%</span>
                  </div>
                  <div className="w-full bg-white border border-[#1B1B1E] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#059669] h-2 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>

                {/* Spoke Structure */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#1B1B1E]">Spoke Structure (Pusat / Bintang)</span>
                    <span className="font-mono text-[#D97706]">8%</span>
                  </div>
                  <div className="w-full bg-white border border-[#1B1B1E] rounded-full h-2 overflow-hidden">
                    <div className="bg-[#D97706] h-2 rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-[#444655] leading-tight pt-1 border-t border-[#1B1B1E]/10">
                Dominasi <strong>Net Structure (68%)</strong> menunjukkan pemahaman relasional non-linier yang matang.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Cognitive Summary Metric Cards (Figma #57:12195 - 4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase tracking-wider">Indeks Kognitif</span>
              <Award className="w-4 h-4 text-[#0038D1]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#0038D1] tabular-nums">82.4</span>
                <span className="text-xs font-bold text-[#71717A]">/ 100</span>
                <span className="text-[10.5px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">+4.2%</span>
              </div>
              <p className="text-[11px] text-[#444655] mt-1.5">Skor rata-rata pemahaman konseptual</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Evaluasi Graf</span>
              <span className="font-bold text-[#1B1B1E]">NetworkX Core</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase tracking-wider">Progres Penugasan</span>
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#1B1B1E] tabular-nums">6</span>
                <span className="text-xl font-bold text-[#71717A] font-sans">/</span>
                <span className="text-2xl font-bold text-[#71717A] font-sans tabular-nums">8</span>
                <span className="text-xs font-bold text-[#71717A] ml-1">Modul</span>
                <span className="text-[10.5px] font-mono font-bold text-[#1B1B1E] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#1B1B1E]/20">75%</span>
              </div>
              <p className="text-[11px] text-[#444655] mt-1.5 font-medium">Lintas 4 Mata Kuliah Semester Ganjil</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Tersedia Hari Ini</span>
              <span className="font-bold text-[#059669]">1 Modul Siap</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase tracking-wider">Proposisi Valid (TP)</span>
              <Sparkles className="w-4 h-4 text-[#059669]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#059669] tabular-nums">48</span>
                <span className="text-xs font-bold text-[#059669]">Relasi</span>
                <span className="text-[10.5px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">88.9%</span>
              </div>
              <p className="text-[11px] text-[#444655] mt-1.5">Akurasi triple &lt;S, P, O&gt; tervalidasi</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Akurasi Busur</span>
              <span className="font-bold text-[#059669]">Sangat Tinggi</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFE4E6] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#DA3437] uppercase tracking-wider">Diagnosa Kritis</span>
              <AlertTriangle className="w-4 h-4 text-[#DA3437]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#DA3437] tabular-nums">2</span>
                <span className="text-xs font-bold text-[#DA3437]">Miskonsepsi</span>
              </div>
              <p className="text-[11px] text-[#7F1D1D] mt-1.5">Hubungan terbalik terdeteksi di graf</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#DA3437]">
              <span>Perlu Remedial</span>
              <span className="font-bold underline cursor-pointer" onClick={onViewResults}>Tinjau Graf →</span>
            </div>
          </div>
        </div>

        {/* Section 3: Primary Active Assessment Card (Aligned with Image 1) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[5px_5px_0px_#1B1B1E] space-y-4">
          {/* Header Row: Left Badge, Center Target Icon, Right Timer & Deadline */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left Pill: Green dot + ASESMEN AKTIF • ARSITEKTUR KOMPUTER #07 */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#1B1B1E]">
                ASESMEN AKTIF &bull; ARSITEKTUR KOMPUTER #07
              </span>
            </div>

            {/* Center: Decorative Focus Dot */}
            <div className="hidden md:flex w-7 h-7 rounded-full border border-[#1B1B1E] items-center justify-center bg-transparent">
              <span className="w-2 h-2 rounded-full bg-[#1B1B1E]"></span>
            </div>

            {/* Right Badges: Batas Waktu & Tenggat */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white border border-[#1B1B1E] text-xs font-bold text-[#1B1B1E] flex items-center gap-1.5 shadow-[1px_1px_0px_#1B1B1E]">
                <Clock className="w-3.5 h-3.5 text-[#0038D1]" />
                <span>Batas Waktu: {assessmentConfig.time_limit_minutes || 45} Menit</span>
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#DA3437] text-white border border-[#1B1B1E] text-xs font-bold flex items-center gap-1.5 shadow-[1px_1px_0px_#1B1B1E]">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>Tenggat: Hari Ini, 23:59 WIB</span>
              </span>
            </div>
          </div>

          {/* Assessment Title & Subtitle */}
          <div className="space-y-2 pt-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1B1B1E] tracking-tight">
              Kuis Pemahaman Konseptual CPU
            </h2>
            <p className="text-xs sm:text-sm text-[#444655] max-w-4xl leading-relaxed">
              Rangkai konsep tahapan eksekusi instruksi 5-stage pipeline (IF, ID, EX, MEM, WB) serta resolusi Data Hazard (Forwarding Unit) dan Control Hazard (Branch Prediction) sesuai model mental Master Map Dosen.
            </p>
          </div>

          {/* Bottom Bar: Concepts count, Relation types, Scheduled Exam and CTA Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-[#1B1B1E]">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-bold text-[#1B1B1E]">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E]">
                <Layers className="w-3.5 h-3.5 text-[#0038D1]" />
                5 Kepingan Konsep
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E]">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                5 Tipe Relasi
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E]">
                <Clock className="w-3.5 h-3.5 text-[#DA3437]" />
                Ujian Terjadwal
              </span>
            </div>

            <button
              onClick={onStartWorkspace}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white font-black text-sm border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              <span>Mulai Pengerjaan Kit Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 4: Fast Assessment Token Entry Box & Recent History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Quick Token PIN Box */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1B1B1E]/10">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#0038D1]" />
                  <h3 className="text-sm sm:text-base font-serif font-black text-[#1B1B1E]">Akses Cepat via PIN Ujian</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#059669] text-[9.5px] font-mono font-bold text-[#065F46] flex items-center gap-1 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                  Server Siap
                </span>
              </div>

              <p className="text-xs text-[#444655] leading-relaxed">
                Masukkan token 6-karakter dari dosen untuk langsung membuka sesi kanvas kit:
              </p>

              <form onSubmit={handleTokenSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value);
                      setTokenError('');
                    }}
                    placeholder="Contoh: KBT-9428"
                    className="w-full p-2.5 pl-3.5 pr-14 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] font-mono font-bold text-sm tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#0038D1] shadow-[2px_2px_0px_#1B1B1E]"
                  />
                  {tokenInput && (
                    <button
                      type="button"
                      onClick={() => setTokenInput('')}
                      className="absolute right-3 top-2.5 text-[11px] font-bold text-[#71717A] hover:text-[#1B1B1E] cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                {tokenError && <p className="text-[11px] font-bold text-red-600">{tokenError}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1B1B1E] hover:bg-[#0038D1] text-white font-bold text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buka Sesi Kanvas Kit-Build</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Exam Session Notice */}
            <div className="p-2.5 rounded-xl bg-[#F6F2F7] border border-[#1B1B1E] flex items-center gap-2 text-xs text-[#444655]">
              <ShieldCheck className="w-4 h-4 text-[#0038D1] shrink-0" />
              <span className="text-[10.5px] leading-tight">
                Mode Ujian: Timer pengerjaan dan penyimpanan otomatis aktif sejak sesi dibuka.
              </span>
            </div>
          </div>

          {/* Right Column: Upcoming Assessments (Asesmen yang Akan Datang - Sisa 2 Modul Menuju 8/8) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1B1B1E]/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0038D1]" />
                <h3 className="text-sm sm:text-base font-serif font-black text-[#1B1B1E]">
                  Asesmen yang Akan Datang
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#1B1B1E] text-[10px] font-mono font-bold text-[#1B1B1E]">
                2 Modul Tersisa &bull; Target 8/8 Selesai
              </span>
            </div>

            <div className="space-y-2">
              {/* Modul 07: Aktif Hari Ini */}
              <div className="p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#059669] text-[9.5px] font-mono font-black text-[#065F46] uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                      Aktif Hari Ini
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#1B1B1E] text-[9.5px] font-mono font-bold text-[#0038D1]">
                      Arsitektur Komputer
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">Batas: 23:59 WIB</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1B1B1E] truncate">
                    Modul 07: Pipelining Prosesor & Penanganan Hazard
                  </h4>
                  <p className="text-[10.5px] text-[#444655]">
                    5-Stage Execution (IF-ID-EX-MEM-WB), Data Hazards & Branching &bull; Durasi: 45 Menit
                  </p>
                </div>
                <button
                  onClick={onStartWorkspace}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#0038D1] hover:bg-[#2F54EB] text-white text-xs font-bold border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Kerjakan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modul 08: Segera Dibuka / Terjadwal */}
              <div className="p-3 rounded-xl bg-[#FAF7F2]/60 border-2 border-[#1B1B1E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-1 min-w-0 opacity-80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFEAA7] border border-[#1B1B1E] text-[9.5px] font-mono font-black text-[#1B1B1E] uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#1B1B1E]" />
                      Segera Dibuka
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#1B1B1E] text-[9.5px] font-mono font-bold text-[#059669]">
                      Sistem Operasi
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">Jadwal: 20 Okt 2026, 08:00 WIB</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1B1B1E] truncate">
                    Modul 08: Arsitektur Multicore, Parallelism & Cache Coherence
                  </h4>
                  <p className="text-[10.5px] text-[#444655]">
                    Shared Memory, Protokol MESI & Thread Synchronization &bull; Batas: 22 Okt 2026, 23:59 WIB
                  </p>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-[#71717A] text-[11px] font-bold border border-[#1B1B1E]/30 flex items-center justify-center gap-1 select-none">
                  <Lock className="w-3 h-3" />
                  <span>Terkunci</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Two-column Cognitive Diagnostics & Assessment History (Evenly Balanced) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Retensi Kognitif & Diagnosa Miskonsepsi */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#FAF7F2] gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <BarChart3 className="w-5 h-5 text-[#0038D1] shrink-0" />
                  <h3 className="text-base font-serif font-black text-[#1B1B1E] truncate">
                    Retensi Kognitif & Miskonsepsi
                  </h3>
                </div>
                <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#0038D1] text-[10px] font-mono font-bold text-[#0038D1] whitespace-nowrap shadow-[1px_1px_0px_#1B1B1E] select-none leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0038D1] shrink-0" />
                  <span className="whitespace-nowrap">Diagnosa Graf Kognitif &bull; Akumulatif</span>
                </div>
              </div>

              <p className="text-xs text-[#444655] leading-relaxed">
                Sistem Kit-Build mengidentifikasi titik friksi konseptual aktif dari riwayat pengerjaan modul Anda yang belum selaras dengan Master Map Dosen:
              </p>

              {/* Identified Misconceptions List */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#FFFBEB] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#1B1B1E] text-[10px] font-mono font-black text-[#1B1B1E]">
                        Arsitektur Komputer &bull; Modul 04
                      </span>
                      <span className="text-[10.5px] font-mono font-black uppercase text-[#B45309]">
                        Miskonsepsi 01 &bull; Proposisi Terbalik
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] border border-[#1B1B1E] text-[10px] font-bold text-[#DC2626] shrink-0">
                      Kritis
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <span className="bg-white px-2 py-0.5 rounded border border-[#1B1B1E]">[CPU]</span>
                    <span className="text-[#DC2626]">── controls ──▶</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#1B1B1E]">[Register]</span>
                  </div>
                  <p className="text-[11px] text-[#444655] leading-relaxed">
                    <strong>Koreksi Pedagogis:</strong> Register adalah komponen internal penyimpanan sementara kecepatan tinggi di dalam CPU itu sendiri, bukan periferal eksternal yang menerima sinyal kendali bus dari CU.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFBEB] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#1B1B1E] text-[10px] font-mono font-black text-[#1B1B1E]">
                        Sistem Operasi &bull; Modul 05
                      </span>
                      <span className="text-[10.5px] font-mono font-black uppercase text-[#B45309]">
                        Miskonsepsi 02 &bull; Salah Klasifikasi Hierarki
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#FFEAA7] border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] shrink-0">
                      Sedang
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <span className="bg-white px-2 py-0.5 rounded border border-[#1B1B1E]">[Virtual Memory]</span>
                    <span className="text-[#D97706]">── part of ──▶</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#1B1B1E]">[Cache L1]</span>
                  </div>
                  <p className="text-[11px] text-[#444655] leading-relaxed">
                    <strong>Koreksi Pedagogis:</strong> Virtual Memory dikelola oleh MMU OS pada secondary storage (disk), bukan bagian dari SRAM Cache L1 internal prosesor.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1B1B1E]/10 flex justify-end">
              <button
                onClick={onViewResults}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EEF2FF] text-[#0038D1] border-2 border-[#1B1B1E] font-bold text-xs shadow-[2px_2px_0px_#1B1B1E] cursor-pointer transition-all"
              >
                <span>Lihat Analisis Graf Komparatif Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Riwayat Pengerjaan Asesmen (6 Modul Tuntas Sesuai Progress 6/8) */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <h3 className="text-base font-serif font-black text-[#1B1B1E]">
                    Riwayat Pengerjaan Asesmen
                  </h3>
                </div>
                <button
                  onClick={onViewResults}
                  className="text-xs font-bold text-[#0038D1] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Hasil Graf Terakhir</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#71717A]">
                <span>6 dari 8 modul telah diselesaikan</span>
                <span className="font-mono font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                  Rata-rata: 88.9% Akurasi
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Modul 06: Sistem Bus & Manajemen I/O',
                    course: 'Arsitektur Komputer',
                    courseBadge: 'bg-[#EEF2FF] text-[#0038D1] border-[#C7D2FE]',
                    score: 84,
                    date: 'Kemarin',
                    propositions: '14 Proposisi',
                    status: 'Tuntas'
                  },
                  {
                    title: 'Modul 05: Sinkronisasi Thread & Deadlock',
                    course: 'Sistem Operasi',
                    courseBadge: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
                    score: 86,
                    date: '12 Okt 2026',
                    propositions: '16 Proposisi',
                    status: 'Tuntas'
                  },
                  {
                    title: 'Modul 04: Normalisasi Basis Data & Relasional',
                    course: 'Basis Data',
                    courseBadge: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
                    score: 82,
                    date: '10 Okt 2026',
                    propositions: '12 Proposisi',
                    status: 'Perlu Penguatan'
                  },
                  {
                    title: 'Modul 03: Arsitektur Von Neumann & Siklus CPU',
                    course: 'Arsitektur Komputer',
                    courseBadge: 'bg-[#EEF2FF] text-[#0038D1] border-[#C7D2FE]',
                    score: 88,
                    date: '06 Okt 2026',
                    propositions: '15 Proposisi',
                    status: 'Tuntas'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] flex items-center justify-between gap-3 shadow-[1.5px_1.5px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.2 rounded border text-[9px] font-mono font-bold ${item.courseBadge}`}>
                          {item.course}
                        </span>
                        <h4 className="font-bold text-xs text-[#1B1B1E] truncate">{item.title}</h4>
                      </div>
                      <span className="text-[9.5px] font-mono text-[#71717A] block">
                        {item.date} &bull; {item.propositions}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {/* Status Badge: Tuntas = Hijau, Perlu Penguatan = Kuning/Amber */}
                      {item.status === 'Tuntas' ? (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#059669]">
                          <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0" />
                          <span>Tuntas</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9.5px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#D97706]">
                          <AlertTriangle className="w-3 h-3 text-[#D97706] shrink-0" />
                          <span>Perlu Penguatan</span>
                        </span>
                      )}

                      {/* Box Skor: Anchored on the right with uniform width, 100% sederet vertikal */}
                      <div className="w-12 h-10 rounded-lg bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] flex flex-col items-center justify-center shrink-0">
                        <span className="font-mono font-black text-xs text-[#0038D1] leading-none">
                          {item.score}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-[#71717A] uppercase leading-none mt-0.5">
                          Skor
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[11px] text-[#71717A]">
              <span>Portofolio Semester Ganjil</span>
              <span className="font-mono font-bold text-[#059669]">2 Modul Menuju Kelulusan 8/8</span>
            </div>
          </div>
        </div>

        {/* Section 6: Interactive Tips & Tricks Carousel Banner (Pure Slide Geser, No Emoticons) */}
        {(() => {
          const currentTip = KIT_BUILD_TIPS[activeTipIndex];
          return (
            <div
              onMouseEnter={() => setIsTipPaused(true)}
              onMouseLeave={() => setIsTipPaused(false)}
              className="relative p-4 sm:p-5 rounded-2xl bg-[#F6F2F7] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] overflow-hidden transition-all"
            >
              {/* Top Meta Header: Clean Lucide Icon, Title & Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[#1B1B1E]/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-[#1B1B1E] text-[#0038D1] shadow-[1px_1px_0px_#1B1B1E] flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-[#0038D1]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#1B1B1E]">
                      Tips & Trik Metode Kit-Build
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full border border-[#1B1B1E] text-[9.5px] font-mono font-bold text-white transition-colors"
                      style={{ backgroundColor: currentTip.color }}
                    >
                      {currentTip.category}
                    </span>
                  </div>
                </div>

                {/* Right controls: Prev / Dots / Next */}
                <div className="flex items-center gap-2">
                  {isTipPaused && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#1B1B1E]/30 text-[9px] font-mono text-[#71717A] animate-pulse">
                      Jeda
                    </span>
                  )}
                  <div className="flex items-center gap-1 bg-[#FAF7F2] px-2 py-1 rounded-xl border border-[#1B1B1E]">
                    <button
                      type="button"
                      onClick={() =>
                        handleManualTipChange(
                          (activeTipIndex - 1 + KIT_BUILD_TIPS.length) % KIT_BUILD_TIPS.length
                        )
                      }
                      className="p-0.5 rounded hover:bg-white text-[#1B1B1E] cursor-pointer transition-colors"
                      title="Tip Sebelumnya"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1 px-1">
                      {KIT_BUILD_TIPS.map((tip, idx) => (
                        <button
                          key={tip.id}
                          type="button"
                          onClick={() => handleManualTipChange(idx)}
                          className={`transition-all rounded-full cursor-pointer ${
                            idx === activeTipIndex
                              ? 'w-4 h-1.5'
                              : 'w-1.5 h-1.5 bg-[#1B1B1E]/30 hover:bg-[#1B1B1E]'
                          }`}
                          style={{
                            backgroundColor: idx === activeTipIndex ? currentTip.color : undefined
                          }}
                          title={`Buka Tip #${idx + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleManualTipChange((activeTipIndex + 1) % KIT_BUILD_TIPS.length)
                      }
                      className="p-0.5 rounded hover:bg-white text-[#1B1B1E] cursor-pointer transition-colors"
                      title="Tip Berikutnya"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pure Horizontal Sliding Track (slide geser murni tanpa flicker) */}
              <div className="overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeTipIndex * 100}%)` }}
                >
                  {KIT_BUILD_TIPS.map((tip) => (
                    <div key={tip.id} className="w-full shrink-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0 pr-2">
                          <h4 className="text-xs sm:text-sm font-black text-[#1B1B1E] flex items-center gap-2">
                            <span>{tip.title}</span>
                          </h4>
                          <p className="text-xs text-[#444655] leading-relaxed">
                            {tip.desc}{' '}
                            <code className="bg-white px-1.5 py-0.5 rounded border border-[#1B1B1E] font-mono font-bold text-[11px] text-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E]">
                              {tip.highlight}
                            </code>{' '}
                            {tip.postDesc}
                          </p>
                        </div>

                        <span className="shrink-0 self-start sm:self-center px-3 py-1 rounded-full bg-white border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E]">
                          {tip.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar (Color filling from left to right) */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#1B1B1E]/10 overflow-hidden">
                <div
                  className="h-full transition-all duration-75 ease-linear rounded-r-full"
                  style={{
                    width: `${tipProgress}%`,
                    backgroundColor: currentTip.color
                  }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
