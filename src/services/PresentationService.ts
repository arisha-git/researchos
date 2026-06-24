import { IngestedDocument } from '../types/retrieval';
import { PresentationResult } from '../types/routing';
import { getGeminiClient } from './gemini';

/**
 * Service responsible for synthesizing document text across the ingested corpus
 * and creating a highly structured presentation slides outline.
 */
export class PresentationService {
  /**
   * Analyzes all ingested documents and generates an executive slide presentation result.
   */
  public static async generatePresentation(
    documents: IngestedDocument[],
    apiKey: string
  ): Promise<PresentationResult> {
    const fallbackResult: PresentationResult = {
      title: "Synthesized Research Overview",
      executive_summary: "A high-level synthesis of the active research corpus.",
      key_findings: ["Core research trends extracted from uploaded documentation."],
      methodologies: ["Standard academic frameworks and research approaches."],
      recommendations: ["Further empirical research and validation of findings."],
      conclusion: "Synthesis complete. Review individual sources for granular details."
    };

    if (documents.length === 0) {
      return fallbackResult;
    }

    try {
      const client = getGeminiClient(apiKey);

      // Create a clean summaries structure to send minimal but highly informative context to the model
      const documentSummaries = documents.map(doc => ({
        id: doc.id,
        name: doc.document_name,
        total_pages: doc.total_pages,
        abstractSnippet: doc.pages.slice(0, 2).map(p => p.raw_text).join(" ").substring(0, 1000)
      }));

      const prompt = `
You are an expert Executive Scientific Presenter. Analyze the following document abstracts/summaries and synthesize them into a cohesive, high-impact slide presentation layout.

--- RESEARCH CORPUS ---
${JSON.stringify(documentSummaries, null, 2)}
--- END RESEARCH CORPUS ---

Generate a highly analytical, peer-reviewed presentation structure and return it as a strict, valid JSON object matching the schema below:
{
  "title": "A compelling, accurate synthesis title spanning the domain",
  "executive_summary": "A concise executive narrative summarizing the central thesis of the domain",
  "key_findings": ["Finding 1", "Finding 2", "Finding 3"],
  "methodologies": ["Methodology 1", "Methodology 2"],
  "recommendations": ["Actionable research recommendation 1", "Recommendation 2"],
  "conclusion": "A firm concluding statement summarizing future trajectory and domain impact"
}

Return ONLY the raw JSON output. Do not include markdown formatting tags, explanation wrappers, or backticks outside of the raw text.
`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.3
        }
      });

      if (!response || !response.text) {
        return fallbackResult;
      }

      console.log(response.text);
      // Safely sanitize potential markdown wrappers or code fences
      const cleanResponse = response.text
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();

      const parsed = JSON.parse(cleanResponse);

      // Construct a strictly validated result with safe fallbacks
      const validatedResult: PresentationResult = {
        title: typeof parsed.title === 'string' && parsed.title ? parsed.title : fallbackResult.title,
        executive_summary: typeof parsed.executive_summary === 'string' && parsed.executive_summary ? parsed.executive_summary : fallbackResult.executive_summary,
        key_findings: Array.isArray(parsed.key_findings) && parsed.key_findings.length > 0 
          ? parsed.key_findings.map((item: any) => String(item)) 
          : fallbackResult.key_findings,
        methodologies: Array.isArray(parsed.methodologies) && parsed.methodologies.length > 0 
          ? parsed.methodologies.map((item: any) => String(item)) 
          : fallbackResult.methodologies,
        recommendations: Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0 
          ? parsed.recommendations.map((item: any) => String(item)) 
          : fallbackResult.recommendations,
        conclusion: typeof parsed.conclusion === 'string' && parsed.conclusion ? parsed.conclusion : fallbackResult.conclusion
      };

      return validatedResult;
    } catch (error) {
      console.error("Presentation generation failed, returning safe fallback data:", error);
      return fallbackResult;
    }
  }
}