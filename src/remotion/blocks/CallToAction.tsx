import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';

export type CallToActionProps = {
  text?: string;
  subtext?: string;
  buttonText?: string;
  accentColor?: string;
  textColor?: string;
  bgColor?: string;
};

export const CallToAction: React.FC<CallToActionProps> = ({
  text = 'Ready to ship?',
  subtext = '',
  buttonText = 'Subscribe',
  accentColor = '#00e676',
  textColor = '#ffffff',
  bgColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, from: 0, to: 1, config: { stiffness: 100, damping: 16 } });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05;
  const btnFade = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: bgColor, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 32 }}>
      <div
        style={{
          fontSize: 96,
          color: textColor,
          fontFamily: 'Arial Black, sans-serif',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          transform: `scale(${s})`,
          padding: '0 80px',
        }}
      >
        {text}
      </div>
      {subtext ? (
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Arial, sans-serif',
            transform: `scale(${s})`,
            maxWidth: 1200,
            textAlign: 'center',
          }}
        >
          {subtext}
        </div>
      ) : null}
      <div
        style={{
          background: accentColor,
          color: '#001a10',
          padding: '22px 64px',
          borderRadius: 14,
          fontSize: 36,
          fontFamily: 'Arial Black, sans-serif',
          fontWeight: 900,
          letterSpacing: '0.02em',
          transform: `scale(${pulse})`,
          boxShadow: `0 18px 50px ${accentColor}55`,
          opacity: btnFade,
        }}
      >
        {buttonText}
      </div>
    </AbsoluteFill>
  );
};
