import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export type BigHeadlineProps = {
  text?: string;
  subtext?: string;
  color?: string;
  subtextColor?: string;
  fontSize?: number;
  slideFrom?: 'bottom' | 'top' | 'left' | 'right';
};

export const BigHeadline: React.FC<BigHeadlineProps> = ({
  text = 'Welcome',
  subtext = '',
  color = '#ffffff',
  subtextColor = 'rgba(255,255,255,0.6)',
  fontSize = 140,
  slideFrom = 'bottom',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, from: 0, to: 1, config: { stiffness: 80, damping: 14 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const axis = slideFrom === 'left' || slideFrom === 'right' ? 'X' : 'Y';
  const sign = slideFrom === 'top' || slideFrom === 'left' ? -1 : 1;
  const offset = (1 - s) * 120 * sign;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          fontSize,
          color,
          fontFamily: 'Arial Black, sans-serif',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          textAlign: 'center',
          transform: `translate${axis}(${offset}px)`,
          opacity,
        }}
      >
        {text}
      </div>
      {subtext ? (
        <div
          style={{
            fontSize: fontSize * 0.28,
            color: subtextColor,
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.05em',
            textAlign: 'center',
            opacity,
          }}
        >
          {subtext}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
