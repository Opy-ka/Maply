'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { OnboardingView } from '../components/OnboardingView';
import { StudentView } from '../components/StudentView';
import { TeacherView } from '../components/TeacherView';
import { AnalyticsView } from '../components/AnalyticsView';
import { EvaluationModal } from '../components/EvaluationModal';
import {
  fetchMasterMap,
  fetchAssessmentKit,
  fetchClassAnalytics,
  INITIAL_MASTER_MAP,
  INITIAL_ASSESSMENT
} from '../lib/api';
import { MasterConceptMap, AssessmentConfig, ConceptKit, EvaluationResult, ClassKnowledgeGapSummary } from '../types/maply';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('onboarding');
  const [masterMap, setMasterMap] = useState<MasterConceptMap>(INITIAL_MASTER_MAP);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(INITIAL_ASSESSMENT);
  const [kit, setKit] = useState<ConceptKit | null>(null);
  const [analytics, setAnalytics] = useState<ClassKnowledgeGapSummary | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [mapData, kitData, analyticsData] = await Promise.all([
          fetchMasterMap(),
          fetchAssessmentKit(),
          fetchClassAnalytics()
        ]);
        setMasterMap(mapData);
        setKit(kitData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleUpdateMasterMap = (newMap: MasterConceptMap) => {
    setMasterMap(newMap);
    setKit({
      assessment_id: assessmentConfig.id,
      concepts: [...newMap.nodes].sort(() => Math.random() - 0.5),
      available_relationships: Array.from(new Set(newMap.edges.map((e) => e.label)))
    });
  };

  if (isLoading || !kit || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E]">
          <div className="w-8 h-8 border-4 border-[#1B1B1E] border-t-[#0038D1] rounded-full animate-spin"></div>
          <span className="text-xs font-black uppercase text-[#1B1B1E] tracking-wider">
            Memuat Maply Cognitive Lab...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F2] font-sans text-[#1B1B1E]">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      <div className="flex-1">
        {currentTab === 'onboarding' && (
          <OnboardingView onNavigate={(tab) => setCurrentTab(tab)} />
        )}

        {currentTab === 'student' && (
          <StudentView kit={kit} onEvaluationComplete={(res) => setEvaluationResult(res)} />
        )}

        {currentTab === 'teacher' && (
          <TeacherView
            masterMap={masterMap}
            assessmentConfig={assessmentConfig}
            onUpdateMasterMap={handleUpdateMasterMap}
          />
        )}

        {currentTab === 'analytics' && <AnalyticsView analytics={analytics} />}
      </div>

      <EvaluationModal result={evaluationResult} onClose={() => setEvaluationResult(null)} />
    </main>
  );
}
