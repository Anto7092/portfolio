
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
  // Educational Platform Views
  DASHBOARD = 'DASHBOARD',
  AI_TUTOR = 'AI_TUTOR',
  FLASHCARDS = 'FLASHCARDS',
  MINDMAP = 'MINDMAP'
}

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

export interface Flashcard {
  question: string;
  answer: string;
  tags?: string[];
}

export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}
