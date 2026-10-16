'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { OnboardingView } from '../components/OnboardingView';
import { StudentView } from '../components/StudentView';
import { StudentDashboardView } from '../components/StudentDashboardView';
import { StudentAssessmentsView } from '../components/StudentAssessmentsView';
import { StudentEvaluationView } from '../components/StudentEvaluationView';
import { StudentPersonalResultsView } from '../components/StudentPersonalResultsView';
import { TeacherView } from '../components/TeacherView';
import { AnalyticsView } from '../components/AnalyticsView';
import { EvaluationModal } from '../components/EvaluationModal';
import { AuthModal } from '../components/AuthModal';
import { CreateAssessmentWizard } from '../components/CreateAssessmentWizard';
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
  const [studentSubView, setStudentSubView] = useState<'dashboard' | 'assessments' | 'workspace' | 'evaluation'>('dashboard');
  const [inspectedAssessmentId, setInspectedAssessmentId] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'student' | 'teacher'>('student');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeExamToken, setActiveExamToken] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Exam Countdown Timer (synchronized across Navbar & Student Workspace)
  const [examTimeRemaining, setExamTimeRemaining] = useState<number>(2700);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore active user session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('maply_active_session_v1');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed.currentTab) setCurrentTab(parsed.currentTab);
        if (parsed.studentSubView) setStudentSubView(parsed.studentSubView);
        if (parsed.activeExamToken) setActiveExamToken(parsed.activeExamToken);
        if (parsed.inspectedAssessmentId) setInspectedAssessmentId(parsed.inspectedAssessmentId);
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
  }, []);

  // Persist session changes to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          'maply_active_session_v1',
          JSON.stringify({
            currentTab,
            studentSubView,
            activeExamToken,
            inspectedAssessmentId
          })
        );
      } catch (e) {
        console.error('Failed to persist session:', e);
      }
    }
  }, [currentTab, studentSubView, activeExamToken, inspectedAssessmentId, isLoading]);

  // Live Countdown Interval for Active Exam Workspace
  useEffect(() => {
    if (currentTab === 'student' && studentSubView === 'workspace') {
      const interval = setInterval(() => {
        setExamTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            showToast('⚠️ Waktu pengerjaan asesmen telah habis!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTab, studentSubView]);

  const handleOpenAuth = (role: 'student' | 'teacher' = 'student') => {
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const handleEnterExamWithToken = (token: string) => {
    setActiveExamToken(token);
    setCurrentTab('student');
    setStudentSubView('workspace');
    setExamTimeRemaining((assessmentConfig.time_limit_minutes || 45) * 60);
    showToast(`✓ Memulai sesi pengerjaan Kit Map dengan Token ${token}!`);
  };

  const handleLoginSuccess = (role: 'student' | 'teacher', userName: string) => {
    setCurrentTab(role === 'student' ? 'student' : 'teacher');
    if (role === 'student') {
      setStudentSubView('dashboard');
    }
    showToast(`✓ Berhasil masuk ke Portal Mahasiswa sebagai ${userName}`);
  };

  const handleAssessmentPublished = (token: string, newConfig: AssessmentConfig) => {
    setActiveExamToken(token);
    setAssessmentConfig(newConfig);
    showToast(`🚀 Asesmen berhasil diterbitkan! Token Mahasiswa: ${token}`);
  };

  const handleLogout = () => {
    setCurrentTab('onboarding');
    setStudentSubView('dashboard');
    setActiveExamToken(null);
    setInspectedAssessmentId(null);
    setExamTimeRemaining(2700);
    try {
      localStorage.removeItem('maply_active_session_v1');
    } catch {}
    showToast('✓ Anda telah berhasil keluar dari akun');
  };

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
    setInspectedAssessmentId(assessmentConfig.id);
    setStudentSubView('evaluation');
    if (backendOnline) {
      setAnalytics(await fetchClassAnalytics(assessmentConfig.id));
    }
    showToast(`✓ Evaluasi graf selesai: Skor ${res.total_score}/100`);
  };

  const sampleEvaluationResult: EvaluationResult = {
    student_id: 'std-215150201111001',
    student_name: 'M. Fadhil',
    assessment_id: assessmentConfig.id,
    concept_recognition_score: 100,
    relationship_accuracy_score: 83.3,
    structural_understanding_score: 80.5,
    total_score: 86,
    metrics: {
      true_positive: 5,
      false_positive: 1,
      false_negative: 1,
      precision: 0.83,
      recall: 0.83,
      f1_score: 0.83
    },
    knowledge_gaps: [
      'Mahasiswa memahami komponen CPU dan Cache, tetapi belum mengaitkan relasi langsung antara ALU dengan Register secara presisi.',
      'Perlu penguatan pada siklus transfer data bus internal antara Register dan Unit Kontrol.'
    ],
    strengths: [
      'Presensi seluruh simpul konsep utama acuan mencapai 100%',
      'Struktur koneksi hierarki terarah CPU, Control Unit, dan ALU tervalidasi presisi'
    ],
    evaluated_edges: [
      {
        source: 'cpu',
        target: 'alu',
        label: 'contains',
        status: 'correct',
        source_label: 'CPU',
        target_label: 'ALU',
        note: 'Sesuai dengan Master Ground Truth'
      },
      {
        source: 'cpu',
        target: 'cu',
        label: 'contains',
        status: 'correct',
        source_label: 'CPU',
        target_label: 'Control Unit',
        note: 'Sesuai dengan Master Ground Truth'
      },
      {
        source: 'cpu',
        target: 'register',
        label: 'contains',
        status: 'correct',
        source_label: 'CPU',
        target_label: 'Register',
        note: 'Sesuai dengan Master Ground Truth'
      },
      {
        source: 'cpu',
        target: 'cache',
        label: 'interacts with',
        status: 'correct',
        source_label: 'CPU',
        target_label: 'Cache Memory',
        note: 'Sesuai dengan Master Ground Truth'
      },
      {
        source: 'alu',
        target: 'register',
        label: 'transfers data to',
        status: 'missing',
        source_label: 'ALU',
        target_label: 'Register',
        note: 'Relasi kunci yang belum terhubung di kanvas'
      },
      {
        source: 'alu',
        target: 'cache',
        label: 'controls',
        status: 'incorrect',
        source_label: 'ALU',
        target_label: 'Cache Memory',
        note: 'Miskonsepsi: ALU tidak mengontrol Cache (tugas Control Unit)'
      }
    ]
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
      {/* Render outer Navbar only when not in full-screen assessment workspace */}
      {!(currentTab === 'student' && studentSubView === 'workspace') && (
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          studentSubView={studentSubView}
          onStudentSubViewChange={(sub) => {
            if (sub === 'evaluation') {
              setInspectedAssessmentId(null);
            }
            setStudentSubView(sub);
          }}
          activeExamToken={activeExamToken}
          assessmentTitle={assessmentConfig.title}
          courseName="FILKOM UB • Arsitektur Komputer"
          studentName="Ahmad Rizky"
          studentNim="225150201111048"
          timeRemainingSeconds={examTimeRemaining}
          onLogout={handleLogout}
          backendOnline={backendOnline}
          onOpenAuthModal={handleOpenAuth}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#1B1B1E] text-white border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#0038D1] text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          {toastMessage}
        </div>
      )}

      <div className="flex-1">
        {currentTab === 'onboarding' && (
          <OnboardingView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAuthModal={handleOpenAuth}
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        )}

        {currentTab === 'student' && (
          <>
            {studentSubView === 'dashboard' && (
              <StudentDashboardView
                assessmentConfig={assessmentConfig}
                kit={kit}
                onStartWorkspace={() => setStudentSubView('workspace')}
                onEnterToken={(tok) => handleEnterExamWithToken(tok)}
                onViewResults={() => {
                  if (!evaluationResult) setEvaluationResult(sampleEvaluationResult);
                  setInspectedAssessmentId('asm-cpu-06');
                  setStudentSubView('evaluation');
                }}
              />
            )}

            {studentSubView === 'assessments' && (
              <StudentAssessmentsView
                assessmentConfig={assessmentConfig}
                kit={kit}
                onStartWorkspace={() => setStudentSubView('workspace')}
                onViewResults={() => {
                  if (!evaluationResult) setEvaluationResult(sampleEvaluationResult);
                  setInspectedAssessmentId('asm-cpu-06');
                  setStudentSubView('evaluation');
                }}
              />
            )}

            {studentSubView === 'workspace' && (
              <StudentView
                key={`kit-${kitVersion}`}
                kit={kit}
                assessmentConfig={assessmentConfig}
                timeRemainingSeconds={examTimeRemaining}
                studentName="Ahmad Rizky"
                studentNim="225150201111048"
                onEvaluationComplete={handleEvaluationComplete}
                onBackToDashboard={() => setStudentSubView('dashboard')}
              />
            )}

            {studentSubView === 'evaluation' && (
              inspectedAssessmentId ? (
                <StudentEvaluationView
                  result={evaluationResult || sampleEvaluationResult}
                  assessmentConfig={assessmentConfig}
                  onBackToDashboard={() => setInspectedAssessmentId(null)}
                  onRetakeWorkspace={() => {
                    setInspectedAssessmentId(null);
                    setStudentSubView('workspace');
                  }}
                />
              ) : (
                <StudentPersonalResultsView
                  studentName="Ahmad Rizky"
                  studentNim="225150201111048"
                  onBackToDashboard={() => setStudentSubView('dashboard')}
                  onInspectAssessment={(asmId) => {
                    if (!evaluationResult) setEvaluationResult(sampleEvaluationResult);
                    setInspectedAssessmentId(asmId);
                  }}
                />
              )
            )}
          </>
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

      {/* Cognitive Evaluation Modal (Only for non-student views or quick triggers) */}
      {currentTab !== 'student' && (
        <EvaluationModal result={evaluationResult} onClose={() => setEvaluationResult(null)} />
      )}

      {/* Multi-Role & Token Access Gateway Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authRole}
        onClose={() => setIsAuthModalOpen(false)}
        onEnterExamWithToken={handleEnterExamWithToken}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Dosen 4-Step Assessment Creation Wizard */}
      {isWizardOpen && (
        <CreateAssessmentWizard
          masterMap={masterMap}
          onSaveAssessment={handleSaveAssessment}
          onClose={() => setIsWizardOpen(false)}
          onAssessmentPublished={handleAssessmentPublished}
        />
      )}
    </main>
  );
}
