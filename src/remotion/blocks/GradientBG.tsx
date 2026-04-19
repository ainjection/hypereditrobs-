import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type GradientBGProps = {
  colors?: string[];       // 2-4 hex colors
  angle?: number;          // degrees, default 135
  animated?: boolean;      // shifts angle over time
  animationSpeed?: number; // degrees per second if animated
};

export const GradientBG: React.FC<GradientBGProps> = ({
  colors = ['#7e22ce', '#3b0764'],
  angle = 135,
  animated = false,
  animationSpeed = 6,
}) => {
  const frame = useCurrentFrame();
  const shift = animated ? (frame / 30) * animationSpeed : 0;
  const finalAngle = angle + shift;
  const stops = colors.map((c, i) => `${c} ${(i / Math.max(1, colors.length - 1)) * 100}%`).join(', ');
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${finalAngle}deg, ${stops})`,
      }}
    />
  );
};
