import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';

export type GlitchProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  accentColor1?: string;
  accentColor2?: string;
  fontFamily?: string;
  intensity?: number;
  align?: 'left' | 'center' | 'right';
};

export const Glitch: React.FC<GlitchProps> = ({
  text = 'GLITCH',
  fontSize = 200,
  color = '#ffffff',
  accentColor1 = '#ff0080',
  accentColor2 = '#00ffe0',
  fontFamily = 'Inter, system-ui, sans-serif',
  intensity = 1,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const jitter = (seed: number) => (random(`glitch-${seed}-${Math.floor(frame / 3)}`) - 0.5) * 16 * intensity;
  const rgbOffset = 6 * intensity;
  return (
    <AbsoluteFill
      style={{
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        justifyContent: 'center',
        padding: align === 'center' ? 0 : 80,
      }}
    >
      <div style={{ position: 'relative', fontSize, fontFamily, fontWeight: 900, letterSpacing: '-0.03em', textAlign: align }}>
        <div style={{ position: 'absolute', inset: 0, color: accentColor1, transform: `translate(${-rgbOffset}px, ${jitter(1)}px)`, mixBlendMode: 'screen' }}>{text}</div>
        <div style={{ position: 'absolute', inset: 0, color: accentColor2, transform: `translate(${rgbOffset}px, ${jitter(2)}px)`, mixBlendMode: 'screen' }}>{text}</div>
        <div style={{ position: 'relative', color, transform: `translate(${jitter(3) * 0.3}px, 0)` }}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};
