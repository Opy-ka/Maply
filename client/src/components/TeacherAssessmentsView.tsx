'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileText,
  Filter,
  Gauge,
  Layers3,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Users,
  type LucideIcon,
  Check,
  Plus
} from 'lucide-react';
import { AssessmentConfig, MasterConceptMap } from '../types/maply';
import { InstructorNavbar, InstructorNavItem } from './InstructorNavbar';

interface TeacherAssessmentsViewProps {
  assessmentConfig: AssessmentConfig;
  masterMap: MasterConceptMap;
  onNavigate: (item: InstructorNavItem) => void;
  onCreateAssessment: () => void;
  onSaveAssessment: (config: AssessmentConfig) => Promise<void>;
  onLogout: () => void;
}

type AssessmentStatus = 'Published (Aktif)' | 'Scheduled' | 'Selesai & Dievaluasi';

const ASSESSMENTS: {
  id: string;
  title: string;
  detail: string;
  course: string;
  className: string;
  participation: number;
  status: AssessmentStatus;
  deadline: string;
  score: number;
  note: string;
}[] = [
  {
    id: 'asm-01',
    title: 'Alur Pemrosesan CPU & Hirarki Memori',
    detail: 'Kit-Build • 14 Nodes • 2 Distraktor',
    course: 'Arsitektur Komputer',
    className: 'Rombel A & B',
    participation: 90,
    status: 'Published (Aktif)',
    deadline: 'Hari ini 23:59 WIB',
    score: 82.4,
    note: '85% Lulus OBE',
  },
  {
    id: 'asm-02',
    title: 'Dekomposisi Normalisasi 1NF–BCNF',
    detail: 'Kit-Build • 18 Nodes • 3 Distraktor',
    course: 'Basis Data Lanjut',
    className: 'Rombel D',
    participation: 64,
    status: 'Scheduled',
    deadline: 'Mulai 20 Okt 2026',
    score: 0,
    note: 'Belum dimulai',
  },
  {
    id: 'asm-03',
    title: 'Virtual Memory Paging & TLB',
    detail: 'Kit-Build • 11 Nodes • 1 Distraktor',
    course: 'Sistem Operasi',
    className: 'Rombel C',
    participation: 100,
    status: 'Selesai & Dievaluasi',
    deadline: 'Selesai 12 Okt 2026',
    score: 88.2,
    note: 'Nilai Rombel Tertinggi',
  },
];

const statusBadgeStyles: Record<AssessmentStatus, { bg: string; text: string; border: string }> = {
  'Published (Aktif)': {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#065F46]',
    border: 'border-[#059669]'
  },
  Scheduled: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#92400E]',
    border: 'border-[#D97706]'
  },
  'Selesai & Dievaluasi': {
    bg: 'bg-[#F4F4F6]',
    text: 'text-[#444655]',
    border: 'border-[#1B1B1E]'
  },
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-[#1B1B1E] transition-colors cursor-pointer ${
        checked ? 'bg-[#0038D1]' : 'bg-[#E4E4E7]'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white border border-[#1B1B1E] transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-3">
      <div className="min-w-0">
        <p className="text-xs font-serif font-black text-[#1B1B1E]">{title}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-[#71717A]">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4px] text-[#71717A]">
      {children}
    </span>
  );
}

export const TeacherAssessmentsView: React.FC<TeacherAssessmentsViewProps> = ({
  assessmentConfig,
  masterMap,
  onNavigate,
  onCreateAssessment,
  onSaveAssessment,
  onLogout,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua status');
  const [duration, setDuration] = useState(assessmentConfig.duration_minutes);
  const [randomizeKit, setRandomizeKit] = useState(assessmentConfig.randomize_kit);
  const [allowBidirectional, setAllowBidirectional] = useState(
    assessmentConfig.allow_bidirectional_tolerance,
  );
  const [showKnowledgeGap, setShowKnowledgeGap] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const filteredAssessments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return ASSESSMENTS.filter((assessment) => {
      const matchesQuery =
        !query ||
        `${assessment.title} ${assessment.course} ${assessment.className}`
          .toLocaleLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === 'Semua status' ||
        (statusFilter === 'Aktif' && assessment.status === 'Published (Aktif)') ||
        (statusFilter === 'Terjadwal' && assessment.status === 'Scheduled') ||
        (statusFilter === 'Selesai' && assessment.status === 'Selesai & Dievaluasi');
      return matchesQuery && matchesStatus;
    });
  }, [search, statusFilter]);

  const saveParameters = async () => {
    setIsSaving(true);
    setNotice('');
    try {
      await onSaveAssessment({
        ...assessmentConfig,
        duration_minutes: duration,
        time_limit_minutes: duration,
        randomize_kit: randomizeKit,
        allow_bidirectional_tolerance: allowBidirectional,
        allow_bidirectional_fallback: allowBidirectional,
      });
      setNotice('Parameter asesmen berhasil disimpan.');
    } catch (error) {
      console.error('Failed to save assessment parameters:', error);
      setNotice('Parameter gagal disimpan. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1B1E]">
      <InstructorNavbar activeItem="Assessments" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8">
        {/* Hero Section */}
        <section className="relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-white p-6 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E] sm:p-8 lg:flex-row lg:items-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#FAF7F2] border border-[#1B1B1E]/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-40 h-32 w-32 rotate-12 rounded-2xl bg-[#FFE3C8]/40 border border-[#1B1B1E]/10" />
          <div className="relative max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.5px] text-[#71717A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0038D1]" />
              <span>Kit-Build Protocol Hirashima • Section 10 OBE</span>
              <span className="rounded-full bg-[#EDE8F5] border border-[#1B1B1E] px-2.5 py-0.5 text-[#1B1B1E]">
                Semester Ganjil 2026/2027
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-black leading-tight tracking-tight sm:text-4xl text-[#1B1B1E]">
              Manajemen &amp; Konfigurasi Asesmen
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#444655]">
              Atur parameter dekomposisi Kit-Build, toleransi relasi graf, dan pantau status
              partisipasi mahasiswa dengan skoring propositional accuracy otomatis.
            </p>
          </div>
          <div className="relative flex w-full flex-col gap-2.5 min-[460px]:w-auto min-[460px]:flex-row lg:shrink-0">
            <button
              type="button"
              onClick={() => setNotice('Impor templat Master Map siap digunakan melalui Studio.')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-serif font-black text-[#1B1B1E] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-[#FAF7F2] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <Layers3 className="h-4 w-4 text-[#0038D1]" />
              Impor Templat Master
            </button>
            <button
              type="button"
              onClick={onCreateAssessment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0038D1] px-5 py-2.5 text-xs font-serif font-black text-white border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-[#2F54EB] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              Buat Asesmen Baru
            </button>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border-2 border-[#1B1B1E] bg-[#ECFDF5] px-4 py-3 text-xs font-bold text-[#065F46] shadow-[2.5px_2.5px_0_#1B1B1E]"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#059669]" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice('')}
              className="font-mono text-base font-bold text-[#065F46] hover:opacity-70 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Metric Cards Row */}
        <section aria-label="Ringkasan status asesmen" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total asesmen aktif" icon={FileText} iconTone="blue">
            <div className="flex items-baseline gap-2">
              <strong className="font-serif text-3xl sm:text-4xl font-black text-[#1B1B1E]">3</strong>
              <span className="text-[10px] font-mono font-bold text-[#71717A]">/ 8 Target RPS</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[#444655]">
              <span className="h-2 w-2 rounded-full bg-[#0038D1]" />
              1 berlangsung hari ini
            </span>
          </MetricCard>

          <MetricCard label="Tingkat penyerahan" icon={Users} iconTone="gray">
            <div className="flex items-baseline gap-2">
              <strong className="font-serif text-3xl sm:text-4xl font-black text-[#1B1B1E]">90.4%</strong>
              <span className="text-[10px] font-mono font-bold text-[#71717A]">(38/42 mhs)</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-[#1B1B1E] bg-[#FAF7F2]">
              <div className="h-full w-[90.4%] rounded-full bg-[#0038D1]" />
            </div>
          </MetricCard>

          <MetricCard label="Rerata proposition accuracy" icon={Gauge} iconTone="amber">
            <div className="flex items-baseline gap-2">
              <strong className="font-serif text-3xl sm:text-4xl font-black text-[#1B1B1E]">82.6</strong>
              <span className="text-[10px] font-mono font-bold text-[#71717A]">/ 100</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#0038D1]">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
              +6.1% vs Quiz Biasa
            </span>
          </MetricCard>

          <MetricCard label="Miskonsepsi terdeteksi" icon={AlertTriangle} iconTone="red">
            <div className="flex items-baseline gap-1">
              <strong className="font-serif text-3xl sm:text-4xl font-black text-[#DA3437]">14</strong>
              <span className="text-xs font-serif font-black text-[#DA3437]">Kasus</span>
            </div>
            <span className="text-[10.5px] leading-snug font-medium text-[#444655]">
              Fokus: ALU ↔ Cache L1 Link
            </span>
          </MetricCard>
        </section>

        {/* Section 01: Parameter Configuration */}
        <section className="rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E]">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0038D1] text-xs font-serif font-black text-white border border-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E]">
                01
              </span>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#1B1B1E]">
                  Konfigurasi Parameter Asesmen Aktif
                </h2>
                <p className="mt-0.5 text-xs text-[#444655]">
                  Dekomposisi Master Concept Map menjadi kit modular untuk evaluasi kognitif mahasiswa.
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[#1B1B1E] bg-[#FFE3C8] px-3 py-1 text-[10px] font-mono font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0_#1B1B1E]">
              <span className="h-2 w-2 rounded-full bg-[#DA3437] animate-pulse" />
              Mode Konfigurasi Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
            {/* Panel 1: Basic Info */}
            <section className="rounded-xl border-2 border-[#1B1B1E] bg-white p-4.5 shadow-[2px_2px_0_#1B1B1E]">
              <PanelHeading icon={BookOpen} title="1. Informasi Dasar" badge="Konteks OBE" />
              <div className="mt-4 space-y-3.5">
                <div>
                  <FieldLabel>Mata kuliah &amp; rombel</FieldLabel>
                  <div className="mt-1 flex items-center justify-between gap-2 rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] px-3 py-2 text-xs font-medium">
                    <span className="font-serif font-bold text-[#1B1B1E]">Arsitektur Komputer (TIF-2101) - Rombel A &amp; B</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#71717A]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <FieldLabel>Master Map Acuan</FieldLabel>
                    <button
                      type="button"
                      onClick={() => onNavigate('Maps')}
                      className="text-[10px] font-bold text-[#0038D1] hover:underline cursor-pointer"
                    >
                      Buka di Studio &rarr;
                    </button>
                  </div>
                  <div className="mt-1 rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-3">
                    <div className="flex items-start gap-2.5">
                      <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-[#0038D1]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-serif font-black text-[#1B1B1E] truncate">{masterMap.title}</p>
                        <p className="mt-0.5 text-[10px] font-mono text-[#71717A]">
                          {masterMap.nodes.length} konsep • {masterMap.edges.length} relasi • Rev. 3
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <FieldLabel>Judul asesmen</FieldLabel>
                  <p className="mt-1 rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] px-3 py-2 text-xs font-serif font-bold text-[#1B1B1E]">
                    {assessmentConfig.title}
                  </p>
                </div>
                <div>
                  <FieldLabel>Instruksi pengerjaan</FieldLabel>
                  <p className="mt-1 min-h-[70px] rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] px-3 py-2 text-xs leading-relaxed text-[#444655]">
                    {assessmentConfig.instructions || 'Susun kembali kepingan konsep sesuai alur dan relasi yang tepat.'}
                  </p>
                </div>
              </div>
            </section>

            {/* Panel 2: Time & Session */}
            <section className="rounded-xl border-2 border-[#1B1B1E] bg-white p-4.5 shadow-[2px_2px_0_#1B1B1E]">
              <PanelHeading icon={CalendarClock} title="2. Waktu & Sesi" badge="SLA Timer" />
              <div className="mt-4 space-y-3.5">
                <label className="block">
                  <FieldLabel>Batas waktu pengerjaan (durasi)</FieldLabel>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={240}
                      value={duration}
                      onChange={(event) => setDuration(Math.max(1, Number(event.target.value) || 1))}
                      className="w-24 rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1.5 text-sm font-mono font-bold outline-none focus:bg-white shadow-[1.5px_1.5px_0_#1B1B1E]"
                    />
                    <span className="text-xs font-serif text-[#71717A]">menit per mahasiswa</span>
                  </div>
                </label>
                <div>
                  <FieldLabel>Jadwal rilis &amp; tenggat (WIB)</FieldLabel>
                  <div className="mt-1 space-y-2 rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-3 text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="text-[#71717A]">Buka (Mulai)</span>
                      <strong className="font-mono text-[#1B1B1E]">20 Okt 2026, 08:00 WIB</strong>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-[#71717A]">Tenggat</span>
                      <strong className="font-mono text-[#DA3437]">24 Okt 2026, 23:59 WIB</strong>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-serif font-black text-[#1B1B1E]">Visibilitas Knowledge Gap</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-[#71717A]">
                        Tampilkan skor dan peta kesalahan graf setelah mahasiswa submit.
                      </p>
                    </div>
                    <Toggle
                      checked={showKnowledgeGap}
                      onChange={() => setShowKnowledgeGap((value) => !value)}
                      label="Visibilitas Knowledge Gap"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-[#FFB95F] bg-[#FFF8EF] p-3 text-[10.5px] leading-relaxed text-[#6D4400]">
                  <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
                  <span>Jadwal detail dapat disesuaikan melalui wizard pembuatan asesmen.</span>
                </div>
              </div>
            </section>

            {/* Panel 3: Engine Kit-Build */}
            <section className="rounded-xl border-2 border-[#1B1B1E] bg-white p-4.5 shadow-[2px_2px_0_#1B1B1E]">
              <PanelHeading icon={SlidersHorizontal} title="3. Engine Kit-Build" badge="F. Hirashima" />
              <div className="mt-4 space-y-3">
                <SettingRow
                  title="Acak Urutan Concept Kit"
                  description="Posisi node pada palet di-random"
                  checked={randomizeKit}
                  onChange={() => setRandomizeKit((value) => !value)}
                />
                <SettingRow
                  title="Toleransi Relasi Komutatif"
                  description="Bebaskan arah panah relasi simetris"
                  checked={allowBidirectional}
                  onChange={() => setAllowBidirectional((value) => !value)}
                />
                <div>
                  <FieldLabel>Kartu distraktor (jebakan miskonsepsi)</FieldLabel>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span className="rounded-lg border border-[#1B1B1E]/20 bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-mono font-bold text-[#1B1B1E]">
                      GPU Shader Core
                    </span>
                    <span className="rounded-lg border border-[#1B1B1E]/20 bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-mono font-bold text-[#1B1B1E]">
                      Secondary Storage (HDD)
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-serif font-black text-[#1B1B1E]">Preview kit konseptual</span>
                    <span className="text-[10px] font-mono font-bold text-[#71717A]">{masterMap.nodes.length} node</span>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {masterMap.nodes.slice(0, 6).map((node) => (
                      <span
                        key={node.id}
                        className="rounded-lg border border-[#1B1B1E] bg-white px-2 py-0.5 text-[9.5px] font-serif font-bold text-[#1B1B1E] shadow-[1px_1px_0_#1B1B1E]"
                      >
                        {node.label}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={saveParameters}
                  disabled={isSaving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF7F2] hover:bg-white px-3 py-2.5 text-xs font-serif font-black text-[#1B1B1E] border-2 border-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E] transition-all hover:-translate-y-px active:translate-y-0 cursor-pointer disabled:opacity-60"
                >
                  <Settings2 className="h-4 w-4 text-[#0038D1]" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Parameter'}
                </button>
              </div>
            </section>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-3 border-t-2 border-[#1B1B1E]/10 pt-4 sm:flex-row sm:items-center">
            <p className="text-[10.5px] font-mono text-[#71717A]">
              Parameter yang disimpan berlaku pada asesmen aktif dan dapat diubah kembali kapan saja.
            </p>
            <button
              type="button"
              onClick={onCreateAssessment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0038D1] px-4 py-2 text-xs font-serif font-black text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E] hover:bg-[#2F54EB] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Buat Asesmen Baru
            </button>
          </div>
        </section>

        {/* Section 02: Assessment Table & Status */}
        <section className="rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E]">
          <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#0038D1]" />
                <h2 className="font-serif text-xl sm:text-2xl font-black text-[#1B1B1E]">
                  Daftar Asesmen &amp; Status Mahasiswa
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[#444655]">
                Pantau distribusi skor, partisipasi rombel, dan evaluasi hasil secara langsung.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[460px]:flex-row">
              <label className="relative min-w-0 flex-1 min-[460px]:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari asesmen atau topik..."
                  className="w-full rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] py-2 pl-9 pr-3 text-xs font-serif font-bold outline-none focus:bg-white shadow-[1.5px_1.5px_0_#1B1B1E]"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1.5 text-xs font-serif font-bold shadow-[1.5px_1.5px_0_#1B1B1E]">
                <Filter className="h-4 w-4 text-[#0038D1]" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="min-w-24 bg-transparent outline-none cursor-pointer"
                >
                  <option>Semua status</option>
                  <option>Aktif</option>
                  <option>Terjadwal</option>
                  <option>Selesai</option>
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border-2 border-[#1B1B1E]">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="bg-[#FAF7F2] border-b-2 border-[#1B1B1E] text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B1B1E]">
                  <th className="px-4 py-3">Detail asesmen</th>
                  <th className="px-4 py-3">Mata kuliah &amp; rombel</th>
                  <th className="px-4 py-3">Partisipasi</th>
                  <th className="px-4 py-3">Status &amp; tenggat</th>
                  <th className="px-4 py-3">Rata-rata skor</th>
                  <th className="px-4 py-3 text-right">Aksi kontrol</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[#1B1B1E]/10">
                {filteredAssessments.map((assessment, index) => {
                  const badgeStyle = statusBadgeStyles[assessment.status];
                  return (
                    <tr key={assessment.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="max-w-64 px-4 py-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] border border-[#1B1B1E] text-[#0038D1] shadow-[1px_1px_0_#1B1B1E]">
                            <FileText className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-xs font-serif font-black text-[#1B1B1E]">
                              Asesmen #{String(index + 1).padStart(2, '0')}: {assessment.title}
                            </p>
                            <p className="mt-0.5 text-[10px] font-mono text-[#71717A]">{assessment.detail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs">
                        <p className="font-serif font-bold text-[#1B1B1E]">{assessment.course}</p>
                        <p className="mt-0.5 text-[10px] font-mono text-[#71717A]">{assessment.className}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full border border-[#1B1B1E] bg-[#FAF7F2]">
                            <div className="h-full rounded-full bg-[#0038D1]" style={{ width: `${assessment.participation}%` }} />
                          </div>
                          <span className="text-[10.5px] font-mono font-bold text-[#1B1B1E]">{assessment.participation}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[9px] font-mono font-bold ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                          {assessment.status}
                        </span>
                        <p className="mt-1 text-[10px] font-mono text-[#71717A]">{assessment.deadline}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-baseline gap-1">
                          <strong className="font-serif text-lg font-black text-[#1B1B1E]">
                            {assessment.score ? assessment.score.toFixed(1) : '—'}
                          </strong>
                          {assessment.score > 0 && <span className="text-[10px] font-mono text-[#71717A]">/100</span>}
                        </div>
                        <p className="mt-0.5 text-[9.5px] font-serif font-bold text-[#0038D1]">{assessment.note}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onNavigate('Analytics')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038D1] hover:bg-[#2F54EB] px-3 py-1.5 text-[10.5px] font-serif font-black text-white border border-[#1B1B1E] shadow-[1.5px_1.5px_0_#1B1B1E] transition-all hover:-translate-y-px cursor-pointer"
                          >
                            Hasil <ArrowDownUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={onCreateAssessment}
                            aria-label={`Buat asesmen berdasarkan ${assessment.title}`}
                            title="Buat asesmen baru"
                            className="rounded-lg bg-white hover:bg-[#FAF7F2] p-1.5 border border-[#1B1B1E] shadow-[1.5px_1.5px_0_#1B1B1E] transition-all hover:-translate-y-px cursor-pointer"
                          >
                            <Clock3 className="h-4 w-4 text-[#1B1B1E]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredAssessments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-xs font-serif text-[#71717A]">
                      Tidak ada asesmen yang cocok dengan pencarian atau filter ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#1B1B1E]/10 pt-4 text-[10.5px] font-mono text-[#71717A] sm:flex-row sm:items-center">
            <span>Menampilkan {filteredAssessments.length} dari 3 asesmen terdaftar</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="rounded-lg border border-[#1B1B1E]/30 bg-[#FAF7F2] px-3 py-1 text-xs font-serif font-bold text-[#71717A] opacity-50 cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="rounded-lg border-2 border-[#1B1B1E] bg-[#0038D1] px-3 py-1 text-xs font-serif font-black text-white shadow-[1px_1px_0_#1B1B1E]">
                1
              </span>
              <button
                type="button"
                disabled
                className="rounded-lg border border-[#1B1B1E]/30 bg-[#FAF7F2] px-3 py-1 text-xs font-serif font-bold text-[#71717A] opacity-50 cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

function MetricCard({
  label,
  icon,
  iconTone,
  children,
}: {
  label: string;
  icon: LucideIcon;
  iconTone: 'blue' | 'gray' | 'amber' | 'red';
  children: React.ReactNode;
}) {
  const tones = {
    blue: 'bg-[#EEF2FF] text-[#0038D1] border-[#0038D1]',
    gray: 'bg-[#EDE8F5] text-[#1B1B1E] border-[#1B1B1E]',
    amber: 'bg-[#FFFBEB] text-[#D97706] border-[#D97706]',
    red: 'bg-[#FEF2F2] text-[#DA3437] border-[#DA3437]',
  };
  return (
    <article className="flex min-h-36 flex-col justify-between gap-4 rounded-2xl bg-white p-5 border-2 border-[#1B1B1E] shadow-[3px_3px_0_#1B1B1E]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
          {label}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${tones[iconTone]} shadow-[1px_1px_0_#1B1B1E]`}>
          {React.createElement(icon, { className: 'h-3.5 w-3.5' })}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">{children}</div>
    </article>
  );
}

function PanelHeading({
  icon,
  title,
  badge,
}: {
  icon: LucideIcon;
  title: string;
  badge: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b-2 border-[#1B1B1E]/10 pb-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-[#0038D1]">{React.createElement(icon, { className: 'h-4 w-4' })}</span>
        <h3 className="font-serif text-base font-black text-[#1B1B1E]">{title}</h3>
      </div>
      <span className="shrink-0 rounded-full border border-[#1B1B1E] bg-[#FAF7F2] px-2.5 py-0.5 text-[9px] font-mono font-bold text-[#1B1B1E]">
        {badge}
      </span>
    </div>
  );
}
