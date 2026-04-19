import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, spring, useVideoConfig } from 'remotion';

export type LogoGridProps = {
  logos?: string[];
  columns?: number;
  background?: string;
  tileColor?: string;
  cellHeight?: number;
  staggerFrames?: number;
  maxLogoHeight?: number;
};

export const LogoGrid: React.FC<LogoGridProps> = ({
  logos = [],
  columns = 4,
  background = '#0a0a0a',
  tileColor = '#151515',
  cellHeight = 180,
  staggerFrames = 4,
  maxLogoHeight = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background, padding: 80, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 20,
          width: '100%',
          maxWidth: 1600,
        }}
      >
        {logos.map((logo, i) => {
          const appearFrame = i * staggerFrames;
          const progress = spring({
            frame: frame - appearFrame,
            fps,
            config: { damping: 16, stiffness: 200, mass: 0.8 },
          });
          const src = logo.startsWith('http') ? logo : staticFile(logo);
          return (
            <div
              key={i}
              style={{
                height: cellHeight,
                background: tileColor,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: progress,
                transform: `scale(${0.6 + progress * 0.4})`,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <img src={src} style={{ maxHeight: maxLogoHeight, maxWidth: '70%', objectFit: 'contain' }} alt="" />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
