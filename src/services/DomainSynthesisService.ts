import { IngestedDocument } from '../types/retrieval';
import { DomainSynthesisResult } from '../types/routing';
import { getGeminiClient } from './gemini';

export class DomainSynthesisService {
  public static async synthesize(documents: IngestedDocument[], apiKey: string): Promise<DomainSynthesisResult> {
    const client = getGeminiClient(apiKey);
    const context = documents.map(doc => ({
      name: doc.document_name,
      content: doc.pages.map(p => p.raw_text).join(" ").substring(0, 1500)
    }));

    const prompt = `
You are a Research Domain Synthesis engine. Analyze these documents to produce a holistic synthesis of the domain.

--- DOCUMENTS ---
${JSON.stringify(context, null, 2)}
--- END DOCUMENTS ---

Return a strict JSON object:
{
  "core_concepts": string[],
  "recurring_themes": string[],
  "methodologies": string[],
  "key_findings": string[],
  "domain_summary": string
}
`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text =
  typeof response.text === "string"
    ? response.text
    : JSON.stringify(response.text);

    const clean = text
  .replace(/^```json\s*/, "")
  .replace(/```$/, "")
  .trim();
    return JSON.parse(clean) as DomainSynthesisResult;
  }
}