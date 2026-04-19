import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export type TypingCodeProps = {
  code?: string;
  language?: string;
  fontSize?: number;
  width?: number;
  charsPerSecond?: number;
  background?: string;
  accent?: string;
};

export const TypingCode: React.FC<TypingCodeProps> = ({
  code = "const agent = new VideoAgent();\nagent.render('demo.mp4');",
  language = 'typescript',
  fontSize = 32,
  width = 1100,
  charsPerSecond = 35,
  background = '#0d1117',
  accent = '#79c0ff',
}) => {
  const frame = useCurrentFrame();
  const visible = Math.floor((frame / 30) * charsPerSecond);
  const shown = code.slice(0, visible);
  const lines = shown.split('\n');
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width,
          background,
          borderRadius: 14,
          padding: '28px 32px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
          fontSize,
          lineHeight: 1.6,
          color: '#e6edf3',
        }}
      >
        <div style={{ marginBottom: 14, fontSize: 13, color: '#8b949e' }}>{language}</div>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre', minHeight: fontSize * 1.6 }}>
            <span>{line}</span>
            {i === lines.length - 1 && (
              <span style={{ opacity: cursorOn ? 1 : 0, color: accent }}>▎</span>
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
