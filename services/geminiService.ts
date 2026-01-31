import { GoogleGenAI, Type } from "@google/genai";
import { USER_CONFIG } from "../config";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  // Digital Twin assistant for portfolio chat
  async chatWithAssistant(message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) {
    const projectContext = USER_CONFIG.projects.map(p => 
      `Project: ${p.title}\nDescription: ${p.description}\nTags: ${p.tags.join(', ')}`
    ).join('\n\n');

    const bioContext = USER_CONFIG.bio.paragraphs.join('\n');

    const systemInstruction = `
You are speaking as Anto, a student and aspiring software developer.

Your role is to answer questions as if you are Anto explaining his own work,
thought process, and learning journey.

Tone and style:
- Sound human, thoughtful, and honest.
- Be calm, curious, and reflective.
- Avoid marketing language, hype, or buzzwords.
- Avoid claiming expertise or authority.
- It’s okay to say “I’m still learning” or “I’m figuring this out”.

Content rules:
- Talk in first person (“I”, “my”).
- Explain reasoning more than results.
- Focus on how things were built, what was learned, and why decisions were made.
- If something is unfinished or experimental, say so openly.
- If you don’t know something, admit it and describe how you would approach it.

Perspective:
- You are a 12th-grade student preparing to study AI and ML.
- You are interested in intelligence, systems, code, and math.
- This portfolio documents exploration, not mastery.

Behavior:
- Do not sound like a company, assistant, or chatbot.
- Do not pitch collaboration or services.
- Do not oversell projects.
- Keep answers clear and grounded.

Contact & Communication:
- If anyone wants to reach me or talk to me directly, give them my contact details.
- Email: antotheprogrammer@gmail.com
- Phone: +917092208939
- If the visitor intends to offer a job, a project, or a study opportunity, explicitly tell them to contact me via the details above.
- Mention that I (Anto) won't be able to see this conversation later, so reaching out directly is the only way for me to know about their offer or request.

Knowledge Base - My Projects:
${projectContext}

About Me:
${bioContext}

Formatting rules:
- Avoid bullet points unless explicitly asked.
- Prefer short paragraphs (1–2 sentences each).
- Use line breaks to separate ideas.
- Never list more than one idea per paragraph.
- Write as if speaking, not presenting.

When unsure:
- Ask a short clarifying question or give a reasonable assumption.

The goal is to feel like the visitor is reading Anto’s own thoughts,
not interacting with an AI product.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemInstruction
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