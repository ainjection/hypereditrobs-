import React from 'react';
import { AbsoluteFill, staticFile, Video } from 'remotion';

export type VideoFrameProps = {
  src?: string;
  chrome?: 'mac' | 'clean' | 'phone';
  width?: number;
  rotate?: number;
  shadow?: boolean;
  label?: string;
};

export const VideoFrame: React.FC<VideoFrameProps> = ({
  src = '',
  chrome = 'mac',
  width = 1400,
  rotate = 0,
  shadow = true,
  label = '',
}) => {
  const url = src ? (src.startsWith('http') ? src : staticFile(src)) : '';
  const isPhone = chrome === 'phone';
  const borderRadius = isPhone ? 44 : 14;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: isPhone ? 420 : width,
          transform: `rotate(${rotate}deg)`,
          background: '#0a0a0a',
          borderRadius,
          overflow: 'hidden',
          boxShadow: shadow ? '0 40px 100px rgba(0,0,0,0.55)' : 'none',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {chrome === 'mac' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', background: '#1a1d28', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
              <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
            ))}
            {label && (
              <div style={{ marginLeft: 18, color: 'rgba(255,255,255,0.55)', fontFamily: 'Courier New, monospace', fontSize: 13 }}>{label}</div>
            )}
          </div>
        )}
        {url ? (
          <Video src={url} style={{ width: '100%', display: 'block' }} />
        ) : (
          <div style={{ height: 600, background: '#111', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: 18 }}>[no video]</div>
        )}
      </div>
    </AbsoluteFill>
  );
};
