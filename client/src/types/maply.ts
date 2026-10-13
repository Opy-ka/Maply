export interface ConceptNode {
  id: string;
  label: string;
  description?: string;
  group?: string;
  x?: number;
  y?: number;
}

export interface ConceptEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  is_bidirectional?: boolean;
}

export interface MasterConceptMap {
  id: string;
  title: string;
  description?: string;
  course_id?: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
  status: 'draft' | 'approved' | 'archived';
}

export interface AssessmentConfig {
  id: string;
  title: string;
  description?: string;
  master_map_id: string;
  duration_minutes: number;
  allow_bidirectional_tolerance: boolean;
  tolerated_symmetric_labels: string[];
  randomize_kit: boolean;
  weights: {
    concept_recognition: number;
    relationship_accuracy: number;
    structural_understanding: number;
  };
}

export interface ConceptKit {
  assessment_id: string;
  concepts: ConceptNode[];
  available_relationships: string[];
}

export interface EdgeEvaluationItem {
  source: string;
  source_label: string;
  target: string;
  target_label: string;
  label: string;
  status: 'correct' | 'incorrect' | 'missing';
  note?: string;
}

export interface EvaluationResult {
  student_id: string;
  student_name: string;
  assessment_id: string;
  total_score: number;
  concept_recognition_score: number;
  relationship_accuracy_score: number;
  structural_understanding_score: number;
  metrics: {
    precision: number;
    recall: number;
    f1_score: number;
    true_positive: number;
    false_positive: number;
    false_negative: number;
  };
  evaluated_edges: EdgeEvaluationItem[];
  knowledge_gaps: string[];
  strengths: string[];
}

export interface ClassKnowledgeGapSummary {
  assessment_id: string;
  total_students: number;
  average_score: number;
  score_distribution: {
    '<60': number;
    '60-69': number;
    '70-79': number;
    '80-89': number;
    '90-100': number;
  };
  problematic_relationships: {
    key: string;
    source: string;
    target: string;
    label: string;
    correct_percentage: number;
    error_percentage: number;
  }[];
  well_understood_relationships: {
    key: string;
    source: string;
    target: string;
    label: string;
    correct_percentage: number;
    error_percentage: number;
  }[];
}

export interface AIDraftResponse {
  topic: string;
  nodes: ConceptNode[];
  edges: ConceptEdge[];
  confidence_score: number;
  generation_notes: string;
}
