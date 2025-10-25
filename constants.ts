
import { Language, ReviewAspect } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
];

export const REVIEW_ASPECTS_CONFIG = {
  [ReviewAspect.Quality]: {
    name: "Code Quality",
    description: "Assess overall code structure, readability, and adherence to best practices.",
    icon: "M5 13l4 4L19 7"
  },
  [ReviewAspect.Refactor]: {
    name: "Refactoring Suggestions",
    description: "Identify areas for simplification, modularization, and improved design.",
    icon: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
  },
  [ReviewAspect.Bugs]: {
    name: "Bug Detection",
    description: "Scan for logical errors, potential runtime issues, and common pitfalls.",
    icon: "M19 8h-1.88l-1.04-2.09c-.29-.58-.89-1-1.58-1h-5c-.69 0-1.29.42-1.58 1L6.88 8H5c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zM12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
  },
  [ReviewAspect.Security]: {
    name: "Security Vulnerabilities",
    description: "Check for common security flaws like injection attacks, XSS, and insecure configurations.",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
  },
  [ReviewAspect.Performance]: {
    name: "Performance Optimization",
    description: "Look for inefficient algorithms, memory leaks, and other performance bottlenecks.",
    icon: "M12 6v6l4 2"
  },
};
