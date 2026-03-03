import React from 'react';

/**
 * Renders text with each word on its own line (e.g. "Feature Analysis" → Feature\nAnalysis).
 */
export function LineBreakLabel({ text }: { text: string }) {
  const words = text.split(' ');
  if (words.length <= 1) return <>{text}</>;
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {w}
        </React.Fragment>
      ))}
    </>
  );
}
