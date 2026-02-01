<<<<<<< HEAD
// src/services/gemini.ts
// TEMPORARY NO-AI VERSION
=======
import { GoogleGenAI, Type } from "@google/genai";

// GEMINI_API_KEY is injected at build time via Vite define
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb

/**
 * Gemini Service
 * Provides AI-powered capabilities for study tools and portfolio interaction.
 */
export const geminiService = {
<<<<<<< HEAD
  async chatWithAssistant() {
    return "AI is temporarily disabled.";
  },

  async chatWithTutor() {
    return "AI is temporarily disabled.";
  },

  async generateFlashcards() {
    return [];
  },

  async generateMindMap() {
    return null;
  },
};
=======
  /**
   * Handles tutor chat sessions with Google Search grounding enabled.
   * Fix for Error in AIChat.tsx on line 47.
   */
  chatWithTutor: async (message: string, history: any[]) => {
    if (!ai) {
      return { text: "AI features require a Gemini API key. Set GEMINI_API_KEY in your environment.", candidates: [] };
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are ZenStudy's AI Study Tutor. Help students understand academic concepts clearly and provide reliable sources via Google Search.",
      },
    });
    return response;
  },

  /**
   * Generates a set of flashcards for a specific topic in JSON format.
   * Fix for Error in FlashcardTool.tsx on line 17.
   */
  generateFlashcards: async (topic: string) => {
    if (!ai) return [];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 5 educational flashcards for: ${topic}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["question", "answer"],
          },
        },
      },
    });
    
    try {
      // Use .text property directly
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Flashcard generation failed", e);
      return [];
    }
  },

  /**
   * Generates a hierarchical mind map structure for a topic.
   * Fix for Error in MindMap.tsx on line 17.
   */
  generateMindMap: async (topic: string) => {
    if (!ai) return { label: topic, children: [] };
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Build a hierarchical mind map for the topic: ${topic}. Include at least two levels of sub-topics.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
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
                        label: { type: Type.STRING },
                      },
                      required: ["label"],
                    },
                  },
                },
                required: ["label"],
              },
            },
          },
          required: ["label"],
        },
      },
    });

    try {
      // Use .text property directly
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Mind map generation failed", e);
      return { label: topic, children: [] };
    }
  },

  /**
   * Chat interface for the portfolio assistant.
   * Fix for Error in ChatAssistant.tsx on line 42.
   */
  chatWithAssistant: async (message: string, history: any[]) => {
    if (!ai) {
      return "AI chat is unavailable. To enable it, set GEMINI_API_KEY in your deployment environment.";
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are the AI assistant for Anto Bredly's portfolio. Anto is a student focused on AI and ML. Help visitors explore his work and biography. Be helpful, professional, and concise.",
      },
    });
    // Return the text directly
    return response.text;
  },
};
>>>>>>> 46b1704e7aba05485f39c133dfe5a62e8f415abb
