import React from 'react';

interface FormattedPatternInstructionsProps {
  content: string;
  className?: string;
  isPrint?: boolean;
  accentColor?: 'burgundy' | 'charcoal' | 'neutral';
  isFluid?: boolean;
}

/**
 * Helper to parse bold markup (**text**, <b>text</b>, <strong>text</strong>)
 */
function renderFormattedInlineText(text: string): React.ReactNode {
  // Regex to match **bold**, <b>bold</b>, <strong>bold</strong>
  const regex = /(\*\*(.*?)\*\*|<b>(.*?)<\/b>|<strong>(.*?)<\/strong>)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before the bold part
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    
    // Bold content
    const boldText = match[2] || match[3] || match[4] || '';
    elements.push(
      <strong key={`bold-${match.index}`} className="font-bold text-neutral-950">
        {boldText}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  // Trailing text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}

/**
 * FormattedPatternInstructions component
 * Renders pattern drafting instructions with support for:
 * - Bold text (**text** or <b>text</b>)
 * - Numbered lists (1. , 1) , (1) )
 * - Bullet lists (• , - , * )
 * - Paragraphs and line breaks
 */
export const FormattedPatternInstructions: React.FC<FormattedPatternInstructionsProps> = ({
  content,
  className = '',
  isPrint = false,
  accentColor = 'burgundy',
  isFluid = false,
}) => {
  if (!content || !content.trim()) {
    return null;
  }

  const rawLines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let currentListType: 'numbered' | 'bullet' | null = null;
  let currentListItems: { numberStr?: string; content: string }[] = [];

  const flushList = () => {
    if (!currentListType || currentListItems.length === 0) return;

    if (currentListType === 'numbered') {
      blocks.push(
        <ol
          key={`list-numbered-${blocks.length}`}
          className={`${
            isPrint
              ? 'space-y-1 my-1 pl-4'
              : isFluid
              ? 'space-y-[clamp(0.15rem,0.1rem+0.15vw,0.5rem)] my-[clamp(0.15rem,0.1rem+0.15vw,0.5rem)] pl-[clamp(0.65rem,0.5rem+0.4vw,1rem)]'
              : 'space-y-2 my-2 pl-4'
          } list-decimal list-outside text-neutral-800`}
        >
          {currentListItems.map((item, idx) => (
            <li
              key={idx}
              className={`${
                isPrint
                  ? 'text-[10.5px] leading-snug'
                  : isFluid
                  ? 'text-[clamp(0.625rem,0.52rem+0.45vw,0.875rem)] leading-snug sm:leading-relaxed'
                  : 'text-xs sm:text-sm leading-relaxed'
              } pl-1`}
            >
              {renderFormattedInlineText(item.content)}
            </li>
          ))}
        </ol>
      );
    } else if (currentListType === 'bullet') {
      blocks.push(
        <ul
          key={`list-bullet-${blocks.length}`}
          className={`${
            isPrint
              ? 'space-y-1 my-1 pl-4'
              : isFluid
              ? 'space-y-[clamp(0.15rem,0.1rem+0.15vw,0.5rem)] my-[clamp(0.15rem,0.1rem+0.15vw,0.5rem)] pl-[clamp(0.65rem,0.5rem+0.4vw,1rem)]'
              : 'space-y-2 my-2 pl-4'
          } list-disc list-outside text-neutral-800`}
        >
          {currentListItems.map((item, idx) => (
            <li
              key={idx}
              className={`${
                isPrint
                  ? 'text-[10.5px] leading-snug'
                  : isFluid
                  ? 'text-[clamp(0.625rem,0.52rem+0.45vw,0.875rem)] leading-snug sm:leading-relaxed'
                  : 'text-xs sm:text-sm leading-relaxed'
              } pl-1`}
            >
              {renderFormattedInlineText(item.content)}
            </li>
          ))}
        </ul>
      );
    }

    currentListType = null;
    currentListItems = [];
  };

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Check for empty line -> paragraph break
    if (!trimmed) {
      flushList();
      blocks.push(
        <div
          key={`spacer-${i}`}
          className={
            isPrint
              ? 'h-1.5'
              : isFluid
              ? 'h-[clamp(0.25rem,0.18rem+0.25vw,0.625rem)]'
              : 'h-2.5'
          }
        />
      );
      continue;
    }

    // Check for numbered list: e.g. "1. ", "1) ", "(1) ", "A. ", "a. "
    const numberedMatch = trimmed.match(/^(\d+[\.\)]|\([0-9a-zA-Z]\)|[a-zA-Z][\.\)])\s+(.*)$/);
    if (numberedMatch) {
      if (currentListType && currentListType !== 'numbered') {
        flushList();
      }
      currentListType = 'numbered';
      currentListItems.push({
        numberStr: numberedMatch[1],
        content: numberedMatch[2],
      });
      continue;
    }

    // Check for bullet list: e.g. "- ", "* ", "• ", "– "
    const bulletMatch = trimmed.match(/^([•\-\*–—]|(\u2022))\s+(.*)$/);
    if (bulletMatch) {
      if (currentListType && currentListType !== 'bullet') {
        flushList();
      }
      currentListType = 'bullet';
      currentListItems.push({
        content: bulletMatch[3],
      });
      continue;
    }

    // Regular line / paragraph
    flushList();
    blocks.push(
      <p
        key={`para-${i}`}
        className={`${
          isPrint
            ? 'text-[10.5px] leading-snug my-1'
            : isFluid
            ? 'text-[clamp(0.625rem,0.52rem+0.45vw,0.875rem)] leading-snug sm:leading-relaxed my-[clamp(0.15rem,0.1rem+0.15vw,0.375rem)]'
            : 'text-xs sm:text-sm leading-relaxed my-1.5'
        } text-neutral-800`}
      >
        {renderFormattedInlineText(rawLine)}
      </p>
    );
  }

  // Flush any remaining list
  flushList();

  return (
    <div className={`formatted-pattern-instructions ${className}`}>
      {blocks}
    </div>
  );
};
