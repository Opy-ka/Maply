'use client';

import React from 'react';
import { Network, Sparkles, BookOpen, Layers, BarChart3, GraduationCap, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'onboarding' | 'teacher' | 'student' | 'analytics';

interface NavbarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2] border-b-2 border-[#1B1B1E] px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('onboarding')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0038D1] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] flex items-center justify-center text-white group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_#1B1B1E] transition-all">
              <Network className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-serif tracking-tight text-[#1B1B1E]">
                  Maply
                </span>
                <span className="px-1.5 py-0.2 rounded-sm bg-[#FFEAA7] border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] uppercase tracking-wider">
                  KIT-BUILD V2.4
                </span>
              </div>
              <p className="text-[10px] font-semibold text-[#444655] tracking-wide uppercase">
                Cognitive Lab &bull; FILKOM UB
              </p>
            </div>
          </button>
        </div>

        {/* Neo-Brutalist Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#1B1B1E] rounded-full shadow-[2px_2px_0px_#1B1B1E] overflow-x-auto max-w-full">
          <button
            onClick={() => onTabChange('onboarding')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              currentTab === 'onboarding'
                ? 'bg-[#2F54EB] text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                : 'text-[#1B1B1E] hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="text-[9px]">●</span>
            <span>Onboarding & Tour</span>
          </button>

          <button
            onClick={() => onTabChange('teacher')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              currentTab === 'teacher'
                ? 'bg-[#2F54EB] text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                : 'text-[#1B1B1E] hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="text-[9px]">▲</span>
            <span>AI Map Builder (Dosen)</span>
          </button>

          <button
            onClick={() => onTabChange('student')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              currentTab === 'student'
                ? 'bg-[#2F54EB] text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                : 'text-[#1B1B1E] hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="text-[9px]">■</span>
            <span>Student Workspace</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              currentTab === 'analytics'
                ? 'bg-[#2F54EB] text-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                : 'text-[#1B1B1E] hover:bg-[#FAF7F2]'
            }`}
          >
            <span className="text-[9px]">◆</span>
            <span>Class Analytics & Gaps</span>
          </button>
        </nav>

        {/* Right Status Ribbon */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4EA] border border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10px] font-bold text-[#059669]">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span>MODE EKSPLORASI</span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-white border border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-[10px] font-bold text-[#1B1B1E]">
            ICONFEST 2026 Ready
          </div>
        </div>
      </div>
    </header>
  );
};
