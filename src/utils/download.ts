import type { ResearchResult } from '../types/research.types';

/**
 * Formats research result as plain text
 */
function formatResultAsText(result: ResearchResult): string {
  let text = `Research Gap Analysis\n`;
  text += `Domain: ${result.domain}\n`;
  text += `Generated: ${new Date(result.createdAt).toLocaleString()}\n`;
  text += `\n${'='.repeat(50)}\n\n`;

  text += `Research Gaps:\n\n`;
  result.gaps.forEach((gap, index) => {
    text += `${index + 1}. ${gap}\n\n`;
  });

  if (result.papers && result.papers.length > 0) {
    text += `\n${'='.repeat(50)}\n\n`;
    text += `Referenced Papers:\n\n`;
    result.papers.forEach((paper, index) => {
      text += `${index + 1}. ${paper.title} (${paper.year})\n`;
      if (paper.authors && paper.authors.length > 0) {
        text += `   Authors: ${paper.authors.join(', ')}\n`;
      }
      text += `   Link: ${paper.link}\n\n`;
    });
  }

  return text;
}

/**
 * Downloads research result as a text file
 * Requirement: 2.3
 */
export function downloadAsTxt(result: ResearchResult): void {
  const text = formatResultAsText(result);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `research-gaps-${result.domain.replace(/\s+/g, '-')}-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads research result as a PDF file
 * Requirement: 2.2
 * 
 * Note: This is a simplified implementation that creates a text-based PDF.
 * For production, consider using a library like jsPDF or pdfmake for better formatting.
 */
export function downloadAsPdf(result: ResearchResult): void {
  // For now, we'll create a simple HTML-based PDF using the browser's print functionality
  // In a real implementation, you'd use a library like jsPDF
  
  const text = formatResultAsText(result);
  
  // Create a simple HTML document for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Research Gap Analysis - ${result.domain}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .gap {
          margin: 20px 0;
        }
        .paper {
          margin: 15px 0;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${text}</pre>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `research-gaps-${result.domain.replace(/\s+/g, '-')}-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies research result text to clipboard
 * Requirement: 2.4
 */
export async function copyToClipboard(result: ResearchResult): Promise<void> {
  const text = formatResultAsText(result);
  
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}
