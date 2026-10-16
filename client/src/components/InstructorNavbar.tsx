'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Menu, X, GraduationCap, BookOpen, Network, FileCheck, BarChart3, LogOut, Check, Sparkles } from 'lucide-react';

export type InstructorNavItem = 'Dashboard' | 'Courses' | 'Maps' | 'Assessments' | 'Analytics';

interface InstructorNavbarProps {
  activeItem: InstructorNavItem;
  onNavigate: (item: InstructorNavItem) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: InstructorNavItem; label: string }[] = [
  { id: 'Dashboard', label: 'Dashboard' },
  { id: 'Courses', label: 'My Courses' },
  { id: 'Maps', label: 'Concept Maps' },
  { id: 'Assessments', label: 'Assessments' },
  { id: 'Analytics', label: 'Analytics' }
];

interface CourseOption {
  code: string;
  title: string;
  faculty: string;
  rombels: string;
  color: string;
}

const COURSE_OPTIONS: CourseOption[] = [
  {
    code: 'TIF-2101',
    title: 'Arsitektur Komputer',
    faculty: 'FILKOM UB',
    rombels: 'Kelas A & B',
    color: '#0038D1'
  },
  {
    code: 'TIF-2202',
    title: 'Sistem Operasi',
    faculty: 'FILKOM UB',
    rombels: 'Kelas C',
    color: '#D97706'
  },
  {
    code: 'CSP-2103',
    title: 'Algoritma & Pemrograman II',
    faculty: 'FILKOM UB',
    rombels: 'Kelas E',
    color: '#2563EB'
  },
  {
    code: 'TIF-2304',
    title: 'Jaringan Komputer',
    faculty: 'FILKOM UB',
    rombels: 'Kelas B',
    color: '#059669'
  }
];

export const InstructorNavbar: React.FC<InstructorNavbarProps> = ({
  activeItem,
  onNavigate,
  onLogout
}) => {
  const [selectedCourse, setSelectedCourse] = useState(COURSE_OPTIONS[0]);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Profile menu outside click ref
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

  // Course dropdown outside click ref
  const courseMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (courseMenuRef.current && !courseMenuRef.current.contains(e.target as Node)) {
        setIsCourseMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================================================================
  // HOVER & ACTIVE SLIDING PILL INDICATOR MECHANISM (Matching Student Navbar)
  // =========================================================================
  const [hoveredNavTab, setHoveredNavTab] = useState<InstructorNavItem | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<{ [key in InstructorNavItem]?: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
    borderRadius: string;
  }>({
    left: -4,
    width: 0,
    opacity: 0,
    borderRadius: '0 9999px 9999px 0',
  });

  const activeTabKey = hoveredNavTab ?? activeItem;

  const updateIndicator = useCallback((targetKey: InstructorNavItem) => {
    const navEl = navRef.current;
    const targetEl = tabRefs.current[targetKey];
    if (navEl && targetEl) {
      const navRect = navEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const isFirst = targetKey === NAV_ITEMS[0].id;
      const isLast = targetKey === NAV_ITEMS[NAV_ITEMS.length - 1].id;

      let left = targetRect.left - navRect.left;
      let width = targetRect.width;
      let borderRadius = '9999px';

      if (isFirst) {
        // Bleed past left border for zero-gap fit against container's rounded cap
        left = -4;
        width = targetRect.right - navRect.left + 4;
        borderRadius = '0 9999px 9999px 0';
      } else if (isLast) {
        // Bleed past right border for zero-gap fit against container's rounded cap
        left = targetRect.left - navRect.left;
        width = navRect.right - targetRect.left + 4;
        borderRadius = '9999px 0 0 9999px';
      }

      setIndicatorStyle({
        left,
        width,
        opacity: 1,
        borderRadius,
      });
    }
  }, []);

  useEffect(() => {
    updateIndicator(activeTabKey);
    const handleResize = () => updateIndicator(activeTabKey);
    window.addEventListener('resize', handleResize);
    const raf = requestAnimationFrame(() => updateIndicator(activeTabKey));
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [activeTabKey, updateIndicator, activeItem]);

  const handleTabHover = (tabId: InstructorNavItem) => {
    setHoveredNavTab(tabId);
    updateIndicator(tabId);
  };

  const handleNavLeave = () => {
    setHoveredNavTab(null);
    updateIndicator(activeItem);
  };

  const navigate = (item: InstructorNavItem) => {
    setIsMobileMenuOpen(false);
    onNavigate(item);
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#1B1B1E] bg-[#FAF7F2] shadow-[0_2px_0_rgba(27,27,30,0.08)]">
      <div className="mx-auto flex h-[58px] max-w-[1280px] items-center justify-between gap-2 px-3 sm:px-4">
        {/* Brand & Dosen Badge */}
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('Dashboard')}
            className="flex shrink-0 items-center gap-1.5 text-left cursor-pointer transition-transform hover:-translate-y-px"
            aria-label="Maply dashboard"
          >
            <span className="flex items-center gap-0.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0038D1]" />
              <span className="h-0 w-0 border-b-[9px] border-l-[6px] border-r-[6px] border-b-[#DA3437] border-l-transparent border-r-transparent" />
              <span className="h-2.5 w-2.5 rounded-[1px] bg-[#FFB95F]" />
            </span>
            <span className="font-serif text-[17px] font-black tracking-[-0.45px] text-[#1B1B1E]">Maply</span>
          </button>
          <span className="hidden whitespace-nowrap rounded-full border-2 border-[#1B1B1E] bg-[#EDE8F5] px-2.5 py-0.5 text-[8.5px] font-mono font-bold uppercase leading-none tracking-[0.2px] text-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E] min-[500px]:inline-flex">
            Dosen / Pengajar
          </span>
        </div>

        {/* Center: Sliding Segmented Pill Nav (Exact same height h-[38px], border-2, shadow-[2.5px_2.5px_0px_#1B1B1E] and blue gradient hover as Student) */}
        <div className="flex items-center justify-center">
          <nav
            ref={navRef}
            onMouseLeave={handleNavLeave}
            aria-label="Navigasi utama dosen"
            className="relative hidden min-[900px]:flex items-center h-[38px] bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2.5px_2.5px_0px_#1B1B1E] p-0 overflow-hidden select-none"
          >
            {/* Seamless Blue Sliding Fill (Zero gap on curved ends via negative bleed & dynamic border radius) */}
            <div
              className="absolute -top-[2px] -bottom-[2px] left-0 bg-gradient-to-r from-[#0038D1] to-[#2F54EB] pointer-events-none transition-all duration-250 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                borderRadius: indicatorStyle.borderRadius,
                opacity: indicatorStyle.opacity,
              }}
            />

            {NAV_ITEMS.map((item, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === NAV_ITEMS.length - 1;
              const isHighlighted = activeTabKey === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[item.id] = el;
                  }}
                  type="button"
                  onClick={() => navigate(item.id)}
                  onMouseEnter={() => handleTabHover(item.id)}
                  aria-current={activeItem === item.id ? 'page' : undefined}
                  className={`relative z-10 h-full flex items-center justify-center text-center text-xs whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                    isFirst
                      ? 'pl-5 pr-4 sm:pl-6 sm:pr-4.5'
                      : isLast
                      ? 'pl-4 pr-5 sm:pl-4.5 sm:pr-6'
                      : 'px-4 sm:px-4.5'
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

        {/* Right: Course Selector, Logout, Tactile Profile Pill & Mobile Menu */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Course Selector Dropdown Pill */}
          <div className="relative hidden min-[940px]:block" ref={courseMenuRef}>
            <button
              type="button"
              onClick={() => setIsCourseMenuOpen((open) => !open)}
              aria-expanded={isCourseMenuOpen}
              className="flex h-[38px] max-w-[230px] items-center gap-2 whitespace-nowrap rounded-full border-2 border-[#1B1B1E] bg-white px-3.5 py-1 text-left text-[11px] font-serif font-black tracking-tight text-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:bg-[#FAF7F2] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer select-none"
              title={`${selectedCourse.title} (${selectedCourse.code})`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-[#1B1B1E]"
                style={{ backgroundColor: selectedCourse.color }}
              />
              <span className="truncate max-w-[145px]">{selectedCourse.title}</span>
              <span className="text-[9px] font-mono font-bold text-[#71717A] shrink-0">
                {selectedCourse.code}
              </span>
              <ChevronDown
                className={`h-3 w-3 shrink-0 text-[#1B1B1E] transition-transform duration-150 ${
                  isCourseMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCourseMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-84 overflow-hidden rounded-2xl border-2 border-[#1B1B1E] bg-white p-2 shadow-[5px_5px_0px_#1B1B1E] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header label */}
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b-2 border-[#1B1B1E]/10 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#0038D1]" />
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
                      Pilih Mata Kuliah Aktif
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#1B1B1E]/20 text-[#1B1B1E]">
                    {COURSE_OPTIONS.length} Matkul
                  </span>
                </div>

                {/* Course List Options */}
                <div className="space-y-1">
                  {COURSE_OPTIONS.map((course) => {
                    const isSelected = selectedCourse.code === course.code;
                    return (
                      <button
                        key={course.code}
                        type="button"
                        onClick={() => {
                          setSelectedCourse(course);
                          setIsCourseMenuOpen(false);
                        }}
                        className={`group w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EEF2FF] border-2 border-[#0038D1] shadow-[2px_2px_0px_#0038D1]'
                            : 'hover:bg-[#FAF7F2] border-2 border-transparent hover:border-[#1B1B1E]/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span
                            className="h-3 w-3 shrink-0 rounded-full border border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E]"
                            style={{ backgroundColor: course.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`truncate text-xs font-serif font-black ${
                                  isSelected ? 'text-[#0038D1]' : 'text-[#1B1B1E]'
                                }`}
                              >
                                {course.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono font-bold text-[#71717A]">
                                {course.code}
                              </span>
                              <span className="text-[9.5px] font-serif text-[#9CA3AF]">&bull;</span>
                              <span className="text-[10px] font-serif font-bold text-[#555]">
                                {course.rombels}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0038D1] text-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#1B1B1E]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border-2 border-[#1B1B1E] bg-[#DA3437] px-3 py-1.5 text-[10px] font-serif font-black text-white shadow-[2px_2px_0px_#1B1B1E] transition-transform hover:-translate-y-px cursor-pointer"
          >
            Logout
          </button>

          {/* Tactile Profile Pill (Standardized h-[38px], border-2, shadow-[2px_2px_0px_#1B1B1E] matching Student) */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-[38px] flex items-center gap-2.5 pl-1.5 pr-3.5 rounded-full bg-white hover:bg-slate-50 border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer select-none"
              title="Profil Dr. Eng. Herman Tolle"
            >
              <div className="w-7 h-7 rounded-full bg-[#FFDDB8] text-[#2A1700] flex items-center justify-center font-serif font-black text-xs border border-[#1B1B1E]">
                HT
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-[#1B1B1E]">Dr. Eng. Herman Tolle</span>
                <span className="text-[9.5px] font-mono text-[#71717A]">Dosen &bull; FILKOM UB</span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-[#1B1B1E] rounded-2xl shadow-[5px_5px_0px_#1B1B1E] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header Profile Card */}
                <div className="flex items-center gap-3 pb-3 border-b-2 border-[#1B1B1E]/10">
                  <div className="w-10 h-10 rounded-full bg-[#FFDDB8] text-[#2A1700] flex items-center justify-center font-serif font-black text-sm border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]">
                    HT
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-serif font-black text-[#1B1B1E] truncate leading-tight">
                      Dr. Eng. Herman Tolle, S.T., M.T.
                    </p>
                    <p className="text-[10px] font-mono text-[#555] font-semibold mt-0.5">
                      NIP: 198005122005011002
                    </p>
                    <span className="inline-block px-1.5 py-0.2 rounded bg-[#FFE3C8] border border-[#FFB95F] text-[9px] font-mono font-bold text-[#6D4400] mt-1">
                      Dosen Pengampu &bull; FILKOM UB
                    </span>
                  </div>
                </div>

                {/* Navigation Links inside Menu */}
                <div className="py-2.5 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('Dashboard');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF7F2] font-serif font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#0038D1]" />
                    <span>Dashboard Pengajar</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('Courses');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF7F2] font-serif font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#0038D1]" />
                    <span>Daftar Mata Kuliah</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('Maps');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF7F2] font-serif font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5 text-[#0038D1]" />
                    <span>Concept Maps Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('Assessments');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF7F2] font-serif font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#0038D1]" />
                    <span>Manajemen Asesmen</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('Analytics');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF7F2] font-serif font-bold text-[#1B1B1E] flex items-center gap-2 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#0038D1]" />
                    <span>Class Analytics & Gaps</span>
                  </button>
                </div>

                {/* Logout Divider & Button */}
                <div className="pt-2 border-t border-[#1B1B1E]/10">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] font-serif font-black text-xs text-[#DC2626] flex items-center gap-2 border border-[#FCA5A5] cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar dari Akun Dosen</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger Button */}
          <button
            type="button"
            className="min-[900px]:hidden h-[38px] w-[38px] flex items-center justify-center rounded-full bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] cursor-pointer"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={isMobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation for Instructor */}
      {isMobileMenuOpen && (
        <nav
          aria-label="Navigasi utama dosen"
          className="absolute left-0 right-0 top-full z-50 border-b-2 border-[#1B1B1E] bg-[#FAF7F2] px-3 py-2 shadow-[0_4px_10px_rgba(27,27,30,0.08)] min-[900px]:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-serif font-bold transition-colors ${
                  activeItem === item.id ? 'bg-[#0038D1] text-white' : 'text-[#444655] hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
