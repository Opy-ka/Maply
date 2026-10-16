'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { InstructorNavbar, InstructorNavItem } from './InstructorNavbar';
import {
  AssessmentConfig,
  ClassKnowledgeGapSummary,
  MasterConceptMap
} from '../types/maply';

const ASSETS = {
  newAssessment: ['eee2d.svg', 15, 15],
  map: ['30ea8.svg', 12.75, 16.5],
  lesson: ['41d08.svg', 16.5, 14.625],
  courses: ['09188.svg', 18.3333, 15],
  assessments: ['c7ff3.svg', 15, 16.6667],
  participation: ['4d328.svg', 20, 10],
  completion: ['bddce.svg', 16.6667, 10],
  metricLink: ['bcabf.svg', 9.3333, 9.3333],
  activity: ['8bb30.svg', 12, 14],
  warning: ['2ac32.svg', 18.3333, 20.3333],
  assessmentAction: ['1982a.svg', 16.5, 11.25],
  mapAction: ['1fbaa.svg', 15, 13.5],
  studentActivity: ['8b36f.svg', 12.8333, 12.25],
  chevron: ['0ea3b.svg', 5.55, 9],
  score: ['b5adf.svg', 11.6667, 11.0833],
  remedial: ['31bb6.svg', 12.8333, 11.0833],
  externalLink: ['62435.svg', 10.6667, 10.6667],
  mapLink: ['bb47a.svg', 10.5, 10.5],
  masterMap: ['a83c9.svg', 9.3333, 11.6667],
  included: ['3bcbb.svg', 15, 17],
  lock: ['175da.svg', 15, 17],
  limit: ['8c7b1.svg', 13.4167, 11.0833],
  ingest: ['7655a.svg', 16.5, 18.5],
  mapFeature: ['1f32f.svg', 18, 10.25],
  curriculum: ['066db.svg', 16.5, 14.75],
  validation: ['ebb73.svg', 16.5, 17.75],
  sync: ['9e4d4.svg', 15, 15.5],
  trial: ['03d99.svg', 12, 12],
  protocol: ['4ab16.svg', 19.0118, 20],
  profile: ['59e02.svg', 12, 12]
} as const;

type AssetName = keyof typeof ASSETS;

function DesignIcon({ name, className = '' }: { name: AssetName; className?: string }) {
  const [file, width, height] = ASSETS[name];

  return (
    <img
      src={`/figma/dashboard/${file}`}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    />
  );
}

interface TeacherDashboardViewProps {
  masterMap: MasterConceptMap;
  assessmentConfig: AssessmentConfig;
  analytics: ClassKnowledgeGapSummary;
  onOpenMap: () => void;
  onOpenCourses: () => void;
  onOpenAssessments: () => void;
  onOpenWizard: () => void;
  onOpenAnalytics: () => void;
  onOpenAiDraft: () => void;
  onLogout: () => void;
}

const SUBMISSIONS = [
  { initials: 'AR', name: 'Ahmad Rizky', nim: 'NIM 225150201111048', score: 82, status: 'Optimal', tone: 'blue', time: '12 mnt lalu' },
  { initials: 'CD', name: 'Citra Dewi', nim: 'NIM 225150201111203', score: 94, status: 'Sangat Baik', tone: 'amber', time: '34 mnt lalu' },
  { initials: 'BS', name: 'Budi Santoso', nim: 'NIM 225150201111082', score: 64, status: 'Perlu Remedial', tone: 'red', time: '1 jam lalu' },
  { initials: 'NP', name: 'Nabila Putri', nim: 'NIM 225150201111115', score: 78, status: 'Lulus Standar', tone: 'gray', time: '2 jam lalu' }
] as const;

const MASTER_MAPS = [
  {
    course: 'Arsitektur Komputer',
    revision: 'Rev. 3 • 2024',
    title: 'CPU & Memory Hierarchy Architecture',
    description: 'Model acuan interkoneksi ALU, Control Unit, Register Bank, Cache L1-L3, hingga Main Memory (RAM) bus.',
    nodes: 14,
    edges: 17
  },
  {
    course: 'Sistem Operasi',
    revision: 'Rev. 2 • 2025',
    title: 'Virtual Memory Paging & TLB Hit/Miss',
    description: 'Struktur hierarki memori, Page Table Walk, Process Buffer, dan virtual address translation.',
    nodes: 11,
    edges: 15
  },
  {
    course: 'Jaringan Komputer',
    revision: 'Rev. 1 • 2025',
    title: 'OSI Layer Protocol Encapsulation',
    description: 'Model pemetaan paket data: Application (Payload) hingga Physical Bit Stream pada ethernet & IP routing.',
    nodes: 16,
    edges: 12
  }
];

const FREE_FEATURES = [
  { icon: 'included', text: <>100% Kontrol Pedagogis: <span className="font-normal">Rancang manual konsep & relasi bebas</span></> },
  { icon: 'lock', text: <>Maksimal 5 Master Map Aktif <span className="font-normal">per semester</span></> },
  { icon: 'mapFeature', text: <>Dokumentasi Kit-Builder <span className="font-normal">terintegrasi</span></> },
  { icon: 'curriculum', text: <>Evaluasi Deterministik Graf NetworkX <span className="font-normal">(Zero Hallucination)</span></> },
  { icon: 'limit', text: <>Ekspor Data Analitik &amp; Sinkronisasi SIAKAD UB</> }
] as const;

const PRO_FEATURES = [
  { icon: 'ingest', text: <>AI Document Ingestion: <span className="font-normal">Ekstraksi otomatis SAP, PDF, dan Slide Kuliah</span></> },
  { icon: 'mapFeature', text: <>Master Map Tanpa Batas <span className="font-normal">untuk seluruh kelas FILKOM</span></> },
  { icon: 'curriculum', text: <>Rekomendasi Celah Kurikulum Prediktif (Outcome-Based Education)</> },
  { icon: 'validation', text: <>Dukungan Validasi Ahli: <span className="font-normal">Dosen tetap sebagai Otoritas Penilai</span></> },
  { icon: 'sync', text: <>Seluruh fitur evaluasi graf deterministik &amp; sinkronisasi SIAKAD UB</> }
] as const;

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  masterMap,
  assessmentConfig,
  analytics,
  onOpenMap,
  onOpenCourses,
  onOpenAssessments,
  onOpenWizard,
  onOpenAnalytics,
  onOpenAiDraft,
  onLogout
}) => {
  const [activeNav, setActiveNav] = useState<InstructorNavItem>('Dashboard');

  const navigate = (label: InstructorNavItem) => {
    setActiveNav(label);
    if (label === 'Courses') {
      onOpenCourses();
    } else if (label === 'Maps') {
      onOpenMap();
    } else if (label === 'Assessments') {
      onOpenAssessments();
    } else if (label === 'Analytics') {
      onOpenAnalytics();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1b1b1e]">
      <InstructorNavbar activeItem={activeNav} onNavigate={navigate} onLogout={onLogout} />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-6 sm:px-8">
        {/* Hero Section */}
        <section className="relative flex flex-col justify-between gap-7 overflow-hidden rounded-2xl bg-white p-6 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E] sm:p-9 lg:flex-row lg:items-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 rounded-full bg-[#FAF7F2] border border-[#1B1B1E]/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-28 h-48 w-48 rotate-12 rounded-2xl bg-[#FFE3C8]/40 border border-[#1B1B1E]/10" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1B1B1E] bg-[#EDE8F5] px-3.5 py-1 text-[9.5px] font-mono font-bold uppercase tracking-[0.45px] text-[#1B1B1E] shadow-[1px_1px_0_#1B1B1E]">
              <span className="h-2 w-2 rounded-full bg-[#0038D1]" />
              LAB SISTEM KOMPUTER • SEMESTER GANJIL 2026/2027
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-[#1B1B1E]">
              Selamat Datang, <span className="text-[#0038D1] underline decoration-[#FFB95F] decoration-wavy decoration-2">Pak Herman</span> 👋
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#444655]">
              Pantau dinamika kognitif dan struktur pemahaman mahasiswa secara deterministik tanpa tebakan AI.
              Evaluasi proposisi berbasis grafik Kit-Build secara langsung.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-2.5 lg:justify-end">
            <button
              type="button"
              onClick={onOpenWizard}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0038D1] px-4 py-2.5 text-xs font-serif font-black text-white border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-[#2F54EB] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <DesignIcon name="newAssessment" /> + Buat Asesmen Baru
            </button>
            <button
              type="button"
              onClick={onOpenMap}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-serif font-black text-[#1B1B1E] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-[#FAF7F2] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <DesignIcon name="map" /> Peta Konsep Acuan
            </button>
            <button
              type="button"
              onClick={onOpenAiDraft}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FAF7F2] px-4 py-2.5 text-xs font-serif font-black text-[#1B1B1E] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-white transition-transform hover:-translate-y-px cursor-pointer"
            >
              <DesignIcon name="lesson" /> Bahan Ajar (AI Draft)
            </button>
          </div>
        </section>

        {/* Metric Summary Cards */}
        <section id="teacher-courses" aria-label="Ringkasan kelas dan asesmen" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="TOTAL MATAKULIAH" icon="courses" iconTone="blue">
            <strong className="font-serif text-2xl sm:text-3xl font-black text-[#1B1B1E]">4 Kelas Aktif</strong>
            <span className="text-xs leading-relaxed text-[#444655]">Arsitektur Komputer, SO, Alpro II, Jarkom</span>
            <span className="mt-1 inline-flex w-fit rounded-lg border border-[#0038D1]/30 bg-[#EEF2FF] px-2.5 py-1 text-[9.5px] font-mono font-bold text-[#0038D1]">
              168 Total Mahasiswa Terdaftar
            </span>
          </MetricCard>

          <MetricCard title="ASESMEN KIT-BUILD" icon="assessments" iconTone="amber">
            <strong className="font-serif text-2xl sm:text-3xl font-black text-[#1B1B1E]">14 Asesmen</strong>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
              <span className="text-[#0038D1]">● 4 Aktif</span>
              <span className="text-[#71717A]">•</span>
              <span className="text-[#71717A]">● 8 Selesai</span>
            </div>
            <span className="mt-1 inline-flex w-fit rounded-lg border border-[#D97706]/30 bg-[#FFFBEB] px-2.5 py-1 text-[9.5px] font-mono font-bold text-[#92400E]">
              2 Draf Siap Rilis
            </span>
          </MetricCard>

          <MetricCard title="PARTISIPASI SESI" icon="participation" iconTone="red">
            <strong className="font-serif text-2xl sm:text-3xl font-black text-[#1B1B1E]">142 / 168</strong>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full border border-[#1B1B1E] bg-[#FAF7F2]">
              <div className="h-full w-[84.5%] rounded-full bg-[#DA3437]" />
            </div>
            <span className="mt-1 inline-flex w-fit rounded-lg border border-[#DA3437]/30 bg-[#FEF2F2] px-2.5 py-1 text-[9.5px] font-mono font-bold text-[#DA3437]">
              84.5% Mahasiswa Mengerjakan
            </span>
          </MetricCard>

          <MetricCard title="TINGKAT PENYELESAIAN" icon="completion" iconTone="gray">
            <strong className="font-serif text-2xl sm:text-3xl font-black text-[#1B1B1E]">91.2%</strong>
            <span className="text-xs leading-relaxed text-[#444655]">Skor Kognitif: {analytics.average_score}/100</span>
            <button
              type="button"
              onClick={onOpenAnalytics}
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#1B1B1E] bg-[#FAF7F2] hover:bg-white px-2.5 py-1 text-[9.5px] font-serif font-black text-[#0038D1] shadow-[1px_1px_0_#1B1B1E] transition-all cursor-pointer"
            >
              <DesignIcon name="metricLink" /> Lihat tren kelas &rarr;
            </button>
          </MetricCard>
        </section>

        {/* Live Attention Section */}
        <section aria-label="Aktivitas asesmen terbaru" className="rounded-2xl bg-white p-5 sm:p-7 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B1B1E]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DA3437] animate-pulse" />
              SEDANG BERLANGSUNG &amp; PERLU ATENSI DOSEN
            </div>
            <span className="rounded-full border border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1 text-[9.5px] font-mono font-bold text-[#1B1B1E]">
              <span className="mr-1 text-[#0038D1]">◉</span> Status: Hari ini, 10:30 WIB
            </span>
          </div>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#0038d1] px-2 py-1 text-[8px] font-bold uppercase text-white">TIF-2101</span>
                <span className="text-[10px] text-[#747687]">Arsitektur Komputer • Kelas B</span>
              </div>
              <h2 className="font-serif text-xl font-bold leading-7">
                Asesmen #01: {assessmentConfig.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#444655]">
                <span>38 / 42 Mahasiswa Selesai (90.4%)</span>
                <span>•</span>
                <span><span className="text-[#ffb95f]">●</span> Metode: Closed Kit (14 Nodes, 17 Links)</span>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[rgba(255,218,215,0.3)] p-3 text-[11px] leading-5 text-[#444655]">
                <DesignIcon name="warning" className="mt-0.5" />
                <div className="min-w-0 flex-1 break-words">
                  <strong className="block text-[#1b1b1e]">Deteksi 1 Celah Kognitif Kritis (Misconception Detected)</strong>
                  Sebanyak <strong>18 Mahasiswa</strong> keliru menghubungkan proposisi langsung dari <b>[ALU]</b> ke <b>[Memory]</b>,
                  melewati stage krusial <span className="font-bold text-[#b61722]">[Register Internal]</span>.
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 lg:w-[190px]">
              <button type="button" onClick={onOpenAnalytics} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0038d1] px-4 py-3 text-[10px] font-bold text-white shadow-[3px_3px_0_#1b1b1e]">
                <DesignIcon name="assessmentAction" /> Buka Analisis Kelas
              </button>
              <button type="button" onClick={onOpenAnalytics} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-[10px] font-bold text-[#b61722] shadow-[2px_2px_0_#1b1b1e]">
                <DesignIcon name="mapAction" /> Lihat Knowledge Gap
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-6" aria-label="Submission mahasiswa dan peta acuan">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold tracking-[-0.3px]">
                <DesignIcon name="activity" /> Aktivitas Submission Terkini
              </h2>
              <button type="button" onClick={onOpenAnalytics} className="text-[9px] font-bold text-[#747687] hover:text-[#0038d1]">
                Refresh Network Analysis
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-[3px_3px_0_#1b1b1e]">
              {SUBMISSIONS.map((submission) => (
                <button
                  key={submission.initials}
                  type="button"
                  onClick={onOpenAnalytics}
                  className="flex w-full items-center justify-between gap-3 border-b border-[#f0edf1] px-4 py-3 text-left last:border-b-0 hover:bg-[#fbf8fc] sm:px-5"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold ${
                      submission.tone === 'blue' ? 'bg-[#dee1ff] text-[#0038d1]' :
                      submission.tone === 'amber' ? 'bg-[#ffddb8] text-[#6d4400]' :
                      submission.tone === 'red' ? 'bg-[#ffdad7] text-[#b61722]' : 'bg-[#eae7eb] text-[#444655]'
                    }`}>{submission.initials}</span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <strong className="text-[10px]">{submission.name}</strong>
                        <span className="inline-flex items-center gap-1 text-[8px] text-[#747687]"><DesignIcon name="studentActivity" />{submission.nim}</span>
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[9px] text-[#444655]">
                        Arsitektur Komputer <span>•</span>
                        <span className="rounded bg-[#f0edf1] px-1.5 py-0.5">Net Structure</span>
                        <span>•</span>{submission.time}
                      </span>
                      {submission.tone === 'red' && (
                        <span className="mt-1 flex items-center gap-1 text-[8px] font-bold text-[#b61722]">
                          <DesignIcon name="remedial" /> Perlu Remedial [ALU → Register]
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-right">
                      <strong className={`inline-flex items-center justify-end gap-1 font-serif text-lg ${submission.tone === 'red' ? 'text-[#b61722]' : 'text-[#0038d1]'}`}><DesignIcon name="score" />{submission.score}<span className="text-[9px] font-normal text-[#444655]"> / 100</span></strong>
                      <span className={`block text-[8px] ${submission.tone === 'red' ? 'text-[#b61722]' : 'text-[#747687]'}`}>{submission.status}</span>
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f6f2f7]"><DesignIcon name="chevron" /></span>
                  </span>
                </button>
              ))}
              <div className="border-t border-[#eae7eb] p-3 text-center">
                <button type="button" onClick={onOpenAnalytics} className="inline-flex items-center gap-2 text-[10px] font-bold text-[#0038d1]">
                  Lihat Seluruh 142 Hasil Submission <DesignIcon name="externalLink" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold tracking-[-0.3px]">
                <span className="h-3 w-3 rounded-full bg-[#ffb95f]" /> Peta Konsep Acuan (Master)
              </h2>
              <span className="shrink-0 text-[9px] font-bold text-[#747687]">3 Map Tersedia</span>
            </div>
            {MASTER_MAPS.map((map, index) => (
              <article key={map.title} className="rounded-2xl bg-white p-4 shadow-[3px_3px_0_#1b1b1e] sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#dee1ff] px-2 py-1 text-[8px] font-bold text-[#0038d1]">● {map.course}</span>
                  <span className="text-[8px] font-bold text-[#747687]">{map.revision}</span>
                </div>
                <h3 className="mt-2 font-serif text-lg font-bold leading-6">
                  {index === 0 ? (masterMap.title.includes('CPU') ? masterMap.title : map.title) : map.title}
                </h3>
                <p className="mt-1 text-[10px] leading-5 text-[#444655]">{index === 0 ? (masterMap.description || map.description) : map.description}</p>
                <div className="mt-2 flex items-center justify-between border-t border-[#eae7eb] pt-2">
                  <div className="flex items-center gap-3 text-[8px] font-bold">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#0038d1]" />{index === 0 ? masterMap.nodes.length : map.nodes} Node</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#b61722]" />{index === 0 ? masterMap.edges.length : map.edges} Relasi</span>
                  </div>
                  <button type="button" onClick={onOpenMap} className="inline-flex items-center gap-1 text-[8px] font-bold text-[#0038d1]">
                    Buka Kanvas <DesignIcon name={index === 0 ? 'mapLink' : 'metricLink'} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="Pilihan lisensi dosen" className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eae7eb] px-4 py-1 text-[9px] font-bold uppercase tracking-[0.45px]">
                <DesignIcon name="masterMap" /> PILIHAN LISENSI DOSEN
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold tracking-[-0.5px] sm:text-[28px]">Tingkatkan Kapasitas Authoring Peta Konsep Anda</h2>
              <p className="mt-1 text-[12px] leading-5 text-[#444655]">
                Fleksibilitas penuh antara kontrol pedagogis manual murni versus akselerasi ekstraksi materi ajar cerdas
                berbasis AI untuk efisiensi beban kerja dosen FILKOM UB.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-white px-3 py-2 text-[9px] shadow-[2px_2px_0_#1b1b1e] sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#0038d1]" /> Akun Akademik Resmi Terverifikasi
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LicenseCard
              kind="free"
              title="Coba Gratis"
              subtitle="Penyusunan Peta Manual Penuh"
              description="Dirancang sangat pragmatis dengan bebas authoring konsep mandiri berstandar riset."
              features={FREE_FEATURES}
              buttonLabel="Paket Dasar Digunakan"
              onClick={onOpenMap}
            />
            <LicenseCard
              kind="pro"
              title="Coba Gratis 14 Hari"
              subtitle="Asisten AI Ekstraksi Silabus & Dokumen Ajar"
              description="Unggah slide kuliah, paper acuan, atau RPS untuk men-generate draf kanvas konsep dalam hitungan detik."
              features={PRO_FEATURES}
              buttonLabel="Coba AI Pro Dosen 14 Hari"
              onClick={onOpenAiDraft}
            />
          </div>
        </section>

        <button
          type="button"
          onClick={onOpenMap}
          className="flex flex-col items-start gap-4 rounded-2xl bg-[#f0edf1] p-6 text-left shadow-[3px_3px_0_#1b1b1e] transition-transform hover:-translate-y-px sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <span className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0038d1] shadow-[2px_2px_0_#1b1b1e]">
              <DesignIcon name="protocol" />
            </span>
            <span>
              <strong className="block font-serif text-lg">Kit-Build Concept Map Research Protocol</strong>
              <span className="mt-1 block text-[10px] text-[#444655]">Framework F. Hirashima (Hiroshima University) sebagai landasan berbasis konseptual FILKOM UB.</span>
            </span>
          </span>
          <span className="flex flex-wrap gap-2 text-[8px] font-bold text-[#444655]">
            <span className="rounded-full bg-white px-3 py-2">F1-Score: 0.842</span>
            <span className="rounded-full bg-white px-3 py-2">Graph Logic: 100% Audit</span>
          </span>
        </button>
      </main>

      <footer className="bg-[#f6f2f7] px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1216px] flex-col justify-between gap-3 text-[8px] text-[#747687] sm:flex-row sm:items-center">
          <span>MAPLE COGNITIVE LAB • Kit-Build Concept Map Method (F. Hirashima Framework) — FILKOM Universitas Brawijaya • Malang</span>
          <span>© 2025 Fakultas Ilmu Komputer UB</span>
        </div>
      </footer>
    </div>
  );
};

function MetricCard({
  title,
  icon,
  iconTone,
  children
}: {
  title: string;
  icon: AssetName;
  iconTone: 'blue' | 'amber' | 'red' | 'gray';
  children: React.ReactNode;
}) {
  const toneClasses = {
    blue: 'bg-[#EEF2FF] border-[#0038D1]',
    amber: 'bg-[#FFFBEB] border-[#D97706]',
    red: 'bg-[#FEF2F2] border-[#DA3437]',
    gray: 'bg-[#EDE8F5] border-[#1B1B1E]'
  };

  return (
    <article className="flex min-h-[178px] flex-col justify-between gap-3 rounded-2xl bg-white p-5 border-2 border-[#1B1B1E] shadow-[3px_3px_0_#1B1B1E] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[9.5px] font-mono font-bold uppercase tracking-[0.45px] text-[#71717A]">{title}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${toneClasses[iconTone]} shadow-[1px_1px_0_#1B1B1E]`}>
          <DesignIcon name={icon} />
        </span>
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </article>
  );
}

function LicenseCard({
  kind,
  title,
  subtitle,
  description,
  features,
  buttonLabel,
  onClick
}: {
  kind: 'free' | 'pro';
  title: string;
  subtitle: string;
  description: string;
  features: ReadonlyArray<{ icon: AssetName; text: React.ReactNode }>;
  buttonLabel: string;
  onClick: () => void;
}) {
  const isPro = kind === 'pro';

  return (
    <article className={`flex flex-col rounded-2xl bg-white p-6 sm:p-8 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E] ${isPro ? 'ring-2 ring-[#0038D1]' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-[#1B1B1E] bg-[#FAF7F2] px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.35px] text-[#1B1B1E]">
          {isPro ? '✦ AI Augmented Pro' : '◉ Edu Free Tier (Aktif)'}
        </span>
        <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-mono font-bold ${isPro ? 'bg-[#FFE3C8] text-[#6D4400] border-[#FFB95F]' : 'border-[#1B1B1E] text-[#71717A]'}`}>
          {isPro ? 'AKSELERASI AI' : 'Standar FILKOM'}
        </span>
      </div>
      <div className="mt-4">
        <h3 className={`font-serif text-3xl sm:text-4xl font-black leading-tight ${isPro ? 'text-[#0038D1]' : 'text-[#1B1B1E]'}`}>{title}</h3>
        <strong className="mt-2 block font-serif text-sm font-bold text-[#1B1B1E]">{subtitle}</strong>
        <p className="mt-1 text-xs leading-relaxed text-[#444655]">{description}</p>
      </div>
      <div className="my-5 border-t-2 border-[#1B1B1E]/10" />
      <ul className="flex-1 space-y-2.5 pb-6">
        {features.map((feature, index) => (
          <li key={`${kind}-${index}`} className="flex items-start gap-2.5 text-xs text-[#1B1B1E]">
            <DesignIcon name={feature.icon} className="mt-0.5 shrink-0" />
            <span className="leading-snug">{feature.text}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-serif font-black border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] transition-all hover:-translate-y-px active:translate-y-0 cursor-pointer ${
          isPro ? 'bg-[#0038D1] text-white hover:bg-[#2F54EB]' : 'bg-[#FAF7F2] text-[#1B1B1E] hover:bg-white'
        }`}
      >
        {buttonLabel}
        {isPro && <DesignIcon name="trial" />}
        {!isPro && <ChevronRight className="h-4 w-4" />}
      </button>
    </article>
  );
}
