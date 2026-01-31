
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  // Digital Twin assistant for portfolio chat
  async chatWithAssistant(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the AI Digital Twin of Anto Bredly, a world-renowned Creative Technologist. 
        Anto is known for:
        - Design Philosophy: "Minimalism is the ultimate sophistication."
        - Expertise: React, TypeScript, AI Engineering, and Motion Design.
        - Tone: Sophisticated, articulate, slightly mysterious, and extremely helpful.
        
        Refer to yourself as Anto's assistant or twin. Answer questions about his stack, his vision for the web, and how others can collaborate with him. 
        Always be concise and elegant.`
      }
    });

    return response.text;
  },

  // AI Tutor with Google Search grounding for accurate academic research
  async chatWithTutor(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are ZenStudy AI, a brilliant academic tutor. 
        Help students master difficult concepts through clear explanations and verified research. 
        Always provide high-quality information and use Google Search to find current facts or academic sources.`,
        tools: [{ googleSearch: {} }]
      }
    });
    return response;
  },

  // Generates structured flashcards using JSON response schema
  async generateFlashcards(topic: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 5 educational flashcards for the topic: ${topic}. Ensure questions are challenging and answers are clear.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The study question" },
              answer: { type: Type.STRING, description: "The concise answer" },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Subject matter tags"
              }
            },
            required: ["question", "answer"]
          }
        }
      }
    });
    try {
      const text = response.text || "[]";
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Failed to parse flashcards JSON", e);
      return [];
    }
  },

  // Generates hierarchical mind map data using JSON response schema
  async generateMindMap(topic: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a radial mind map structure for: ${topic}. Break it down into logical sub-topics and details.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "The central topic or node name" },
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
          required: ["label"]
        }
      }
    });
    try {
      const text = response.text || "{}";
      return JSON.parse(text.trim());
    } catch (e) {
      console.error("Failed to parse mind map JSON", e);
      return null;
    }
  }
};
