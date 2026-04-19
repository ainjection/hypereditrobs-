import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export type DepthZoomProps = {
  text?: string;
  subtext?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  background?: string;
  zoomFrom?: number;
  zoomTo?: number;
  blurFrom?: number;
  blurTo?: number;
  durationInFrames?: number;
  align?: 'left' | 'center' | 'right';
};

export const DepthZoom: React.FC<DepthZoomProps> = ({
  text = 'Come closer',
  subtext = '',
  fontSize = 220,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
  background = '#0a0a0a',
  zoomFrom = 0.6,
  zoomTo = 1.05,
  blurFrom = 30,
  blurTo = 0,
  durationInFrames = 60,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });
  const blur = interpolate(frame, [0, durationInFrames], [blurFrom, blurTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [0, Math.max(1, durationInFrames * 0.4)], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background,
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
        justifyContent: 'center',
        padding: align === 'center' ? 0 : 80,
        perspective: 2000,
      }}
    >
      <div
        style={{
          transform: `scale(${scale}) translateZ(0)`,
          filter: `blur(${blur}px)`,
          opacity,
          textAlign: align,
          willChange: 'transform, filter',
        }}
      >
        <div
          style={{
            fontSize,
            color,
            fontFamily,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 1,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          {text}
        </div>
        {subtext && (
          <div
            style={{
              fontSize: fontSize * 0.22,
              color,
              fontFamily,
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginTop: 16,
              opacity: 0.7,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
