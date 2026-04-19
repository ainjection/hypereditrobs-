import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export type WordByWordProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  accentEvery?: number;
  fontFamily?: string;
  wordsPerSecond?: number;
  align?: 'left' | 'center' | 'right';
};

export const WordByWord: React.FC<WordByWordProps> = ({
  text = 'This is how we make videos now',
  fontSize = 100,
  color = '#ffffff',
  accentColor = '#00e676',
  accentEvery = 3,
  fontFamily = 'Inter, system-ui, sans-serif',
  wordsPerSecond = 2.5,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const framesPerWord = fps / wordsPerSecond;
  return (
    <AbsoluteFill
      style={{
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize,
          fontFamily,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          textAlign: align,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.3em',
          justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
          maxWidth: 1600,
        }}
      >
        {words.map((word, i) => {
          const appearFrame = i * framesPerWord;
          const progress = spring({
            frame: frame - appearFrame,
            fps,
            config: { damping: 14, stiffness: 180, mass: 0.7 },
          });
          const isAccent = accentEvery > 0 && (i + 1) % accentEvery === 0;
          return (
            <span
              key={i}
              style={{
                opacity: progress,
                transform: `translateY(${(1 - progress) * 40}px)`,
                color: isAccent ? accentColor : color,
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
