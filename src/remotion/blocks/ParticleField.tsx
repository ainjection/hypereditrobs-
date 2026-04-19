import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export type ParticleFieldProps = {
  color?: string;
  count?: number;
  background?: string;
};

export const ParticleField: React.FC<ParticleFieldProps> = ({
  color = '#00e676',
  count = 40,
  background = '#050507',
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i * 47) % 100,
        y: (i * 71) % 100,
        size: 1 + (i % 4),
        drift: 0.3 + ((i * 3) % 10) * 0.08,
        opacity: 0.2 + ((i * 5) % 7) * 0.08,
      })),
    [count]
  );
  return (
    <AbsoluteFill style={{ background }}>
      {particles.map((p, i) => {
        const y = (p.y - (frame * p.drift * 0.5)) % 100;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${y < 0 ? y + 100 : y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
