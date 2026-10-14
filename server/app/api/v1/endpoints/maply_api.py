from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
import uuid
import pypdf
import io

from app.models.schemas import (
    MasterConceptMap,
    AssessmentConfig,
    ConceptKit,
    StudentSubmission,
    EvaluationResult,
    ClassKnowledgeGapSummary,
    AIDraftRequest,
    AIDraftResponse,
    ConceptNode,
    ConceptEdge,
)
from app.services.graph_engine import GraphAssessmentEngine
from app.services.kit_generator import KitGenerator
from app.services.ai_service import AIService

router = APIRouter()

# In-Memory Database for rapid MVP demonstration
SAMPLE_NODES = [
    ConceptNode(id="cpu", label="CPU", description="Central Processing Unit", x=320, y=40),
    ConceptNode(id="alu", label="ALU", description="Arithmetic Logic Unit", x=160, y=180),
    ConceptNode(id="cu", label="Control Unit", description="Pengendali instruksi dan sinyal", x=480, y=180),
    ConceptNode(id="register", label="Register", description="Penyimpan data internal sementara", x=160, y=320),
    ConceptNode(id="memory", label="Memory (RAM)", description="Memori penyimpanan data utama", x=320, y=460),
]

SAMPLE_EDGES = [
    ConceptEdge(id="e1", source="cpu", target="alu", label="contains"),
    ConceptEdge(id="e2", source="cpu", target="cu", label="contains"),
    ConceptEdge(id="e3", source="cpu", target="register", label="uses"),
    ConceptEdge(id="e4", source="alu", target="register", label="stores temporary result in"),
    ConceptEdge(id="e5", source="cu", target="alu", label="controls"),
    ConceptEdge(id="e6", source="register", target="memory", label="transfers data with", is_bidirectional=True),
]

DB_MASTER_MAPS: dict[str, MasterConceptMap] = {
    "map-cpu-1": MasterConceptMap(
        id="map-cpu-1",
        title="Arsitektur Komputer — Komponen CPU",
        description="Peta acuan struktur CPU, ALU, CU, Register, dan Memory.",
        course_id="course-cs101",
        nodes=SAMPLE_NODES,
        edges=SAMPLE_EDGES,
        status="approved"
    )
}

DB_ASSESSMENTS: dict[str, AssessmentConfig] = {
    "asm-1": AssessmentConfig(
        id="asm-1",
        title="Kuis Pemahaman Konseptual CPU",
        description="Rekonstruksi komponen utama CPU dan alur transfer data.",
        master_map_id="map-cpu-1",
        duration_minutes=30,
        allow_bidirectional_tolerance=True,
        tolerated_symmetric_labels=["transfers data with", "interacts with", "terhubung dengan"]
    )
}

DB_SUBMISSIONS: dict[str, List[EvaluationResult]] = {
    "asm-1": []
}

# Seed realistic class submissions for rich analytics out of the box
def seed_class_results():
    if not DB_SUBMISSIONS["asm-1"]:
        # Student 1: High performer
        sub1 = StudentSubmission(
            student_id="mhs-01",
            student_name="Budi Santoso",
            assessment_id="asm-1",
            submitted_nodes=SAMPLE_NODES,
            submitted_edges=SAMPLE_EDGES[:5]  # missed e6
        )
        res1 = GraphAssessmentEngine.evaluate_submission(DB_MASTER_MAPS["map-cpu-1"], sub1, DB_ASSESSMENTS["asm-1"])
        DB_SUBMISSIONS["asm-1"].append(res1)

        # Student 2: Common gap (missed ALU -> Register and Register -> Memory)
        sub2 = StudentSubmission(
            student_id="mhs-02",
            student_name="Siti Rahma",
            assessment_id="asm-1",
            submitted_nodes=SAMPLE_NODES,
            submitted_edges=[
                ConceptEdge(id="s1", source="cpu", target="alu", label="contains"),
                ConceptEdge(id="s2", source="cpu", target="cu", label="contains"),
                ConceptEdge(id="s3", source="alu", target="memory", label="directly connects to"),  # wrong!
            ]
        )
        res2 = GraphAssessmentEngine.evaluate_submission(DB_MASTER_MAPS["map-cpu-1"], sub2, DB_ASSESSMENTS["asm-1"])
        DB_SUBMISSIONS["asm-1"].append(res2)

        # Student 3: Perfect score
        sub3 = StudentSubmission(
            student_id="mhs-03",
            student_name="Ahmad Fauzan",
            assessment_id="asm-1",
            submitted_nodes=SAMPLE_NODES,
            submitted_edges=SAMPLE_EDGES
        )
        res3 = GraphAssessmentEngine.evaluate_submission(DB_MASTER_MAPS["map-cpu-1"], sub3, DB_ASSESSMENTS["asm-1"])
        DB_SUBMISSIONS["asm-1"].append(res3)

seed_class_results()

# Endpoints
@router.get("/assessments", response_model=List[AssessmentConfig])
def list_assessments():
    return list(DB_ASSESSMENTS.values())

@router.get("/assessments/{assessment_id}", response_model=AssessmentConfig)
def get_assessment(assessment_id: str):
    if assessment_id not in DB_ASSESSMENTS:
        raise HTTPException(status_code=404, detail="Assessment tidak ditemukan")
    return DB_ASSESSMENTS[assessment_id]

@router.put("/assessments/{assessment_id}", response_model=AssessmentConfig)
def update_assessment(assessment_id: str, config: AssessmentConfig):
    if assessment_id not in DB_ASSESSMENTS:
        raise HTTPException(status_code=404, detail="Assessment tidak ditemukan")
    if config.id != assessment_id:
        raise HTTPException(status_code=400, detail="ID assessment tidak cocok")
    if config.master_map_id not in DB_MASTER_MAPS:
        raise HTTPException(status_code=404, detail="Master Map tidak ditemukan")
    DB_ASSESSMENTS[assessment_id] = config
    return config

@router.get("/assessments/{assessment_id}/kit", response_model=ConceptKit)
def get_assessment_kit(assessment_id: str):
    if assessment_id not in DB_ASSESSMENTS:
        raise HTTPException(status_code=404, detail="Assessment tidak ditemukan")
    asm = DB_ASSESSMENTS[assessment_id]
    master_map = DB_MASTER_MAPS.get(asm.master_map_id)
    if not master_map:
        raise HTTPException(status_code=404, detail="Master Map tidak ditemukan")
    return KitGenerator.generate_kit(master_map, shuffle=asm.randomize_kit)

@router.get("/maps/master/{map_id}", response_model=MasterConceptMap)
def get_master_map(map_id: str):
    if map_id not in DB_MASTER_MAPS:
        raise HTTPException(status_code=404, detail="Master Map tidak ditemukan")
    return DB_MASTER_MAPS[map_id]

@router.post("/maps/master", response_model=MasterConceptMap)
def save_master_map(master_map: MasterConceptMap):
    node_ids = {n.id for n in master_map.nodes}
    if not node_ids:
        raise HTTPException(status_code=422, detail="Master Map harus memiliki minimal satu konsep")
    for e in master_map.edges:
        if e.source not in node_ids or e.target not in node_ids:
            raise HTTPException(
                status_code=422,
                detail=f"Relasi '{e.id}' merujuk node yang tidak ada ({e.source} -> {e.target})"
            )

    DB_MASTER_MAPS[master_map.id] = master_map

    # Results graded against the previous version of this map are no longer valid
    for asm_id, asm in DB_ASSESSMENTS.items():
        if asm.master_map_id == master_map.id:
            DB_SUBMISSIONS[asm_id] = []
    return master_map

@router.post("/assessments/{assessment_id}/submit", response_model=EvaluationResult)
def submit_student_map(assessment_id: str, submission: StudentSubmission):
    if assessment_id not in DB_ASSESSMENTS:
        raise HTTPException(status_code=404, detail="Assessment tidak ditemukan")
    asm = DB_ASSESSMENTS[assessment_id]
    master_map = DB_MASTER_MAPS.get(asm.master_map_id)
    if not master_map:
        raise HTTPException(status_code=404, detail="Master Map tidak ditemukan")

    result = GraphAssessmentEngine.evaluate_submission(master_map, submission, asm)
    DB_SUBMISSIONS.setdefault(assessment_id, []).append(result)
    return result

@router.get("/assessments/{assessment_id}/analytics", response_model=ClassKnowledgeGapSummary)
def get_class_analytics(assessment_id: str):
    if assessment_id not in DB_ASSESSMENTS:
        raise HTTPException(status_code=404, detail="Assessment tidak ditemukan")
    asm = DB_ASSESSMENTS[assessment_id]
    master_map = DB_MASTER_MAPS.get(asm.master_map_id)
    if not master_map:
        raise HTTPException(status_code=404, detail="Master Map tidak ditemukan")

    results = DB_SUBMISSIONS.get(assessment_id, [])
    return GraphAssessmentEngine.aggregate_class_knowledge_gaps(master_map, results)

@router.post("/ai/draft", response_model=AIDraftResponse)
async def generate_ai_draft(payload: AIDraftRequest):
    return await AIService.generate_concept_map_draft(
        topic=payload.topic,
        text=payload.material_text,
        target_node_count=payload.target_node_count or 7
    )

@router.post("/ai/draft-from-file", response_model=AIDraftResponse)
async def generate_ai_draft_from_file(
    topic: str = Form(...),
    file: UploadFile = File(...)
):
    content_bytes = await file.read()
    extracted_text = ""
    
    if file.filename.endswith(".pdf"):
        pdf_reader = pypdf.PdfReader(io.BytesIO(content_bytes))
        for page in pdf_reader.pages:
            extracted_text += (page.extract_text() or "") + "\n"
    else:
        try:
            extracted_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = content_bytes.decode("latin-1", errors="ignore")

    if not extracted_text.strip():
        extracted_text = f"Materi seputar {topic}."

    return await AIService.generate_concept_map_draft(
        topic=topic,
        text=extracted_text,
        target_node_count=7
    )
