import { ChunkEmbedding, SemanticChunk } from '../types/retrieval';
import { RetrievedChunk } from '../types/citation';

export class RetrievalService {
  /**
   * Calculates the Cosine Similarity between two vectors.
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return normA === 0 || normB === 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Searches for relevant chunks and returns them as scored, ranked objects.
   */
  public static search(
    queryEmbedding: number[],
    embeddings: ChunkEmbedding[],
    chunks: SemanticChunk[],
    topK: number = 3
  ): RetrievedChunk[] {
    return embeddings
      .map((item) => {
  const chunk = chunks.find((c) => c.chunk_id === item.chunk_id);

  return {
    chunk,
    relevance_score: this.cosineSimilarity(
      queryEmbedding,
      item.embedding
    ),
  };
})
.filter(
  (item): item is { chunk: SemanticChunk; relevance_score: number } =>
    !!item.chunk
)
.sort((a, b) => b.relevance_score - a.relevance_score)
  .slice(0, topK)
  .map((item, index) => ({
    chunk: item.chunk,
    relevance_score: item.relevance_score,
    rank: index + 1,
      }));
}}