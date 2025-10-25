
export enum ReviewAspect {
  Quality = 'CODE_QUALITY',
  Refactor = 'REFACTORING',
  Bugs = 'BUG_DETECTION',
  Security = 'SECURITY_VULNERABILITIES',
  Performance = 'PERFORMANCE_OPTIMIZATION',
}

export interface ReviewRequest {
  code: string;
  language: string;
  aspect: ReviewAspect;
}

export interface ReviewSuggestion {
  line: number;
  suggestion: string;
  explanation: string;
}

export interface ReviewResult {
  summary: string;
  suggestions: ReviewSuggestion[];
}

export interface Language {
  id: string;
  name: string;
}
