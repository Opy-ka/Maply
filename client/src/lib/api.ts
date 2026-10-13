import {
  MasterConceptMap,
  AssessmentConfig,
  ConceptKit,
  EvaluationResult,
  ClassKnowledgeGapSummary,
  AIDraftResponse,
  ConceptNode,
  ConceptEdge
} from '../types/maply';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const INITIAL_MASTER_MAP: MasterConceptMap = {
  id: 'map-cpu-1',
  title: 'Arsitektur Komputer — Komponen CPU',
  description: 'Peta konsep acuan struktur CPU, ALU, Control Unit, Register, dan Memory.',
  course_id: 'course-cs101',
  nodes: [
    { id: 'cpu', label: 'CPU', description: 'Central Processing Unit', x: 300, y: 50 },
    { id: 'alu', label: 'ALU', description: 'Arithmetic Logic Unit', x: 150, y: 190 },
    { id: 'cu', label: 'Control Unit', description: 'Pengendali alur instruksi', x: 450, y: 190 },
    { id: 'register', label: 'Register', description: 'Penyimpan data internal super cepat', x: 150, y: 340 },
    { id: 'memory', label: 'Memory (RAM)', description: 'Penyimpan data utama sistem', x: 300, y: 480 },
  ],
  edges: [
    { id: 'e1', source: 'cpu', target: 'alu', label: 'contains' },
    { id: 'e2', source: 'cpu', target: 'cu', label: 'contains' },
    { id: 'e3', source: 'cpu', target: 'register', label: 'uses' },
    { id: 'e4', source: 'alu', target: 'register', label: 'stores temporary result in' },
    { id: 'e5', source: 'cu', target: 'alu', label: 'controls' },
    { id: 'e6', source: 'register', target: 'memory', label: 'transfers data with', is_bidirectional: true },
  ],
  status: 'approved'
};

export const INITIAL_ASSESSMENT: AssessmentConfig = {
  id: 'asm-1',
  title: 'Kuis Pemahaman Konseptual Arsitektur CPU',
  description: 'Susun kembali Concept Kit untuk menguji pemahaman aliran data antar-komponen CPU.',
  master_map_id: 'map-cpu-1',
  duration_minutes: 30,
  allow_bidirectional_tolerance: true,
  tolerated_symmetric_labels: ['transfers data with', 'interacts with', 'terhubung dengan'],
  randomize_kit: true,
  weights: {
    concept_recognition: 0.20,
    relationship_accuracy: 0.50,
    structural_understanding: 0.30
  }
};

export async function fetchMasterMap(mapId: string = 'map-cpu-1'): Promise<MasterConceptMap> {
  try {
    const res = await fetch(`${API_BASE_URL}/maps/master/${mapId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using initial data:', err);
  }
  return INITIAL_MASTER_MAP;
}

export async function fetchAssessmentKit(asmId: string = 'asm-1'): Promise<ConceptKit> {
  try {
    const res = await fetch(`${API_BASE_URL}/assessments/${asmId}/kit`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, generating client fallback kit:', err);
  }
  return {
    assessment_id: asmId,
    concepts: [...INITIAL_MASTER_MAP.nodes].sort(() => Math.random() - 0.5),
    available_relationships: ['contains', 'uses', 'stores temporary result in', 'controls', 'transfers data with']
  };
}

export async function submitStudentMap(
  asmId: string,
  studentName: string,
  nodes: ConceptNode[],
  edges: ConceptEdge[]
): Promise<EvaluationResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/assessments/${asmId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'mhs-' + Math.floor(Math.random() * 900 + 100),
        student_name: studentName,
        assessment_id: asmId,
        submitted_nodes: nodes,
        submitted_edges: edges
      })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, evaluating on client:', err);
  }

  // Client-side fallback deterministic evaluation
  const masterEdges = INITIAL_MASTER_MAP.edges;
  let tp = 0;
  let fp = 0;
  const evaluatedEdges: any[] = [];
  const matchedMasterIds = new Set<string>();

  for (const sEdge of edges) {
    const match = masterEdges.find(
      (m) =>
        (m.source === sEdge.source && m.target === sEdge.target && m.label.toLowerCase() === sEdge.label.toLowerCase()) ||
        (m.target === sEdge.source && m.source === sEdge.target && m.label.toLowerCase() === sEdge.label.toLowerCase() && m.is_bidirectional)
    );
    if (match) {
      tp++;
      matchedMasterIds.add(match.id);
      evaluatedEdges.push({
        source: sEdge.source,
        source_label: sEdge.source,
        target: sEdge.target,
        target_label: sEdge.target,
        label: sEdge.label,
        status: 'correct',
        note: 'Relasi dan arah sesuai dengan acuan.'
      });
    } else {
      fp++;
      evaluatedEdges.push({
        source: sEdge.source,
        source_label: sEdge.source,
        target: sEdge.target,
        target_label: sEdge.target,
        label: sEdge.label,
        status: 'incorrect',
        note: 'Relasi tidak sesuai dengan struktur acuan.'
      });
    }
  }

  const fn = masterEdges.length - matchedMasterIds.size;
  for (const mEdge of masterEdges) {
    if (!matchedMasterIds.has(mEdge.id)) {
      evaluatedEdges.push({
        source: mEdge.source,
        source_label: mEdge.source,
        target: mEdge.target,
        target_label: mEdge.target,
        label: mEdge.label,
        status: 'missing',
        note: `Relasi '${mEdge.label}' belum dibuat.`
      });
    }
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  const conceptRec = (nodes.length / INITIAL_MASTER_MAP.nodes.length) * 100;
  const relAcc = precision * 100;
  const structUnd = f1 * 100;
  const total = Math.round(0.2 * conceptRec + 0.5 * relAcc + 0.3 * structUnd);

  return {
    student_id: 'mhs-local',
    student_name: studentName,
    assessment_id: asmId,
    total_score: total,
    concept_recognition_score: Math.round(conceptRec),
    relationship_accuracy_score: Math.round(relAcc),
    structural_understanding_score: Math.round(structUnd),
    metrics: {
      precision: Number(precision.toFixed(2)),
      recall: Number(recall.toFixed(2)),
      f1_score: Number(f1.toFixed(2)),
      true_positive: tp,
      false_positive: fp,
      false_negative: fn
    },
    evaluated_edges: evaluatedEdges,
    knowledge_gaps: fn > 0 ? ['Hubungan komponen memori dan register memerlukan penguatan konsep aliran data.'] : [],
    strengths: tp > 0 ? ['Identifikasi struktur utama CPU berhasil direkonstruksi dengan tepat.'] : []
  };
}

export async function fetchClassAnalytics(asmId: string = 'asm-1'): Promise<ClassKnowledgeGapSummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/assessments/${asmId}/analytics`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using initial analytics data:', err);
  }

  return {
    assessment_id: asmId,
    total_students: 42,
    average_score: 76.4,
    score_distribution: {
      '<60': 3,
      '60-69': 7,
      '70-79': 15,
      '80-89': 11,
      '90-100': 6
    },
    problematic_relationships: [
      {
        key: 'Register -> Memory',
        source: 'Register',
        target: 'Memory (RAM)',
        label: 'transfers data with',
        correct_percentage: 38.1,
        error_percentage: 61.9
      },
      {
        key: 'ALU -> Register',
        source: 'ALU',
        target: 'Register',
        label: 'stores temporary result in',
        correct_percentage: 47.6,
        error_percentage: 52.4
      },
      {
        key: 'Control Unit -> ALU',
        source: 'Control Unit',
        target: 'ALU',
        label: 'controls',
        correct_percentage: 61.9,
        error_percentage: 38.1
      }
    ],
    well_understood_relationships: [
      {
        key: 'CPU -> ALU',
        source: 'CPU',
        target: 'ALU',
        label: 'contains',
        correct_percentage: 95.2,
        error_percentage: 4.8
      },
      {
        key: 'CPU -> Control Unit',
        source: 'CPU',
        target: 'Control Unit',
        label: 'contains',
        correct_percentage: 92.8,
        error_percentage: 7.2
      }
    ]
  };
}

export async function generateAIDraft(topic: string, materialText: string): Promise<AIDraftResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, material_text: materialText, target_node_count: 6 })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using local mock AI draft:', err);
  }

  return {
    topic,
    nodes: [
      { id: 'n-cpu', label: 'CPU', description: 'Unit pemroses sentral', x: 280, y: 40 },
      { id: 'n-alu', label: 'ALU', description: 'Operasi aritmatika & logika', x: 140, y: 170 },
      { id: 'n-cu', label: 'Control Unit', description: 'Pengendali siklus instruksi', x: 420, y: 170 },
      { id: 'n-reg', label: 'Register', description: 'Penyimpan data internal tercepat', x: 140, y: 310 },
      { id: 'n-mem', label: 'Memory (RAM)', description: 'Penyimpanan program & data eksternal', x: 280, y: 450 },
    ],
    edges: [
      { id: 'ae1', source: 'n-cpu', target: 'n-alu', label: 'contains' },
      { id: 'ae2', source: 'n-cpu', target: 'n-cu', label: 'contains' },
      { id: 'ae3', source: 'n-alu', target: 'n-reg', label: 'stores temporary result in' },
      { id: 'ae4', source: 'n-cu', target: 'n-alu', label: 'controls' },
      { id: 'ae5', source: 'n-reg', target: 'n-mem', label: 'transfers data with', is_bidirectional: true },
    ],
    confidence_score: 0.91,
    generation_notes: 'Draf otomatis berhasil mengekstrak 5 konsep utama dan 5 relasi berlabel dari materi komputer.'
  };
}
