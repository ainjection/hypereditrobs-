import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export type GlassmorphismCardProps = {
  text?: string;
  subtext?: string;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  fontFamily?: string;
  glassColor?: string;
  borderColor?: string;
  bgColors?: string[];
  width?: number;
  height?: number;
};

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  text = 'Frosted Glass',
  subtext = 'with depth and light',
  fontSize = 160,
  color = '#ffffff',
  accentColor = '#00e676',
  fontFamily = 'Inter, system-ui, sans-serif',
  glassColor = 'rgba(255,255,255,0.08)',
  borderColor = 'rgba(255,255,255,0.18)',
  bgColors = ['#0f172a', '#3b0764', '#0f172a'],
  width = 1200,
  height = 600,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 14, stiffness: 120, mass: 1 } });
  const glow = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const shimmerX = interpolate(frame, [0, 180], [-200, width + 200]);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Layered gradient background with animated blobs */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% 40%, ${bgColors[1] || '#3b0764'} 0%, ${bgColors[0] || '#0f172a'} 50%, ${bgColors[2] || '#0f172a'} 100%)`,
        }}
      />
      {[0, 1, 2].map((i) => {
        const cx = 20 + (i * 35) + Math.sin((frame / 30) + i) * 10;
        const cy = 30 + Math.cos((frame / 40) + i) * 20;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${cx}%`,
              top: `${cy}%`,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: accentColor,
              filter: 'blur(160px)',
              opacity: 0.25,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* The glass card */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width,
            height,
            background: glassColor,
            border: `1px solid ${borderColor}`,
            borderRadius: 32,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: `0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px ${borderColor}, inset 0 1px 0 rgba(255,255,255,0.2)`,
            transform: `translateY(${(1 - progress) * 60}px) scale(${0.9 + progress * 0.1})`,
            opacity: progress,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top-edge shimmer sweep */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 200,
              height: '100%',
              transform: `translateX(${shimmerX}px) skewX(-20deg)`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            }}
          />
          <div
            style={{
              fontSize,
              color,
              fontFamily,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textShadow: `0 0 40px ${accentColor}${Math.floor(glow * 80).toString(16).padStart(2, '0')}`,
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            {text}
          </div>
          {subtext && (
            <div
              style={{
                fontSize: fontSize * 0.25,
                color: accentColor,
                fontFamily,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: 24,
                opacity: 0.85,
              }}
            >
              {subtext}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
