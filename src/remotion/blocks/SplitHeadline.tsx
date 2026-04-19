import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { resolveEasing, EasingName } from './utils';

export type SplitHeadlineProps = {
  topText?: string;
  bottomText?: string;
  topColor?: string;
  bottomColor?: string;
  fontSize?: number;
  fontFamily?: string;
  topWeight?: number;
  bottomWeight?: number;
  durationInFrames?: number;
  delay?: number;
  easing?: EasingName;
};

export const SplitHeadline: React.FC<SplitHeadlineProps> = ({
  topText = 'THIS IS',
  bottomText = 'BIG',
  topColor = '#ffffff',
  bottomColor = '#00e676',
  fontSize = 240,
  fontFamily = 'Inter, system-ui, sans-serif',
  topWeight = 700,
  bottomWeight = 900,
  durationInFrames = 25,
  delay = 0,
  easing = 'inOut',
}) => {
  const frame = useCurrentFrame();
  const topAdj = Math.max(0, frame - delay);
  const bottomAdj = Math.max(0, frame - delay - 8);
  const topProgress = interpolate(topAdj, [0, durationInFrames], [0, 100], { extrapolateRight: 'clamp', easing: resolveEasing(easing) });
  const bottomProgress = interpolate(bottomAdj, [0, durationInFrames], [0, 100], { extrapolateRight: 'clamp', easing: resolveEasing(easing) });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          fontSize,
          color: topColor,
          fontFamily,
          fontWeight: topWeight,
          letterSpacing: '-0.03em',
          lineHeight: 1.0,
          clipPath: `inset(0 ${100 - topProgress}% 0 0)`,
        }}
      >
        {topText}
      </div>
      <div
        style={{
          fontSize,
          color: bottomColor,
          fontFamily,
          fontWeight: bottomWeight,
          letterSpacing: '-0.04em',
          lineHeight: 1.0,
          clipPath: `inset(0 0 0 ${100 - bottomProgress}%)`,
        }}
      >
        {bottomText}
      </div>
    </AbsoluteFill>
  );
};
