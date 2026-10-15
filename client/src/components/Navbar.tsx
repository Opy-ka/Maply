'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Network, User, CheckCircle2, LogIn } from 'lucide-react';

export type ActiveTab = 'onboarding' | 'teacher' | 'student' | 'analytics';

interface NavbarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  backendOnline?: boolean;
  onOpenAuthModal?: (role?: 'student' | 'teacher') => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'onboarding', label: 'Onboarding & Tour' },
  { id: 'teacher', label: 'AI Map Builder (Dosen)' },
  { id: 'student', label: 'Student Workspace' },
  { id: 'analytics', label: 'Class Analytics & Gaps' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  backendOnline = false,
  onOpenAuthModal
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<ActiveTab | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<{ [key in ActiveTab]?: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const activeTabKey = hoveredTab ?? currentTab;

  const updateIndicatorForTab = useCallback((targetKey: ActiveTab) => {
    const navEl = navRef.current;
    const targetEl = tabRefs.current[targetKey];
    if (navEl && targetEl) {
      const navRect = navEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const isFirst = targetKey === NAV_ITEMS[0].id;
      const isLast = targetKey === NAV_ITEMS[NAV_ITEMS.length - 1].id;

      let left = targetRect.left - navRect.left;
      let width = targetRect.width;

      if (isFirst) {
        width += left;
        left = 0;
      } else if (isLast) {
        width = navRect.right - targetRect.left;
      }

      setIndicatorStyle({
        left,
        width,
        opacity: 1,
      });
    }
  }, []);

  useEffect(() => {
    updateIndicatorForTab(activeTabKey);
  }, [activeTabKey, updateIndicatorForTab]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabHover = (tabId: ActiveTab) => {
    setHoveredTab(tabId);
    updateIndicatorForTab(tabId);
  };

  const handleNavLeave = () => {
    setHoveredTab(null);
    updateIndicatorForTab(currentTab);
  };

  const roleNavRef = useRef<HTMLDivElement>(null);
  const roleRefs = useRef<{ teacher: HTMLButtonElement | null; student: HTMLButtonElement | null }>({
    teacher: null,
    student: null,
  });
  const [rolePillStyle, setRolePillStyle] = useState({ left: 4, width: 68, opacity: 1 });

  // Role toggle state: Dosen is active on teacher & analytics, Mahasiswa is active on student
  const isDosenActive = currentTab === 'teacher' || currentTab === 'analytics';
  const isMahasiswaActive = currentTab === 'student';

  const activeRoleKey: 'teacher' | 'student' = isMahasiswaActive ? 'student' : 'teacher';

  const updateRoleIndicator = useCallback(() => {
    const container = roleNavRef.current;
    const target = roleRefs.current[activeRoleKey];
    if (container && target) {
      const cRect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      setRolePillStyle({
        left: tRect.left - cRect.left,
        width: tRect.width,
        opacity: 1,
      });
    }
  }, [activeRoleKey]);

  useEffect(() => {
    updateRoleIndicator();
    const handleResize = () => updateRoleIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateRoleIndicator]);

  const isHomeSection = currentTab === 'onboarding';
  const isThickBorder = !isHomeSection || isScrolled;

  return (
    <header
      className={`sticky top-0 z-50 px-3 sm:px-6 py-2.5 transition-all duration-300 backdrop-blur-md ${
        isThickBorder
          ? 'border-b-2 border-[#1B1B1E] bg-[#FAF7F2]/90 shadow-[0_2px_10px_rgba(27,27,30,0.06)]'
          : 'border-b border-[#1B1B1E]/20 bg-[#FAF7F2]/75'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 lg:gap-4 w-full">
        {/* Brand (Matches Figma #52:7718 with 3 geometric shapes + Kit-Build Core pill) */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => onTabChange('onboarding')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
          >
            {/* Tactile 3-shape Logo Box (Figma #52:7718) */}
            <div className="h-[38px] px-2.5 bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] rounded-xl flex items-center gap-1.5 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-all">
              {/* Shape 1: Blue circle with pupil */}
              <div className="w-5 h-5 rounded-full bg-[#0038D1] border border-[#1B1B1E] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
              {/* Shape 2: Red trapezoid */}
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <polygon points="6,2 14,2 19,17 1,17" fill="#B61722" stroke="#1B1B1E" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {/* Shape 3: Peach square with two eye dots */}
              <div className="w-4 h-4 rounded-xs bg-[#FFB95F] border border-[#1B1B1E] flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-[#1B1B1E]"></span>
                <span className="w-1 h-1 rounded-full bg-[#1B1B1E]"></span>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-[#1B1B1E] group-hover:text-[#0038D1] transition-colors leading-none">
                  Maply
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#DEE1FF] text-[#0038D1] border border-[#1B1B1E] text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_#1B1B1E]">
                  Kit-Build Core
                </span>
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] font-mono font-black tracking-widest text-[#444655] uppercase mt-0.5">
                PLATFORM ASESMEN GRAF KOGNITIF KIT-BUILD
              </span>
            </div>
          </button>
        </div>

        {/* When on Home / Onboarding (sebelum login): show dedicated pre-login header controls */}
        {isHomeSection ? (
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Masuk / Login Button */}
            <button
              onClick={() => onOpenAuthModal ? onOpenAuthModal('student') : onTabChange('student')}
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
        ) : (
          /* When in workspace mode: show middle tabs and session controls */
          <>
            {/* Navigation Tabs Bar (Outer pill container with seamless borderless blue sliding fill) */}
            <nav
              ref={navRef}
              onMouseLeave={handleNavLeave}
              className="relative hidden md:flex items-center h-[38px] bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2.5px_2.5px_0px_#1B1B1E] p-0 overflow-hidden select-none max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* Seamless Blue Sliding Fill */}
              <div
                className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#0038D1] to-[#2F54EB] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {NAV_ITEMS.map((item, idx) => {
                const isHighlighted = activeTabKey === item.id;
                const isFirst = idx === 0;
                const isLast = idx === NAV_ITEMS.length - 1;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      tabRefs.current[item.id] = el;
                    }}
                    onClick={() => onTabChange(item.id)}
                    onMouseEnter={() => handleTabHover(item.id)}
                    className={`relative z-10 h-full flex items-center text-xs whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                      isFirst ? 'pl-5 pr-4' : isLast ? 'pl-4 pr-5' : 'px-4'
                    } ${
                      isHighlighted ? 'text-white font-black' : 'text-[#444655] hover:text-[#1B1B1E] font-bold'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Status & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Peach Live Room Badge */}
              <div
                className="h-[38px] flex items-center gap-2.5 px-3.5 rounded-full bg-[#FFE3C8] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] select-none cursor-default"
                title={backendOnline ? 'FILKOM UB Live Room — Backend Online (port 8000)' : 'FILKOM UB Live Room — Offline Demo Mode'}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    backendOnline ? 'bg-[#059669] animate-pulse' : 'bg-[#874112]'
                  }`}
                />
                <div className="flex flex-col text-left leading-[1.05]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1B1B1E] font-serif">
                    FILKOM UB • LIVE
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1B1B1E] font-serif">
                    ROOM
                  </span>
                </div>
              </div>

              {/* Dosen / Mahasiswa Role Toggle */}
              <div
                ref={roleNavRef}
                className="relative h-[38px] flex items-center p-1 rounded-full bg-[#EDE8F5] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] select-none"
              >
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-white border-2 border-[#1B1B1E] shadow-[1px_1px_0px_#1B1B1E] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none z-0"
                  style={{
                    transform: `translateX(${rolePillStyle.left - 4}px)`,
                    width: `${rolePillStyle.width}px`,
                    opacity: rolePillStyle.opacity,
                  }}
                />

                <button
                  type="button"
                  ref={(el) => {
                    roleRefs.current.teacher = el;
                  }}
                  onClick={() => onTabChange('teacher')}
                  className={`relative z-10 px-3.5 sm:px-4 py-1 text-xs sm:text-sm font-serif font-black transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                    isDosenActive ? 'text-[#1B1B1E]' : 'text-[#504E5C] hover:text-[#1B1B1E]'
                  }`}
                >
                  Dosen
                </button>
                <button
                  type="button"
                  ref={(el) => {
                    roleRefs.current.student = el;
                  }}
                  onClick={() => onTabChange('student')}
                  className={`relative z-10 px-3.5 sm:px-4 py-1 text-xs sm:text-sm font-serif font-black transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                    isMahasiswaActive ? 'text-[#1B1B1E]' : 'text-[#504E5C] hover:text-[#1B1B1E]'
                  }`}
                >
                  Mahasiswa
                </button>
              </div>

              {/* User Profile Avatar Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-[38px] h-[38px] rounded-full bg-[#0047FF] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-white cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#1B1B1E] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1B1B1E] transition-all"
                  title="Akun Pengguna FILKOM UB"
                >
                  <User className="w-4 h-4 stroke-[2.5]" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-[#1B1B1E] rounded-xl shadow-[4px_4px_0px_#1B1B1E] p-3 z-50">
                    <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#1B1B1E]/15">
                      <div className="w-8 h-8 rounded-full bg-[#0047FF] text-white flex items-center justify-center font-bold text-xs border border-[#1B1B1E]">
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
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenAuthModal) onOpenAuthModal('teacher');
                        }}
                        className="w-full text-left font-bold text-[11px] text-[#B61722] hover:underline pt-1"
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
