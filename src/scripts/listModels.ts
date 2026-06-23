import { GoogleGenAI } from '@google/genai';

async function listAvailableModels(apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  try {
    const models = await ai.models.list();

    console.log(models);
  } catch (error) {
    console.error(error);
  }
}

const apiKey = process.env.GEMINI_API_KEY || '';
console.log("API Key Present:", !!apiKey);

if (apiKey) {
  listAvailableModels(apiKey);
}