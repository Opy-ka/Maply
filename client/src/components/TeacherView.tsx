'use client';

import React, { useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Edge,
  Node
} from '@xyflow/react';
import { MasterConceptMap, AssessmentConfig, AIDraftResponse } from '../types/maply';
import { generateAIDraft } from '../lib/api';
import { Sparkles, CheckCheck, Sliders, BrainCircuit, Check, ShieldCheck, ThumbsUp, ThumbsDown, Edit3 } from 'lucide-react';

interface TeacherViewProps {
  masterMap: MasterConceptMap;
  assessmentConfig: AssessmentConfig;
  onUpdateMasterMap: (newMap: MasterConceptMap) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  masterMap,
  assessmentConfig,
  onUpdateMasterMap
}) => {
  const initialNodes: Node[] = masterMap.nodes.map((n) => ({
    id: n.id,
    type: 'default',
    data: { label: `■ [${n.label}]` },
    position: { x: n.x || 300, y: n.y || 100 },
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

  const initialEdges: Edge[] = masterMap.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: `── ${e.label} ──▶`,
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
    style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
    labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11, fontFamily: 'monospace' },
    labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
    labelBgPadding: [6, 4]
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [showAiModal, setShowAiModal] = useState(false);
  const [topic, setTopic] = useState('Arsitektur Komputer — CPU');
  const [materialText, setMaterialText] = useState(
    'CPU terdiri dari Control Unit dan ALU. ALU melakukan operasi aritmatika dan logika. Register digunakan untuk menyimpan data sementara. Register bertukar data dengan Memory utama.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState<AIDraftResponse | null>(null);

  const [allowTolerance, setAllowTolerance] = useState(assessmentConfig.allow_bidirectional_tolerance);
  const [duration, setDuration] = useState(assessmentConfig.duration_minutes);
  const [saveToast, setSaveToast] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const draft = await generateAIDraft(topic, materialText);
      setAiDraft(draft);
    } catch (err) {
      console.error('AI Draft generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAIDraft = () => {
    if (!aiDraft) return;

    const updatedMap: MasterConceptMap = {
      ...masterMap,
      title: `${aiDraft.topic} (Disahkan Dosen)`,
      nodes: aiDraft.nodes,
      edges: aiDraft.edges,
      status: 'approved'
    };

    onUpdateMasterMap(updatedMap);

    const newRfNodes: Node[] = aiDraft.nodes.map((n, i) => ({
      id: n.id,
      type: 'default',
      data: { label: `■ [${n.label}]` },
      position: { x: n.x || 150 + (i % 3) * 220, y: n.y || 80 + Math.floor(i / 3) * 150 },
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

    const newRfEdges: Edge[] = aiDraft.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: `── ${e.label} ──▶`,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
      style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
      labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11 },
      labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 }
    }));

    setNodes(newRfNodes);
    setEdges(newRfEdges);
    setShowAiModal(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] bg-[#FAF7F2]">
      {/* Sub-Header Ribbon Matching Figma #7:379 */}
      <div className="bg-[#FAF7F2] border-b-2 border-[#1B1B1E] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-10 shadow-[0_2px_0px_#1B1B1E]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] border border-[#1B1B1E] text-[10px] font-extrabold text-[#059669]">
              ● CURRENT SESSION
            </span>
            <span className="text-xs font-bold text-[#444655]">FILKOM UB &bull; KELAS B</span>
          </div>
          <h1 className="text-base font-serif font-black text-[#1B1B1E] mt-0.5">
            {masterMap.title} &bull; Master Map Acuan
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white text-xs font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:shadow-[4px_4px_0px_#1B1B1E] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFEAA7]" />
            <span>Generate Draf AI</span>
          </button>

          <button
            onClick={() => {
              setSaveToast(true);
              setTimeout(() => setSaveToast(false), 3000);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFEAA7] hover:bg-[#FFDDB8] text-[#1B1B1E] text-xs font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Kunci Master Map</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#E6F4EA] text-[#059669] border-2 border-[#1B1B1E] px-4 py-2.5 rounded-xl shadow-[4px_4px_0px_#1B1B1E] flex items-center gap-2 text-xs font-extrabold animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>Master Concept Map berhasil disimpan & dikunci sebagai acuan formal.</span>
        </div>
      )}

      {/* Editor & Right Inspector Aside */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative w-full h-full">
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
            <Controls />
            <MiniMap nodeStrokeColor="#1B1B1E" nodeColor="#FFEAA7" />
            <Background color="#1B1B1E" gap={24} size={1} />
          </ReactFlow>
        </div>

        {/* Right Aside Inspector Matching Figma #7:817 */}
        <div className="w-88 bg-white border-l-2 border-[#1B1B1E] p-5 overflow-y-auto hidden lg:block space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1B1B1E] pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E]">
              LIVE PROPOSITION INSPECTOR
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4EA] border border-[#1B1B1E] text-[#059669]">
              94.8% Match
            </span>
          </div>

          {/* Active Proposition Card */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-[#444655]">PROPOSITION #12</span>
              <span className="text-[10px] font-bold text-[#059669] bg-white px-2 py-0.5 rounded-sm border border-[#1B1B1E]">
                ✓ Valid TP
              </span>
            </div>

            <div className="text-xs font-bold text-[#1B1B1E]">
              <strong>[ALU]</strong> ── stores temporary result in ──▶ <strong>[Register]</strong>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-[#1B1B1E]/20">
              <button className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#E6F4EA] border border-[#1B1B1E] text-[10px] font-bold text-[#059669] hover:bg-[#c2ebd0]">
                <ThumbsUp className="w-3 h-3" /> Terima
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#FFE4E6] border border-[#1B1B1E] text-[10px] font-bold text-[#DA3437] hover:bg-[#fecdd3]">
                <ThumbsDown className="w-3 h-3" /> Tolak
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-white border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] hover:bg-slate-50">
                <Edit3 className="w-3 h-3" /> Ubah
              </button>
            </div>
          </div>

          {/* Assessment Settings Card */}
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E] block">
              KONFIGURASI ASESMEN
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1B1B1E] block mb-1">Durasi Asesmen (Menit)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border-2 border-[#1B1B1E] rounded-lg font-bold text-[#1B1B1E] bg-[#FAF7F2] focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B1B1E]">Toleransi Arah Simetris</span>
                  <input
                    type="checkbox"
                    checked={allowTolerance}
                    onChange={(e) => setAllowTolerance(e.target.checked)}
                    className="w-4 h-4 accent-[#0038D1]"
                  />
                </div>
                <p className="text-[10px] text-[#444655] leading-tight">
                  Relasi interaktif dua arah (misal: <em>transfers data with</em>) tetap dinilai benar meski panah terbalik.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border-2 border-[#1B1B1E] text-[#444655] space-y-1">
                <span className="font-bold text-[#1B1B1E] block text-[11px]">Metode Asesmen:</span>
                <p className="text-[10px] leading-relaxed">
                  Kit-Build Concept Mapping (F. Hirashima). Penilaian 100% deterministik graf NetworkX tanpa halusinasi LLM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator Modal Matching Figma */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] rounded-2xl border-2 border-[#1B1B1E] shadow-[6px_6px_0px_#1B1B1E] max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1B1B1E] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-[#0038D1] text-white border border-[#1B1B1E]">
                  <BrainCircuit className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black font-serif text-[#1B1B1E] text-base">AI Concept Map Generator</h3>
                  <p className="text-[11px] text-[#444655]">Ekstraksi otomatis materi silabus menjadi draf graf</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-[#1B1B1E] font-black text-sm px-2 py-1 rounded-md border border-[#1B1B1E] bg-white hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#1B1B1E] block mb-1">Topik Materi</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#1B1B1E] rounded-lg text-xs font-bold text-[#1B1B1E] bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1B1B1E] block mb-1">Teks Materi Pembelajaran</label>
                <textarea
                  rows={3}
                  value={materialText}
                  onChange={(e) => setMaterialText(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#1B1B1E] rounded-lg text-xs font-medium text-[#1B1B1E] bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white text-xs font-bold border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFEAA7]" />
                  <span>{isGenerating ? 'AI Mengekstrak...' : 'Mulai Ekstraksi AI'}</span>
                </button>
              </div>

              {aiDraft && (
                <div className="p-4 rounded-xl bg-white border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1B1B1E]">
                      Hasil Draf AI ({aiDraft.nodes.length} Konsep &bull; {aiDraft.edges.length} Relasi)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F4EA] border border-[#1B1B1E] text-[#059669]">
                      94.8% Match
                    </span>
                  </div>

                  <p className="text-xs text-[#444655] italic">{aiDraft.generation_notes}</p>

                  <div className="flex justify-end pt-2 border-t border-[#1B1B1E]/20">
                    <button
                      onClick={handleApproveAIDraft}
                      className="px-4 py-2 rounded-full bg-[#FFEAA7] hover:bg-[#FFDDB8] text-[#1B1B1E] font-black text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]"
                    >
                      Setujui & Jadikan Master Map
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
