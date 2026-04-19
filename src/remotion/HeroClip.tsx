import React from 'react';
import { AbsoluteFill, Video, staticFile } from 'remotion';

export type HeroClipProps = {
  src?: string;           // path under public/, e.g. "hero-library/Neptune.mp4"
  overlayText?: string;
  overlayColor?: string;
  overlayFontSize?: number;
  overlayAlign?: 'top' | 'center' | 'bottom';
  darken?: number;        // 0–1 dim the video behind text
};

export const HeroClip: React.FC<HeroClipProps> = ({
  src = '',
  overlayText = '',
  overlayColor = '#ffffff',
  overlayFontSize = 140,
  overlayAlign = 'bottom',
  darken = 0,
}) => {
  const hasOverlay = overlayText && overlayText.trim().length > 0;
  const justify = overlayAlign === 'top' ? 'flex-start' : overlayAlign === 'center' ? 'center' : 'flex-end';
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {src && (
        <Video
          src={src.startsWith('http') ? src : staticFile(src)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          loop
        />
      )}
      {darken > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,0,0,${Math.min(1, Math.max(0, darken))})` }} />
      )}
      {hasOverlay && (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: justify,
            padding: '80px 100px',
          }}
        >
          <div
            style={{
              fontSize: overlayFontSize,
              color: overlayColor,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textAlign: 'center',
              textShadow: '0 2px 30px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)',
              maxWidth: 1600,
            }}
          >
            {overlayText}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
