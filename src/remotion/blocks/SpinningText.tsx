import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type SpinningTextProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  rotationsPerSecond?: number;
  scaleIn?: boolean;
};

export const SpinningText: React.FC<SpinningTextProps> = ({
  text = 'SPINNING',
  fontSize = 120,
  color = '#ffffff',
  fontFamily = 'Arial Black, sans-serif',
  rotationsPerSecond = 0.5,
  scaleIn = true,
}) => {
  const frame = useCurrentFrame();
  const rotation = (frame / 30) * rotationsPerSecond * 360;
  const scale = scaleIn ? interpolate(frame, [0, 20], [0.5, 1], { extrapolateRight: 'clamp' }) : 1;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          fontSize,
          color,
          fontFamily,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          textShadow: `0 0 40px ${color}88`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
