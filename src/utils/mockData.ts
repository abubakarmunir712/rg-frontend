import type { User } from '../types/auth.types';
import type { ResearchResult, HistoryItem, Paper } from '../types/research.types';

/**
 * Generates a mock user for development
 */
export function generateMockUser(): User {
  return {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates mock papers
 */
export function generateMockPapers(count: number = 5): Paper[] {
  const papers: Paper[] = [];
  const topics = [
    'Machine Learning',
    'Neural Networks',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
  ];

  for (let i = 0; i < count; i++) {
    papers.push({
      title: `${topics[i % topics.length]} Research Paper ${i + 1}`,
      year: 2020 + Math.floor(Math.random() * 4),
      link: `https://example.com/paper-${i + 1}`,
      authors: ['Author A', 'Author B', 'Author C'],
    });
  }

  return papers;
}

/**
 * Generates a mock research result
 */
export function generateMockResearchResult(domain: string): ResearchResult {
  const gaps = [
    `Limited research on ${domain} applications in emerging markets`,
    `Insufficient studies on the long-term effects of ${domain} implementations`,
    `Gap in understanding the ethical implications of ${domain} technologies`,
    `Lack of comprehensive frameworks for ${domain} evaluation`,
    `Need for more interdisciplinary approaches to ${domain} research`,
  ];

  return {
    id: 'result-' + Math.random().toString(36).substr(2, 9),
    domain,
    gaps,
    papers: generateMockPapers(5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generates mock history items
 */
export function generateMockHistory(count: number = 10): HistoryItem[] {
  const domains = [
    'Machine Learning',
    'Quantum Computing',
    'Blockchain Technology',
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing',
    'Internet of Things',
    'Data Science',
  ];

  const items: HistoryItem[] = [];

  for (let i = 0; i < count; i++) {
    const domain = domains[i % domains.length];
    const date = new Date();
    date.setDate(date.getDate() - i);

    const id = 'history-' + Math.random().toString(36).substr(2, 9);

    // Generate and store complete result for each history item
    const fullResult = generateMockResearchResult(domain);
    fullResult.id = id;
    fullResult.createdAt = date.toISOString();
    fullResult.updatedAt = date.toISOString();
    
    // Store complete result in localStorage
    const resultKey = `research-result-${id}`;
    localStorage.setItem(resultKey, JSON.stringify(fullResult));

    items.push({
      id,
      topic: domain,
      date: date.toISOString(),
      preview: `Research gaps identified in ${domain} including limited applications...`,
      domain,
    });
  }

  return items;
}

/**
 * Simulates an API delay for mock data
 */
export function mockDelay(ms: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
