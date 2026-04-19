import React from 'react';
import { AbsoluteFill, useCurrentFrame, random, interpolate } from 'remotion';

export type ShatterRevealProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  shardCount?: number;
  revealAt?: number;
  durationInFrames?: number;
  align?: 'left' | 'center' | 'right';
  background?: string;
};

// A letter's worth of shards — approximate by overlaying masked rectangles
// that fly in from random directions and settle at 0.
export const ShatterReveal: React.FC<ShatterRevealProps> = ({
  text = 'Impact',
  fontSize = 260,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  shardCount = 24,
  revealAt = 0,
  durationInFrames = 40,
  align = 'center',
  background = 'transparent',
}) => {
  const frame = useCurrentFrame();
  const adjusted = Math.max(0, frame - revealAt);
  const progress = interpolate(adjusted, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const inv = 1 - progress;

  return (
    <AbsoluteFill
      style={{
        background,
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        justifyContent: 'center',
        padding: align === 'center' ? 0 : 80,
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Solid final text, faded in */}
        <div
          style={{
            fontSize,
            color,
            fontFamily,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            opacity: progress,
            textAlign: align,
          }}
        >
          {text}
        </div>

        {/* Shards — duplicates of the text masked to slivers, flying in */}
        {Array.from({ length: shardCount }).map((_, i) => {
          const sx = (random(`sx-${i}`) - 0.5) * 900;
          const sy = (random(`sy-${i}`) - 0.5) * 700;
          const rot = (random(`rot-${i}`) - 0.5) * 120;
          const top = Math.floor(random(`t-${i}`) * 100);
          const height = 3 + Math.floor(random(`h-${i}`) * 14);
          const shardAlpha = Math.min(1, inv * 1.4);
          if (shardAlpha < 0.02) return null;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: `inset(${top}% 0 ${100 - top - height}% 0)`,
                transform: `translate(${sx * inv}px, ${sy * inv}px) rotate(${rot * inv}deg)`,
                opacity: shardAlpha,
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  fontSize,
                  color,
                  fontFamily,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  textAlign: align,
                }}
              >
                {text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
