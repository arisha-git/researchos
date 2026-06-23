import { RetrievedChunk } from '../types/citation';
import { ContextAssembler } from './ContextAssembler';
import { getGeminiClient } from './gemini';

/**
 * Service responsible for generating grounded answers using retrieved context.
 */
export class GeminiCopilotService {
  /**
   * Generates a grounded response to a user query based on provided chunks.
   * * @param query The user's input question
   * @param chunks Relevant research chunks retrieved from the store
   * @param apiKey User's API key for Gemini authentication
   * @returns Generated answer string
   */


  public static async generateGroundedAnswer(
    query: string,
    chunks: RetrievedChunk[],
    apiKey: string
  ): Promise<string> {
    const client = getGeminiClient(apiKey);
    const context = ContextAssembler.assemble(chunks);

    const prompt = `
You are an expert Research Copilot. Use the following pieces of retrieved research context to answer the user's question accurately. If the answer is not contained within the provided context, state that clearly based on the provided documents.

--- RESEARCH CONTEXT ---
${context}
--- END RESEARCH CONTEXT ---

User Question: ${query}

Provide a concise, analytical answer based strictly on the evidence above. Cite specific documents and page numbers where possible.
`;

    try {
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2, // Low temperature for more factual, grounded output
        }
      });

      // Handle both raw string responses or parsed JSON objects if applicable
      return typeof response.text === 'string' ? response.text : JSON.stringify(response.text);
    } catch (error) {
      console.error("Gemini Copilot generation failed:", error);
      throw new Error("Failed to generate research response.");
    }
  }
}