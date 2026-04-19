import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type TypewriterTextProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  charsPerSecond?: number;
  align?: 'left' | 'center' | 'right';
};

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text = 'Hello',
  fontSize = 84,
  color = '#ffffff',
  fontFamily = 'Arial Black, sans-serif',
  charsPerSecond = 20,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const visibleChars = Math.floor((frame / 30) * charsPerSecond);
  const shown = text.slice(0, visibleChars);
  const cursorOn = Math.floor(frame / 10) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        alignItems: align === 'center' ? 'center' : 'flex-start',
        justifyContent: 'center',
        padding: align === 'center' ? 0 : 80,
      }}
    >
      <div
        style={{
          fontSize,
          color,
          fontFamily,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          whiteSpace: 'pre-wrap',
          textAlign: align,
        }}
      >
        {shown}
        <span style={{ opacity: cursorOn ? 1 : 0 }}>|</span>
      </div>
    </AbsoluteFill>
  );
};
