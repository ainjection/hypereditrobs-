import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { resolveEasing, EasingName } from './utils';

export type BrandStripeProps = {
  colors?: string[];
  direction?: 'horizontal' | 'vertical';
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  thickness?: number;
  sweepInFromFrame?: number;
  durationInFrames?: number;
  easing?: EasingName;
};

export const BrandStripe: React.FC<BrandStripeProps> = ({
  colors = ['#00e676', '#ffffff', '#ff0080'],
  direction = 'horizontal',
  position = 'bottom',
  thickness = 24,
  sweepInFromFrame = 0,
  durationInFrames = 20,
  easing = 'smooth',
}) => {
  const frame = useCurrentFrame();
  const adjusted = Math.max(0, frame - sweepInFromFrame);
  const progress = interpolate(adjusted, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
    easing: resolveEasing(easing),
  });

  const isH = direction === 'horizontal';
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: isH ? 'row' : 'column',
  };
  if (isH) {
    containerStyle.left = 0;
    containerStyle.right = 0;
    containerStyle.height = thickness;
    containerStyle.top = position === 'top' ? 0 : position === 'center' ? `calc(50% - ${thickness / 2}px)` : undefined;
    containerStyle.bottom = position === 'bottom' ? 0 : undefined;
    containerStyle.clipPath = `inset(0 ${100 - progress}% 0 0)`;
  } else {
    containerStyle.top = 0;
    containerStyle.bottom = 0;
    containerStyle.width = thickness;
    containerStyle.left = position === 'left' ? 0 : position === 'center' ? `calc(50% - ${thickness / 2}px)` : undefined;
    containerStyle.right = position === 'right' ? 0 : undefined;
    containerStyle.clipPath = `inset(${100 - progress}% 0 0 0)`;
  }

  return (
    <AbsoluteFill>
      <div style={containerStyle}>
        {colors.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
