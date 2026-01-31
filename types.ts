export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
}

export enum AppView {
  HOME = 'HOME',
  PROJECTS = 'PROJECTS',
  ABOUT = 'ABOUT',
  // Fix for AppView missing properties in Layout.tsx and StudyDashboard.tsx
  DASHBOARD = 'DASHBOARD',
  AI_TUTOR = 'AI_TUTOR',
  FLASHCARDS = 'FLASHCARDS',
  MINDMAP = 'MINDMAP'
}

// Fix for missing types in AIChat.tsx and ChatAssistant.tsx
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

// Fix for missing Flashcard type in FlashcardTool.tsx
export interface Flashcard {
  question: string;
  answer: string;
  tags?: string[];
}

// Fix for missing MindMapNode type in MindMap.tsx
export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}