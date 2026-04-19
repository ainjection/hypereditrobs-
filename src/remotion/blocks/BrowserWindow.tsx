import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';

export type BrowserWindowProps = {
  image?: string;
  url?: string;
  width?: number;
  shadow?: boolean;
};

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  image,
  url = 'example.com',
  width = 1400,
  shadow = true,
}) => {
  const imgSrc = image ? (image.startsWith('http') ? image : staticFile(image)) : '';
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width,
          background: '#1a1d28',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: shadow ? '0 40px 100px rgba(0,0,0,0.55)' : 'none',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 22px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
          ))}
          <div
            style={{
              marginLeft: 18,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: '6px 18px',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Courier New, monospace',
              fontSize: 13,
            }}
          >
            {url}
          </div>
        </div>
        <div style={{ background: '#fff', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {imgSrc ? (
            <img src={imgSrc} style={{ width: '100%', display: 'block' }} alt="" />
          ) : (
            <div style={{ padding: 80, color: '#999', fontSize: 24 }}>[browser content]</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
