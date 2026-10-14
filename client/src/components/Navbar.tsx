'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Network, User, CheckCircle2 } from 'lucide-react';

export type ActiveTab = 'onboarding' | 'teacher' | 'student' | 'analytics';

interface NavbarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  backendOnline?: boolean;
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

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, backendOnline = false }) => {
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
    const handleResize = () => updateIndicatorForTab(activeTabKey);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTabKey, updateIndicatorForTab]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
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
  const showBorder = !isHomeSection || isScrolled;

  return (
    <header
      className={`sticky top-0 z-50 px-3 sm:px-6 py-2.5 transition-all duration-300 backdrop-blur-md ${
        showBorder
          ? 'border-b-2 border-[#1B1B1E] bg-[#FAF7F2]/85 shadow-[0_2px_10px_rgba(27,27,30,0.04)]'
          : 'border-b-2 border-transparent bg-[#FAF7F2]/65'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 lg:gap-4 w-full">
        {/* Brand */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => onTabChange('onboarding')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#0038D1] to-[#2F54EB] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] flex items-center justify-center text-white group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3.5px_3.5px_0px_#1B1B1E] transition-all">
              <Network className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl sm:text-2xl font-black font-serif tracking-tight text-[#1B1B1E] group-hover:text-[#0038D1] transition-colors flex items-baseline">
              Maply<span className="text-[#0038D1] text-2xl sm:text-3xl leading-none ml-0.5">.</span>
            </span>
          </button>
        </div>

        {/* Navigation Tabs Bar (Outer pill container with seamless borderless blue sliding fill) */}
        <nav
          ref={navRef}
          onMouseLeave={handleNavLeave}
          className="relative flex items-center h-[38px] bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2.5px_2.5px_0px_#1B1B1E] p-0 overflow-hidden select-none max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Seamless Blue Sliding Fill (No inner border, fills completely without gaps) */}
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

        {/* Right Status & Controls (FILKOM UB Live Room, Role Switch, User Profile) */}
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

          {/* Dosen / Mahasiswa Role Toggle (Matched to reference image with sliding white capsule pill & 2px black border) */}
          <div
            ref={roleNavRef}
            className="relative h-[38px] flex items-center p-1 rounded-full bg-[#EDE8F5] border-2 border-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] select-none"
          >
            {/* Sliding White Capsule Pill with 2px Black Border */}
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
                isDosenActive
                  ? 'text-[#1B1B1E]'
                  : 'text-[#504E5C] hover:text-[#1B1B1E]'
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
                isMahasiswaActive
                  ? 'text-[#1B1B1E]'
                  : 'text-[#504E5C] hover:text-[#1B1B1E]'
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

            {/* Profile Popup */}
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

                <div className="mt-2.5 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between py-1 px-2 rounded-md bg-[#FAF7F2] border border-[#1B1B1E]/10">
                    <span className="text-neutral-600">Status Server:</span>
                    <span className="font-bold flex items-center gap-1 text-[#059669]">
                      <CheckCircle2 className="w-3 h-3" />
                      {backendOnline ? 'FastAPI Aktif' : 'Demo Engine'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2 rounded-md bg-[#FAF7F2] border border-[#1B1B1E]/10">
                    <span className="text-neutral-600">Peran Aktif:</span>
                    <span className="font-bold text-[#1B1B1E]">
                      {isDosenActive ? 'Dosen' : isMahasiswaActive ? 'Mahasiswa' : 'Pengamat'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

