export type WorkflowType = 
  | 'General Knowledge'
  | 'Single Document Analysis'
  | 'Multi-Document Comparison'
  | 'Research Gap Analysis'
  | 'Methodology Comparison'
  | 'Domain Synthesis';

export interface ClassificationRoute {
  workflow_selected: WorkflowType;
  classification_rationale: string;
  documents_to_consult: string[];
  analytical_strategy: string;
  retrieval_strategy: string;
  retrieval_scope: string;
  evidence_requirements: string[];
  citation_mode: 'optional' | 'strict';
  graph_generation_required: boolean;
  presentation_generation_required: boolean;
}

export interface GapAnalysisResult {
  missing_research_areas: string[];
  unanswered_questions: string[];
  weak_coverage_areas: string[];
  opportunities_for_investigation: string[];
  synthesis_summary: string;
}

export interface DomainSynthesisResult {
  core_concepts: string[];
  recurring_themes: string[];
  methodologies: string[];
  key_findings: string[];
  domain_summary: string;
}

export interface RoutingLogEntry {
  id: string;
  timestamp: number;
  originalQuery: string;
  route: ClassificationRoute;
}
