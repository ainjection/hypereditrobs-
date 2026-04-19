import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';

export type MatrixRainProps = {
  text?: string;
  fontSize?: number;
  color?: string;
  rainColor?: string;
  headColor?: string;
  background?: string;
  columns?: number;
  speed?: number;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
};

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊ01234567890123456789@#$%&*';

export const MatrixRain: React.FC<MatrixRainProps> = ({
  text = 'ACCESS GRANTED',
  fontSize = 180,
  color = '#ffffff',
  rainColor = '#00ff41',
  headColor = '#aaffaa',
  background = '#050505',
  columns = 60,
  speed = 1.2,
  fontFamily = 'JetBrains Mono, Menlo, Consolas, monospace',
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const colWidth = 100 / columns;
  const ROW_HEIGHT = 24;

  return (
    <AbsoluteFill style={{ background, overflow: 'hidden' }}>
      <AbsoluteFill style={{ fontFamily, fontSize: 22, lineHeight: '24px' }}>
        {Array.from({ length: columns }).map((_, col) => {
          const colSeed = `col-${col}`;
          const colSpeed = 6 + random(colSeed) * 10;
          const colOffset = random(`offset-${col}`) * 50;
          const colLen = 10 + Math.floor(random(`len-${col}`) * 22);
          const headFrame = (frame * speed * colSpeed / 10) + colOffset;
          const x = col * colWidth;
          return Array.from({ length: colLen }).map((__, rowIdx) => {
            const distFromHead = rowIdx;
            const y = ((headFrame - distFromHead) * ROW_HEIGHT) % 1300;
            if (y < -50 || y > 1200) return null;
            const glyphIdx = Math.floor(random(`${col}-${rowIdx}-${Math.floor(frame / 6)}`) * GLYPHS.length);
            const isHead = distFromHead === 0;
            const op = isHead ? 1 : Math.max(0, 0.9 - distFromHead * 0.05);
            return (
              <div
                key={`${col}-${rowIdx}`}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: y,
                  color: isHead ? headColor : rainColor,
                  opacity: op,
                  textShadow: isHead ? `0 0 8px ${rainColor}` : 'none',
                }}
              >
                {GLYPHS[glyphIdx]}
              </div>
            );
          });
        })}
      </AbsoluteFill>

      {/* Foreground headline */}
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
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textAlign: align,
            textShadow: `0 0 30px ${rainColor}aa, 0 0 60px ${rainColor}55`,
            padding: '30px 50px',
            background: 'rgba(0,0,0,0.55)',
            border: `1px solid ${rainColor}55`,
            borderRadius: 4,
          }}
        >
          {text}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
