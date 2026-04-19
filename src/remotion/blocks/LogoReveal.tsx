import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export type LogoRevealProps = {
  image?: string;
  text?: string;
  subtext?: string;
  accentColor?: string;
  textColor?: string;
  maxSize?: number;
};

export const LogoReveal: React.FC<LogoRevealProps> = ({
  image,
  text,
  subtext,
  accentColor = '#00e676',
  textColor = '#ffffff',
  maxSize = 420,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, from: 0.2, to: 1, config: { stiffness: 90, damping: 14 } });
  const glow = 0.4 + Math.sin(frame * 0.1) * 0.2;
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const textSlide = interpolate(frame, [20, 40], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textOp = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const imgSrc = image ? (image.startsWith('http') ? image : staticFile(image)) : '';
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div
        style={{
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${40 * glow}px ${accentColor})`,
          opacity,
          marginBottom: text ? 28 : 0,
        }}
      >
        {imgSrc ? (
          <img src={imgSrc} style={{ maxWidth: maxSize, maxHeight: maxSize, display: 'block' }} alt="" />
        ) : (
          <div
            style={{
              width: maxSize,
              height: maxSize,
              background: accentColor,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 140,
              color: '#000',
              fontWeight: 900,
              fontFamily: 'Arial Black, sans-serif',
            }}
          >
            ★
          </div>
        )}
      </div>
      {text ? (
        <div
          style={{
            fontSize: 72,
            color: textColor,
            fontFamily: 'Arial Black, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            transform: `translateY(${textSlide}px)`,
            opacity: textOp,
          }}
        >
          {text}
        </div>
      ) : null}
      {subtext ? (
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Courier New, monospace',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginTop: 10,
            transform: `translateY(${textSlide}px)`,
            opacity: textOp,
          }}
        >
          {subtext}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
