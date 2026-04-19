import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

export type StatsGridProps = {
  stats?: Array<{ value: string; label: string; color?: string }>;
  accentColor?: string;
  bgColor?: string;
};

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats = [
    { value: '1M', label: 'Users' },
    { value: '99%', label: 'Uptime' },
    { value: '24h', label: 'Support' },
    { value: '5★', label: 'Rating' },
  ],
  accentColor = '#00e676',
  bgColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length > 2 ? 2 : stats.length}, 1fr)`,
          gap: 32,
          width: '100%',
          maxWidth: 1400,
        }}
      >
        {stats.map((stat, i) => {
          const delay = i * 6;
          const s = spring({ frame: frame - delay, fps, from: 0, to: 1, config: { stiffness: 90, damping: 14 } });
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 18,
                padding: '44px 36px',
                textAlign: 'center',
                transform: `scale(${s})`,
                opacity,
              }}
            >
              <div
                style={{
                  fontSize: 120,
                  fontFamily: 'Arial Black, sans-serif',
                  fontWeight: 900,
                  color: stat.color || accentColor,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.9,
                  marginBottom: 14,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'Arial, sans-serif',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
