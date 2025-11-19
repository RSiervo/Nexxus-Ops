import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeSystemLogs = async (logs: string): Promise<AIAnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following system logs from a data center environment. 
      Identify the root cause of any errors, assess the severity, and provide actionable recommendations for a Site Reliability Engineer.
      
      Logs:
      ${logs}`,
      config: {
        systemInstruction: "You are an expert Site Reliability Engineer and Systems Architect.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise summary of what the logs indicate." },
            severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], description: "The overall severity of the identified issues." },
            rootCause: { type: Type.STRING, description: "The likely technical root cause of the issue." },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of actionable steps to resolve the issue."
            }
          },
          required: ["summary", "severity", "rootCause", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
