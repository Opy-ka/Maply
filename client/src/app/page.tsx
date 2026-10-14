'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { OnboardingView } from '../components/OnboardingView';
import { StudentView } from '../components/StudentView';
import { TeacherView } from '../components/TeacherView';
import { AnalyticsView } from '../components/AnalyticsView';
import { EvaluationModal } from '../components/EvaluationModal';
import {
  checkBackendHealth,
  fetchMasterMap,
  fetchAssessment,
  fetchAssessmentKit,
  fetchClassAnalytics,
  saveMasterMap,
  updateAssessment,
  INITIAL_MASTER_MAP,
  INITIAL_ASSESSMENT
} from '../lib/api';
import { MasterConceptMap, AssessmentConfig, ConceptKit, EvaluationResult, ClassKnowledgeGapSummary } from '../types/maply';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('onboarding');
  const [masterMap, setMasterMap] = useState<MasterConceptMap>(INITIAL_MASTER_MAP);
  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>(INITIAL_ASSESSMENT);
  const [kit, setKit] = useState<ConceptKit | null>(null);
  const [kitVersion, setKitVersion] = useState(0);
  const [mapVersion, setMapVersion] = useState(0);
  const [analytics, setAnalytics] = useState<ClassKnowledgeGapSummary | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshKitAndAnalytics = useCallback(async (asmId: string) => {
    const [kitData, analyticsData] = await Promise.all([
      fetchAssessmentKit(asmId),
      fetchClassAnalytics(asmId)
    ]);
    setKit(kitData);
    setKitVersion((v) => v + 1);
    setAnalytics(analyticsData);
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const online = await checkBackendHealth();
        setBackendOnline(online);

        const asm = await fetchAssessment(INITIAL_ASSESSMENT.id);
        const mapData = await fetchMasterMap(asm.master_map_id);
        setAssessmentConfig(asm);
        setMasterMap(mapData);
        await refreshKitAndAnalytics(asm.id);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [refreshKitAndAnalytics]);

  /** Persists the master map to the backend so student grading uses it. Throws on failure. */
  const handleSaveMasterMap = async (newMap: MasterConceptMap) => {
    if (backendOnline) {
      const saved = await saveMasterMap(newMap);
      setMasterMap(saved);
      setMapVersion((v) => v + 1);
      await refreshKitAndAnalytics(assessmentConfig.id);
      return;
    }

    // Offline demo mode: keep everything client-side
    setMasterMap(newMap);
    setMapVersion((v) => v + 1);
    setKit({
      assessment_id: assessmentConfig.id,
      concepts: [...newMap.nodes].sort(() => Math.random() - 0.5),
      available_relationships: Array.from(new Set(newMap.edges.map((e) => e.label)))
    });
    setKitVersion((v) => v + 1);
  };

  const handleSaveAssessment = async (config: AssessmentConfig) => {
    if (backendOnline) {
      const saved = await updateAssessment(config);
      setAssessmentConfig(saved);
      return;
    }
    setAssessmentConfig(config);
  };

  const handleEvaluationComplete = async (res: EvaluationResult) => {
    setEvaluationResult(res);
    if (backendOnline) {
      setAnalytics(await fetchClassAnalytics(assessmentConfig.id));
    }
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
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} backendOnline={backendOnline} />

      <div className="flex-1">
        {currentTab === 'onboarding' && <OnboardingView onNavigate={(tab) => setCurrentTab(tab)} />}

        {currentTab === 'student' && (
          <StudentView key={`kit-${kitVersion}`} kit={kit} onEvaluationComplete={handleEvaluationComplete} />
        )}

        {currentTab === 'teacher' && (
          <TeacherView
            key={`map-${mapVersion}`}
            masterMap={masterMap}
            assessmentConfig={assessmentConfig}
            backendOnline={backendOnline}
            onSaveMasterMap={handleSaveMasterMap}
            onSaveAssessment={handleSaveAssessment}
          />
        )}

        {currentTab === 'analytics' && <AnalyticsView analytics={analytics} />}
      </div>

      <EvaluationModal result={evaluationResult} onClose={() => setEvaluationResult(null)} />
    </main>
  );
}
