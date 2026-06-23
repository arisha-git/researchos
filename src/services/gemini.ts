import { GoogleGenAI } from "@google/genai";

export const getGeminiClient = (apiKey: string) => {
  return new GoogleGenAI({ apiKey });
};