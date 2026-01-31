// gpt.ts
import OpenAI from "openai";
import { USER_CONFIG } from "../config";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const gptService = {
  async chatWithAssistant(
    message: string,
    history: { role: 'user' | 'assistant', content: string }[]
  ) {
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
- It’s okay to say "I’m still learning" or "I’m figuring this out".

Content rules:
- Talk in first person ("I", "my").
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
- Avoid overselling projects.
- Keep answers clear and grounded.

Contact & Communication:
- Give your contact details if asked:
  Email: antotheprogrammer@gmail.com
  Phone: +917092208939
- Mention that you (Anto) won’t see this conversation later.

Knowledge Base - My Projects:
${projectContext}

About Me:
${bioContext}

Formatting rules:
- Avoid bullet points unless explicitly asked.
- Prefer short paragraphs (1–2 sentences each).
- Use line breaks to separate ideas.
- Never list more than one idea per paragraph.

When unsure:
- Ask a short clarifying question or give a reasonable assumption.
`;

    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
      { role: "user", content: message }
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  },

  async generateFlashcards(topic: string) {
    const prompt = `Create 5 educational flashcards for the topic: ${topic}. 
    Ensure questions are challenging and answers are clear. Respond in JSON format as an array of objects:
    [{ "question": "...", "answer": "...", "tags": ["..."] }]`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse flashcards JSON", e);
      return [];
    }
  },

  async generateMindMap(topic: string) {
    const prompt = `Generate a radial mind map structure for: ${topic}. 
    Break it into logical sub-topics and details. Respond in JSON format:
    { "label": "central topic", "children": [...] }`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (e) {
      console.error("Failed to parse mind map JSON", e);
      return null;
    }
  }
};
