/**
 * Gemini Service - AI features disabled.
 * Used by study tools (AIChat, FlashcardTool, MindMap) that are not in the main app.
 */
export const geminiService = {
  async chatWithAssistant() {
    return "AI is temporarily disabled.";
  },
  async chatWithTutor() {
    return { text: "AI is temporarily disabled.", candidates: [] };
  },
  async generateFlashcards() {
    return [];
  },
  async generateMindMap() {
    return { label: "", children: [] };
  },
};
