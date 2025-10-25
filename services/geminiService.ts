
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewRequest, ReviewResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const reviewSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, high-level summary of the code quality and overall findings. Should be 2-3 sentences."
    },
    suggestions: {
      type: Type.ARRAY,
      description: "A list of specific, actionable suggestions for improvement.",
      items: {
        type: Type.OBJECT,
        properties: {
          line: {
            type: Type.INTEGER,
            description: "The specific line number the suggestion applies to. Use 0 if it's a general suggestion."
          },
          suggestion: {
            type: Type.STRING,
            description: "A concise, one-sentence description of the suggested change."
          },
          explanation: {
            type: Type.STRING,
            description: "A detailed explanation of why the change is recommended, including its benefits."
          }
        },
        required: ["line", "suggestion", "explanation"]
      }
    }
  },
  required: ["summary", "suggestions"]
};

const getSystemInstruction = (aspect: string, language: string): string => {
  const aspectMap: { [key: string]: string } = {
    CODE_QUALITY: "focus on readability, maintainability, and best practices.",
    REFACTORING: "focus on code structure, simplification, and identifying opportunities for abstraction.",
    BUG_DETECTION: "focus on finding logical errors, potential edge cases, and runtime exceptions.",
    SECURITY_VULNERABILITIES: "focus on identifying common security flaws like injection, XSS, and data exposure.",
    PERFORMANCE_OPTIMIZATION: "focus on finding performance bottlenecks, inefficient loops, and memory management issues.",
  };
  return `You are an expert code reviewer. Your task is to analyze the following ${language} code snippet. Please ${aspectMap[aspect]} Provide a concise summary and a list of specific, actionable suggestions. For each suggestion, provide the line number, a brief suggestion, and a clear explanation.`;
};


export const generateCodeReview = async (request: ReviewRequest): Promise<ReviewResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: request.code }]
      },
      config: {
        systemInstruction: getSystemInstruction(request.aspect, request.language),
        responseMimeType: "application/json",
        responseSchema: reviewSchema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text.trim();
    // Basic cleanup in case of markdown fences
    const cleanedJson = jsonString.replace(/^```json\s*|```\s*$/g, '');
    const reviewData = JSON.parse(cleanedJson);
    
    return reviewData as ReviewResult;

  } catch (error) {
    console.error("Error generating code review:", error);
    throw new Error("Failed to get review from Gemini API. Please check your API key and network connection.");
  }
};
