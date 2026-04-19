import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';

export type ChromaticScanlineProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  background?: string;
  rgbOffset?: number;
  scanlineOpacity?: number;
  noiseIntensity?: number;
  align?: 'left' | 'center' | 'right';
};

export const ChromaticScanline: React.FC<ChromaticScanlineProps> = ({
  text = 'VHS TRANSMISSION',
  fontSize = 200,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  background = '#050505',
  rgbOffset = 8,
  scanlineOpacity = 0.25,
  noiseIntensity = 0.15,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const jitter = (seed: number) => (random(`cs-${seed}-${Math.floor(frame / 4)}`) - 0.5) * 6;
  const bounceY = Math.sin(frame / 12) * 2;
  const flickerAlpha = 0.92 + random(`flicker-${Math.floor(frame / 3)}`) * 0.08;

  return (
    <AbsoluteFill style={{ background, overflow: 'hidden' }}>
      {/* Noise layer */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='${Math.floor(frame / 2)}'/></filter><rect width='300' height='300' filter='url(%23n)' opacity='${noiseIntensity}'/></svg>")`,
          backgroundSize: '300px 300px',
          mixBlendMode: 'overlay',
          opacity: flickerAlpha,
        }}
      />
      {/* Scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,${scanlineOpacity}) 0, rgba(0,0,0,${scanlineOpacity}) 1px, transparent 1px, transparent 4px)`,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      {/* CRT curve shadow */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 200px rgba(0,0,0,0.7)',
          pointerEvents: 'none',
        }}
      />

      {/* Chromatic text */}
      <AbsoluteFill
        style={{
          alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
          justifyContent: 'center',
          padding: align === 'center' ? 0 : 80,
          transform: `translateY(${bounceY}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            fontSize,
            fontFamily,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textAlign: align,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, color: '#ff0050', transform: `translate(${-rgbOffset + jitter(1)}px, ${jitter(2)}px)`, mixBlendMode: 'screen' }}>{text}</div>
          <div style={{ position: 'absolute', inset: 0, color: '#00e0ff', transform: `translate(${rgbOffset + jitter(3)}px, ${jitter(4)}px)`, mixBlendMode: 'screen' }}>{text}</div>
          <div style={{ position: 'relative', color }}>{text}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
