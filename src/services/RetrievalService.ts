import { ChunkEmbedding } from '../types/retrieval';

/**
 * Service responsible for semantic retrieval via cosine similarity.
 * Performs similarity search against the chunk embedding index.
 */
export class RetrievalService {
  /**
   * Calculates the Cosine Similarity between two vectors.
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Performs a similarity search to return the top K relevant chunk IDs.
   */
  public static search(
    queryEmbedding: number[],
    embeddings: ChunkEmbedding[],
    topK: number = 5
  ): string[] {
    const scoredChunks = embeddings.map((item) => ({
      chunk_id: item.chunk_id,
      score: this.cosineSimilarity(queryEmbedding, item.embedding),
    }));

    // Sort by score descending and take top K
    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((item) => item.chunk_id);
  }
}