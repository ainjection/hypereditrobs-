import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export type KineticTypographyProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  fontFamily?: string;
  wordsPerSecond?: number;
  align?: 'left' | 'center' | 'right';
};

type Path = 'up' | 'down' | 'left' | 'right' | 'flip' | 'rotate' | 'scale';

const PATHS: Path[] = ['up', 'down', 'left', 'right', 'flip', 'rotate', 'scale'];

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text = 'Every word moves differently',
  fontSize = 130,
  color = '#ffffff',
  accentColor = '#00e676',
  fontFamily = 'Inter, system-ui, sans-serif',
  wordsPerSecond = 2.2,
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
          letterSpacing: '-0.04em',
          lineHeight: 1.1,
          textAlign: align,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.35em',
          justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
          maxWidth: 1600,
          perspective: 1200,
        }}
      >
        {words.map((word, i) => {
          const appearFrame = i * framesPerWord;
          const progress = spring({
            frame: frame - appearFrame,
            fps,
            config: { damping: 12, stiffness: 160, mass: 0.9 },
          });
          const path = PATHS[i % PATHS.length];
          const invProgress = 1 - progress;
          const isAccent = i % 3 === 1;
          let transform = '';
          switch (path) {
            case 'up':
              transform = `translateY(${invProgress * 120}px)`;
              break;
            case 'down':
              transform = `translateY(${-invProgress * 120}px)`;
              break;
            case 'left':
              transform = `translateX(${invProgress * 160}px)`;
              break;
            case 'right':
              transform = `translateX(${-invProgress * 160}px)`;
              break;
            case 'flip':
              transform = `rotateX(${invProgress * 90}deg)`;
              break;
            case 'rotate':
              transform = `rotate(${invProgress * -8}deg) translateY(${invProgress * 40}px)`;
              break;
            case 'scale':
              transform = `scale(${0.4 + progress * 0.6})`;
              break;
          }
          return (
            <span
              key={i}
              style={{
                opacity: progress,
                transform,
                transformOrigin: 'center center',
                color: isAccent ? accentColor : color,
                display: 'inline-block',
                willChange: 'transform, opacity',
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
