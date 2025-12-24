/**
 * Auto-formats pasted content from ChatGPT or other sources
 * - Converts markdown bullet points to proper Unicode bullets
 * - Fixes spacing and margins
 * - Cleans up formatting issues
 */
export const formatPastedContent = (text: string): string => {
  let formatted = text;

  // Remove extra blank lines (more than 2 consecutive)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Convert markdown bold **text** to plain text (PDF doesn't render markdown)
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1');

  // Convert markdown italic *text* or _text_ to plain text
  formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1');
  formatted = formatted.replace(/_([^_]+)_/g, '$1');

  // Convert markdown headers (##, ###) to plain text with newline
  formatted = formatted.replace(/^#{1,6}\s+(.+)$/gm, '$1');

  // Convert various bullet point formats to standard bullet (•)
  // Handles: -, *, >, →, ➤, ▸, ▹, ◦, ○, ●, ◆, ◇, ★, ☆
  formatted = formatted.replace(/^[\s]*[-*>→➤▸▹◦○●◆◇★☆]\s+/gm, '• ');

  // Convert numbered lists with various formats
  // Handles: 1. 1) 1: (1) [1]
  formatted = formatted.replace(/^[\s]*\d+[.):\]]\s*/gm, (match) => {
    // Extract the number
    const numMatch = match.match(/\d+/);
    if (numMatch) {
      return `${numMatch[0]}. `;
    }
    return match;
  });

  // Fix indented sub-bullets (convert to proper indentation with different bullet)
  formatted = formatted.replace(/^[\s]{2,}[-*>→]\s+/gm, '   ○ ');

  // Clean up multiple spaces to single space
  formatted = formatted.replace(/  +/g, ' ');

  // Ensure proper spacing after bullets
  formatted = formatted.replace(/•\s*/g, '• ');
  formatted = formatted.replace(/○\s*/g, '○ ');

  // Trim each line
  formatted = formatted
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  // Remove leading/trailing whitespace from entire text
  formatted = formatted.trim();

  return formatted;
};

/**
 * Handles paste event and formats the content
 */
export const handlePasteFormat = (
  e: React.ClipboardEvent<HTMLTextAreaElement>,
  currentValue: string,
  onChange: (value: string) => void
): void => {
  e.preventDefault();
  
  const pastedText = e.clipboardData.getData('text');
  const formattedText = formatPastedContent(pastedText);
  
  const textarea = e.currentTarget;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  // Insert formatted text at cursor position
  const newValue = 
    currentValue.substring(0, start) + 
    formattedText + 
    currentValue.substring(end);
  
  onChange(newValue);
  
  // Set cursor position after inserted text
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
  }, 0);
};
