import React from 'react';

/**
 * Highlights search terms in text
 * Returns JSX with highlighted matches (highlights all occurrences)
 * 
 * @param text - The text to search in
 * @param searchQuery - The search term to highlight
 * @returns JSX with highlighted matches
 */
export const highlightSearchTerm = (
  text: string,
  searchQuery: string
): React.ReactNode => {
  if (!searchQuery.trim() || !text) {
    return text;
  }

  const searchLower = searchQuery.toLowerCase();
  const textLower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = textLower.indexOf(searchLower, lastIndex);

  // Find all matches and create parts array
  while (index !== -1) {
    // Add text before match
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index));
    }
    
    // Add highlighted match
    parts.push(
      <mark
        key={index}
        className="font-medium px-0.5 rounded"
        style={{
          backgroundColor: 'var(--color-search-highlight-bg)',
          color: 'var(--color-search-highlight-text)',
        }}
      >
        {text.substring(index, index + searchQuery.length)}
      </mark>
    );
    
    lastIndex = index + searchQuery.length;
    index = textLower.indexOf(searchLower, lastIndex);
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no matches found, return original text
  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
};

/**
 * Checks if search query matches a field (case-insensitive)
 */
export const matchesSearch = (text: string, searchQuery: string): boolean => {
  if (!searchQuery.trim() || !text) {
    return false;
  }
  return text.toLowerCase().includes(searchQuery.toLowerCase());
};

