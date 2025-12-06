export interface Paper {
  title: string;
  year: number;
  link: string;
  authors?: string[];
}

export interface AdvancedFilters {
  yearRange?: { start: number; end: number };
  numberOfPapers?: number;
  includeKeywords?: string[];
  excludeKeywords?: string[];
}

export interface ResearchResult {
  id: string;
  domain: string;
  gaps: string[];
  papers?: Paper[];
  filters?: AdvancedFilters;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchRequest {
  domain: string;
  yearRange?: { start: number; end: number };
  numberOfPapers?: number;
  includeKeywords?: string[];
  excludeKeywords?: string[];
}

export interface GenerateRequest {
  domain: string;
  filters?: AdvancedFilters;
}

export interface GenerateResponse {
  result: ResearchResult;
}

export interface HistoryItem {
  id: string;
  topic: string;
  date: string;
  preview: string;
  domain: string;
}

export type SortOption = 'newest' | 'oldest' | 'topic';
