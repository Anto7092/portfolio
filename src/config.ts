import { Project } from './types';

/**
 * ═══════════════════════════════════════════════════════════════════
 * PORTFOLIO CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════
 *
 * This is the ONLY file you need to edit to update your portfolio.
 * After changing values, run `npm run build` and redeploy.
 */

export const USER_CONFIG = {
  // ─── Contact & Identity ─────────────────────────────────────────
  name: "Anto Bredly",
  role: "Student • AI / ML",
  email: "antotheprogrammer@gmail.com",
  phone: "+917092208939",
  profileImage: "/profile.jpg",

  // ─── Bio Page (About section) ───────────────────────────────────
  // Update paragraphs to change your story. Use "— — —" for visual dividers.
  // Keywords are highlighted in the text when they appear.
  bio: {
    heading: "About Me.",
    paragraphs: [
      "I'm a student interested in understanding how intelligence works — not just at a high level, but at the level of systems, code, and math.",
      "I enjoy building small projects that help me explore ideas in artificial intelligence and machine learning. I'm especially drawn to problems where logic, algorithms, and structure matter.",
      "This portfolio is a place where I document what I build, what I learn, and how my thinking evolves over time.",
      "— — —",
      "Right now, my focus is on strengthening my foundations in programming, algorithms, and mathematics, while gradually moving deeper into machine learning concepts through hands-on work.",
      "— — —",
      "I'm still learning — and that's the point."
    ],
    keywords: ["intelligence", "systems", "code", "math", "logic", "algorithms", "structure", "learning"],
    monogram: "AB"  // Large initials shown on About page
  },

  // ─── Timeline (About page) ──────────────────────────────────────
  // Add or edit events. Each needs: year, title, desc
  timeline: [
    { year: '2020', title: 'Started Programming', desc: 'Began learning programming through online courses and self-exploration.' },
    { year: '2023', title: 'Web & Competitions', desc: 'Designed and built websites, including projects for competitions.' },
    { year: '2025', title: 'Current Focus', desc: 'In 12th grade, preparing to study AI & ML and build stronger systems.' }
  ],

  // ─── Projects (Works section) ───────────────────────────────────
  // Add new projects: copy the block below and fill in your details.
  // - id: unique string (e.g. '4', '5')
  // - link: full URL to project, or '#' for "Coming soon"
  // - image: URL to project thumbnail (Unsplash, your CDN, etc.)
  projects: [
    {
      id: '1',
      title: 'Aura Intelligence',
      description: 'Generative UI systems adapting to user biometrics in real-time.',
      tags: ['GenAI', 'Biometric', 'WebGPU'],
      link: '#',
      image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: '2',
      title: 'Kinetic Studio',
      description: 'High-performance motion engine for interactive brand narratives.',
      tags: ['Rust', 'GLSL', 'WebGL'],
      link: '#',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: '3',
      title: 'Prism Vision',
      description: 'Spatial computing interfaces for the modern web browser.',
      tags: ['Three.js', 'React', 'Canvas'],
      link: '#',
      image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1200'
    }
  ],

  // ─── Skills (displayed on About page) ───────────────────────────
  skills: [
    "Python / NumPy",
    "Algorithms & DS",
    "React / TypeScript",
    "Linear Algebra"
  ]
};
