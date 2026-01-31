
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Flashcard, MindMapNode } from "../types";

// Always initialize with named parameter and process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gemini Service - Educational and Portfolio Logic
 */
export const geminiService = {
  /**
   * Complex academic chat with Google Search grounding.
   * Uses gemini-3-pro-preview for advanced reasoning and up-to-date information.
   */
  chatWithTutor: async (prompt: string, history: any[]): Promise<GenerateContentResponse> => {
    return await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are ZenStudy AI, an elite academic tutor. Use Google Search to provide accurate, cited information. Format your responses with Markdown for clarity. Focus on educational depth and helping students solve problems step-by-step.",
      },
    });
  },

  /**
   * Structured JSON generation for study flashcards.
   * Uses gemini-3-pro-preview to ensure high-quality question/answer pairs.
   */
  generateFlashcards: async (topic: string): Promise<Flashcard[]> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate 6 high-quality study flashcards for the following topic: ${topic}. Focus on key definitions and conceptual understanding.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The study question or term" },
              answer: { type: Type.STRING, description: "The detailed explanation or answer" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant sub-topics" }
            },
            required: ["question", "answer"],
            propertyOrdering: ["question", "answer", "tags"]
          }
        },
      },
    });
    
    try {
      const text = response.text || "[]";
      return JSON.parse(text);
    } catch (e) {
      console.error("Flashcard generation error:", e);
      return [];
    }
  },

  /**
   * Structured JSON generation for hierarchical mind maps.
   * Uses gemini-3-pro-preview for logic and hierarchy construction.
   */
  generateMindMap: async (topic: string): Promise<MindMapNode> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a logical, hierarchical mind map structure for: ${topic}. Break it down into core concepts and supporting details.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "The name of the node" },
            children: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  children: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING }
                      },
                      required: ["label"]
                    }
                  }
                },
                required: ["label"]
              }
            }
          },
          required: ["label"],
          propertyOrdering: ["label", "children"]
        },
      },
    });
    
    try {
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (e) {
      console.error("Mind map generation error:", e);
      return { label: topic };
    }
  },

  /**
   * Portfolio-specific chat assistant.
   * Uses gemini-3-flash-preview for fast, light-weight responses.
   */
  chatWithAssistant: async (prompt: string, history: any[]): Promise<string> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are the personal assistant for Anto Bredly's portfolio. Anto is a 12th-grade student exploring AI/ML and systems programming. Be helpful and professional. You know about his projects (Aura Intelligence, Kinetic Studio, Prism Vision) and his goal to build intelligent systems through code and math.",
      },
    });
    return response.text || "";
  }
};
