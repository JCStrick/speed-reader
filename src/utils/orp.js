/**
 * Calculate the Optimal Recognition Point (ORP) for a word
 * The ORP is the letter that the eye naturally focuses on when reading
 */
export function getORP(word) {
  const cleanWord = word.replace(/[^\w]/g, '');
  const len = cleanWord.length;

  let pos = 0;
  if (len <= 1) pos = 0;
  else if (len <= 3) pos = 1;
  else if (len <= 7) pos = 2;
  else pos = Math.floor(len / 3);

  // Find the position in the original word (accounting for leading punctuation)
  const leadingPunct = word.match(/^[^\w]*/)?.[0] || '';
  const actualPos = leadingPunct.length + pos;

  return {
    left: word.slice(0, actualPos),
    orp: word[actualPos] || '',
    right: word.slice(actualPos + 1)
  };
}

/**
 * Split text into words, preserving punctuation
 */
export function splitIntoWords(text) {
  if (!text) return [];

  // Clean up text: normalize whitespace, remove extra spaces
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words, keeping punctuation attached
  return cleaned.split(/\s+/).filter(word => word.length > 0);
}

/**
 * Calculate delay multiplier based on word characteristics
 */
export function getDelayMultiplier(word) {
  let multiplier = 1;

  // Longer words need more time
  if (word.length > 10) multiplier += 0.3;
  else if (word.length > 7) multiplier += 0.15;

  // Punctuation pauses
  if (/[.!?]$/.test(word)) multiplier += 1.0;  // End of sentence
  else if (/[,;:]$/.test(word)) multiplier += 0.5;  // Mid-sentence pause
  else if (/[-—]$/.test(word)) multiplier += 0.3;  // Dash

  return multiplier;
}
