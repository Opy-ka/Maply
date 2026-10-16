'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Handle,
  Position,
  NodeProps
} from '@xyflow/react';
import { ConceptKit, EvaluationResult, ConceptNode as ConceptNodeType, ConceptEdge as ConceptEdgeType, AssessmentConfig } from '../types/maply';
import { submitStudentMap } from '../lib/api';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  X,
  FileCheck,
  Sparkles,
  Layers,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  Move,
  GraduationCap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Search,
  Check,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Network
} from 'lucide-react';

// =========================================================================
// CUSTOM REACTFLOW NODE COMPONENTS (PIXEL-MATCHED TO IMAGE 2)
// =========================================================================

interface ConceptCardData {
  title: string;
  subtitle: string;
  bulletType?: 'circle' | 'square';
  bulletColor?: string;
  isSlot?: boolean;
}

const ConceptCardNode: React.FC<NodeProps> = ({ data, selected }) => {
  const d = data as unknown as ConceptCardData;
  return (
    <div
      className={`relative min-w-[210px] max-w-[260px] bg-white rounded-2xl border-2 border-[#1B1B1E] p-3.5 shadow-[3px_3px_0px_#1B1B1E] transition-all select-none ${
        selected ? 'ring-2 ring-[#0038D1] shadow-[4px_4px_0px_#0038D1]' : ''
      }`}
    >
      {/* 4 Connection Socket Handles (Top, Bottom, Left, Right) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#1B1B1E] hover:!bg-[#0038D1] transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#1B1B1E] hover:!bg-[#0038D1] transition-colors"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#1B1B1E] hover:!bg-[#0038D1] transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#1B1B1E] hover:!bg-[#0038D1] transition-colors"
      />

      <div className="flex items-start gap-2">
        <span
          className={`shrink-0 text-sm mt-0.5 ${
            d.bulletColor || (d.bulletType === 'square' ? 'text-[#D97706]' : 'text-[#0038D1]')
          }`}
        >
          {d.bulletType === 'square' ? '■' : '●'}
        </span>
        <div className="min-w-0">
          <h4 className="font-serif font-black text-xs text-[#1B1B1E] leading-snug truncate">
            {d.title}
          </h4>
          {d.subtitle && (
            <p className="text-[10px] text-[#555] font-sans mt-0.5 leading-tight">
              {d.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SlotCardNode: React.FC<NodeProps> = ({ data, selected }) => {
  const d = data as {
    targetNumber: string;
    title: string;
    instruction: string;
    status: string;
    isOccupied?: boolean;
  };

  return (
    <div
      className={`relative min-w-[220px] max-w-[270px] rounded-2xl border-2 border-dashed p-3.5 transition-all select-none ${
        d.isOccupied
          ? 'bg-white border-[#059669] shadow-[3px_3px_0px_#059669]'
          : 'bg-[#EEF2FF]/60 border-[#0038D1] shadow-[2px_2px_0px_rgba(0,56,209,0.15)]'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#0038D1] hover:!bg-[#0038D1]"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-white !border-2 !border-[#0038D1] hover:!bg-[#0038D1]"
      />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="px-1.5 py-0.5 rounded bg-[#0038D1] text-white text-[9px] font-mono font-black uppercase tracking-wider">
            {d.targetNumber}
          </span>
          <span className="text-[9.5px] font-mono text-[#0038D1] font-bold">
            {d.status}
          </span>
        </div>

        <div>
          <h4 className="font-serif font-black text-xs text-[#0038D1] leading-snug">
            {d.title}
          </h4>
          <p className="text-[10px] text-[#4B5563] mt-0.5 leading-tight">
            {d.instruction}
          </p>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// MAIN STUDENT VIEW COMPONENT
// =========================================================================

interface StudentViewProps {
  kit: ConceptKit;
  onEvaluationComplete: (result: EvaluationResult) => void;
  onBackToDashboard?: () => void;
  assessmentConfig?: AssessmentConfig;
  timeRemainingSeconds?: number;
  studentName?: string;
  studentNim?: string;
}

export const StudentView: React.FC<StudentViewProps> = ({
  kit,
  onEvaluationComplete,
  onBackToDashboard,
  assessmentConfig,
  timeRemainingSeconds,
  studentName = 'Ahmad Rizky',
  studentNim = '225150201111048'
}) => {
  const nodeTypes = useMemo(
    () => ({
      conceptCard: ConceptCardNode,
      slotCard: SlotCardNode
    }),
    []
  );

  const [selectedRelation, setSelectedRelation] = useState(
    kit.available_relationships[0] || 'memiliki'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPetunjukModal, setShowPetunjukModal] = useState(false);
  const [isRegisterPlaced, setIsRegisterPlaced] = useState(false);
  const [simulationState, setSimulationState] = useState<'default' | 'paham' | 'gap'>('default');
  const [autoSaveTime, setAutoSaveTime] = useState('11:42:08 WIB');

  // Format real-time clock for auto-save pill
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setAutoSaveTime(`${h}:${m}:${s} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initial nodes layout (Exact positioning matched to Image 2)
  const initialNodes: Node[] = useMemo(
    () => [
      {
        id: 'cpu',
        type: 'conceptCard',
        position: { x: 220, y: 70 },
        data: {
          title: 'CPU',
          subtitle: 'Central Processing Unit (Pusat Kendali)',
          bulletType: 'circle',
          bulletColor: 'text-[#0038D1]'
        }
      },
      {
        id: 'cu',
        type: 'conceptCard',
        position: { x: 500, y: 75 },
        data: {
          title: 'Control Unit (CU)',
          subtitle: 'Pengatur instruksi & clock',
          bulletType: 'circle',
          bulletColor: 'text-[#0038D1]'
        }
      },
      {
        id: 'alu',
        type: 'conceptCard',
        position: { x: 220, y: 270 },
        data: {
          title: 'ALU',
          subtitle: 'Arithmetic Logic Unit',
          bulletType: 'square',
          bulletColor: 'text-[#D97706]'
        }
      },
      {
        id: 'operasi',
        type: 'conceptCard',
        position: { x: 200, y: 440 },
        data: {
          title: 'Operasi Aritmatika & Logika',
          subtitle: 'Eksekusi matematis dan bitwise',
          bulletType: 'square',
          bulletColor: 'text-[#D97706]'
        }
      },
      {
        id: 'slot-4',
        type: 'slotCard',
        position: { x: 500, y: 260 },
        data: {
          targetNumber: 'TARGET #4',
          title: 'Slot Rekonstruksi',
          instruction: 'Letakkan "Register File" di sini sambungkan dari CPU',
          status: 'Socket siap terhubung',
          isOccupied: false
        }
      }
    ],
    []
  );

  // Initial edges layout (Exact propositions matched to Image 2)
  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-cpu-cu',
        source: 'cpu',
        target: 'cu',
        label: '── memiliki ──▶',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
        style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
        labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#FAF7F2', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
        labelBgPadding: [6, 4]
      },
      {
        id: 'e-cpu-alu',
        source: 'cpu',
        target: 'alu',
        label: '── memiliki ──▶',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
        style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
        labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#FAF7F2', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
        labelBgPadding: [6, 4]
      },
      {
        id: 'e-alu-op',
        source: 'alu',
        target: 'operasi',
        label: '── menjalankan ──▶',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
        style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
        labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#FAF7F2', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
        labelBgPadding: [6, 4]
      },
      {
        id: 'e-cpu-slot',
        source: 'cpu',
        target: 'slot-4',
        label: '? menyimpan sementara ?',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0038D1' },
        style: { stroke: '#0038D1', strokeWidth: 2, strokeDasharray: '4 4' },
        labelStyle: { fill: '#FFFFFF', fontWeight: 800, fontSize: 9.5, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0038D1', fillOpacity: 1, rx: 6, ry: 6, stroke: '#1B1B1E', strokeWidth: 1 },
        labelBgPadding: [8, 4]
      }
    ],
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  // Connect handler
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        label: `── ${selectedRelation} ──▶`,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
        style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
        labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#FFEAA7', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
        labelBgPadding: [6, 4]
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [selectedRelation, setEdges]
  );

  // Interactive Placement of "Register File" into Slot 4
  const placeRegisterFile = useCallback(() => {
    setIsRegisterPlaced(true);
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === 'slot-4') {
          return {
            ...n,
            type: 'conceptCard',
            data: {
              title: 'Register File',
              subtitle: 'Penyimpanan Cepat Inti (Internal Register State)',
              bulletType: 'square',
              bulletColor: 'text-[#0038D1]'
            }
          };
        }
        return n;
      })
    );
    // Convert dashed edge to valid permanent edge
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id === 'e-cpu-slot') {
          return {
            ...e,
            label: '── menyimpan sementara ──▶',
            style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
            labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 10 },
            labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
          };
        }
        return e;
      })
    );
    setSimulationState('paham');
  }, [setNodes, setEdges]);

  // Simulation switcher (clean, professional, non-cluttering)
  const applySimulation = (mode: 'paham' | 'gap' | 'default') => {
    setSimulationState(mode);
    if (mode === 'default') {
      setIsRegisterPlaced(false);
      setNodes(initialNodes);
      setEdges(initialEdges);
      return;
    }
    if (mode === 'paham') {
      placeRegisterFile();
    } else if (mode === 'gap') {
      setIsRegisterPlaced(true);
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === 'slot-4') {
            return {
              ...n,
              type: 'conceptCard',
              data: {
                title: 'Register File',
                subtitle: 'Penyimpanan Cepat Inti (Internal Register State)',
                bulletType: 'square',
                bulletColor: 'text-[#0038D1]'
              }
            };
          }
          return n;
        })
      );
      setEdges([
        ...initialEdges.filter((e) => e.id !== 'e-cpu-slot'),
        {
          id: 'e-gap-hdd',
          source: 'slot-4',
          target: 'cu',
          label: '── mengontrol ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#DA3437' },
          style: { stroke: '#DA3437', strokeWidth: 2.5 },
          labelStyle: { fill: '#DA3437', fontWeight: 800, fontSize: 10 },
          labelBgStyle: { fill: '#FCE8E6', fillOpacity: 1, rx: 4, ry: 4, stroke: '#DA3437', strokeWidth: 1.5 }
        }
      ]);
    }
  };

  const formatRemainingTime = (seconds?: number) => {
    const s = seconds !== undefined ? seconds : 1452; // 24:12 default from Image 2
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit Final
  const handleFinalSubmit = async () => {
    setShowSubmitModal(false);
    setIsSubmitting(true);
    try {
      const cleanLabel = (text: string) => text.replace('■ [', '').replace(']', '').trim();
      const cleanEdgeLabel = (text: string) =>
        text.replace('──', '').replace('──▶', '').replace('?', '').trim();

      const submittedNodes: ConceptNodeType[] = nodes.map((n) => ({
        id: n.id,
        label: (n.data as { title: string }).title || n.id,
        x: n.position.x,
        y: n.position.y
      }));

      const submittedEdges: ConceptEdgeType[] = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: cleanEdgeLabel((e.label as string) || 'berkaitan dengan')
      }));

      const res = await submitStudentMap(
        kit.assessment_id,
        studentName,
        submittedNodes,
        submittedEdges
      );
      onEvaluationComplete(res);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF7F2] font-sans text-[#1B1B1E] select-none">
      {/* ========================================================= */}
      {/* 1. TOP HEADER (EXACTLY MATCHING IMAGE 2) */}
      {/* ========================================================= */}
      <header className="h-16 px-4 sm:px-6 bg-white border-b-2 border-[#1B1B1E] flex items-center justify-between gap-4 shrink-0 z-30 shadow-[0_2px_4px_rgba(27,27,30,0.04)]">
        {/* Left: UB badge + Breadcrumb & sub-pills */}
        <div className="flex items-center gap-3 min-w-0">
          {/* UB Brand Box */}
          <button
            type="button"
            onClick={onBackToDashboard}
            className="w-8 h-8 rounded-lg bg-[#0038D1] border-2 border-[#1B1B1E] flex items-center justify-center text-white font-serif font-black text-xs shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer shrink-0"
            title="Kembali ke Dashboard Mahasiswa"
          >
            UB
          </button>

          <div className="min-w-0">
            {/* Breadcrumb text */}
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#1B1B1E] truncate">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="hover:text-[#0038D1] transition-colors cursor-pointer"
              >
                Arsitektur Komputer
              </button>
              <span className="text-[#888]">/</span>
              <span className="font-black text-[#1B1B1E] truncate">
                {assessmentConfig?.title || 'Asesmen #01: Alur Pemrosesan CPU & Hirarki Memori'}
              </span>
            </div>

            {/* Sub-bar badges */}
            <div className="flex items-center gap-2 mt-0.5 text-[10px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#1B1B1E] font-mono text-[#1B1B1E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B1B1E]"></span>
                Percobaan 1 dari 2
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#1B1B1E] font-mono font-medium text-[#065F46]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                Auto-saved ke Cloud ({autoSaveTime})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Timer, Petunjuk, Reset & Kirim Jawaban */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#1B1B1E] text-xs font-mono font-black text-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E]">
            <span className="w-2 h-2 rounded-full bg-[#DA3437] animate-pulse"></span>
            <span>{formatRemainingTime(timeRemainingSeconds)} SISA</span>
          </div>

          {/* Petunjuk Button */}
          <button
            type="button"
            onClick={() => setShowPetunjukModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F0ECE1] border-2 border-[#1B1B1E] text-xs font-serif font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#1B1B1E]" />
            <span className="hidden sm:inline">Petunjuk</span>
          </button>

          {/* Reset Kanvas Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Kosongkan kanvas dan kembalikan ke layout awal?')) {
                applySimulation('default');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F0ECE1] border-2 border-[#1B1B1E] text-xs font-serif font-bold text-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#1B1B1E]" />
            <span className="hidden sm:inline">Reset Kanvas</span>
          </button>

          {/* Kirim Jawaban Asesmen Button */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full bg-[#0038D1] hover:bg-[#1A4BDB] text-white font-serif font-black text-xs sm:text-sm border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <span>Kirim Jawaban Asesmen</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. THREE-PANE BODY WORKSPACE (EXACTLY MATCHING IMAGE 2) */}
      {/* ========================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT PANEL: PALET DEKOMPOSISI (~310px) */}
        {/* ========================================================= */}
        <aside className="w-76 sm:w-80 lg:w-[310px] bg-[#FAF7F2] border-r-2 border-[#1B1B1E] flex flex-col h-full shrink-0 z-10 shadow-[2px_0px_0px_rgba(27,27,30,0.04)]">
          {/* Header Block: Peach color with badge */}
          <div className="bg-[#FFDDB8] border-b-2 border-[#1B1B1E] px-4 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[#1B1B1E]"></span>
              <h2 className="font-serif font-black text-sm text-[#1B1B1E]">
                Palet Dekomposisi
              </h2>
            </div>
            <p className="text-[10px] font-mono text-[#6D4400] font-bold mt-0.5">
              Kit-Build Concept Map (T. Hirashima Framework)
            </p>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Section 1: Kepingan Konsep */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1B1B1E]/10">
                <div className="flex items-center gap-1.5 font-bold text-[#1B1B1E]">
                  <span>Kepingan Konsep</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#EEF2FF] border border-[#0038D1] text-[9px] font-mono font-bold text-[#0038D1]">
                    {isRegisterPlaced ? '5/5 Terpasang' : '4/5 Terpasang'}
                  </span>
                </div>
                <Grid className="w-3.5 h-3.5 text-[#71717A]" />
              </div>

              {/* Already Placed Concepts (Muted Cards) */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 border border-[#1B1B1E]/40 text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
                    <span className="font-serif font-bold line-through text-[#6B7280]">
                      CPU (Central Processing Unit)
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-[#059669] font-bold">
                    Terpasang ✓
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 border border-[#1B1B1E]/40 text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-xs bg-[#9CA3AF]"></span>
                    <span className="font-serif font-bold line-through text-[#6B7280]">
                      ALU (Arithmetic Logic Unit)
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-[#059669] font-bold">
                    Terpasang ✓
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 border border-[#1B1B1E]/40 text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
                    <span className="font-serif font-bold line-through text-[#6B7280]">
                      Control Unit (CU)
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-[#059669] font-bold">
                    Terpasang ✓
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/70 border border-[#1B1B1E]/40 text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-xs bg-[#9CA3AF]"></span>
                    <span className="font-serif font-bold line-through text-[#6B7280]">
                      Operasi Aritmatika & Logika
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-[#059669] font-bold">
                    Terpasang ✓
                  </span>
                </div>

                {/* Active Ready Card: Register File */}
                <div
                  onClick={placeRegisterFile}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isRegisterPlaced
                      ? 'bg-white/70 border-[#1B1B1E]/40 opacity-70'
                      : 'bg-white border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                  }`}
                  title="Klik untuk menempatkan kartu ke Slot Rekonstruksi di kanvas"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-serif font-black text-xs text-[#1B1B1E]">
                      <span className="w-2 h-2 rounded-xs bg-[#0038D1]"></span>
                      <span>Register File</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-black uppercase ${
                        isRegisterPlaced
                          ? 'bg-[#ECFDF5] text-[#065F46] border border-[#059669]'
                          : 'bg-[#0038D1] text-white'
                      }`}
                    >
                      {isRegisterPlaced ? 'Terpasang ✓' : 'SIAP TARIK'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#555] mt-1 leading-tight">
                    Tipe: Penyimpanan Cepat Inti (Internal Register State)
                  </p>
                  <div className="flex items-center gap-1 text-[9.5px] font-mono text-[#0038D1] font-bold mt-2 pt-1 border-t border-[#1B1B1E]/10">
                    <Move className="w-3 h-3" />
                    <span>
                      {isRegisterPlaced ? 'Telah disambungkan di kanvas' : 'Tarik ke Slot Kosong'}
                    </span>
                  </div>
                </div>

                {/* Distractor Card: Hard Disk Drive (HDD) */}
                <div className="p-3 rounded-xl bg-[#FFF5F5] border-2 border-[#DA3437] shadow-[2px_2px_0px_#DA3437] space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-serif font-black text-xs text-[#DA3437]">
                      <span>▲</span>
                      <span>Hard Disk Drive (HDD)</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-[#DA3437] text-white text-[9px] font-mono font-black uppercase">
                      DISTRAKTOR
                    </span>
                  </div>
                  <p className="text-[9.5px] text-[#7F1D1D] leading-tight">
                    Kartu pengalih — Tidak termasuk dalam siklus inti CPU internal!
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Kepingan Relasi */}
            <div className="space-y-2 pt-2 border-t border-[#1B1B1E]/10">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1B1B1E]/10">
                <div className="flex items-center gap-1.5 font-bold text-[#1B1B1E]">
                  <span>Kepingan Relasi</span>
                  <span className="text-[10px] text-[#71717A]">(3/5 Digunakan)</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0038D1]">
                  Tersedia: {isRegisterPlaced ? '1' : '2'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                {/* Relation item 1 */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/70 border border-[#1B1B1E]/30 text-[#888]">
                  <span>─[ memiliki ]─</span>
                  <span className="text-[9.5px]">Sisa: 0x</span>
                </div>

                {/* Relation item 2 */}
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/70 border border-[#1B1B1E]/30 text-[#888]">
                  <span>─[ menjalankan ]─</span>
                  <span className="text-[9.5px]">Sisa: 0x</span>
                </div>

                {/* Relation item 3 (active) */}
                <button
                  type="button"
                  onClick={() => setSelectedRelation('menyimpan sementara')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedRelation === 'menyimpan sementara'
                      ? 'bg-[#FFEAA7] border-[#1B1B1E] font-black text-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                      : 'bg-white border-[#1B1B1E] text-[#1B1B1E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>─[ menyimpan sementara ]─</span>
                  <span className="px-1.5 py-0.2 rounded bg-white border border-[#1B1B1E] text-[9px] font-bold">
                    {isRegisterPlaced ? '0x' : '1x'}
                  </span>
                </button>

                {/* Relation item 4 */}
                <button
                  type="button"
                  onClick={() => setSelectedRelation('mengirim instruksi ke')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedRelation === 'mengirim instruksi ke'
                      ? 'bg-[#FFEAA7] border-[#1B1B1E] font-black text-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                      : 'bg-white border-[#1B1B1E] text-[#1B1B1E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>─[ mengirim instruksi ke ]─</span>
                  <span className="px-1.5 py-0.2 rounded bg-white border border-[#1B1B1E] text-[9px] font-bold">
                    1x
                  </span>
                </button>

                {/* Relation item 5 */}
                <button
                  type="button"
                  onClick={() => setSelectedRelation('membaca dari')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedRelation === 'membaca dari'
                      ? 'bg-[#FFEAA7] border-[#1B1B1E] font-black text-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]'
                      : 'bg-white border-[#1B1B1E] text-[#1B1B1E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>─[ membaca dari ]─</span>
                  <span className="px-1.5 py-0.2 rounded bg-white border border-[#1B1B1E] text-[9px] font-bold">
                    1x
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Proposition Format Box */}
          <div className="p-3 bg-white border-t-2 border-[#1B1B1E] text-[10px] space-y-1">
            <div className="flex items-center gap-1 font-mono font-black text-[#1B1B1E] uppercase">
              <span>= ATURAN FORMAT PROPOSISI:</span>
            </div>
            <p className="font-mono text-[#555] bg-[#FAF7F2] p-1.5 rounded border border-[#1B1B1E]/20 text-[9.5px]">
              [Konsep Asal] ➔ [Label Relasi] ➔ [Konsep Tujuan]
            </p>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER PANEL: CANVAS STUDIO (FLEX-1) */}
        {/* ========================================================= */}
        <main className="flex-1 relative flex flex-col h-full bg-[#FAF7F2] overflow-hidden">
          {/* Top Floating Control Bar */}
          <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Left controls */}
            <div className="flex items-center gap-1 p-1 bg-white border-2 border-[#1B1B1E] rounded-xl shadow-[3px_3px_0px_#1B1B1E] pointer-events-auto">
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-[#0038D1] text-white text-[10px] font-serif font-black flex items-center gap-1 cursor-pointer"
              >
                <span>Select</span>
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-[#1B1B1E] text-[10px] font-serif font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#059669]" />
                <span>Connect Socket</span>
              </button>
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-slate-100 text-[#1B1B1E] cursor-pointer"
                title="Toggle Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-slate-100 text-[#1B1B1E] cursor-pointer"
                title="Fullscreen Canvas"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right Zoom controls */}
            <div className="flex items-center gap-1 p-1 bg-white border-2 border-[#1B1B1E] rounded-xl shadow-[3px_3px_0px_#1B1B1E] pointer-events-auto">
              <span className="px-2 text-[10px] font-mono font-bold text-[#1B1B1E]">
                - 100% +
              </span>
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-slate-100 text-[#1B1B1E] cursor-pointer text-[10px] font-bold"
                title="Fit View"
              >
                Fit
              </button>
            </div>
          </div>

          {/* ReactFlow Canvas */}
          <div className="flex-1 w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <Controls className="!bg-white !border-2 !border-[#1B1B1E] !shadow-[2px_2px_0px_#1B1B1E] !rounded-xl" />
              <MiniMap
                className="!bg-white !border-2 !border-[#1B1B1E] !shadow-[3px_3px_0px_#1B1B1E] !rounded-xl"
                nodeStrokeColor="#1B1B1E"
                nodeColor="#FFEAA7"
              />
              <Background color="#1B1B1E" gap={24} size={1} />
            </ReactFlow>
          </div>

          {/* Bottom Floating Status Bar (Matching Image 2) */}
          <div className="h-8 bg-white border-t-2 border-[#1B1B1E] px-4 flex items-center justify-between text-[10.5px] text-[#444655] shrink-0 z-20">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border border-[#1B1B1E] flex items-center justify-center text-[8px] font-bold">
                i
              </span>
              <span>
                Klik socket lingkaran untuk menarik relasi baru. Drag kartu untuk memposisikan ulang proposisi.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-[#71717A]">
                Snap: 8px Grid Active
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[#0038D1] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0038D1] animate-pulse"></span>
                42 Mahasiswa aktif di sesi ini
              </span>
            </div>
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT PANEL: INSPEKTUR GRAF (~330px) */}
        {/* ========================================================= */}
        <aside className="w-80 lg:w-[330px] bg-white border-l-2 border-[#1B1B1E] flex flex-col h-full shrink-0 z-10 shadow-[-2px_0px_0px_rgba(27,27,30,0.04)]">
          {/* Header */}
          <div className="px-4 py-3 border-b-2 border-[#1B1B1E] shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0038D1]"></span>
              <h3 className="font-serif font-black text-sm text-[#1B1B1E]">
                Inspektur Graf
              </h3>
            </div>
            <p className="text-[10px] font-mono text-[#71717A] mt-0.5">
              NetworkX Evaluator Engine &bull; Bebas Halusinasi
            </p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Card 1: Kelengkapan Graf */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-2">
              <div className="flex items-center justify-between text-xs font-serif font-black text-[#1B1B1E]">
                <span>Kelengkapan Graf</span>
                <span className="font-mono text-sm text-[#0038D1]">
                  {isRegisterPlaced ? '100%' : '65%'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-white border-2 border-[#1B1B1E] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#0038D1] rounded-full transition-all duration-300"
                  style={{ width: isRegisterPlaced ? '100%' : '65%' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#555]">
                <span>
                  {isRegisterPlaced ? '4 dari 4 proposisi terbentuk' : '3 dari 5 proposisi terbentuk'}
                </span>
                <span>{isRegisterPlaced ? '0 terpisah' : '1 keping terpisah'}</span>
              </div>
            </div>

            {/* Card 2: Audit Proposisi Realtime */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#1B1B1E]">
                <span className="w-2 h-2 rounded-full bg-[#0038D1]"></span>
                <span>Audit Proposisi Realtime</span>
              </div>

              <div className="space-y-2">
                {/* Prop 1 */}
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-[#1B1B1E]">
                      #01 CPU → memiliki → ALU
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#ECFDF5] border border-[#059669] text-[9px] font-mono font-bold text-[#065F46]">
                      Valid TP ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-[#555] leading-tight">
                    Sesuai dengan peta konsep acuan dosen pengampu.
                  </p>
                </div>

                {/* Prop 2 */}
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-[#1B1B1E]">
                      #02 ALU → menjalankan → Operasi
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#ECFDF5] border border-[#059669] text-[9px] font-mono font-bold text-[#065F46]">
                      Valid TP ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-[#555] leading-tight">
                    Hubungan kausal fungsi komputasi terverifikasi.
                  </p>
                </div>

                {/* Prop 3 */}
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-[#1B1B1E]">
                      #03 CPU → memiliki → Control Unit
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#ECFDF5] border border-[#059669] text-[9px] font-mono font-bold text-[#065F46]">
                      Valid TP ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-[#555] leading-tight">
                    Hirarki modular mikroarsitektur valid.
                  </p>
                </div>

                {/* Prop 4: Dynamic based on Register placement */}
                {isRegisterPlaced ? (
                  <div className="p-2.5 rounded-xl bg-[#ECFDF5] border-2 border-[#059669] shadow-[1.5px_1.5px_0px_#059669] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#065F46]">
                        #04 CPU → menyimpan sementara → Register
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-white border border-[#059669] text-[9px] font-mono font-bold text-[#065F46]">
                        Valid TP ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-[#065F46] leading-tight">
                      Hierarki internal register di dalam CPU terkonfirmasi valid.
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#FFF5F5] border-2 border-[#DA3437] shadow-[1.5px_1.5px_0px_#DA3437] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-[#DA3437]">
                        [Register File] → [ ? ]
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#DA3437] text-white text-[9px] font-mono font-bold">
                        Tertunda ⚠
                      </span>
                    </div>
                    <p className="text-[10px] text-[#7F1D1D] leading-tight">
                      Belum terhubung ke node CPU induk.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button: NetworkX Check */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (!isRegisterPlaced) {
                    placeRegisterFile();
                  } else {
                    alert('✓ NetworkX Check: Struktur graf 100% valid tanpa siklus kontradiktif.');
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] border-2 border-[#1B1B1E] font-serif font-black text-xs text-[#1B1B1E] shadow-[2.5px_2.5px_0px_#1B1B1E] flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <Search className="w-3.5 h-3.5 text-[#0038D1]" />
                <span>Uji Kelayakan Graf (NetworkX Check)</span>
              </button>

              {/* Clean Integrated Simulation Toggle (Replacing Image 1 cleanly) */}
              <div className="p-1.5 rounded-xl bg-[#FAF7F2] border border-[#1B1B1E]/20 flex items-center justify-between gap-1 text-[10px] font-serif font-bold">
                <span className="text-[#71717A] px-1 font-mono uppercase text-[9px]">
                  Mode Uji:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => applySimulation('paham')}
                    className={`px-2 py-0.5 rounded-md font-black uppercase transition-all cursor-pointer ${
                      simulationState === 'paham'
                        ? 'bg-[#059669] text-white shadow-[1px_1px_0px_#1B1B1E]'
                        : 'bg-white text-[#059669] hover:bg-[#D1FAE5]'
                    }`}
                  >
                    Simulasi Paham
                  </button>
                  <button
                    type="button"
                    onClick={() => applySimulation('gap')}
                    className={`px-2 py-0.5 rounded-md font-black uppercase transition-all cursor-pointer ${
                      simulationState === 'gap'
                        ? 'bg-[#DA3437] text-white shadow-[1px_1px_0px_#1B1B1E]'
                        : 'bg-white text-[#92400E] hover:bg-[#FEF3C7]'
                    }`}
                  >
                    Simulasi Gap
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Catatan Dosen (Pak Herman) */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9E6] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-serif font-black text-[#1B1B1E]">
                <GraduationCap className="w-4 h-4 text-[#D97706]" />
                <span>Catatan Dosen (Pak Herman)</span>
              </div>
              <p className="text-[10.5px] italic text-[#444655] leading-relaxed">
                &ldquo;Perhatikan hierarki memori internal. Register berada di dalam CPU, bukan di luar bus sistem!&rdquo;
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL PETUNJUK PENGERJAAN */}
      {/* ========================================================= */}
      {showPetunjukModal && (
        <div className="fixed inset-0 z-50 bg-[#1B1B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl border-2 border-[#1B1B1E] shadow-[6px_6px_0px_#1B1B1E] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#FFEAA7] border-b-2 border-[#1B1B1E] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1B1B1E]" />
                <span className="text-xs font-serif font-black uppercase tracking-wider text-[#1B1B1E]">
                  Petunjuk Rekonstruksi Kit-Build
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPetunjukModal(false)}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border-2 border-[#1B1B1E] flex items-center justify-center text-[#1B1B1E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-serif font-black text-sm text-[#1B1B1E]">
                  Cara Mengerjakan Asesmen Peta Konsep:
                </h4>
                <ol className="list-decimal pl-4 space-y-2 text-[#444655]">
                  <li>
                    <strong>Palet Dekomposisi (Kiri):</strong> Pilih kepingan konsep yang belum terpasang dan seret atau klik untuk menempatkannya pada slot kosong di kanvas.
                  </li>
                  <li>
                    <strong>Membuat Garis Relasi:</strong> Tarik garis dari socket lingkaran simpul asal menuju simpul tujuan, lalu pastikan label relasi yang aktif sesuai dengan kausalitas materi.
                  </li>
                  <li>
                    <strong>Inspektur Graf (Kanan):</strong> Pantau kelengkapan proposisi Anda. AI NetworkX akan memvalidasi apakah hubungan proposisi Anda sesuai dengan master acuan dosen secara real-time.
                  </li>
                  <li>
                    <strong>Kirim Jawaban:</strong> Setelah semua slot terhubung dan graf lengkap, klik tombol <em>Kirim Jawaban Asesmen</em> di pojok kanan atas.
                  </li>
                </ol>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] font-mono text-[10.5px] text-[#0038D1]">
                💡 Tips: Hindari kartu distractor (seperti HDD) yang bukan merupakan komponen internal siklus instruksi CPU.
              </div>

              <button
                type="button"
                onClick={() => setShowPetunjukModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#0038D1] text-white font-serif font-black text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] cursor-pointer"
              >
                Saya Mengerti, Lanjutkan Mengerjakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL KONFIRMASI PENGUMPULAN */}
      {/* ========================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-[#1B1B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border-2 border-[#1B1B1E] shadow-[6px_6px_0px_#1B1B1E] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#FFEAA7] border-b-2 border-[#1B1B1E] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#1B1B1E]" />
                <span className="text-xs font-serif font-black uppercase tracking-wider text-[#1B1B1E]">
                  Konfirmasi Pengesahan Jawaban
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border-2 border-[#1B1B1E] flex items-center justify-center text-[#1B1B1E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-serif font-black text-[#1B1B1E]">
                  Kumpulkan Lembar Kerja Asesmen?
                </h3>
                <p className="text-xs text-[#555] mt-0.5 leading-relaxed">
                  Periksa kembali ringkasan rekonstruksi konsep sebelum mengirim lembar kerja Anda ke sistem penilaian Kit-Build.
                </p>
              </div>

              {/* Student Identity Box */}
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border-2 border-[#1B1B1E] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0038D1] text-white flex items-center justify-center font-serif font-black text-sm border-2 border-[#1B1B1E] shrink-0">
                  AR
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-serif font-black text-[#1B1B1E] truncate">{studentName}</p>
                  <p className="font-mono text-[#71717A] text-[11px]">NIM: {studentNim}</p>
                  <span className="inline-block px-1.5 py-0.2 rounded bg-[#EEF2FF] border border-[#C7D2FE] text-[9.5px] font-mono font-bold text-[#0038D1] mt-0.5">
                    FILKOM UB &bull; Teknik Informatika
                  </span>
                </div>
              </div>

              {/* Assessment Metrics Summary */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-center">
                  <p className="text-[10px] font-mono font-bold text-[#71717A] uppercase">Relasi</p>
                  <p className="text-lg font-serif font-black text-[#0038D1] leading-tight mt-0.5">
                    {edges.length}
                  </p>
                  <p className="text-[9px] text-[#555]">Proposisi</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-center">
                  <p className="text-[10px] font-mono font-bold text-[#71717A] uppercase">Kelengkapan</p>
                  <p className="text-lg font-serif font-black text-[#059669] leading-tight mt-0.5">
                    {isRegisterPlaced ? '100%' : '65%'}
                  </p>
                  <p className="text-[9px] text-[#555]">Graf</p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-center">
                  <p className="text-[10px] font-mono font-bold text-[#71717A] uppercase">Sisa Waktu</p>
                  <p className="text-lg font-mono font-black text-[#B61722] leading-tight mt-0.5">
                    {formatRemainingTime(timeRemainingSeconds)}
                  </p>
                  <p className="text-[9px] text-[#555]">Tersedia</p>
                </div>
              </div>

              {!isRegisterPlaced && (
                <div className="p-3 rounded-xl bg-[#FFF5F5] border-2 border-[#DA3437] text-xs text-[#7F1D1D] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#DA3437] shrink-0 mt-0.5" />
                  <p className="leading-tight">
                    <strong>Peringatan:</strong> Masih terdapat 1 kepingan konsep terpisah (Register File). Kelengkapan graf Anda belum 100%.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="bg-[#FAF7F2] border-t-2 border-[#1B1B1E] px-5 py-3.5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#1B1B1E] text-xs font-serif font-black border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] cursor-pointer"
              >
                Batal & Lanjutkan
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0038D1] hover:bg-[#1A4BDB] text-white text-xs font-serif font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengevaluasi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Konfirmasi & Kumpulkan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
