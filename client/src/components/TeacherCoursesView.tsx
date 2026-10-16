'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart2,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Network,
  Sparkles,
  Users,
  X,
  type LucideIcon
} from 'lucide-react';
import { InstructorNavbar, InstructorNavItem } from './InstructorNavbar';

const COURSE_ASSETS = {
  import: ['f314b.svg', 12, 12],
  add: ['e79e9.svg', 16.667, 16.667],
  search: ['fe8f2.svg', 13.5, 13.5],
  filter: ['230ce.svg', 13.5, 13.5],
  courseMap: ['16271.svg', 26.667, 24],
  instructor: ['c9a79.svg', 11.667, 9.333],
  arrow: ['457a9.svg', 12, 12],
  soloInstructor: ['e29b1.svg', 9.333, 9.333],
  arrowMuted: ['c6538.svg', 12, 12],
  bell: ['5a7f0.svg', 13.333, 13.367],
  download: ['3ebfc.svg', 10.667, 10.667],
  settings: ['4f443.svg', 15.075, 15],
  students: ['8b734.svg', 16, 8],
  modules: ['c2900.svg', 11.333, 14.667],
  groups: ['eacce.svg', 14.667, 10.667],
  tableFilter: ['57772.svg', 12, 12],
  attendance: ['55ca7.svg', 15, 15],
  topology: ['45d0c.svg', 18.333, 15.417],
  misconception: ['b2763.svg', 18.333, 17.75],
  score: ['f0f8a.svg', 18.333, 15.417],
  insight: ['5736b.svg', 12.833, 12.25],
  mapAction: ['5f619.svg', 15, 13.5],
  assessmentAction: ['e88a6.svg', 14.259, 15],
  groupAction: ['e792f.svg', 12.833, 12.25],
  participantAction: ['aff1c.svg', 14.667, 10.667]
} as const;

type CourseAssetName = keyof typeof COURSE_ASSETS;

function CourseAsset({ name, className = '' }: { name: CourseAssetName; className?: string }) {
  const [file, width, height] = COURSE_ASSETS[name];
  return (
    <img
      src={`/figma/courses/${file}`}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    />
  );
}

type Course = {
  code: string;
  credits: number;
  title: string;
  rombels: string;
  students: number;
  assessments: number;
  score: number;
  color: string;
  instructor: string;
  room: string;
  status: 'active' | 'remedial' | 'archived';
};

const INITIAL_COURSES: Course[] = [
  {
    code: 'TIF-2101',
    credits: 3,
    title: 'Arsitektur Komputer',
    rombels: 'Kelas A & B',
    students: 42,
    assessments: 4,
    score: 82.4,
    color: '#0038d1',
    instructor: 'Ir. Aryo Pinandito, Ph.D.',
    room: 'Gedung G-301 & Hybrid Daring',
    status: 'active'
  },
  {
    code: 'TIF-2103',
    credits: 3,
    title: 'Sistem Operasi',
    rombels: 'Kelas C',
    students: 38,
    assessments: 3,
    score: 84.1,
    color: '#8e5900',
    instructor: 'Dosen Tunggal: Mandiri',
    room: 'Gedung G-302',
    status: 'active'
  },
  {
    code: 'TIF-2104',
    credits: 4,
    title: 'Algoritma & Struktur Data',
    rombels: 'Kelas E',
    students: 45,
    assessments: 5,
    score: 79.5,
    color: '#2f54eb',
    instructor: 'Dr. Tri Astoto, M.Kom.',
    room: 'Gedung G-305',
    status: 'active'
  },
  {
    code: 'TIF-2102',
    credits: 3,
    title: 'Jaringan Komputer',
    rombels: 'Kelas B',
    students: 43,
    assessments: 2,
    score: 74,
    color: '#da3437',
    instructor: 'Kadek Suarjuna, Ph.D.',
    room: 'Gedung G-204',
    status: 'remedial'
  }
];

const ARCHIVED_COURSES: Course[] = [
  'Matematika Diskrit', 'Basis Data', 'Pemrograman Dasar', 'Sistem Digital', 'Kalkulus', 'Statistika Komputasi'
].map((title, index) => ({
  code: `ARS-${2101 + index}`,
  credits: 3,
  title,
  rombels: 'Arsip',
  students: 36 + index,
  assessments: 2 + (index % 3),
  score: 76 + index * 1.5,
  color: '#747687',
  instructor: 'Arsip Semester Lalu',
  room: 'FILKOM UB',
  status: 'archived'
}));

type Student = {
  initials: string;
  name: string;
  nim: string;
  rombel: string;
  attendance: string;
  score: number;
  topology: string;
  gap: string;
  tone: string;
  status: 'complete' | 'incomplete';
};

const STUDENTS: Student[] = [
  { initials: 'AR', name: 'Ahmad Rizky Pratama', nim: '225150201111045', rombel: 'Rombel A1', attendance: '4/4 Selesai', score: 91.8, topology: 'Net (Jejaring Kompleks)', gap: 'Komprehensif', tone: '#dee1ff', status: 'complete' },
  { initials: 'CD', name: 'Citra Dewi Lestari', nim: '225150201111018', rombel: 'Rombel A1', attendance: '4/4 Selesai', score: 82, topology: 'Spoke (Pusat Sentris)', gap: 'Paham Sebagian (Pipeline)', tone: '#ffddb8', status: 'complete' },
  { initials: 'BS', name: 'Budi Santoso', nim: '225150201111002', rombel: 'Rombel A2', attendance: '3/4 Asesmen', score: 68.5, topology: 'Chain (Rantai Linear)', gap: 'Perlu Bimbingan', tone: '#ffdad7', status: 'incomplete' },
  { initials: 'FP', name: 'Fajar Pratama', nim: '225150201111077', rombel: 'Rombel A2', attendance: '4/4 Selesai', score: 88, topology: 'Net (Jejaring Kompleks)', gap: 'Komprehensif', tone: '#dee1ff', status: 'complete' },
  { initials: 'MA', name: 'Maya Anggraini', nim: '225150201111092', rombel: 'Rombel A1', attendance: '4/4 Selesai', score: 76.4, topology: 'Chain (Rantai Linear)', gap: 'Paham Sebagian (Memori Hierarki)', tone: '#eae7eb', status: 'complete' },
  { initials: 'NP', name: 'Nabila Putri', nim: '225150201111115', rombel: 'Rombel A1', attendance: '4/4 Selesai', score: 78, topology: 'Spoke (Pusat Sentris)', gap: 'Komprehensif', tone: '#ffddb8', status: 'complete' },
  { initials: 'DA', name: 'Dimas Aditya', nim: '225150201111126', rombel: 'Rombel A2', attendance: '2/4 Asesmen', score: 63.2, topology: 'Chain (Rantai Linear)', gap: 'Perlu Bimbingan', tone: '#ffdad7', status: 'incomplete' }
];

const FILTERS = [
  { id: 'all', label: 'Semua Kelas', count: 4 },
  { id: 'semester', label: 'Semester Ganjil 2026/2027', count: 3 },
  { id: 'collaborative', label: 'Kelas Kolaboratif', count: 1 },
  { id: 'archive', label: 'Arsip Semester Lalu', count: 6 }
] as const;

type CourseFilter = (typeof FILTERS)[number]['id'];
type CourseTab = 'students' | 'assessments' | 'groups' | 'rubric';

interface TeacherCoursesViewProps {
  onNavigate: (item: InstructorNavItem) => void;
  onLogout: () => void;
}

export const TeacherCoursesView: React.FC<TeacherCoursesViewProps> = ({ onNavigate, onLogout }) => {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [selectedCourseCode, setSelectedCourseCode] = useState(INITIAL_COURSES[0].code);
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [query, setQuery] = useState('');
  const [courseTab, setCourseTab] = useState<CourseTab>('students');
  const [studentPage, setStudentPage] = useState(1);
  const [sortCourses, setSortCourses] = useState(false);
  const [topologyFilter, setTopologyFilter] = useState('Semua Pola');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [toast, setToast] = useState('');
  const uploadRef = useRef<HTMLInputElement>(null);

  const selectedCourse = [...courses, ...ARCHIVED_COURSES].find((course) => course.code === selectedCourseCode) ?? courses[0];
  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const sourceCourses = filter === 'archive' ? ARCHIVED_COURSES : courses;
    return sourceCourses.filter((course) => {
      const matchesQuery = !normalizedQuery || `${course.title} ${course.code} ${course.rombels}`.toLocaleLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'all' || filter === 'archive' || (filter === 'semester' && course.code !== 'TIF-2104') || (filter === 'collaborative' && course.code === 'TIF-2104');
      return matchesQuery && matchesFilter;
    }).sort((a, b) => sortCourses ? a.title.localeCompare(b.title) : 0);
  }, [courses, filter, query, sortCourses]);

  const filteredStudents = useMemo(() => STUDENTS.filter((student) => {
    const matchesTopology = topologyFilter === 'Semua Pola' || student.topology.startsWith(topologyFilter);
    const matchesStatus = statusFilter === 'Semua Status' || (statusFilter === 'Selesai' ? student.status === 'complete' : student.status === 'incomplete');
    return matchesTopology && matchesStatus;
  }), [statusFilter, topologyFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / 5));
  const pageStudents = filteredStudents.slice((studentPage - 1) * 5, studentPage * 5);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const exportStudents = () => {
    const rows = [
      ['Nama', 'NIM', 'Rombel', 'Kehadiran', 'Skor Kognitif', 'Topologi', 'Celah Pengetahuan'],
      ...filteredStudents.map((student) => [student.name, student.nim, student.rombel, student.attendance, student.score.toString(), student.topology, student.gap])
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${selectedCourse.code}-rekap-obe.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const addCourse = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = newCourseCode.trim().toUpperCase();
    if (!newCourseTitle.trim() || !code || courses.some((course) => course.code === code)) {
      notify('Isi nama dan kode mata kuliah dengan benar.');
      return;
    }
    const newCourse: Course = {
      code,
      credits: 3,
      title: newCourseTitle.trim(),
      rombels: 'Kelas Baru',
      students: 0,
      assessments: 0,
      score: 0,
      color: '#0038d1',
      instructor: 'Dr. Eng. Herman Tolle, S.T., M.T.',
      room: 'Belum ditentukan',
      status: 'active'
    };
    setCourses((items) => [...items, newCourse]);
    setSelectedCourseCode(code);
    setFilter('all');
    setIsAddCourseOpen(false);
    setNewCourseTitle('');
    setNewCourseCode('');
    notify('Mata kuliah baru berhasil ditambahkan.');
  };

  const navTo = (item: InstructorNavItem) => {
    if (item !== 'Courses') onNavigate(item);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1b1b1e]">
      <InstructorNavbar activeItem="Courses" onNavigate={navTo} onLogout={onLogout} />
      {toast && <div role="status" className="fixed right-5 top-20 z-50 rounded-xl bg-[#1b1b1e] px-4 py-3 text-xs font-bold text-white shadow-lg">{toast}</div>}
      <input
        ref={uploadRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) notify(`File ${file.name} dipilih; sinkronisasi SIAKAD belum terhubung.`);
          event.currentTarget.value = '';
        }}
      />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 sm:px-8">
        {/* Hero Section */}
        <section className="relative flex flex-col justify-between gap-5 overflow-hidden rounded-2xl bg-white p-6 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E] sm:p-8 xl:flex-row xl:items-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-[#FAF7F2] border border-[#1B1B1E]/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-40 h-32 w-32 rotate-12 rounded-2xl bg-[#FFE3C8]/40 border border-[#1B1B1E]/10" />
          <div className="relative min-w-0 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.5px] text-[#71717A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0038D1]" />
              <span>Semester Ganjil 2026/2027 • FILKOM UB</span>
              <span className="rounded-full bg-[#EDE8F5] border border-[#1B1B1E] px-2.5 py-0.5 text-[#1B1B1E]">
                Kit-Build Concept Map Method
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-black leading-tight tracking-tight text-[#1B1B1E]">
              Pengelolaan Mata Kuliah &amp; Kelas
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#444655]">
              Kelola daftar kelas aktif, distribusi peserta mahasiswa, dan keterkaitan modul asesmen peta konsep berbasis kerangka kognitif F. Hirashima.
            </p>
          </div>
          <div className="relative flex shrink-0 flex-wrap gap-2.5 xl:w-[340px] xl:flex-col xl:items-start">
            <button
              type="button"
              onClick={() => uploadRef.current?.click()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-serif font-black text-[#1B1B1E] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-[#FAF7F2] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <CourseAsset name="import" /> Impor Data Mahasiswa (SIAKAD)
            </button>
            <button
              type="button"
              onClick={() => setIsAddCourseOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0038D1] px-4 py-2.5 text-xs font-serif font-black text-white border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0_#1B1B1E] hover:bg-[#2F54EB] transition-transform hover:-translate-y-px cursor-pointer"
            >
              <CourseAsset name="add" /> + Tambah Mata Kuliah Baru
            </button>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section aria-label="Filter dan pencarian mata kuliah" className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-3 border-2 border-[#1B1B1E] shadow-[3px_3px_0_#1B1B1E] xl:flex-row xl:items-center">
          <div className="flex gap-1.5 overflow-x-auto">
            {FILTERS.map((item) => {
              const count = item.id === 'all'
                ? courses.length
                : item.id === 'semester'
                ? courses.filter((c) => c.code !== 'TIF-2104').length
                : item.id === 'collaborative'
                ? courses.filter((c) => c.code === 'TIF-2104').length
                : ARCHIVED_COURSES.length;
              const isSelected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFilter(item.id);
                    setStudentPage(1);
                    setSelectedCourseCode(
                      item.id === 'archive'
                        ? ARCHIVED_COURSES[0].code
                        : item.id === 'collaborative'
                        ? 'TIF-2104'
                        : courses[0].code
                    );
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-serif font-black border-2 border-[#1B1B1E] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0038D1] text-white shadow-[2px_2px_0_#1B1B1E]'
                      : 'bg-[#FAF7F2] text-[#444655] hover:bg-white hover:text-[#1B1B1E]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[9px] font-mono font-bold border border-[#1B1B1E] ${
                      isSelected ? 'bg-white text-[#0038D1]' : 'bg-white text-[#1B1B1E]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex min-w-0 gap-2 xl:w-[350px]">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1.5 shadow-[1.5px_1.5px_0_#1B1B1E] focus-within:bg-white">
              <CourseAsset name="search" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari mata kuliah, kode, rombel..."
                className="min-w-0 flex-1 bg-transparent text-xs font-serif font-bold outline-none placeholder:text-[#71717A]"
              />
            </label>
            <button
              type="button"
              aria-label="Urutkan mata kuliah"
              aria-pressed={sortCourses}
              onClick={() => setSortCourses((sorted) => !sorted)}
              className={`rounded-xl border-2 border-[#1B1B1E] p-2 shadow-[1.5px_1.5px_0_#1B1B1E] transition-all cursor-pointer ${
                sortCourses ? 'bg-[#EEF2FF]' : 'bg-[#FAF7F2] hover:bg-white'
              }`}
            >
              <CourseAsset name="filter" />
            </button>
          </div>
        </section>

        {/* Course Cards Grid */}
        <section aria-label="Daftar mata kuliah" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => {
            const isSelected = selectedCourseCode === course.code;
            return (
              <button
                key={course.code}
                type="button"
                onClick={() => {
                  setSelectedCourseCode(course.code);
                  setStudentPage(1);
                }}
                aria-pressed={isSelected}
                className={`flex min-w-0 flex-col rounded-2xl bg-white p-4.5 text-left border-2 border-[#1B1B1E] transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-[4px_4px_0_#0038D1] -translate-y-0.5'
                    : 'shadow-[3px_3px_0_#1B1B1E] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1B1B1E]'
                }`}
              >
                <span className="flex w-full items-start justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1B1B1E] px-2.5 py-0.5 text-[9px] font-mono font-bold"
                    style={{ backgroundColor: `${course.color}15`, color: course.color }}
                  >
                    <span className="h-2 w-2 rounded-full border border-[#1B1B1E]" style={{ backgroundColor: course.color }} />
                    {course.code} • SKS {course.credits}
                  </span>
                  <span className="shrink-0 rounded-full border border-[#1B1B1E] bg-[#FAF7F2] px-2 py-0.5 text-[9px] font-mono font-bold text-[#1B1B1E]">
                    {course.rombels}
                  </span>
                </span>

                <span className="mt-2.5 flex min-h-14 items-start gap-2">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-[#1B1B1E]" style={{ backgroundColor: course.color }} />
                  <span className="font-serif text-lg font-black leading-snug text-[#1B1B1E]">{course.title}</span>
                </span>

                <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#71717A]">
                  <CourseAsset name={course.instructor.startsWith('Dosen Tunggal') ? 'soloInstructor' : 'instructor'} />
                  <span className="truncate">
                    {course.instructor.startsWith('Dosen Tunggal') ? course.instructor : `Pendamping: ${course.instructor}`}
                  </span>
                </span>

                <span className="mt-3 grid w-full grid-cols-2 gap-1.5">
                  <span className="rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-2">
                    <span className="block text-[8.5px] font-mono font-bold text-[#71717A]">Peserta</span>
                    <span className="font-serif text-base font-black text-[#1B1B1E]">
                      {course.students} <span className="font-sans text-[10px] font-normal text-[#71717A]">Mhs</span>
                    </span>
                  </span>
                  <span className="rounded-xl border border-[#1B1B1E]/15 bg-[#FAF7F2] p-2">
                    <span className="block text-[8.5px] font-mono font-bold text-[#71717A]">Asesmen Aktif</span>
                    <span
                      className="font-serif text-base font-black"
                      style={{ color: course.assessments > 3 ? '#0038D1' : '#1B1B1E' }}
                    >
                      {course.assessments} <span className="font-sans text-[10px] font-normal text-[#71717A]">Kit</span>
                    </span>
                  </span>
                </span>

                <span className="mt-2.5 flex w-full items-center justify-between text-[9px] font-mono font-bold">
                  <span className="text-[#71717A]">Skor Rerata</span>
                  <span style={{ color: course.status === 'remedial' ? '#DA3437' : course.color }}>
                    {course.score.toFixed(1)} / 100
                  </span>
                </span>

                <span className="mt-1 h-2 w-full overflow-hidden rounded-full border border-[#1B1B1E] bg-[#FAF7F2]">
                  <span className="block h-full rounded-full" style={{ width: `${course.score}%`, backgroundColor: course.color }} />
                </span>

                <span className="mt-auto flex w-full items-center justify-between border-t border-[#1B1B1E]/10 pt-3 text-[9.5px] font-bold text-[#71717A]">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full border border-[#1B1B1E]"
                      style={{
                        backgroundColor:
                          course.status === 'remedial'
                            ? '#DA3437'
                            : course.status === 'archived'
                            ? '#71717A'
                            : '#0038D1',
                      }}
                    />
                    {course.status === 'remedial'
                      ? 'Sedang Remedial'
                      : course.status === 'archived'
                      ? 'Arsip'
                      : isSelected
                      ? 'Sedang Dipilih'
                      : 'Aktif Berjalan'}
                  </span>
                  <CourseAsset name={isSelected ? 'arrow' : 'arrowMuted'} />
                </span>
              </button>
            );
          })}
          {filteredCourses.length === 0 && (
            <p className="col-span-full rounded-2xl bg-white p-8 text-center text-sm font-serif text-[#71717A] border-2 border-[#1B1B1E]">
              Tidak ada mata kuliah yang sesuai dengan pencarian.
            </p>
          )}
        </section>

        {/* Selected Course Detail Section */}
        {selectedCourse && (
          <section
            aria-label={`Detail ${selectedCourse.title}`}
            className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-5 sm:p-6 border-2 border-[#1B1B1E] shadow-[4px_4px_0_#1B1B1E]"
          >
            <div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] p-4 lg:flex-row lg:items-center">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0038D1] text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E]">
                  <CourseAsset name="courseMap" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl font-black leading-tight text-[#1B1B1E]">{selectedCourse.title}</h2>
                    <span className="rounded-full bg-[#EEF2FF] border border-[#0038D1] px-2.5 py-0.5 text-[9px] font-mono font-bold text-[#0038D1]">
                      {selectedCourse.code} • {selectedCourse.rombels}
                    </span>
                    <span className="rounded-full bg-white border border-[#1B1B1E] px-2 py-0.5 text-[9px] font-mono font-bold text-[#1B1B1E]">
                      T.A. 2026/2027 Ganjil
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#71717A]">
                    Koordinator: <strong className="text-[#1B1B1E]">Dr. Eng. Herman Tolle, S.T., M.T.</strong>
                    {' • '}Dosen Pendamping: {selectedCourse.instructor} • Ruang: {selectedCourse.room}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 lg:w-[385px] lg:justify-end">
                <button
                  type="button"
                  onClick={() => notify(`Pengingat asesmen ${selectedCourse.code} siap dikirim.`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-serif font-black text-[#1B1B1E] border-2 border-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E] hover:bg-[#FAF7F2] transition-transform hover:-translate-y-px cursor-pointer"
                >
                  <CourseAsset name="bell" /> Kirim Pengingat
                </button>
                <button
                  type="button"
                  onClick={exportStudents}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0038D1] px-3.5 py-2 text-xs font-serif font-black text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E] hover:bg-[#2F54EB] transition-transform hover:-translate-y-px cursor-pointer"
                >
                  <CourseAsset name="download" /> Unduh Rekap OBE (CSV)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {([
                  ['students', `Daftar Mahasiswa (${selectedCourse.students})`, 'students'],
                  ['assessments', `Daftar Asesmen Modul (${selectedCourse.assessments})`, 'modules'],
                  ['groups', 'Rombel & Kelompok', 'groups'],
                  ['rubric', 'Pengaturan Rubrik Kit-Build', 'tableFilter']
                ] as const).map(([id, label, icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCourseTab(id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all border-2 border-[#1B1B1E] cursor-pointer ${
                      courseTab === id
                        ? 'bg-[#0038D1] text-white shadow-[2px_2px_0_#1B1B1E]'
                        : 'bg-white text-[#1B1B1E] hover:bg-[#FAF7F2] shadow-[1.5px_1.5px_0_#1B1B1E]'
                    }`}
                  >
                    <CourseAsset name={icon} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1 font-mono text-[10px] text-[#1B1B1E] shadow-[1px_1px_0_#1B1B1E]">
                  <strong>Topologi:</strong> Net Model (57%)
                </span>
                <span className="rounded-full border border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1 font-mono text-[10px] text-[#1B1B1E] shadow-[1px_1px_0_#1B1B1E]">
                  <strong>Status Celah:</strong> Semua Status
                </span>
              </div>
            </div>

            {courseTab === 'students' ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <SummaryMetric icon={Users} title="Tingkat Partisipasi" value="97.6%" detail="(41/42 Mhs)" />
                  <SummaryMetric icon={Network} title="Topologi Dominan" value="Net Model" detail="(57%)" />
                  <SummaryMetric icon={AlertTriangle} title="Deteksi Miskonsepsi" value="6 Mahasiswa" danger />
                  <SummaryMetric icon={Award} title="Kesesuaian Peta Dosen" value="86.2%" detail="F-Score" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <label className="flex items-center gap-2 rounded-xl border border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1.5 text-xs font-mono font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0_#1B1B1E]">
                    <span className="text-[#71717A]">Topologi:</span>
                    <select
                      value={topologyFilter}
                      onChange={(event) => {
                        setTopologyFilter(event.target.value);
                        setStudentPage(1);
                      }}
                      className="bg-transparent font-mono font-bold outline-none cursor-pointer"
                    >
                      <option>Semua Pola</option>
                      <option>Net</option>
                      <option>Spoke</option>
                      <option>Chain</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-[#1B1B1E] bg-[#FAF7F2] px-3 py-1.5 text-xs font-mono font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0_#1B1B1E]">
                    <span className="text-[#71717A]">Status Celah:</span>
                    <select
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value);
                        setStudentPage(1);
                      }}
                      className="bg-transparent font-mono font-bold outline-none cursor-pointer"
                    >
                      <option>Semua Status</option>
                      <option>Selesai</option>
                      <option>Belum Selesai</option>
                    </select>
                  </label>
                </div>

                <StudentTable students={pageStudents} onNotify={notify} />
                <div className="flex flex-col justify-between gap-3 border-t-2 border-[#1B1B1E]/10 pt-3 text-xs font-mono text-[#71717A] sm:flex-row sm:items-center">
                  <span>
                    Menampilkan {filteredStudents.length ? (studentPage - 1) * 5 + 1 : 0}–
                    {Math.min(studentPage * 5, filteredStudents.length)} dari {selectedCourse.students} mahasiswa
                    terdaftar
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={studentPage === 1}
                      onClick={() => setStudentPage((page) => Math.max(1, page - 1))}
                      className="rounded-lg border border-[#1B1B1E] bg-white px-2.5 py-1 text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#1B1B1E] transition-all hover:bg-[#FAF7F2] active:translate-y-0.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Sebelumnya
                    </button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setStudentPage(page)}
                        aria-current={page === studentPage ? 'page' : undefined}
                        className={`h-7 min-w-7 rounded-lg border border-[#1B1B1E] px-2 text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#1B1B1E] transition-all cursor-pointer ${
                          page === studentPage ? 'bg-[#0038D1] text-white' : 'bg-white text-[#1B1B1E] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={studentPage === pageCount}
                      onClick={() => setStudentPage((page) => Math.min(pageCount, page + 1))}
                      className="rounded-lg border border-[#1B1B1E] bg-white px-2.5 py-1 text-xs font-mono font-bold shadow-[1.5px_1.5px_0_#1B1B1E] transition-all hover:bg-[#FAF7F2] active:translate-y-0.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl bg-[#f6f2f7] p-8 text-center">
                <h3 className="font-serif text-lg font-bold">
                  {courseTab === 'assessments' ? 'Daftar Asesmen Modul' : courseTab === 'groups' ? 'Rombel & Kelompok' : 'Pengaturan Rubrik Kit-Build'}
                </h3>
                <p className="mt-2 text-xs text-[#747687]">
                  {courseTab === 'assessments' ? `${selectedCourse.assessments} modul asesmen Kit-Build terhubung dengan mata kuliah ini.` : courseTab === 'groups' ? `Kelola distribusi ${selectedCourse.students} mahasiswa ke dalam rombel.` : 'Atur toleransi relasi dan parameter evaluasi peta konsep.'}
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="mt-4 bg-[#f6f2f7] px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[1216px] flex-col justify-between gap-3 text-[8px] text-[#747687] sm:flex-row sm:items-center">
          <span>MAPLY COGNITIVE LAB • Kit-Build Concept Map Method (F. Hirashima Framework) — FILKOM Universitas Brawijaya • Malang</span>
          <span>© 2025 Fakultas Ilmu Komputer UB</span>
        </div>
      </footer>

      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <form
            onSubmit={addCourse}
            className="w-full max-w-md rounded-2xl border-2 border-[#1B1B1E] bg-white p-6 shadow-[6px_6px_0_#1B1B1E]"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-black text-[#1B1B1E]">Tambah Mata Kuliah Baru</h2>
              <button
                type="button"
                onClick={() => setIsAddCourseOpen(false)}
                className="rounded-lg p-1 text-[#71717A] hover:bg-[#FAF7F2] hover:text-[#1B1B1E] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-4 block font-mono text-xs font-bold text-[#1B1B1E]">
              Nama Mata Kuliah
              <input
                required
                value={newCourseTitle}
                onChange={(event) => setNewCourseTitle(event.target.value)}
                placeholder="misal: Kecerdasan Buatan"
                className="mt-1 w-full rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] px-3.5 py-2 font-mono text-xs outline-none focus:bg-white focus:shadow-[2px_2px_0_#1B1B1E] transition-all"
              />
            </label>
            <label className="mt-3 block font-mono text-xs font-bold text-[#1B1B1E]">
              Kode Mata Kuliah
              <input
                required
                value={newCourseCode}
                onChange={(event) => setNewCourseCode(event.target.value)}
                placeholder="misal: CIF-6101"
                className="mt-1 w-full rounded-xl border-2 border-[#1B1B1E] bg-[#FAF7F2] px-3.5 py-2 font-mono text-xs outline-none focus:bg-white focus:shadow-[2px_2px_0_#1B1B1E] transition-all"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAddCourseOpen(false)}
                className="rounded-xl border-2 border-[#1B1B1E] bg-white px-4 py-2 font-mono text-xs font-bold text-[#1B1B1E] shadow-[2px_2px_0_#1B1B1E] hover:bg-[#FAF7F2] active:translate-y-0.5 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl border-2 border-[#1B1B1E] bg-[#0038D1] px-4 py-2 font-mono text-xs font-bold text-white shadow-[2px_2px_0_#1B1B1E] hover:bg-[#2F54EB] active:translate-y-0.5 transition-all cursor-pointer"
              >
                Simpan Mata Kuliah
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

function SummaryMetric({
  icon: Icon,
  title,
  value,
  detail,
  danger = false
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  detail?: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-xl border-2 border-[#1B1B1E] p-3 shadow-[2.5px_2.5px_0_#1B1B1E] ${
        danger ? 'bg-[#FFF0F0]' : 'bg-white'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1B1B1E] shadow-[1px_1px_0_#1B1B1E] ${
          danger ? 'bg-[#B61722] text-white' : 'bg-[#FAF7F2] text-[#0038D1]'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#71717A]">
          {title}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif text-xl font-black ${
              danger ? 'text-[#B61722]' : 'text-[#1B1B1E]'
            }`}
          >
            {value}
          </span>
          {detail && <span className="font-mono text-[10px] text-[#71717A]">{detail}</span>}
        </div>
      </div>
    </div>
  );
}

function StudentTable({ students, onNotify }: { students: Student[]; onNotify: (message: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-[#1B1B1E] bg-white shadow-[3px_3px_0_#1B1B1E]">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="border-b-2 border-[#1B1B1E] bg-[#FAF7F2] text-[10px] font-mono font-black uppercase tracking-wider text-[#1B1B1E]">
          <tr>
            <th className="px-4 py-3">Mahasiswa &amp; NIM</th>
            <th className="px-4 py-3">Kehadiran Asesmen</th>
            <th className="px-4 py-3">Skor Kognitif</th>
            <th className="px-4 py-3">Topologi Dominan</th>
            <th className="px-4 py-3">Celah Pengetahuan</th>
            <th className="px-4 py-3 text-right">Aksi Analisis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1B1B1E]/10">
          {students.map((student) => {
            const isNeedGuidance = student.gap === 'Perlu Bimbingan';
            const isComprehensive = student.gap === 'Komprehensif';

            return (
              <tr key={student.nim} className="transition-colors hover:bg-[#FAF7F2]/60">
                {/* 1. Mahasiswa & NIM */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1B1B1E] font-serif text-xs font-black shadow-[1.5px_1.5px_0_#1B1B1E]"
                      style={{ backgroundColor: student.tone }}
                    >
                      {student.initials}
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate font-serif text-xs font-bold text-[#1B1B1E]">
                        {student.name}
                      </strong>
                      <span className="font-mono text-[10px] text-[#71717A]">
                        {student.nim} • {student.rombel}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Kehadiran Asesmen */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs font-bold text-[#1B1B1E]">
                    <span
                      className={`h-2 w-2 rounded-full border border-[#1B1B1E] ${
                        student.status === 'complete' ? 'bg-[#0038D1]' : 'bg-[#B61722]'
                      }`}
                    />
                    {student.attendance}
                  </span>
                </td>

                {/* 3. Skor Kognitif */}
                <td className="px-4 py-3">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-serif text-base font-black ${
                        student.score >= 85
                          ? 'text-[#0038D1]'
                          : student.score < 70
                          ? 'text-[#B61722]'
                          : 'text-[#1B1B1E]'
                      }`}
                    >
                      {student.score.toFixed(1)}
                    </span>
                    <span className="font-mono text-[10px] text-[#71717A]">/100</span>
                  </div>
                </td>

                {/* 4. Topologi Dominan */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#0038D1]/30 bg-[#EEF2FF] px-2.5 py-1 font-mono text-[10px] font-bold text-[#0038D1]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0038D1]" />
                    {student.topology}
                  </span>
                </td>

                {/* 5. Celah Pengetahuan */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold ${
                      isNeedGuidance
                        ? 'border-[#B61722]/30 bg-[#FFF0F0] text-[#B61722]'
                        : isComprehensive
                        ? 'border-[#137333]/30 bg-[#E6F4EA] text-[#137333]'
                        : 'border-[#B06000]/30 bg-[#FEF7E0] text-[#B06000]'
                    }`}
                  >
                    {isNeedGuidance ? (
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    ) : isComprehensive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>{student.gap}</span>
                  </span>
                </td>

                {/* 6. Aksi Analisis */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      title={`Lihat peta konsep ${student.name}`}
                      onClick={() => onNotify(`Peta konsep ${student.name} siap ditelaah.`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1B1B1E] bg-white px-2.5 py-1.5 font-mono text-[10px] font-bold text-[#0038D1] shadow-[1.5px_1.5px_0_#1B1B1E] transition-all hover:bg-[#EEF2FF] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <Network className="h-3.5 w-3.5" />
                      <span>Peta</span>
                    </button>
                    <button
                      type="button"
                      title={`Lihat analisis kognitif ${student.name}`}
                      onClick={() => onNotify(`Analisis kognitif ${student.name} tersedia pada tab Analytics.`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#1B1B1E] bg-[#FAF7F2] px-2.5 py-1.5 font-mono text-[10px] font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0_#1B1B1E] transition-all hover:bg-white hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      <BarChart2 className="h-3.5 w-3.5 text-[#71717A]" />
                      <span>Analisis</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {students.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center font-mono text-xs text-[#71717A]">
                Tidak ada mahasiswa yang sesuai dengan filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
