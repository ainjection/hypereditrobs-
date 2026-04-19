import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { resolveEasing, EasingName } from './utils';

export type BlurInProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  startBlur?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingName;
  align?: 'left' | 'center' | 'right';
};

export const BlurIn: React.FC<BlurInProps> = ({
  text = 'Focus',
  fontSize = 180,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  startBlur = 40,
  durationInFrames = 30,
  delay = 0,
  easing = 'smooth',
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const adjusted = Math.max(0, frame - delay);
  const blur = interpolate(adjusted, [0, durationInFrames], [startBlur, 0], {
    extrapolateRight: 'clamp',
    easing: resolveEasing(easing),
  });
  const opacity = interpolate(adjusted, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
    easing: resolveEasing(easing),
  });
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
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          textAlign: align,
          filter: `blur(${blur}px)`,
          opacity,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
