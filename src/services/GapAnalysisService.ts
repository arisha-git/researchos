import { IngestedDocument } from '../types/retrieval';
import { GapAnalysisResult } from '../types/routing';
import { getGeminiClient } from './gemini';

/**
 * Service responsible for cross-document synthesis to identify research gaps.
 */
export class GapAnalysisService {
  /**
   * Analyzes multiple documents to identify missing areas, unanswered questions,
   * and research opportunities.
   */
  public static async analyze(
    documents: IngestedDocument[],
    apiKey: string
  ): Promise<GapAnalysisResult> {
    const client = getGeminiClient(apiKey);

    // Construct a domain manifest for synthesis
    const domainManifest = documents.map(doc => ({
      name: doc.document_name,
      summary: doc.pages.slice(0, 2).map(p => p.raw_text).join(" ").substring(0, 1000)
    }));

    const prompt = `
You are an expert Research Synthesis Engine. Analyze the following research documents to identify gaps in the current body of work.

--- DOCUMENTS MANIFEST ---
${JSON.stringify(domainManifest, null, 2)}
--- END MANIFEST ---

Perform a structural gap analysis and return the result as a strict JSON object with the following fields:
- missing_research_areas: string[]
- unanswered_questions: string[]
- weak_coverage_areas: string[]
- opportunities_for_investigation: string[]
- synthesis_summary: string (a concise overview of the collective state of this research domain)

Ensure the JSON is valid and the analysis is grounded in the provided document summaries.
`;

    try {
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.3
        }
      });

      // Sanitize and parse response
      const cleanResponse = (response.text ?? "")
        .replace(/^```json\s*/, '')
        .replace(/```\s*$/, '')
        .trim();

      const parsed = JSON.parse(cleanResponse);

      // Validate required fields and provide safe fallbacks
      const result: GapAnalysisResult = {
        missing_research_areas: Array.isArray(parsed.missing_research_areas) ? parsed.missing_research_areas : [],
        unanswered_questions: Array.isArray(parsed.unanswered_questions) ? parsed.unanswered_questions : [],
        weak_coverage_areas: Array.isArray(parsed.weak_coverage_areas) ? parsed.weak_coverage_areas : [],
        opportunities_for_investigation: Array.isArray(parsed.opportunities_for_investigation) ? parsed.opportunities_for_investigation : [],
        synthesis_summary: typeof parsed.synthesis_summary === 'string' ? parsed.synthesis_summary : "Synthesis unavailable."
      };

      return result;
    } catch (error) {
      console.error("Gap Analysis synthesis failed:", error);
      throw new Error("Failed to generate research gap synthesis.");
    }
  }
}