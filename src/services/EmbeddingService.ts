import { GoogleGenAI } from '@google/genai';

/**
 * Service responsible for generating semantic embeddings using Google's Gemini models.
 * Compatible with @google/genai SDK (v2.9.0+).
 */
export class EmbeddingService {
  private ai: GoogleGenAI;
  private modelName = 'gemini-embedding-001';

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generates a single vector embedding for a given text string.
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    try {
      const result = await this.ai.models.embedContent({
        model: this.modelName,
        contents: { parts: [{ text }] },
      });

      if (!result.embeddings?.values) {
        throw new Error('Failed to retrieve embedding values from Gemini API.');
      }

      return result.embeddings[0].values ?? [];
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error('Semantic vector generation error.');
    }
  }

  /**
   * Generates batch embeddings for multiple text strings.
   */
  public async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const batchRequests = texts.map((text) => 
        this.ai.models.embedContent({
          model: this.modelName,
          contents: { parts: [{ text }] },
        })
      );

      const responses = await Promise.all(batchRequests);
      
      return responses.map((res, index) => {
  if (!res.embeddings?.[0]?.values) {
    throw new Error(`Failed to retrieve embedding for index ${index}`);
  }

  return res.embeddings[0].values;
});
    } catch (error) {
      console.error('Batch embedding generation failed:', error);
      throw new Error('Semantic batch vector generation error.');
    }
  }
}