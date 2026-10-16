'use client';

import React, { useState } from 'react';
import { AssessmentConfig, ConceptKit } from '../types/maply';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Filter,
  Layers,
  Award,
  Sparkles,
  Play,
  RotateCcw,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface StudentAssessmentsViewProps {
  assessmentConfig: AssessmentConfig;
  kit: ConceptKit | null;
  onStartWorkspace: () => void;
  onViewResults: () => void;
}

export const StudentAssessmentsView: React.FC<StudentAssessmentsViewProps> = ({
  assessmentConfig,
  kit,
  onStartWorkspace,
  onViewResults
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const assessments = [
    {
      id: 'asm-cpu-01',
      title: 'Asesmen #01: Alur Pemrosesan CPU & Siklus Instruksi',
      course: 'Arsitektur Komputer',
      code: 'TIF-2101',
      lecturer: 'Ir. Aryo Pinandito, Ph.D.',
      status: 'in_progress',
      statusLabel: 'Sedang Berjalan • 65% Selesai',
      badgeColor: 'bg-[#FFDAD6] text-[#93000A] border-[#93000A]',
      topic: 'REKONSTRUKSI GRAPH SIKLUS INSTRUKSI',
      desc: 'Susun kembali kepingan konsep CPU, ALU, CU, dan Register sesuai alur fetch-decode-execute. Waspada terhadap kartu distraktor yang tidak memiliki keterhubungan logis pada bus data utama!',
      deadline: 'Hari ini, 23:59 WIB',
      attempts: 'Percobaan 1 dari 2',
      nodesCount: 7,
      score: null,
      isActiveCurrent: true
    },
    {
      id: 'asm-cache-02',
      title: 'Asesmen #02: Hirarki Memori, Cache L1/L2, & Siklus Bus Data',
      course: 'Arsitektur Komputer',
      code: 'TIF-2101',
      lecturer: 'Ir. Aryo Pinandito, Ph.D.',
      status: 'in_progress',
      statusLabel: 'Tersedia • Belum Dimulai',
      badgeColor: 'bg-[#EEF2FF] text-[#0038D1] border-[#C7D2FE]',
      topic: 'LOKALITAS SPASIAL & TEMPORAL MEMORI',
      desc: 'Petakan aliran data dari Secondary Storage hingga CPU Core Registers. Tentukan keterkaitan hit-rate cache dan latency transfer memori bertingkat.',
      deadline: '18 Okt 2026, 12:00 WIB',
      attempts: 'Percobaan 0 dari 2',
      nodesCount: 8,
      score: null,
      isActiveCurrent: false
    },
    {
      id: 'asm-vm-03',
      title: 'Asesmen #03: Translasi Alamat Virtual Memory & Paging Sistem',
      course: 'Sistem Operasi',
      code: 'TIF-2104',
      lecturer: 'Dr. Eng. Herman Tolle',
      status: 'completed',
      statusLabel: 'Telah Dinilai • Skor 88/100',
      badgeColor: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
      topic: 'MANAGEMEN PAGE TABLE & TLB FAULT',
      desc: 'Konstruksi graf telah divalidasi oleh sistem deterministik NetworkX. 8 proposisi valid berhasil terhubung dengan precision 87.5%.',
      deadline: 'Selesai 12 Okt 2026',
      attempts: '2 dari 2 Percobaan Digunakan',
      nodesCount: 9,
      score: 88,
      isActiveCurrent: false
    },
    {
      id: 'asm-osi-04',
      title: 'Asesmen #04: Enkapsulasi Paket Protokol Lapisan OSI & TCP/IP',
      course: 'Jaringan Komputer',
      code: 'TIF-2108',
      lecturer: 'Widhy Hayuhardhika N. P., M.Kom.',
      status: 'completed',
      statusLabel: 'Telah Dinilai • Skor 74/100',
      badgeColor: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',
      topic: 'DATA ENCAPSULATION & HEADER FRAMING',
      desc: 'Konstruksi graf selesai dengan rekomendasi perkuatan pada perbedaan framing data link vs network packet header.',
      deadline: 'Selesai 08 Okt 2026',
      attempts: '1 Kali Iterasi',
      nodesCount: 7,
      score: 74,
      isActiveCurrent: false
    }
  ];

  const filtered = assessments.filter((a) => {
    if (filterTab === 'in_progress' && a.status !== 'in_progress') return false;
    if (filterTab === 'completed' && a.status !== 'completed') return false;
    if (searchQuery.trim() && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-[#FAF7F2] text-[#1B1B1E] min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* ========================================================= */}
        {/* SECTION 1: HEADER BANNER (Figma #46:1472) */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b-2 border-[#1B1B1E]/10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#F0EDF1] border border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10px] font-serif font-black uppercase tracking-wider text-[#1B1B1E]">
                PORTAL MAHASISWA &bull; FILKOM UB
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#FFDDB8] text-[#2A1700] text-[10px] font-mono font-bold flex items-center gap-1.5 border border-[#1B1B1E]">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                Hirashima Kit-Build Framework
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1B1B1E] tracking-tight leading-tight">
              Daftar Asesmen Mahasiswa
            </h1>

            <p className="text-xs sm:text-sm text-[#444655] leading-relaxed">
              Asesmen rekonstruksi peta konsep berarah (Kit-Build) berdasarkan kurikulum aktif FILKOM UB.
              Bangun proposisi ilmiah yang valid dari kepingan konsep yang tersedia.
            </p>
          </div>

          {/* Right Benchmark Badge Card (Figma #46:1487) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 rounded-xl bg-[#DEE1FF] border-2 border-[#1B1B1E] flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black font-sans tracking-tight text-[#0038D1] leading-none tabular-nums">82.4</span>
              <span className="text-[8.5px] font-mono font-bold uppercase text-[#001257]">AKURASI</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#6D4400] block">
                TINGKAT KOGNITIF
              </span>
              <h4 className="text-base font-serif font-black text-[#1B1B1E] leading-tight">
                Terintegrasi
              </h4>
              <p className="text-[11px] text-[#444655] font-medium">
                5 dari 6 Peta Konsep Valid
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: TACTILE FILTER BAR (Figma #46:1503) */}
        {/* ========================================================= */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#F6F2F7] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2px_2px_0px_#1B1B1E] text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 sm:px-4 py-1.5 rounded-full font-serif text-xs transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-[#0038D1] text-white font-black shadow-[1.5px_1.5px_0px_#1B1B1E]'
                  : 'text-[#444655] hover:text-[#1B1B1E] font-bold'
              }`}
            >
              Semua ({assessments.length})
            </button>
            <button
              onClick={() => setFilterTab('in_progress')}
              className={`px-3 sm:px-4 py-1.5 rounded-full font-serif text-xs transition-all cursor-pointer ${
                filterTab === 'in_progress'
                  ? 'bg-[#0038D1] text-white font-black shadow-[1.5px_1.5px_0px_#1B1B1E]'
                  : 'text-[#444655] hover:text-[#1B1B1E] font-bold'
              }`}
            >
              Tersedia / Aktif (2)
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 sm:px-4 py-1.5 rounded-full font-serif text-xs transition-all cursor-pointer ${
                filterTab === 'completed'
                  ? 'bg-[#0038D1] text-white font-black shadow-[1.5px_1.5px_0px_#1B1B1E]'
                  : 'text-[#444655] hover:text-[#1B1B1E] font-bold'
              }`}
            >
              Telah Selesai (2)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul asesmen..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0038D1]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: ASSESSMENT CARDS LIST (Figma #46:1539) */}
        {/* ========================================================= */}
        <div className="space-y-5">
          {filtered.map((asm) => (
            <div
              key={asm.id}
              className={`rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] overflow-hidden transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#1B1B1E] ${
                asm.isActiveCurrent ? 'ring-2 ring-[#0038D1]' : ''
              }`}
            >
              {/* Top Utility Strip */}
              <div className="px-5 py-2.5 bg-[#F0EDF1] border-b-2 border-[#1B1B1E] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E] font-serif font-black text-[11px] text-[#1B1B1E]">
                    {asm.course}
                  </span>
                  <span className="font-mono text-[#71717A] text-[11px] font-bold">
                    {asm.code} &bull; {asm.lecturer}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${asm.badgeColor}`}>
                    {asm.statusLabel}
                  </span>
                </div>
              </div>

              {/* Main Card Body */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0038D1] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {asm.topic}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1B1B1E] leading-snug">
                      {asm.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-[#444655] leading-relaxed max-w-3xl">
                      {asm.desc}
                    </p>
                  </div>

                  {/* Actions depending on status */}
                  <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
                    {asm.status === 'in_progress' ? (
                      <button
                        onClick={onStartWorkspace}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0038D1] hover:bg-[#1A4BDB] text-white font-serif font-black text-xs sm:text-sm border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Buka Sesi Kanvas Kit-Build</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={onViewResults}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1B1B1E] font-serif font-bold text-xs border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-[#D97706]" />
                        <span>Lihat Evaluasi & Hasil Graf</span>
                      </button>
                    )}

                    <span className="text-[10.5px] font-mono text-[#71717A] text-right">
                      {asm.deadline} &bull; {asm.attempts}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* SECTION 4: PEDAGOGICAL GUIDANCE CALLOUT (Figma #46:1815) */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#F6F2F7] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFDDB8] border-2 border-[#1B1B1E] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1B1B1E]">
            <ShieldCheck className="w-6 h-6 text-[#2A1700]" />
          </div>

          <div className="space-y-1 flex-1">
            <h4 className="text-sm sm:text-base font-serif font-black text-[#1B1B1E]">
              Ketentuan Pengerjaan Kit-Build Concept Map (Hirashima Framework)
            </h4>
            <p className="text-xs text-[#555] leading-relaxed">
              Penilaian menggunakan algoritma graf deterministik (NetworkX). Setiap proposisi dinilai secara utuh dalam formula{' '}
              <code className="px-1.5 py-0.5 rounded bg-white border border-[#1B1B1E] font-mono font-bold text-[11px] text-[#0038D1]">
                [Konsep Asal] ➔ [Label Relasi] ➔ [Konsep Tujuan]
              </code>
              . Nilai dan umpan balik otomatis dihitung langsung setelah Anda menekan tombol Kirim Asesmen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
