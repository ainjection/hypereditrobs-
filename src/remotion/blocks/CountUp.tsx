import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { resolveEasing, EasingName } from './utils';

export type CountUpProps = {
  from?: number;
  to?: number;
  durationInFrames?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  easing?: EasingName;
  align?: 'left' | 'center' | 'right';
};

export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to = 100,
  durationInFrames = 60,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  fontSize = 200,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  easing = 'smooth',
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const adjusted = Math.max(0, frame - delay);
  const value = interpolate(adjusted, [0, durationInFrames], [from, to], {
    extrapolateRight: 'clamp',
    easing: resolveEasing(easing),
  });
  const display = value.toFixed(decimals);
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
          textAlign: align,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix}{display}{suffix}
      </div>
    </AbsoluteFill>
  );
};
