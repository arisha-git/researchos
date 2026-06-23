import { SemanticChunk } from './retrieval';

export interface RetrievedChunk {
  chunk: SemanticChunk;
  relevance_score: number;
  rank: number;
}