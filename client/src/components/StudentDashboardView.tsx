'use client';

import React, { useState } from 'react';
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
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';
import { AssessmentConfig, ConceptKit } from '../types/maply';

interface StudentDashboardViewProps {
  assessmentConfig: AssessmentConfig;
  kit: ConceptKit;
  onStartWorkspace: () => void;
  onEnterToken: (token: string) => void;
  onViewResults: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  assessmentConfig,
  kit,
  onStartWorkspace,
  onEnterToken,
  onViewResults
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

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
        {/* Top Student Greeting Card (Figma #57:12175) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#1B1B1E] text-xs font-bold text-[#0038D1]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Portal Mahasiswa &bull; FILKOM Universitas Brawijaya</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#1B1B1E]">
              Selamat Datang, M. Fadhil! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#444655] max-w-xl">
              NIM: <span className="font-mono font-bold text-[#1B1B1E]">215150201111001</span> &bull; Kelas:{' '}
              <span className="font-bold text-[#1B1B1E]">Arsitektur & Organisasi Komputer (Kelas B)</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-center">
              <span className="text-[10px] font-bold text-[#71717A] uppercase block">Status OBE</span>
              <span className="text-sm font-black text-[#059669]">CPL-3 Memenuhi</span>
            </div>
          </div>
        </div>

        {/* Section 2: Cognitive Summary Metric Cards (Figma #57:12195) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#71717A] uppercase">Rata-rata Skor Kognitif</span>
              <Award className="w-4 h-4 text-[#0038D1]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0038D1]">86.4</span>
              <span className="text-xs font-bold text-[#059669]">/ 100 (+12% vs Rombel)</span>
            </div>
            <p className="text-[11px] text-[#444655]">Metrik matematis deterministik NetworkX</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#71717A] uppercase">Asesmen Selesai</span>
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#1B1B1E]">4</span>
              <span className="text-xs font-bold text-[#71717A]">dari 5 Modul Terbit</span>
            </div>
            <p className="text-[11px] text-[#444655]">1 Modul baru siap dikerjakan sekarang</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#71717A] uppercase">Miskonsepsi Tuntas</span>
              <Sparkles className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#D97706]">91.2%</span>
              <span className="text-xs font-bold text-[#059669]">Relasi Tervalidasi</span>
            </div>
            <p className="text-[11px] text-[#444655]">Umpan balik terarah berhasil dipahami</p>
          </div>
        </div>

        {/* Section 3: Primary Active Assessment Card (Figma #57:12262) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[5px_5px_0px_#1B1B1E] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E]">
                ASESMEN AKTIF &bull; JADWAL RESMI HARI INI
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white border border-[#1B1B1E] text-xs font-bold text-[#1B1B1E]">
              Batas Waktu: {assessmentConfig.time_limit_minutes || 45} Menit
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1B1B1E]">
              {assessmentConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#444655] max-w-3xl leading-relaxed">
              {assessmentConfig.instructions ||
                'Rangkai kembali kepingan konsep struktur CPU dan hierarki memori sesuai proposisi relasi yang valid. Setiap koneksi berarah dievaluasi secara eksak.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-2 border-[#1B1B1E]">
            <div className="flex items-center gap-4 text-xs font-bold text-[#1B1B1E]">
              <span>● {kit.concepts.length} Kepingan Konsep</span>
              <span>▲ {kit.available_relationships.length} Tipe Relasi</span>
              <span>⏱ Mode Ujian Terjadwal</span>
            </div>

            <button
              onClick={onStartWorkspace}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white font-black text-sm border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              <span>Mulai Pengerjaan Kit Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 4: Fast Assessment Token Entry Box & Recent History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Quick Token PIN Box */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#0038D1]" />
              <h3 className="text-base font-black text-[#1B1B1E]">Akses Cepat via PIN Ujian</h3>
            </div>
            <p className="text-xs text-[#444655]">
              Dosen memberikan token 6-karakter untuk kuis kelas atau ujian lab dadakan? Masukkan kodenya di bawah:
            </p>

            <form onSubmit={handleTokenSubmit} className="space-y-3">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setTokenError('');
                }}
                placeholder="Contoh: KBT-9428"
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] font-mono font-bold text-sm tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#0038D1]"
              />
              {tokenError && <p className="text-[11px] font-bold text-red-600">{tokenError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1B1B1E] hover:bg-[#0038D1] text-white font-bold text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Sesi Ujian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right Column: Assessment History */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#FAF7F2]">
              <h3 className="text-base font-black text-[#1B1B1E]">Riwayat Pengerjaan Asesmen</h3>
              <button
                onClick={onViewResults}
                className="text-xs font-bold text-[#0038D1] hover:underline flex items-center gap-1"
              >
                <span>Lihat Hasil Terakhir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Modul 1: Pengantar Gerbang Logika & Boolean',
                  score: 95,
                  date: '10 Okt 2026',
                  status: 'Tuntas'
                },
                {
                  title: 'Modul 2: Arsitektur Von Neumann & Siklus Instruksi',
                  score: 88,
                  date: '12 Okt 2026',
                  status: 'Tuntas'
                },
                {
                  title: 'Modul 3: Struktur CPU & Hierarki Memori',
                  score: 76,
                  date: 'Kemarin',
                  status: 'Perlu Remedial'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs sm:text-sm text-[#1B1B1E]">{item.title}</h4>
                    <span className="text-[10px] text-[#71717A]">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-[#0038D1]">{item.score}</span>
                      <span className="text-[10px] text-[#71717A] block">Skor Graf</span>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#1B1B1E] ${
                        item.score >= 80 ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#FFEAA7] text-[#1B1B1E]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Editorial Study Tip Banner Pill (Figma #57:12518) */}
        <div className="p-4 rounded-2xl bg-[#F6F2F7] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <div>
              <span className="text-xs font-black text-[#1B1B1E]">Tip Kognitif Kit-Build:</span>
              <p className="text-xs text-[#444655]">
                Perhatikan label relasi sebelum menyambungkan simpul. Relasi kausalitas berarah seperti{' '}
                <code className="bg-white px-1 font-bold">controls</code> berbeda dengan relasi komutatif{' '}
                <code className="bg-white px-1 font-bold">interacts with</code>.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E]">
            Scaffolding
          </span>
        </div>
      </div>
    </div>
  );
};
