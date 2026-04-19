import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export type TerminalWindowProps = {
  lines?: string[];
  title?: string;
  width?: number;
  fontSize?: number;
  charsPerSecond?: number;
  prompt?: string;
  promptColor?: string;
  textColor?: string;
  background?: string;
};

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  lines = ['npm install video-agent', 'Installing dependencies...', '✓ Done in 2.3s'],
  title = 'zsh — video-agent',
  width = 1200,
  fontSize = 26,
  charsPerSecond = 45,
  prompt = '$',
  promptColor = '#00e676',
  textColor = '#e6edf3',
  background = '#0b0d10',
}) => {
  const frame = useCurrentFrame();
  const totalChars = Math.floor((frame / 30) * charsPerSecond);
  let remaining = totalChars;
  const rendered = lines.map((line) => {
    if (remaining <= 0) return { text: '', done: false };
    if (line.length <= remaining) {
      remaining -= line.length + 1;
      return { text: line, done: true };
    }
    const partial = line.slice(0, remaining);
    remaining = 0;
    return { text: partial, done: false };
  });
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width,
          background,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
          ))}
          <div style={{ marginLeft: 14, color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{title}</div>
        </div>
        <div style={{ padding: '24px 28px', minHeight: 400, fontSize, color: textColor, lineHeight: 1.6 }}>
          {rendered.map((r, i) => (
            <div key={i} style={{ whiteSpace: 'pre' }}>
              <span style={{ color: promptColor }}>{prompt}</span>{' '}
              <span>{r.text}</span>
              {i === rendered.length - 1 && !r.done && r.text.length > 0 && (
                <span style={{ opacity: cursorOn ? 1 : 0 }}>▎</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
