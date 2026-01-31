
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gemini Service - Integrated with @google/genai
 */
export const geminiService = {
  /**
   * Chat with the AI Study Tutor using Google Search grounding.
   */
  chatWithTutor: async (message: string, history: any[]): Promise<GenerateContentResponse> => {
    return await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert AI Study Tutor. Help students understand complex topics, find research sources, and solve academic problems. Use Google Search for up-to-date information.",
      }
    });
  },

  /**
   * Generate educational flashcards for a specific topic in JSON format.
   */
  generateFlashcards: async (topic: string) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a set of 5 high-quality educational flashcards about the topic: ${topic}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The study question" },
              answer: { type: Type.STRING, description: "The detailed answer" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant categories" }
            },
            required: ["question", "answer"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  /**
   * Generate a hierarchical mind map structure for a topic in JSON format.
   */
  generateMindMap: async (topic: string) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a hierarchical mind map structure for the topic: ${topic}. Focus on core concepts and sub-topics.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "The node name" },
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
                      }
                    }
                  }
                },
                required: ["label"]
              }
            }
          },
          required: ["label"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  /**
   * Chat with the Portfolio Assistant about Anto Bredly.
   */
  chatWithAssistant: async (message: string, history: any[]): Promise<string> => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are Anto Bredly's personal AI assistant. You help visitors explore Anto's portfolio, research interests in AI/ML, and professional background. You are friendly, professional, and concise. Anto is a 12th-grade student focused on building intelligent systems.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  }
};
