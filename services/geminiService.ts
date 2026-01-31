
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Gemini Service - Handles all AI-powered functionality using the Google GenAI SDK.
 */
// Initialize the Gemini client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Chat with a study tutor using Google Search grounding.
   * Returns the full GenerateContentResponse to allow extraction of grounding metadata.
   */
  chatWithTutor: async (message: string, history: any[]) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are ZenStudy AI, an expert academic tutor. Provide clear, concise explanations and use your search tool to verify facts or find recent research. Always cite your findings.",
      },
    });
    return response;
  },

  /**
   * Simple chat for the portfolio assistant interface.
   * Returns the generated text output.
   */
  chatWithAssistant: async (message: string, history: any[]) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are Anto Bredly's personal portfolio assistant. Be helpful, professional, and friendly. Answer questions about his projects, skills, and background based on the portfolio context.",
      },
    });
    return response.text || "";
  },

  /**
   * Generates a list of structured flashcards from a given topic using JSON response mode.
   */
  generateFlashcards: async (topic: string) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a set of 5 educational flashcards for the topic: "${topic}". Each card should have a clear question, a detailed answer, and relevant tags.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ["question", "answer"],
            propertyOrdering: ["question", "answer", "tags"],
          },
        },
      },
    });
    
    try {
      const jsonStr = response.text || "[]";
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Error parsing flashcards JSON:", e);
      return [];
    }
  },

  /**
   * Generates hierarchical data for a radial mind map using JSON response mode.
   */
  generateMindMap: async (topic: string) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a hierarchical mind map structure for the topic: "${topic}". Break it down into key concepts and sub-concepts.`,
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
                        label: { type: Type.STRING }
                      }
                    }
                  }
                },
                required: ["label"],
                propertyOrdering: ["label", "children"],
              }
            }
          },
          required: ["label"],
          propertyOrdering: ["label", "children"],
        },
      },
    });

    try {
      const jsonStr = response.text || "{}";
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.error("Error parsing mind map JSON:", e);
      return { label: topic, children: [] };
    }
  }
};
