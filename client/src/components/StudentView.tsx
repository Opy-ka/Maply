'use client';

import React, { useState, useCallback } from 'react';
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
  MarkerType
} from '@xyflow/react';
import { ConceptKit, EvaluationResult, ConceptNode as ConceptNodeType, ConceptEdge as ConceptEdgeType } from '../types/maply';
import { submitStudentMap } from '../lib/api';
import { Send, RotateCcw, Info, Clock, CheckCircle2, AlertOctagon, User, ArrowLeft } from 'lucide-react';
import { AssessmentConfig } from '../types/maply';

interface StudentViewProps {
  kit: ConceptKit;
  onEvaluationComplete: (result: EvaluationResult) => void;
  onBackToDashboard?: () => void;
  assessmentConfig?: AssessmentConfig;
}

export const StudentView: React.FC<StudentViewProps> = ({
  kit,
  onEvaluationComplete,
  onBackToDashboard,
  assessmentConfig
}) => {
  const [studentName, setStudentName] = useState('Mhs. Koko');
  const [selectedRelation, setSelectedRelation] = useState(kit.available_relationships[0] || 'contains');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial nodes placed on the canvas in Neo-Brutalist cards
  const initialNodes: Node[] = kit.concepts.map((concept, idx) => ({
    id: concept.id,
    type: 'default',
    data: { label: `■ [${concept.label}]` },
    position: {
      x: 120 + (idx % 3) * 240,
      y: 90 + Math.floor(idx / 3) * 170
    },
    style: {
      background: '#ffffff',
      color: '#1B1B1E',
      border: '2px solid #1B1B1E',
      borderRadius: '10px',
      padding: '12px 18px',
      fontWeight: 800,
      fontSize: '13px',
      boxShadow: '4px 4px 0px 0px #1B1B1E'
    }
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Connect handler
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `s-edge-${Date.now()}`,
        label: `── ${selectedRelation} ──▶`,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
        style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
        labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#FFEAA7', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
        labelBgPadding: [6, 4]
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [selectedRelation, setEdges]
  );

  // Preset loaders for instant live demonstration
  const loadPreset = (type: 'accurate' | 'with-gaps' | 'clear') => {
    if (type === 'clear') {
      setEdges([]);
      return;
    }

    if (type === 'accurate') {
      setEdges([
        {
          id: 'p-1',
          source: 'cpu',
          target: 'alu',
          label: '── contains ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'p-2',
          source: 'cpu',
          target: 'cu',
          label: '── contains ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'p-3',
          source: 'cpu',
          target: 'register',
          label: '── uses ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'p-4',
          source: 'alu',
          target: 'register',
          label: '── stores temporary result in ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'p-5',
          source: 'cu',
          target: 'alu',
          label: '── controls ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'p-6',
          source: 'register',
          target: 'memory',
          label: '── transfers data with ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        }
      ]);
    } else if (type === 'with-gaps') {
      setEdges([
        {
          id: 'g-1',
          source: 'cpu',
          target: 'alu',
          label: '── contains ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'g-2',
          source: 'cpu',
          target: 'cu',
          label: '── contains ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
        },
        {
          id: 'g-3',
          source: 'alu',
          target: 'memory',
          label: '── directly connects to ──▶',
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
          style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
          labelStyle: { fill: '#DA3437', fontWeight: 800, fontSize: 11 },
          labelBgStyle: { fill: '#FFE4E6', fillOpacity: 1, rx: 4, ry: 4, stroke: '#DA3437', strokeWidth: 1.5 }
        }
      ]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const cleanLabel = (text: string) => text.replace('■ [', '').replace(']', '').trim();
      const cleanEdgeLabel = (text: string) => text.replace('──', '').replace('──▶', '').trim();

      const submittedNodes: ConceptNodeType[] = nodes.map((n) => ({
        id: n.id,
        label: cleanLabel(n.data.label as string),
        x: n.position.x,
        y: n.position.y
      }));

      const submittedEdges: ConceptEdgeType[] = edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: cleanEdgeLabel((e.label as string) || 'berkaitan dengan')
      }));

      const res = await submitStudentMap(kit.assessment_id, studentName, submittedNodes, submittedEdges);
      onEvaluationComplete(res);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] bg-[#FAF7F2]">
      {/* Top Workspace Header (Figma Frame 2 #46:382) */}
      <div className="bg-[#FAF7F2] border-b-2 border-[#1B1B1E] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-10 shadow-[0_2px_0px_#1B1B1E]">
        {/* Left: Back Navigation & Assessment Title */}
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#EEF2FF] text-[#1B1B1E] font-serif font-bold text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#FFEAA7] border border-[#1B1B1E] text-[10px] font-mono font-bold text-[#1B1B1E]">
                KIT-BUILD SESI #01
              </span>
              <h2 className="text-xs sm:text-sm font-serif font-black text-[#1B1B1E] truncate max-w-[260px] sm:max-w-md">
                {assessmentConfig?.title || 'Rekonstruksi Peta Konsep: Struktur CPU & Hierarki Memori'}
              </h2>
            </div>
          </div>
        </div>

        {/* Center: Live Timer & Socket Metrics */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-xs font-mono font-bold text-[#1B1B1E]">
            <Clock className="w-3.5 h-3.5 text-[#DA3437]" />
            <span>34:18</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] text-xs font-bold text-[#1B1B1E]">
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            <span>
              <strong className="font-mono text-[#0038D1]">{edges.length}</strong> / {kit.concepts.length} Relasi
            </span>
          </div>
        </div>

        {/* Right: Relation Selector, Simulation Presets & Submit */}
        <div className="flex items-center gap-2">
          {/* Active Relation Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]">
            <span className="text-[10px] font-mono font-extrabold uppercase text-[#71717A]">Relasi Aktif:</span>
            <select
              value={selectedRelation}
              onChange={(e) => setSelectedRelation(e.target.value)}
              className="text-xs font-black text-[#0038D1] bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {kit.available_relationships.map((rel, idx) => (
                <option key={idx} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Simulation Buttons */}
          <button
            onClick={() => loadPreset('with-gaps')}
            className="hidden md:inline-flex px-2.5 py-1.5 rounded-full bg-[#FFDDB8] hover:bg-[#FFB95F] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-[10px] font-extrabold text-[#1B1B1E] uppercase cursor-pointer"
            title="Muat contoh jawaban dengan miskonsepsi"
          >
            Simulasi Gap
          </button>

          <button
            onClick={() => loadPreset('accurate')}
            className="hidden md:inline-flex px-2.5 py-1.5 rounded-full bg-[#E6F4EA] hover:bg-[#c2ebd0] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] text-[10px] font-extrabold text-[#059669] uppercase cursor-pointer"
            title="Muat contoh jawaban valid"
          >
            Simulasi Paham
          </button>

          <button
            onClick={() => loadPreset('clear')}
            className="p-1.5 rounded-full bg-white hover:bg-slate-100 border-2 border-[#1B1B1E] text-[#444655] hover:text-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] cursor-pointer"
            title="Reset Garis Relasi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white text-xs font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Mengevaluasi...' : 'Kirim & Evaluasi Graf'}</span>
          </button>
        </div>
      </div>

      {/* Main Reconstruction Canvas Workspace */}
      <div className="flex-1 relative w-full h-full">
        {/* Floating Kit Tray (Figma Frame 2 #46:420) */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] max-w-sm sm:max-w-md space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#1B1B1E]/10 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0038D1]"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1B1B1E]">
                CONCEPT KIT &bull; {kit.concepts.length} KEPINGAN TERSEDIA
              </span>
            </div>
            <span className="text-[9.5px] font-mono font-bold text-[#0038D1] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#0038D1]">
              Tarik Titik Soket
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {kit.concepts.map((c) => {
              const isUsed = edges.some(e => e.source === c.id || e.target === c.id);
              return (
                <span
                  key={c.id}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-[#1B1B1E] shadow-[1.5px_1.5px_0px_#1B1B1E] transition-all ${
                    isUsed ? 'bg-[#ECFDF5] text-[#065F46] border-[#059669]' : 'bg-[#FAF7F2] text-[#1B1B1E]'
                  }`}
                >
                  ■ [{c.label}]
                </span>
              );
            })}
          </div>

          <p className="text-[10.5px] text-[#71717A] leading-relaxed">
            💡 Pasang proposisi berarah dengan menarik garis soket antar simpul: <code className="bg-[#FAF7F2] px-1 py-0.5 rounded font-mono font-bold text-[#1B1B1E]">[Konsep Asal] ➔ [{selectedRelation}] ➔ [Konsep Tujuan]</code>
          </p>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap nodeStrokeColor="#1B1B1E" nodeColor="#FFEAA7" />
          <Background color="#1B1B1E" gap={24} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};
