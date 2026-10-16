'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  User,
  CheckCircle2,
  LogIn,
  ArrowLeft,
  GraduationCap,
  Layers,
  Award,
  Clock,
  Sparkles,
  LogOut,
  School,
  RotateCcw
} from 'lucide-react';

export type ActiveTab = 'onboarding' | 'teacher' | 'student' | 'analytics';
export type StudentSubView = 'dashboard' | 'assessments' | 'workspace' | 'evaluation';

interface NavbarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  studentSubView?: StudentSubView;
  onStudentSubViewChange?: (subView: StudentSubView) => void;
  backendOnline?: boolean;
  onOpenAuthModal?: (role?: 'student' | 'teacher') => void;
  activeExamToken?: string | null;
  assessmentTitle?: string;
  courseName?: string;
  studentName?: string;
  studentNim?: string;
  onLogout?: () => void;
}

interface StudentNavItem {
  id: 'dashboard' | 'assessments' | 'evaluation';
  label: string;
}

const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'assessments', label: 'My Assessments' },
  { id: 'evaluation', label: 'Results' }
];

interface TeacherNavItem {
  id: ActiveTab;
  label: string;
}

const TEACHER_NAV_ITEMS: TeacherNavItem[] = [
  { id: 'teacher', label: 'AI Map Builder (Dosen)' },
  { id: 'analytics', label: 'Class Analytics & Gaps' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  studentSubView = 'dashboard',
  onStudentSubViewChange,
  backendOnline = false,
  onOpenAuthModal,
  activeExamToken = 'KBT-9428',
  assessmentTitle = 'Arsitektur Komputer & Organisasi Sistem',
  courseName = 'FILKOM UB • Arsitektur Komputer',
  studentName = 'Ahmad Rizky',
  studentNim = '225150201111048',
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close profile dropdown when clicking outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomeSection = currentTab === 'onboarding';
  const isStudentSection = currentTab === 'student';
  const isTeacherSection = currentTab === 'teacher' || currentTab === 'analytics';
  const isThickBorder = !isHomeSection || isScrolled;

  const handleStudentNav = (sub: StudentSubView) => {
    if (onStudentSubViewChange) {
      onStudentSubViewChange(sub);
    }
  };

  const handleLogoutAction = () => {
    setShowProfileMenu(false);
    if (onLogout) {
      onLogout();
    } else {
      onTabChange('onboarding');
    }
  };

  // =========================================================================
  // HOVER & ACTIVE SLIDING PILL INDICATOR MECHANISM FOR STUDENT NAVBAR
  // =========================================================================
  const [hoveredStudentTab, setHoveredStudentTab] = useState<'dashboard' | 'assessments' | 'evaluation' | null>(null);
  const studentNavRef = useRef<HTMLElement>(null);
  const studentTabRefs = useRef<{ [key in 'dashboard' | 'assessments' | 'evaluation']?: HTMLButtonElement | null }>({});
  const [studentIndicatorStyle, setStudentIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
    borderRadius: string;
  }>({
    left: -6,
    width: 0,
    opacity: 0,
    borderRadius: '0 9999px 9999px 0',
  });

  const currentStudentKey: 'dashboard' | 'assessments' | 'evaluation' =
    studentSubView === 'assessments' ? 'assessments' : studentSubView === 'evaluation' ? 'evaluation' : 'dashboard';

  const activeStudentTabKey: 'dashboard' | 'assessments' | 'evaluation' = hoveredStudentTab ?? currentStudentKey;

  const updateStudentIndicator = useCallback((targetKey: 'dashboard' | 'assessments' | 'evaluation') => {
    const navEl = studentNavRef.current;
    const targetEl = studentTabRefs.current[targetKey];
    if (navEl && targetEl) {
      const navRect = navEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const isFirst = targetKey === STUDENT_NAV_ITEMS[0].id;
      const isLast = targetKey === STUDENT_NAV_ITEMS[STUDENT_NAV_ITEMS.length - 1].id;

      let left = targetRect.left - navRect.left;
      let width = targetRect.width;
      let borderRadius = '9999px 9999px 9999px 9999px';

      if (isFirst) {
        // Bleed 6px past left inner border; square left edge so container overflow-hidden clips flush with zero white gap
        width = targetRect.right - navRect.left + 6;
        left = -6;
        borderRadius = '0 9999px 9999px 0';
      } else if (isLast) {
        // Bleed 6px past right inner border; square right edge
        width = navRect.right - targetRect.left + 6;
        borderRadius = '9999px 0 0 9999px';
      }

      setStudentIndicatorStyle({
        left,
        width,
        opacity: 1,
        borderRadius,
      });
    }
  }, []);

  useEffect(() => {
    if (isStudentSection && studentSubView !== 'workspace') {
      updateStudentIndicator(activeStudentTabKey);
      const handleResize = () => updateStudentIndicator(activeStudentTabKey);
      window.addEventListener('resize', handleResize);
      const raf = requestAnimationFrame(() => updateStudentIndicator(activeStudentTabKey));
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(raf);
      };
    }
  }, [activeStudentTabKey, updateStudentIndicator, isStudentSection, studentSubView]);

  const handleStudentTabHover = (tabId: 'dashboard' | 'assessments' | 'evaluation') => {
    setHoveredStudentTab(tabId);
    updateStudentIndicator(tabId);
  };

  const handleStudentNavLeave = () => {
    setHoveredStudentTab(null);
    updateStudentIndicator(currentStudentKey);
  };

  // =========================================================================
  // HOVER & ACTIVE SLIDING PILL INDICATOR MECHANISM FOR TEACHER NAVBAR
  // =========================================================================
  const [hoveredTeacherTab, setHoveredTeacherTab] = useState<ActiveTab | null>(null);
  const teacherNavRef = useRef<HTMLElement>(null);
  const teacherTabRefs = useRef<{ [key in ActiveTab]?: HTMLButtonElement | null }>({});
  const [teacherIndicatorStyle, setTeacherIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
    borderRadius: string;
  }>({
    left: -6,
    width: 0,
    opacity: 0,
    borderRadius: '0 9999px 9999px 0',
  });

  const activeTeacherTabKey = hoveredTeacherTab ?? currentTab;

  const updateTeacherIndicator = useCallback((targetKey: ActiveTab) => {
    const navEl = teacherNavRef.current;
    const targetEl = teacherTabRefs.current[targetKey];
    if (navEl && targetEl) {
      const navRect = navEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const isFirst = targetKey === TEACHER_NAV_ITEMS[0].id;
      const isLast = targetKey === TEACHER_NAV_ITEMS[TEACHER_NAV_ITEMS.length - 1].id;

      let left = targetRect.left - navRect.left;
      let width = targetRect.width;
      let borderRadius = '9999px 9999px 9999px 9999px';

      if (isFirst) {
        width = targetRect.right - navRect.left + 6;
        left = -6;
        borderRadius = '0 9999px 9999px 0';
      } else if (isLast) {
        width = navRect.right - targetRect.left + 6;
        borderRadius = '9999px 0 0 9999px';
      }

      setTeacherIndicatorStyle({
        left,
        width,
        opacity: 1,
        borderRadius,
      });
    }
  }, []);

  useEffect(() => {
    if (isTeacherSection) {
      updateTeacherIndicator(activeTeacherTabKey);
      const handleResize = () => updateTeacherIndicator(activeTeacherTabKey);
      window.addEventListener('resize', handleResize);
      const raf = requestAnimationFrame(() => updateTeacherIndicator(activeTeacherTabKey));
      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(raf);
      };
    }
  }, [activeTeacherTabKey, updateTeacherIndicator, isTeacherSection]);

  const handleTeacherTabHover = (tabId: ActiveTab) => {
    setHoveredTeacherTab(tabId);
    updateTeacherIndicator(tabId);
  };

  const handleTeacherNavLeave = () => {
    setHoveredTeacherTab(null);
    updateTeacherIndicator(currentTab);
  };

  return (
    <header
      className={`sticky top-0 z-50 px-3 sm:px-6 py-2.5 transition-all duration-300 backdrop-blur-md ${
        isThickBorder
          ? 'border-b-2 border-[#1B1B1E] bg-[#FAF7F2]/95 shadow-[0_2px_10px_rgba(27,27,30,0.06)]'
          : 'border-b border-[#1B1B1E]/20 bg-[#FAF7F2]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 lg:gap-4 w-full">
        {/* ========================================================= */}
        {/* BRAND LOGO & KIT-BUILD MAHASISWA BADGE (Figma #57:12538) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (isStudentSection) {
                handleStudentNav('dashboard');
              } else {
                onTabChange('onboarding');
              }
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
            title="Ke Beranda Maply"
          >
            {/* Tactile 3-shape Logo Box (Figma #52:7718) */}
            <div className="h-[38px] px-2.5 bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] rounded-xl flex items-center gap-1.5 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-all">
              {/* Shape 1: Blue circle with pupil */}
              <div className="w-5 h-5 rounded-full bg-[#0038D1] border border-[#1B1B1E] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              {/* Shape 2: Red trapezoid */}
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <polygon
                  points="6,2 14,2 19,17 1,17"
                  fill="#B61722"
                  stroke="#1B1B1E"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Shape 3: Peach square with two eye dots */}
              <div className="w-4 h-4 rounded-xs bg-[#FFB95F] border border-[#1B1B1E] flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#1B1B1E]"></span>
                <span className="w-1 h-1 rounded-full bg-[#1B1B1E]"></span>
              </div>
            </div>

            <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-[#1B1B1E] group-hover:text-[#0038D1] transition-colors leading-none">
              Maply
            </span>
          </button>

          {/* Badge: KIT-BUILD MAHASISWA (Standardized height h-[38px] & border-2) */}
          {isStudentSection && (
            <span className="hidden sm:inline-flex h-[38px] px-3.5 rounded-full bg-[#F0EDF1] border-2 border-[#1B1B1E] text-[10.5px] font-serif font-black uppercase tracking-wider text-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] select-none items-center">
              KIT-BUILD MAHASISWA
            </span>
          )}

          {isTeacherSection && (
            <span className="hidden sm:inline-flex h-[38px] px-3.5 rounded-full bg-[#FFDDB8] text-[#6D4400] border-2 border-[#1B1B1E] text-[10.5px] font-serif font-black uppercase tracking-wider shadow-[2px_2px_0px_#1B1B1E] select-none items-center">
              PORTAL DOSEN
            </span>
          )}
        </div>

        {/* ========================================================= */}
        {/* SCENARIO 1: LANDING PAGE (SEBELUM LOGIN) */}
        {/* ========================================================= */}
        {isHomeSection && (
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Masuk / Login Button */}
            <button
              onClick={() => (onOpenAuthModal ? onOpenAuthModal('student') : onTabChange('student'))}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 text-[#1B1B1E] font-serif font-black text-xs sm:text-sm border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#1B1B1E] stroke-[2.5]" />
              <span>Masuk / Login</span>
            </button>

            {/* Akses: Mahasiswa / Dosen Toggle Pill */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#EAE7EB] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-xs select-none">
              <span className="px-2 text-xs font-serif font-bold text-[#444655]">Akses:</span>
              <button
                type="button"
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('student') : onTabChange('student'))}
                className="px-3.5 py-1 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white font-serif font-black text-xs shadow-[1px_1px_0px_#1B1B1E] cursor-pointer transition-all"
              >
                Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('teacher') : onTabChange('teacher'))}
                className="px-3.5 py-1 rounded-full bg-white hover:bg-slate-50 text-[#1B1B1E] border border-[#1B1B1E] font-serif font-bold text-xs shadow-[1px_1px_0px_#1B1B1E] cursor-pointer transition-all"
              >
                Dosen
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENARIO 2: MAHASISWA SECTION (DASHBOARD, ASSESSMENTS, RESULTS) */}
        {/* ========================================================= */}
        {isStudentSection && (
          <>
            {/* If inside active exam workspace: show focused exam banner with back button */}
            {studentSubView === 'workspace' ? (
              <>
                {/* Center: Exam Context Breadcrumb & Session Banner */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleStudentNav('dashboard')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F0ECE1] text-[#1B1B1E] font-serif font-bold text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                    title="Kembali ke Dashboard Mahasiswa"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>

                  <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-xs">
                    <span className="px-1.5 py-0.2 rounded bg-[#FFEAA7] border border-[#1B1B1E] text-[9.5px] font-mono font-black text-[#8E5900]">
                      UB
                    </span>
                    <span className="font-bold text-[#1B1B1E] max-w-[200px] lg:max-w-xs truncate">
                      {assessmentTitle}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#EEF2FF] border border-[#0038D1] text-[9.5px] font-mono font-black text-[#0038D1]">
                      {activeExamToken || 'KBT-9428'}
                    </span>
                  </div>
                </div>

                {/* Right: Live Exam Status & Student Badge */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10.5px] font-mono font-bold text-[#065F46]"
                    title="Penyimpanan otomatis aktif di background"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Cloud Synced</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-xs font-mono font-black text-[#1B1B1E]">
                    <Clock className="w-3.5 h-3.5 text-[#8E5900]" />
                    <span>24:18 SISA</span>
                  </div>

                  {/* Course Pill */}
                  <span className="hidden xl:inline-block px-3 py-1 rounded-full bg-[#F0EDF1] border border-[#1B1B1E] text-[10px] font-serif font-black uppercase text-[#1B1B1E]">
                    {courseName}
                  </span>

                  {/* Student Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#0038D1] text-white flex items-center justify-center font-serif font-black text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]">
                    AR
                  </div>
                </div>
              </>
            ) : (
              /* If in Dashboard, My Assessments, or Results: 3 perfectly balanced sections with uniform tab sizes */
              <>
                {/* Center: Interactive Sliding Segmented Pill Nav with EQUAL TAB SIZES (Dashboard, My Assessments, Results) */}
                <div className="flex items-center justify-center">
                  <nav
                    ref={studentNavRef}
                    onMouseLeave={handleStudentNavLeave}
                    className="relative flex items-center h-[38px] bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2.5px_2.5px_0px_#1B1B1E] p-0 overflow-hidden select-none"
                  >
                    {/* Seamless Blue Sliding Fill (Zero gap on curved ends via negative bleed & dynamic border radius) */}
                    <div
                      className="absolute -top-[2px] -bottom-[2px] left-0 bg-gradient-to-r from-[#0038D1] to-[#2F54EB] pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
                      style={{
                        transform: `translateX(${studentIndicatorStyle.left}px)`,
                        width: `${studentIndicatorStyle.width}px`,
                        borderRadius: studentIndicatorStyle.borderRadius,
                        opacity: studentIndicatorStyle.opacity,
                      }}
                    />

                    {STUDENT_NAV_ITEMS.map((item, idx) => {
                      const isHighlighted = activeStudentTabKey === item.id;
                      const isFirst = idx === 0;
                      const isLast = idx === STUDENT_NAV_ITEMS.length - 1;
                      return (
                        <button
                          key={item.id}
                          ref={(el) => {
                            studentTabRefs.current[item.id] = el;
                          }}
                          onClick={() => handleStudentNav(item.id)}
                          onMouseEnter={() => handleStudentTabHover(item.id)}
                          className={`relative z-10 h-full w-[105px] sm:w-[130px] flex items-center justify-center text-center text-xs whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                            isFirst ? 'pl-2' : isLast ? 'pr-2' : ''
                          } ${
                            isHighlighted
                              ? 'text-white font-serif font-black tracking-tight'
                              : 'text-[#444655] hover:text-[#1B1B1E] font-serif font-bold'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Right: Course Badge + Tactile Profile Pill & Dropdown (Uniform Height h-[38px]) */}
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                  {/* Course Pill: Standardized h-[38px], border-2, shadow-[2px_2px_0px_#1B1B1E] */}
                  <div className="hidden lg:flex h-[38px] items-center px-3.5 rounded-full bg-[#F0EDF1] border-2 border-[#1B1B1E] text-[10.5px] font-serif font-black uppercase text-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] select-none">
                    <span>{courseName}</span>
                  </div>

                  {/* Tactile Profile Pill: Standardized h-[38px], border-2, shadow-[2px_2px_0px_#1B1B1E] */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="h-[38px] flex items-center gap-2.5 pl-1.5 pr-3.5 rounded-full bg-white hover:bg-slate-50 border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer select-none"
                      title="Profil Mahasiswa"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#0038D1] text-white flex items-center justify-center font-serif font-black text-xs border border-[#1B1B1E]">
                        AR
                      </div>
                      <div className="hidden sm:flex flex-col text-left leading-tight">
                        <span className="text-xs font-bold text-[#1B1B1E]">{studentName}</span>
                        <span className="text-[9.5px] font-mono text-[#71717A]">NIM: {studentNim}</span>
                      </div>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-[#1B1B1E] rounded-2xl shadow-[5px_5px_0px_#1B1B1E] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Header Profile Card */}
                        <div className="flex items-center gap-3 pb-3 border-b-2 border-[#1B1B1E]/10">
                          <div className="w-10 h-10 rounded-full bg-[#0038D1] text-white flex items-center justify-center font-serif font-black text-sm border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]">
                            AR
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-serif font-black text-[#1B1B1E] truncate leading-tight">
                              {studentName}
                            </p>
                            <p className="text-[10px] font-mono text-[#555] font-semibold mt-0.5">
                              NIM: {studentNim}
                            </p>
                            <span className="inline-block px-1.5 py-0.2 rounded bg-[#EEF2FF] border border-[#C7D2FE] text-[9px] font-mono font-bold text-[#0038D1] mt-1">
                              Teknik Informatika &bull; FILKOM UB
                            </span>
                          </div>
                        </div>

                        {/* Navigation Links inside Menu */}
                        <div className="py-2.5 space-y-1 text-xs">
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              handleStudentNav('dashboard');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F6] font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-[#0038D1]" />
                            <span>Dashboard Mahasiswa</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              handleStudentNav('assessments');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F6] font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#0038D1]" />
                            <span>Daftar Asesmen (My Assessments)</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              handleStudentNav('evaluation');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F6] font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>Lihat Riwayat & Nilai (Results)</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              onTabChange('onboarding');
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F4F6] font-medium text-[#4B5563] flex items-center gap-2 cursor-pointer"
                          >
                            <School className="w-3.5 h-3.5 text-[#71717A]" />
                            <span>Halaman Utama Kampus</span>
                          </button>
                        </div>

                        {/* Logout Divider & Button */}
                        <div className="pt-2 border-t border-[#1B1B1E]/10">
                          <button
                            onClick={handleLogoutAction}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] font-serif font-black text-xs text-[#DC2626] flex items-center gap-2 border border-[#FCA5A5] cursor-pointer transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Keluar dari Akun Mahasiswa</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* SCENARIO 3: DOSEN & TEACHER SECTION */}
        {/* ========================================================= */}
        {isTeacherSection && (
          <>
            {/* Teacher Tabs Bar with Sliding Pill */}
            <nav
              ref={teacherNavRef}
              onMouseLeave={handleTeacherNavLeave}
              className="relative hidden md:flex items-center h-[38px] bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2.5px_2.5px_0px_#1B1B1E] p-0 overflow-hidden select-none max-w-full"
            >
              <div
                className="absolute -top-[2px] -bottom-[2px] left-0 bg-[#1B1B1E] pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
                style={{
                  transform: `translateX(${teacherIndicatorStyle.left}px)`,
                  width: `${teacherIndicatorStyle.width}px`,
                  borderRadius: teacherIndicatorStyle.borderRadius,
                  opacity: teacherIndicatorStyle.opacity,
                }}
              />

              {TEACHER_NAV_ITEMS.map((item, idx) => {
                const isHighlighted = activeTeacherTabKey === item.id;
                const isFirst = idx === 0;
                const isLast = idx === TEACHER_NAV_ITEMS.length - 1;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      teacherTabRefs.current[item.id] = el;
                    }}
                    onClick={() => onTabChange(item.id)}
                    onMouseEnter={() => handleTeacherTabHover(item.id)}
                    className={`relative z-10 h-full px-4 flex items-center text-xs whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                      isFirst ? 'pl-5 pr-4' : isLast ? 'pl-4 pr-5' : 'px-4'
                    } ${
                      isHighlighted ? 'text-white font-serif font-black' : 'text-[#504E5C] hover:text-[#1B1B1E] font-serif font-bold'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Status & Controls for Teacher */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Peach Live Room Badge */}
              <div
                className="h-[38px] flex items-center gap-2 px-3 rounded-full bg-[#FFE3C8] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] select-none cursor-default text-[10px] font-black uppercase text-[#1B1B1E] font-serif"
                title={backendOnline ? 'FILKOM UB Live Room — Backend Online (port 8000)' : 'FILKOM UB Live Room — Offline Demo Mode'}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    backendOnline ? 'bg-[#059669] animate-pulse' : 'bg-[#874112]'
                  }`}
                />
                <span>FILKOM UB • LIVE ROOM</span>
              </div>

              {/* Dosen Role Switcher Pill */}
              <div className="flex items-center p-1 rounded-full bg-[#EDE8F5] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-xs">
                <button
                  type="button"
                  onClick={() => onTabChange('teacher')}
                  className="px-3.5 py-1 rounded-full bg-white text-[#1B1B1E] font-serif font-black text-xs shadow-[1px_1px_0px_#1B1B1E] cursor-pointer"
                >
                  Dosen
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('student')}
                  className="px-3 py-1 rounded-full text-[#504E5C] hover:text-[#1B1B1E] font-serif font-bold text-xs cursor-pointer"
                >
                  Mahasiswa
                </button>
              </div>

              {/* Teacher Profile Avatar */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-[38px] h-[38px] rounded-full bg-[#FFDDB8] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-[#2A1700] font-serif font-black text-xs cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                  title="Akun Dosen FILKOM UB"
                >
                  HT
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-[#1B1B1E] rounded-xl shadow-[4px_4px_0px_#1B1B1E] p-3 z-50">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#1B1B1E]/15">
                      <div className="w-8 h-8 rounded-full bg-[#FFDDB8] text-[#2A1700] flex items-center justify-center font-bold text-xs border border-[#1B1B1E]">
                        HT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1B1B1E] leading-tight">Dr. Eng. Herman Tolle</p>
                        <p className="text-[10px] text-neutral-500">Dosen Pengampu • FILKOM UB</p>
                      </div>
                    </div>
                    <div className="pt-2 text-xs text-neutral-700 space-y-1">
                      <p className="font-semibold text-[11px] text-[#0038D1]">Arsitektur Komputer B</p>
                      <button
                        onClick={handleLogoutAction}
                        className="w-full text-left font-bold text-[11px] text-[#B61722] hover:underline pt-1 cursor-pointer"
                      >
                        Ganti Akun / Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
