import { ClassificationRoute } from '../types/routing';
import { getGeminiClient } from '../services/gemini';

export class AgenticRouter {
  public async triageQuery(query: string, manifest: string[], apiKey: string): Promise<ClassificationRoute> {
    const client = getGeminiClient(apiKey);
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {}
    });
    return JSON.parse(response.text) as ClassificationRoute;
  }
}