'use client';

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  User,
  GraduationCap,
  GitCompare,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';

interface StudentPersonalResultsViewProps {
  studentName?: string;
  studentNim?: string;
  onBackToDashboard: () => void;
  onInspectAssessment: (assessmentId: string) => void;
}

export const StudentPersonalResultsView: React.FC<StudentPersonalResultsViewProps> = ({
  studentName = 'Ahmad Rizky',
  studentNim = '235150201111048',
  onBackToDashboard,
  onInspectAssessment
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  const courseList = [
    { id: 'all', name: 'Semua Mata Kuliah (4)' },
    { id: 'arkom', name: 'Arsitektur Komputer' },
    { id: 'os', name: 'Sistem Operasi' },
    { id: 'bd', name: 'Basis Data' },
    { id: 'jarkom', name: 'Jaringan Komputer' }
  ];

  const completedAssessments = [
    {
      id: 'asm-cpu-06',
      courseId: 'arkom',
      courseName: 'Arsitektur Komputer',
      courseCode: 'TIF-2101',
      moduleTitle: 'Modul 06: Sistem Bus & Manajemen I/O',
      date: '15 Okt 2026',
      score: 84,
      status: 'Tuntas',
      validPropositions: 14,
      totalPropositions: 16,
      accuracy: '87.5%',
      dominantTopology: 'Net Structure (70%)',
      misconceptionCount: 0
    },
    {
      id: 'asm-os-05',
      courseId: 'os',
      courseName: 'Sistem Operasi',
      courseCode: 'TIF-2104',
      moduleTitle: 'Modul 05: Sinkronisasi Thread & Deadlock Resolution',
      date: '12 Okt 2026',
      score: 86,
      status: 'Tuntas',
      validPropositions: 16,
      totalPropositions: 18,
      accuracy: '88.9%',
      dominantTopology: 'Net Structure (65%)',
      misconceptionCount: 1
    },
    {
      id: 'asm-arkom-04',
      courseId: 'arkom',
      courseName: 'Arsitektur Komputer',
      courseCode: 'TIF-2101',
      moduleTitle: 'Modul 04: Struktur CPU & Hierarki Cache L1/L2',
      date: '10 Okt 2026',
      score: 82,
      status: 'Perlu Penguatan',
      validPropositions: 12,
      totalPropositions: 15,
      accuracy: '80.0%',
      dominantTopology: 'Chain Structure (55%)',
      misconceptionCount: 1
    },
    {
      id: 'asm-bd-03',
      courseId: 'bd',
      courseName: 'Basis Data',
      courseCode: 'TIF-2103',
      moduleTitle: 'Modul 03: Normalisasi Relasional & Ketergantungan Fungsional',
      date: '06 Okt 2026',
      score: 88,
      status: 'Tuntas',
      validPropositions: 15,
      totalPropositions: 16,
      accuracy: '93.7%',
      dominantTopology: 'Net Structure (72%)',
      misconceptionCount: 0
    },
    {
      id: 'asm-jarkom-02',
      courseId: 'jarkom',
      courseName: 'Jaringan Komputer',
      courseCode: 'TIF-2108',
      moduleTitle: 'Modul 02: Arsitektur Lapisan Protokol TCP/IP & Subnetting CIDR',
      date: '01 Okt 2026',
      score: 85,
      status: 'Tuntas',
      validPropositions: 13,
      totalPropositions: 15,
      accuracy: '86.7%',
      dominantTopology: 'Chain Structure (48%)',
      misconceptionCount: 0
    },
    {
      id: 'asm-os-01',
      courseId: 'os',
      courseName: 'Sistem Operasi',
      courseCode: 'TIF-2104',
      moduleTitle: 'Modul 01: Arsitektur Von Neumann & Siklus Instruksi OS Kernel',
      date: '27 Sep 2026',
      score: 90,
      status: 'Tuntas',
      validPropositions: 18,
      totalPropositions: 19,
      accuracy: '94.7%',
      dominantTopology: 'Net Structure (75%)',
      misconceptionCount: 0
    }
  ];

  const filteredAssessments =
    selectedCourseFilter === 'all'
      ? completedAssessments
      : completedAssessments.filter((a) => a.courseId === selectedCourseFilter);

  return (
    <div className="bg-[#FAF7F2] text-[#1B1B1E] min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* SECTION 1: HEADER PERSONAL RESULTS & ACADEMIC CONTEXT */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#0038D1] text-[10.5px] font-mono font-bold text-[#0038D1]">
                PORTOFOLIO KOGNITIF MAHASISWA &bull; AKUMULATIF
              </span>
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#059669] text-[10.5px] font-mono font-bold text-[#065F46]">
                4 Mata Kuliah Aktif
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#1B1B1E]">
              Hasil Evaluasi Kognitif Personal
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#71717A]">
              <span className="font-bold text-[#1B1B1E] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0038D1]" />
                {studentName} (NIM: {studentNim})
              </span>
              <span>&bull;</span>
              <span>Teknik Informatika &bull; FILKOM UB</span>
              <span>&bull;</span>
              <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#1B1B1E] text-[10px] font-mono font-bold text-[#1B1B1E]">
                Personifikasi: Relational Thinker
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onBackToDashboard}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#1B1B1E] font-serif font-bold text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: 4 SUMMARY CARDS (AKUMULASI LINTAS MATA KULIAH) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
              Indeks Kognitif Kumulatif
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#0038D1] tabular-nums">
                  84.5
                </span>
                <span className="text-sm font-bold text-[#71717A]">/ 100</span>
                <span className="text-[10px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                  +3.8%
                </span>
              </div>
              <p className="text-[11px] text-[#444655] mt-1.5">Rata-rata 6 modul lintas 4 matkul</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Tingkat Penguasaan</span>
              <span className="font-bold text-[#0038D1]">Tinggi (Kompeten)</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
              Progres Kelulusan Modul
            </span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#1B1B1E] tabular-nums">
                  6
                </span>
                <span className="text-xl font-bold text-[#71717A]">/</span>
                <span className="text-2xl font-bold text-[#71717A] tabular-nums">8</span>
                <span className="text-xs font-bold text-[#71717A] ml-1">Modul</span>
                <span className="text-[10px] font-mono font-bold text-[#1B1B1E] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#1B1B1E]/20">
                  75%
                </span>
              </div>
              <p className="text-[11px] text-[#444655] mt-1.5">Sisa 2 modul target semester</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Status CPL</span>
              <span className="font-bold text-[#059669]">Memenuhi Target</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
              Proposisi Valid Akumulatif
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#059669] tabular-nums">
                  88
                </span>
                <span className="text-xs font-bold text-[#059669]">Relasi Kausal</span>
                <span className="text-[10px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                  89.2%
                </span>
              </div>
              <p className="text-[11px] text-[#444655] mt-1.5">Akurasi triple tervalidasi</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Kepadatan Graf</span>
              <span className="font-bold text-[#059669]">Sangat Baik</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFE4E6] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex flex-col justify-between space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#DA3437] uppercase tracking-wider">
              Miskonsepsi Aktif
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#DA3437] tabular-nums">
                  2
                </span>
                <span className="text-xs font-bold text-[#DA3437]">Titik Perlu Review</span>
              </div>
              <p className="text-[11px] text-[#7F1D1D] mt-1.5">Tercatat di Modul Arkom & OS</p>
            </div>
            <div className="pt-2 border-t border-[#1B1B1E]/10 flex items-center justify-between text-[10px] font-mono text-[#DA3437]">
              <span>Rekomendasi</span>
              <span className="font-bold underline cursor-pointer">Lihat Diagnosa ↓</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: TOPOLOGY HIRASHIMA BREAKDOWN & PEDAGOGICAL INSIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Hirashima Mental Model Distribution */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1B1E]/10">
              <div>
                <h3 className="text-sm font-serif font-black uppercase tracking-wider text-[#1B1B1E]">
                  Karakteristik Struktur Topologi Hirashima Akumulatif
                </h3>
                <span className="text-xs text-[#71717A]">
                  Analisis model mental dari 6 peta konsep yang direkonstruksi
                </span>
              </div>
              <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10.5px] font-mono font-bold text-[#0038D1]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0038D1]" />
                <span>6 Modul Terverifikasi</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* Net Structure */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0038D1]" />
                    <span className="text-[#1B1B1E]">Net Structure (Jejaring Kompleks Non-Linier)</span>
                  </div>
                  <span className="font-mono text-[#0038D1] font-black">68%</span>
                </div>
                <div className="w-full bg-[#FAF7F2] border border-[#1B1B1E] rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#0038D1] h-2.5 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Chain Structure */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#059669]" />
                    <span className="text-[#1B1B1E]">Chain Structure (Rantai Logika Linier)</span>
                  </div>
                  <span className="font-mono text-[#059669] font-black">24%</span>
                </div>
                <div className="w-full bg-[#FAF7F2] border border-[#1B1B1E] rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#059669] h-2.5 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              {/* Spoke Structure */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D97706]" />
                    <span className="text-[#1B1B1E]">Spoke Structure (Pusat Sentral / Bintang)</span>
                  </div>
                  <span className="font-mono text-[#D97706] font-black">8%</span>
                </div>
                <div className="w-full bg-[#FAF7F2] border border-[#1B1B1E] rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#D97706] h-2.5 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1B1B1E]/15 text-xs text-[#444655] leading-relaxed">
              <strong>Interpretasi Pedagogis:</strong> Dominasi <strong>Net Structure (68%)</strong> membuktikan Anda mampu menghubungkan konsep lintas sub-bab secara sistemik, melampaui hafalan linear urutan bab.
            </div>
          </div>

          {/* Persona Card & Recommendations */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#1B1B1E] text-[10px] font-mono font-black uppercase text-[#1B1B1E]">
                PROFIL KOGNITIF MAHASISWA
              </span>
              <h3 className="text-xl font-serif font-black text-[#1B1B1E]">
                Relational Thinker
              </h3>
              <p className="text-xs text-[#444655] leading-relaxed">
                Gaya kognitif Anda sangat kuat dalam mengidentifikasi hubungan sebab-akibat antar komponen abstrak (misal: keterkaitan bus data, memori, dan register).
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#1B1B1E]/15">
              <span className="text-[11px] font-mono font-bold text-[#1B1B1E] uppercase">
                Fokus Penguatan Berikutnya:
              </span>
              <ul className="text-xs text-[#444655] space-y-1.5 list-disc list-inside">
                <li>Perbaiki relasi terbalik pada konsep bus kendali vs register CPU.</li>
                <li>Perjelas batas fisik SRAM Cache internal vs DRAM Virtual Memory MMU.</li>
              </ul>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#1B1B1E] text-[10.5px] font-mono font-bold text-[#059669] shadow-[1px_1px_0px_#1B1B1E]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                Lulus Ambang CPL Fakultas (Min. 70/100)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3B: MATRIKS CPL KURIKULUM & REKOMENDASI AI PEDAGOGIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Matriks CPL */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B1B1E]/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0038D1]" />
                <h3 className="text-sm font-serif font-black uppercase tracking-wider text-[#1B1B1E]">
                  Pencapaian CPL Program Studi (Kurikulum OBE)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#059669] text-[10px] font-mono font-bold text-[#065F46]">
                4 dari 4 CPL Terpenuhi
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  code: 'CPL-01',
                  name: 'Penguasaan Arsitektur Sistem & Organisasi Komputer',
                  score: 85,
                  course: 'Arsitektur Komputer',
                  status: 'Melampaui Target'
                },
                {
                  code: 'CPL-02',
                  name: 'Manajemen Konkurensi & Siklus Sumber Daya OS',
                  score: 88,
                  course: 'Sistem Operasi',
                  status: 'Melampaui Target'
                },
                {
                  code: 'CPL-03',
                  name: 'Integritas Relasional & Dekomposisi Normalisasi',
                  score: 88,
                  course: 'Basis Data',
                  status: 'Melampaui Target'
                },
                {
                  code: 'CPL-04',
                  name: 'Protokol Komunikasi Data & Arsitektur Jaringan',
                  score: 85,
                  course: 'Jaringan Komputer',
                  status: 'Memenuhi Target'
                }
              ].map((cpl, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#1B1B1E]/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-white border border-[#1B1B1E] font-mono font-black text-[10px] text-[#0038D1]">
                        {cpl.code}
                      </span>
                      <span className="font-bold text-[#1B1B1E]">{cpl.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#0038D1]">{cpl.score}%</span>
                      <span className="text-[10px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                        {cpl.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white border border-[#1B1B1E]/30 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#0038D1] h-2 rounded-full" style={{ width: `${cpl.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pedagogical Advisor Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#EEF2FF] border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#0038D1]/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0038D1]" />
                  <h3 className="text-sm font-serif font-black uppercase tracking-wider text-[#0038D1]">
                    Rekomendasi AI Pedagogis
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#0038D1] text-[9.5px] font-mono font-bold text-[#0038D1]">
                  NetworkX AI
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-[#1B1B1E]">
                <div className="p-3 rounded-xl bg-white border border-[#0038D1]/30 space-y-1">
                  <span className="font-bold text-[#0038D1] block text-[11.5px]">
                    Strategi 2 Modul Tersisa (Menuju 8/8):
                  </span>
                  <p className="text-[11px] text-[#444655] leading-relaxed">
                    Fokuskan konstruksi pada <strong>Pipelining (Modul 07)</strong> dan <strong>Multicore Cache Coherence (Modul 08)</strong>. Pertahankan dominasi Net Structure agar skor kumulatif menembus ambang 85+.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#0038D1]/30 space-y-1">
                  <span className="font-bold text-[#D97706] block text-[11.5px]">
                    Catatan Remedial Singkat:
                  </span>
                  <p className="text-[11px] text-[#444655] leading-relaxed">
                    Luangkan 5 menit meninjau garis merah pada visualisasi graf <em>Modul 04</em> sebelum membuka sesi pengerjaan Modul 07 hari ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#0038D1]/20 flex items-center justify-between text-[10.5px] text-[#444655]">
              <span>Status Sertifikasi</span>
              <span className="font-mono font-bold text-[#0038D1]">Siap Ujian Akhir Semester</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: DAFTAR EVALUASI ASESMEN LINTAS MATA KULIAH */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#FAF7F2]">
            <div>
              <h3 className="text-lg font-serif font-black text-[#1B1B1E]">
                Riwayat & Evaluasi Modul Lintas Mata Kuliah
              </h3>
              <p className="text-xs text-[#71717A]">
                Pilih modul asesmen untuk meninjau detail graf proposisi, metrik F1-score, dan perbandingan terhadap Master Map Dosen.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {courseList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseFilter(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-serif font-bold border border-[#1B1B1E] transition-all cursor-pointer ${
                    selectedCourseFilter === c.id
                      ? 'bg-[#0038D1] text-white shadow-[1.5px_1.5px_0px_#1B1B1E]'
                      : 'bg-white hover:bg-slate-100 text-[#1B1B1E]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredAssessments.map((asm) => (
              <div
                key={asm.id}
                className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-[#EEF2FF] border border-[#C7D2FE] text-[10px] font-mono font-bold text-[#0038D1]">
                      {asm.courseName} ({asm.courseCode})
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">{asm.date}</span>
                    {asm.misconceptionCount > 0 ? (
                      <span className="px-2 py-0.2 rounded-full bg-[#FEE2E2] border border-[#FCA5A5] text-[9.5px] font-mono font-bold text-[#DC2626]">
                        {asm.misconceptionCount} Miskonsepsi
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[9.5px] font-mono font-bold text-[#065F46]">
                        Bebas Miskonsepsi
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-[#1B1B1E] truncate">{asm.moduleTitle}</h4>

                  <div className="flex items-center gap-4 text-xs text-[#444655]">
                    <span>Akurasi: <strong>{asm.accuracy}</strong> ({asm.validPropositions}/{asm.totalPropositions} relasi)</span>
                    <span>&bull;</span>
                    <span>Topologi: <strong>{asm.dominantTopology}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {/* Status Badge */}
                  {asm.status === 'Tuntas' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#059669]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                      <span>Tuntas</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#D97706]">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                      <span>Perlu Penguatan</span>
                    </span>
                  )}

                  {/* Skor Box */}
                  <div className="w-12 h-10 rounded-lg bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] flex flex-col items-center justify-center shrink-0">
                    <span className="font-mono font-black text-sm text-[#0038D1] leading-none">
                      {asm.score}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-[#71717A] uppercase leading-none mt-0.5">
                      Skor
                    </span>
                  </div>

                  {/* Button: Tinjau Detail Graf */}
                  <button
                    onClick={() => onInspectAssessment(asm.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEF2FF] text-[#0038D1] border-2 border-[#1B1B1E] text-xs font-bold shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
                    title="Buka visualisasi graf komparatif dan proposisi evaluasi lengkap"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tinjau Detail Graf</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
