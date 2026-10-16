'use client';

import React, { useMemo, useRef, useState } from 'react';
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
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#747687]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0038d1]" />
              <span>Semester Ganjil 2026/2027 • FILKOM UB</span>
              <span>•</span>
              <span className="text-[#0038d1]">Kit-Build Concept Map Method</span>
            </div>
            <h1 className="mt-2 font-serif text-[32px] font-bold leading-tight tracking-[-0.8px] sm:text-[40px]">
              Pengelolaan Mata Kuliah &amp; Kelas
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] leading-6 text-[#444655]">
              Kelola daftar kelas aktif, distribusi peserta mahasiswa, dan keterkaitan modul asesmen peta konsep berbasis kerangka kognitif F. Hirashima.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 xl:w-[330px] xl:flex-col xl:items-start">
            <button type="button" onClick={() => uploadRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[11px] font-bold shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
              <CourseAsset name="import" /> Impor Data Mahasiswa (SIAKAD)
            </button>
            <button type="button" onClick={() => setIsAddCourseOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0038d1] px-4 py-2 text-[11px] font-bold text-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
              <CourseAsset name="add" /> + Tambah Mata Kuliah Baru
            </button>
          </div>
        </section>

        <section aria-label="Filter dan pencarian mata kuliah" className="flex flex-col justify-between gap-3 rounded-xl bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] xl:flex-row xl:items-center">
          <div className="flex gap-1 overflow-x-auto">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFilter(item.id);
                  setStudentPage(1);
                  setSelectedCourseCode(
                    item.id === 'archive' ? ARCHIVED_COURSES[0].code
                      : item.id === 'collaborative' ? 'TIF-2104'
                        : courses[0].code
                  );
                }}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-bold sm:px-4 sm:text-[10px] ${filter === item.id ? 'bg-[#0038d1] text-white' : 'text-[#444655] hover:bg-[#f6f2f7]'}`}
              >
                {item.label}<span className={`rounded-full px-1.5 text-[8px] ${filter === item.id ? 'bg-white/20' : 'bg-[#eae7eb]'}`}>{item.id === 'all' ? courses.length : item.id === 'semester' ? courses.filter((course) => course.code !== 'TIF-2104').length : item.id === 'collaborative' ? courses.filter((course) => course.code === 'TIF-2104').length : ARCHIVED_COURSES.length}</span>
              </button>
            ))}
          </div>
          <div className="flex min-w-0 gap-2 xl:w-[340px]">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-[#f6f2f7] px-3 py-2">
              <CourseAsset name="search" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari mata kuliah, kode, atau rombel..."
                className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#747687]"
              />
            </label>
            <button type="button" aria-label="Urutkan mata kuliah" aria-pressed={sortCourses} onClick={() => setSortCourses((sorted) => !sorted)} className={`rounded-lg p-2 ${sortCourses ? 'bg-[#dee1ff]' : 'bg-[#f6f2f7]'}`}>
              <CourseAsset name="filter" />
            </button>
          </div>
        </section>

        <section aria-label="Daftar mata kuliah" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <button
              key={course.code}
              type="button"
              onClick={() => {
                setSelectedCourseCode(course.code);
                setStudentPage(1);
              }}
              aria-pressed={selectedCourseCode === course.code}
              className={`flex min-w-0 flex-col rounded-xl bg-white p-4 text-left transition-shadow ${selectedCourseCode === course.code ? 'ring-2 ring-[#0038d1] shadow-[0_4px_6px_rgba(0,0,0,0.1)]' : 'shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_5px_10px_rgba(0,0,0,0.12)]'}`}
            >
              <span className="flex w-full items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eae7eb] px-2 py-1 text-[8px] font-bold" style={{ color: course.color }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: course.color }} />{course.code} • SKS {course.credits}
                </span>
                <span className="shrink-0 rounded-full bg-[#eae7eb] px-2 py-1 text-[8px] font-bold">{course.rombels}</span>
              </span>
              <span className="mt-2 flex min-h-14 items-start gap-2">
                <span className="mt-1 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: course.color }} />
                <span className="font-serif text-lg font-bold leading-6">{course.title}</span>
              </span>
              <span className="flex items-center gap-1 text-[9px] text-[#747687]">
                <CourseAsset name={course.instructor.startsWith('Dosen Tunggal') ? 'soloInstructor' : 'instructor'} />
                {course.instructor.startsWith('Dosen Tunggal') ? course.instructor : `Pendamping: ${course.instructor}`}
              </span>
              <span className="mt-3 grid w-full grid-cols-2 gap-1">
                <span className="rounded-lg bg-[#f6f2f7] p-2">
                  <span className="block text-[8px] font-bold text-[#747687]">Peserta</span>
                  <span className="font-serif text-lg font-bold">{course.students} <span className="font-sans text-[9px] font-normal text-[#747687]">Mhs</span></span>
                </span>
                <span className="rounded-lg bg-[#f6f2f7] p-2">
                  <span className="block text-[8px] font-bold text-[#747687]">Asesmen Aktif</span>
                  <span className="font-serif text-lg font-bold" style={{ color: course.assessments > 3 ? '#0038d1' : undefined }}>{course.assessments} <span className="font-sans text-[9px] font-normal text-[#747687]">Kit-Build</span></span>
                </span>
              </span>
              <span className="mt-2 flex w-full items-center justify-between text-[8px] font-bold">
                <span className="text-[#747687]">Rata-rata Skor Kognitif</span><span style={{ color: course.status === 'remedial' ? '#b61722' : course.color }}>{course.score.toFixed(1)} / 100</span>
              </span>
              <span className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#eae7eb]">
                <span className="block h-full rounded-full" style={{ width: `${course.score}%`, backgroundColor: course.color }} />
              </span>
              <span className="mt-auto flex w-full items-center justify-between border-t border-[#eae7eb] pt-3 text-[8px] font-bold text-[#747687]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: course.status === 'remedial' ? '#b61722' : course.status === 'archived' ? '#747687' : '#2f54eb' }} />{course.status === 'remedial' ? 'Sedang Remedial' : course.status === 'archived' ? 'Arsip Semester Lalu' : selectedCourseCode === course.code ? 'Sedang Dipilih' : 'Aktif Berjalan'}</span>
                <CourseAsset name={selectedCourseCode === course.code ? 'arrow' : 'arrowMuted'} />
              </span>
            </button>
          ))}
          {filteredCourses.length === 0 && (
            <p className="col-span-full rounded-xl bg-white p-8 text-center text-sm text-[#747687]">Tidak ada mata kuliah yang sesuai dengan pencarian.</p>
          )}
        </section>

        {selectedCourse && (
          <section aria-label={`Detail ${selectedCourse.title}`} className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)] sm:p-5">
            <div className="flex flex-col justify-between gap-4 rounded-xl bg-[#f6f2f7] p-4 lg:flex-row lg:items-center">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0038d1] text-white">
                  <CourseAsset name="courseMap" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold leading-8">{selectedCourse.title}</h2>
                    <span className="rounded-full bg-[#dee1ff] px-2 py-1 text-[8px] font-bold text-[#001257]">{selectedCourse.code} • {selectedCourse.rombels}</span>
                    <span className="rounded-full bg-[#eae7eb] px-2 py-1 text-[8px] font-bold">T.A. 2026/2027 Ganjil</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-5 text-[#747687]">
                    Koordinator: <strong className="text-[#1b1b1e]">Dr. Eng. Herman Tolle, S.T., M.T.</strong>
                    {' • '}Dosen Pendamping: {selectedCourse.instructor} • Ruang Kuliah: {selectedCourse.room}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 lg:w-[385px] lg:justify-end">
                <button type="button" onClick={() => notify(`Pengingat asesmen ${selectedCourse.code} siap dikirim setelah integrasi notifikasi.`)} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[9px] font-bold shadow-sm">
                  <CourseAsset name="bell" /> Kirim Pengingat Asesmen
                </button>
                <button type="button" onClick={exportStudents} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[9px] font-bold shadow-sm">
                  <CourseAsset name="download" /> Unduh Rekap Nilai OBE (CSV)
                </button>
                <button type="button" aria-label="Pengaturan mata kuliah" onClick={() => notify('Pengaturan mata kuliah belum tersedia pada demo ini.')} className="rounded-lg bg-white p-2 shadow-sm">
                  <CourseAsset name="settings" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap gap-1">
                {([
                  ['students', `Daftar Mahasiswa (${selectedCourse.students})`, 'students'],
                  ['assessments', `Daftar Asesmen Modul (${selectedCourse.assessments})`, 'modules'],
                  ['groups', 'Rombel & Kelompok', 'groups'],
                  ['rubric', 'Pengaturan Rubrik Kit-Build', 'tableFilter']
                ] as const).map(([id, label, icon]) => (
                  <button key={id} type="button" onClick={() => setCourseTab(id)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[9px] font-bold sm:px-4 sm:text-[10px] ${courseTab === id ? 'bg-[#eae7eb] text-[#1b1b1e]' : 'text-[#444655] hover:bg-[#f6f2f7]'}`}>
                    <CourseAsset name={icon} />{label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-[8px]">
                <span className="rounded-full bg-[#f6f2f7] px-3 py-1.5"><strong>Topologi:</strong> Net Model (57%)</span>
                <span className="rounded-full bg-[#f6f2f7] px-3 py-1.5"><strong>Status Celah:</strong> Semua Status</span>
              </div>
            </div>

            {courseTab === 'students' ? (
              <>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <SummaryMetric icon="attendance" title="Tingkat Partisipasi" value="97.6%" detail="(41/42 Mhs)" />
                  <SummaryMetric icon="topology" title="Topologi Dominan" value="Net Model" detail="(57%)" />
                  <SummaryMetric icon="misconception" title="Deteksi Miskonsepsi" value="6 Mahasiswa" danger />
                  <SummaryMetric icon="score" title="Kesesuaian Peta Dosen" value="86.2%" detail="F-Score" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <label className="flex items-center gap-2 rounded-lg bg-[#f6f2f7] px-3 py-2 text-[9px] font-bold">
                    Topologi:
                    <select value={topologyFilter} onChange={(event) => { setTopologyFilter(event.target.value); setStudentPage(1); }} className="bg-transparent outline-none">
                      <option>Semua Pola</option><option>Net</option><option>Spoke</option><option>Chain</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 rounded-lg bg-[#f6f2f7] px-3 py-2 text-[9px] font-bold">
                    Status Celah:
                    <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setStudentPage(1); }} className="bg-transparent outline-none">
                      <option>Semua Status</option><option>Selesai</option><option>Belum Selesai</option>
                    </select>
                  </label>
                </div>

                <StudentTable students={pageStudents} onNotify={notify} />
                <div className="flex flex-col justify-between gap-3 border-t border-[#eae7eb] pt-3 text-[9px] text-[#747687] sm:flex-row sm:items-center">
                  <span>Menampilkan {filteredStudents.length ? (studentPage - 1) * 5 + 1 : 0}–{Math.min(studentPage * 5, filteredStudents.length)} dari {selectedCourse.students} mahasiswa terdaftar</span>
                  <div className="flex items-center gap-1">
                    <button type="button" disabled={studentPage === 1} onClick={() => setStudentPage((page) => Math.max(1, page - 1))} className="rounded-md px-2 py-1 disabled:opacity-40">Sebelumnya</button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                      <button key={page} type="button" onClick={() => setStudentPage(page)} aria-current={page === studentPage ? 'page' : undefined} className={`h-7 min-w-7 rounded-md px-2 ${page === studentPage ? 'bg-[#0038d1] text-white' : 'bg-[#f6f2f7]'}`}>{page}</button>
                    ))}
                    <button type="button" disabled={studentPage === pageCount} onClick={() => setStudentPage((page) => Math.min(pageCount, page + 1))} className="rounded-md px-2 py-1 disabled:opacity-40">Selanjutnya</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={addCourse} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-serif text-xl font-bold">Tambah Mata Kuliah Baru</h2>
            <label className="mt-4 block text-xs font-bold">Nama mata kuliah
              <input required value={newCourseTitle} onChange={(event) => setNewCourseTitle(event.target.value)} className="mt-1 w-full rounded-lg border border-[#eae7eb] px-3 py-2 text-sm outline-none focus:border-[#0038d1]" />
            </label>
            <label className="mt-3 block text-xs font-bold">Kode mata kuliah
              <input required value={newCourseCode} onChange={(event) => setNewCourseCode(event.target.value)} className="mt-1 w-full rounded-lg border border-[#eae7eb] px-3 py-2 text-sm outline-none focus:border-[#0038d1]" />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddCourseOpen(false)} className="rounded-lg px-4 py-2 text-xs font-bold">Batal</button>
              <button type="submit" className="rounded-lg bg-[#0038d1] px-4 py-2 text-xs font-bold text-white">Simpan Mata Kuliah</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

function SummaryMetric({ icon, title, value, detail, danger = false }: { icon: CourseAssetName; title: string; value: string; detail?: string; danger?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-[#f6f2f7] p-2">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm"><CourseAsset name={icon} /></span>
      <span className="min-w-0">
        <span className="block text-[8px] font-bold text-[#747687]">{title}</span>
        <span className={`font-serif text-lg font-bold leading-6 ${danger ? 'text-[#b61722]' : ''}`}>{value}</span>
        {detail && <span className="ml-1 text-[8px] text-[#747687]">{detail}</span>}
      </span>
    </div>
  );
}

function StudentTable({ students, onNotify }: { students: Student[]; onNotify: (message: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#f0edf1]">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead className="bg-[#f6f2f7] text-[8px] font-bold uppercase tracking-[0.5px] text-[#444655]">
          <tr>
            <th className="px-3 py-3">Mahasiswa &amp; NIM</th>
            <th className="px-3 py-3">Kehadiran Asesmen</th>
            <th className="px-3 py-3">Skor Kognitif</th>
            <th className="px-3 py-3">Topologi Dominan</th>
            <th className="px-3 py-3">Celah Pengetahuan</th>
            <th className="px-3 py-3 text-right">Aksi Analisis</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.nim} className="border-t border-[#f0edf1] text-[9px]">
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: student.tone }}>{student.initials}</span>
                  <span className="min-w-0">
                    <strong className="block truncate text-[10px]">{student.name}</strong>
                    <span className="text-[8px] text-[#747687]">{student.nim} • {student.rombel}</span>
                  </span>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className={`h-1.5 w-1.5 rounded-full ${student.status === 'complete' ? 'bg-[#0038d1]' : 'bg-[#b61722]'}`} />{student.attendance}</span>
              </td>
              <td className={`px-3 py-2.5 font-serif text-base font-bold ${student.score >= 85 ? 'text-[#0038d1]' : student.score < 70 ? 'text-[#b61722]' : ''}`}>{student.score.toFixed(1)} <span className="font-sans text-[8px] font-normal text-[#747687]">/100</span></td>
              <td className="px-3 py-2.5"><span className="whitespace-nowrap rounded-full bg-[#dee1ff] px-2 py-1 text-[8px] font-bold text-[#001257]">● {student.topology}</span></td>
              <td className="px-3 py-2.5">
                <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[8px] font-bold ${student.gap === 'Perlu Bimbingan' ? 'bg-[#ffdad7] text-[#410004]' : student.gap.startsWith('Paham') ? 'bg-[#ffddb8] text-[#2a1700]' : 'bg-[#f0edf1]'}`}>
                  {student.gap === 'Komprehensif' ? <CourseAsset name="insight" /> : student.gap === 'Perlu Bimbingan' ? <CourseAsset name="participantAction" /> : <CourseAsset name="groupAction" />}
                  {student.gap}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex justify-end gap-1">
                  <button type="button" aria-label={`Lihat peta ${student.name}`} onClick={() => onNotify(`Peta konsep ${student.name} tersedia dari halaman analisis.`)} className="rounded-md p-1.5 text-[#0038d1] hover:bg-[#f6f2f7]"><CourseAsset name="mapAction" /></button>
                  <button type="button" aria-label={`Lihat analisis ${student.name}`} onClick={() => onNotify(`Analisis kognitif ${student.name} tersedia pada halaman Analytics.`)} className="rounded-md p-1.5 text-[#747687] hover:bg-[#f6f2f7]"><CourseAsset name="assessmentAction" /></button>
                </div>
              </td>
            </tr>
          ))}
          {students.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-[#747687]">Tidak ada mahasiswa yang sesuai dengan filter.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
