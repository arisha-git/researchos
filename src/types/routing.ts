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

export interface RoutingLogEntry {
  id: string;
  timestamp: number;
  originalQuery: string;
  route: ClassificationRoute;
}