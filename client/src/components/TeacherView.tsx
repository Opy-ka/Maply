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
  MarkerType,
  Edge,
  Node
} from '@xyflow/react';
import { MasterConceptMap, AssessmentConfig, AIDraftResponse, ConceptNode, ConceptEdge } from '../types/maply';
import { generateAIDraft } from '../lib/api';
import {
  Sparkles,
  CheckCheck,
  BrainCircuit,
  Check,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Plus,
  AlertTriangle,
  Save,
  Sliders
} from 'lucide-react';
import { CreateAssessmentWizard } from './CreateAssessmentWizard';

interface TeacherViewProps {
  masterMap: MasterConceptMap;
  assessmentConfig: AssessmentConfig;
  backendOnline: boolean;
  onSaveMasterMap: (newMap: MasterConceptMap) => Promise<void>;
  onSaveAssessment: (config: AssessmentConfig) => Promise<void>;
}

const NODE_STYLE: React.CSSProperties = {
  background: '#ffffff',
  color: '#1B1B1E',
  border: '2px solid #1B1B1E',
  borderRadius: '10px',
  padding: '12px 18px',
  fontWeight: 800,
  fontSize: '13px',
  boxShadow: '4px 4px 0px 0px #1B1B1E'
};

const decorateEdgeLabel = (label: string) => `── ${label} ──▶`;
const stripEdgeLabel = (label: string) => label.replace(/^──\s*/, '').replace(/\s*──▶$/, '').trim();
const decorateNodeLabel = (label: string) => `■ [${label}]`;
const stripNodeLabel = (label: string) => label.replace(/^■\s*\[/, '').replace(/\]$/, '').trim();

function toRfNode(n: ConceptNode, i: number): Node {
  return {
    id: n.id,
    type: 'default',
    data: { label: decorateNodeLabel(n.label), description: n.description },
    position: {
      x: n.x || 150 + (i % 3) * 220,
      y: n.y || 80 + Math.floor(i / 3) * 150
    },
    style: NODE_STYLE
  };
}

function toRfEdge(e: ConceptEdge): Edge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: decorateEdgeLabel(e.label),
    data: { is_bidirectional: !!e.is_bidirectional },
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#1B1B1E' },
    style: { stroke: '#1B1B1E', strokeWidth: 2.5 },
    labelStyle: { fill: '#1B1B1E', fontWeight: 800, fontSize: 11, fontFamily: 'monospace' },
    labelBgStyle: { fill: '#E6F4EA', fillOpacity: 1, rx: 4, ry: 4, stroke: '#1B1B1E', strokeWidth: 1.5 },
    labelBgPadding: [6, 4]
  };
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  masterMap,
  assessmentConfig,
  backendOnline,
  onSaveMasterMap,
  onSaveAssessment
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(masterMap.nodes.map(toRfNode));
  const [edges, setEdges, onEdgesChange] = useEdgesState(masterMap.edges.map(toRfEdge));

  // Builder inputs
  const [newConceptLabel, setNewConceptLabel] = useState('');
  const [relationLabel, setRelationLabel] = useState('contains');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // AI drawer
  const [showAiModal, setShowAiModal] = useState(false);
  const [topic, setTopic] = useState('Arsitektur Komputer — CPU');
  const [materialText, setMaterialText] = useState(
    'CPU terdiri dari Control Unit dan ALU. ALU melakukan operasi aritmatika dan logika. Register digunakan untuk menyimpan data sementara. Register bertukar data dengan Memory utama.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState<AIDraftResponse | null>(null);

  // Assessment wizard
  const [showWizard, setShowWizard] = useState(false);

  // Assessment config
  const [allowTolerance, setAllowTolerance] = useState(assessmentConfig.allow_bidirectional_tolerance);
  const [duration, setDuration] = useState(assessmentConfig.duration_minutes);

  // Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const showToast = (kind: 'ok' | 'err', msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const selectedEdge = edges.find((e) => e.id === selectedEdgeId) || null;
  const labelOf = (id: string) => {
    const n = nodes.find((x) => x.id === id);
    return n ? stripNodeLabel(String(n.data.label)) : id;
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const label = relationLabel.trim() || 'berkaitan dengan';
      const edge = toRfEdge({
        id: `e-${Date.now()}`,
        source: params.source,
        target: params.target,
        label
      });
      setEdges((eds) => addEdge(edge, eds));
    },
    [relationLabel, setEdges]
  );

  const handleAddConcept = () => {
    const label = newConceptLabel.trim();
    if (!label) return;
    if (nodes.some((n) => stripNodeLabel(String(n.data.label)).toLowerCase() === label.toLowerCase())) {
      showToast('err', `Konsep "${label}" sudah ada.`);
      return;
    }
    const id = `n-${Date.now()}`;
    setNodes((ns) => [...ns, toRfNode({ id, label, x: 80 + Math.random() * 400, y: 80 + Math.random() * 300 }, ns.length)]);
    setNewConceptLabel('');
  };

  const handleDeleteSelectedEdge = () => {
    if (!selectedEdgeId) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
    setSelectedEdgeId(null);
  };

  const handleRelabelSelectedEdge = () => {
    if (!selectedEdgeId) return;
    const label = relationLabel.trim();
    if (!label) return;
    setEdges((eds) => eds.map((e) => (e.id === selectedEdgeId ? { ...e, label: decorateEdgeLabel(label) } : e)));
  };

  const buildMapFromCanvas = (): MasterConceptMap => ({
    ...masterMap,
    status: 'approved',
    nodes: nodes.map((n) => ({
      id: n.id,
      label: stripNodeLabel(String(n.data.label)),
      description: (n.data.description as string | undefined) ?? undefined,
      x: n.position.x,
      y: n.position.y
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: stripEdgeLabel(String(e.label ?? '')),
      is_bidirectional: !!(e.data as { is_bidirectional?: boolean } | undefined)?.is_bidirectional
    }))
  });

  const persistMap = async (map: MasterConceptMap, successMsg: string) => {
    setIsSaving(true);
    try {
      await onSaveMasterMap(map);
      showToast('ok', successMsg);
    } catch (err) {
      showToast('err', `Gagal menyimpan: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLockMasterMap = () => {
    const map = buildMapFromCanvas();
    if (map.edges.length === 0) {
      showToast('err', 'Master Map harus memiliki minimal satu relasi.');
      return;
    }
    persistMap(
      map,
      backendOnline
        ? 'Master Map tersimpan di server. Kit mahasiswa diperbarui & hasil lama direset.'
        : 'Master Map disimpan lokal (backend offline).'
    );
  };

  const handleSaveConfig = async () => {
    try {
      await onSaveAssessment({
        ...assessmentConfig,
        duration_minutes: duration,
        allow_bidirectional_tolerance: allowTolerance
      });
      showToast('ok', 'Konfigurasi asesmen tersimpan.');
    } catch (err) {
      showToast('err', `Gagal menyimpan konfigurasi: ${(err as Error).message}`);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      setAiDraft(await generateAIDraft(topic, materialText));
    } catch (err) {
      showToast('err', `Ekstraksi AI gagal: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAIDraft = async () => {
    if (!aiDraft) return;
    setShowAiModal(false);
    // On success the parent remounts this view with the new map
    await persistMap(
      {
        ...masterMap,
        title: aiDraft.topic,
        nodes: aiDraft.nodes,
        edges: aiDraft.edges,
        status: 'approved'
      },
      'Draf AI disetujui & dijadikan Master Map.'
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.25rem)] bg-[#FAF7F2]">
      {/* Sub-Header Ribbon */}
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
          <p className="text-[11px] font-bold text-[#444655]">
            {nodes.length} konsep &bull; {edges.length} relasi
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] text-xs font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:shadow-[4px_4px_0px_#1B1B1E] transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-[#059669]" />
            <span>Wizard Asesmen 4-Step</span>
          </button>

          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white text-xs font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] hover:shadow-[4px_4px_0px_#1B1B1E] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFEAA7]" />
            <span>Generate Draf AI</span>
          </button>

          <button
            onClick={handleLockMasterMap}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFEAA7] hover:bg-[#FFDDB8] text-[#1B1B1E] text-xs font-black border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] transition-all disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Menyimpan...' : 'Kunci Master Map'}</span>
          </button>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed top-20 right-8 z-50 border-2 border-[#1B1B1E] px-4 py-2.5 rounded-xl shadow-[4px_4px_0px_#1B1B1E] flex items-center gap-2 text-xs font-extrabold animate-in fade-in duration-200 max-w-sm ${
            toast.kind === 'ok' ? 'bg-[#E6F4EA] text-[#059669]' : 'bg-[#FFE4E6] text-[#DA3437]'
          }`}
        >
          {toast.kind === 'ok' ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative w-full h-full">
          {/* Floating builder toolbar */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 p-3 rounded-2xl border-2 border-[#1B1B1E] shadow-[4px_4px_0px_#1B1B1E] space-y-2 w-72">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#444655] block">
              Editor Master Map
            </span>
            <div className="flex gap-1.5">
              <input
                id="new-concept-input"
                type="text"
                value={newConceptLabel}
                onChange={(e) => setNewConceptLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddConcept()}
                placeholder="Nama konsep baru"
                className="flex-1 min-w-0 px-2 py-1 border-2 border-[#1B1B1E] rounded-lg text-xs font-bold bg-[#FAF7F2] focus:outline-hidden"
              />
              <button
                id="add-concept-btn"
                onClick={handleAddConcept}
                className="px-2 py-1 rounded-lg bg-[#0038D1] text-white border-2 border-[#1B1B1E] text-xs font-black"
                title="Tambah konsep"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#444655] block mb-0.5">
                Label relasi (dipakai saat menarik garis antar-node)
              </label>
              <input
                id="relation-label-input"
                type="text"
                value={relationLabel}
                onChange={(e) => setRelationLabel(e.target.value)}
                className="w-full px-2 py-1 border-2 border-[#1B1B1E] rounded-lg text-xs font-bold bg-[#FFEAA7] focus:outline-hidden"
              />
            </div>
            <p className="text-[10px] text-[#444655] leading-tight">
              Klik relasi untuk memeriksa di panel kanan. Tekan Backspace untuk menghapus node/relasi terpilih.
            </p>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeClick={(_, edge) => setSelectedEdgeId(edge.id)}
            onPaneClick={() => setSelectedEdgeId(null)}
            fitView
          >
            <Controls />
            <MiniMap nodeStrokeColor="#1B1B1E" nodeColor="#FFEAA7" />
            <Background color="#1B1B1E" gap={24} size={1} />
          </ReactFlow>
        </div>

        {/* Right Aside Inspector */}
        <div className="w-88 bg-white border-l-2 border-[#1B1B1E] p-5 overflow-y-auto hidden lg:block space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#1B1B1E] pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E]">
              Live Proposition Inspector
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0EDF1] border border-[#1B1B1E] text-[#1B1B1E]">
              {edges.length} proposisi
            </span>
          </div>

          {selectedEdge ? (
            <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-[#1B1B1E] shadow-[3px_3px_0px_#1B1B1E] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-[#444655]">
                  Proposisi #{edges.findIndex((e) => e.id === selectedEdge.id) + 1}
                </span>
                <span className="text-[10px] font-bold text-[#0038D1] bg-white px-2 py-0.5 rounded-sm border border-[#1B1B1E]">
                  Terpilih
                </span>
              </div>

              <div className="text-xs font-bold text-[#1B1B1E] break-words">
                <strong>[{labelOf(selectedEdge.source)}]</strong> {String(selectedEdge.label)}{' '}
                <strong>[{labelOf(selectedEdge.target)}]</strong>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-[#1B1B1E]/20">
                <button
                  onClick={() => setSelectedEdgeId(null)}
                  className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#E6F4EA] border border-[#1B1B1E] text-[10px] font-bold text-[#059669] hover:bg-[#c2ebd0]"
                >
                  <ThumbsUp className="w-3 h-3" /> Terima
                </button>
                <button
                  onClick={handleDeleteSelectedEdge}
                  className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#FFE4E6] border border-[#1B1B1E] text-[10px] font-bold text-[#DA3437] hover:bg-[#fecdd3]"
                >
                  <ThumbsDown className="w-3 h-3" /> Tolak
                </button>
                <button
                  onClick={handleRelabelSelectedEdge}
                  title="Ganti label dengan isi kolom 'Label relasi'"
                  className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-white border border-[#1B1B1E] text-[10px] font-bold text-[#1B1B1E] hover:bg-slate-50"
                >
                  <Edit3 className="w-3 h-3" /> Ubah
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#FAF7F2] border-2 border-dashed border-[#1B1B1E] text-[11px] text-[#444655] font-medium">
              Klik salah satu relasi pada kanvas untuk meninjau, menolak, atau mengubah labelnya.
            </div>
          )}

          {/* Assessment Settings */}
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1B1B1E] block">
              Konfigurasi Asesmen
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1B1B1E] block mb-1">Durasi Asesmen (Menit)</label>
                <input
                  id="duration-input"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 border-2 border-[#1B1B1E] rounded-lg font-bold text-[#1B1B1E] bg-[#FAF7F2] focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FFEAA7] border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B1B1E]">Toleransi Arah Simetris</span>
                  <input
                    id="tolerance-toggle"
                    type="checkbox"
                    checked={allowTolerance}
                    onChange={(e) => setAllowTolerance(e.target.checked)}
                    className="w-4 h-4 accent-[#0038D1]"
                  />
                </div>
                <p className="text-[10px] text-[#444655] leading-tight">
                  Label simetris yang ditoleransi: {assessmentConfig.tolerated_symmetric_labels.join(', ')}.
                </p>
              </div>

              <button
                id="save-config-btn"
                onClick={handleSaveConfig}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#0038D1] hover:bg-[#2F54EB] text-white font-black border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]"
              >
                <Save className="w-3.5 h-3.5" /> Simpan Konfigurasi
              </button>

              <div className="p-3 rounded-xl bg-white border-2 border-[#1B1B1E] text-[#444655] space-y-1">
                <span className="font-bold text-[#1B1B1E] block text-[11px]">Metode Asesmen:</span>
                <p className="text-[10px] leading-relaxed">
                  Kit-Build Concept Mapping (F. Hirashima). Penilaian 100% deterministik graf NetworkX tanpa
                  halusinasi LLM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator Modal */}
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
                      Confidence {(aiDraft.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-xs text-[#444655] italic">{aiDraft.generation_notes}</p>

                  <div className="flex flex-wrap gap-1">
                    {aiDraft.nodes.map((n) => (
                      <span key={n.id} className="px-1.5 py-0.5 rounded-sm bg-[#FAF7F2] border border-[#1B1B1E] text-[10px] font-bold">
                        {n.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1B1B1E]/20 gap-2">
                    <span className="text-[10px] text-[#444655]">
                      Menyetujui akan mengganti Master Map & mereset hasil asesmen sebelumnya.
                    </span>
                    <button
                      onClick={handleApproveAIDraft}
                      className="shrink-0 px-4 py-2 rounded-full bg-[#FFEAA7] hover:bg-[#FFDDB8] text-[#1B1B1E] font-black text-xs border-2 border-[#1B1B1E] shadow-[2px_2px_0px_#1B1B1E]"
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

      {/* Assessment 4-Step Wizard Modal */}
      {showWizard && (
        <CreateAssessmentWizard
          masterMap={buildMapFromCanvas()}
          onSaveAssessment={onSaveAssessment}
          onClose={() => setShowWizard(false)}
        />
      )}
    </div>
  );
};
