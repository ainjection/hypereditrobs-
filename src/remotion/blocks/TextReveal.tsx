import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { resolveEasing, EasingName } from './utils';

export type TextRevealProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  durationInFrames?: number;
  delay?: number;
  easing?: EasingName;
  align?: 'left' | 'center' | 'right';
};

export const TextReveal: React.FC<TextRevealProps> = ({
  text = 'Reveal',
  fontSize = 120,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  direction = 'left',
  durationInFrames = 30,
  delay = 0,
  easing = 'inOut',
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const adjusted = Math.max(0, frame - delay);
  const progress = interpolate(adjusted, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
    easing: resolveEasing(easing),
  });

  const inset = {
    left: `inset(0 ${100 - progress}% 0 0)`,
    right: `inset(0 0 0 ${100 - progress}%)`,
    up: `inset(${100 - progress}% 0 0 0)`,
    down: `inset(0 0 ${100 - progress}% 0)`,
  }[direction];

  return (
    <AbsoluteFill
      style={{
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
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
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          textAlign: align,
          clipPath: inset,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
