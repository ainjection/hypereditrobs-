import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, random } from 'remotion';

export type CardStack3DProps = {
  text?: string;
  subtext?: string;
  cards?: Array<{ icon?: string; label?: string; color?: string }>;
  accentColor1?: string;
  accentColor2?: string;
  background?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
};

// Positions for three floating cards in 3D space. Slightly asymmetric so
// it feels like a product shot, not a symmetrical grid.
const CARD_POSITIONS = [
  { x: -420, y: 20, z: -200, rotY: 28, rotX: -4 },
  { x: 0, y: -10, z: 0, rotY: 0, rotX: 0 },
  { x: 420, y: 40, z: -150, rotY: -24, rotX: -2 },
];

export const CardStack3D: React.FC<CardStack3DProps> = ({
  text = 'Built in 3D',
  subtext = '',
  cards = [
    { icon: '◎', label: 'Design' },
    { icon: '⚡', label: 'Build' },
    { icon: '➤', label: 'Ship' }
  ],
  accentColor1 = '#ff7a00',
  accentColor2 = '#00d4ff',
  background = '#030614',
  fontSize = 120,
  color = '#ffffff',
  fontFamily = 'Inter, system-ui, sans-serif',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame, fps, config: { damping: 14, stiffness: 140, mass: 1 } });
  const titleSpring = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 180, mass: 1 } });
  const subtitleSpring = spring({ frame: frame - 24, fps, config: { damping: 18, stiffness: 180, mass: 1 } });
  const driftA = Math.sin(frame / 40) * 8;
  const driftB = Math.cos(frame / 36) * 6;

  return (
    <AbsoluteFill style={{ background, overflow: 'hidden' }}>
      {/* Deep-space gradient + nebula glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${accentColor1}22 0%, transparent 45%), radial-gradient(ellipse at 75% 70%, ${accentColor2}22 0%, transparent 50%), ${background}`,
        }}
      />
      {/* Subtle starfield */}
      <AbsoluteFill>
        {Array.from({ length: 80 }).map((_, i) => {
          const x = random(`sx-${i}`) * 100;
          const y = random(`sy-${i}`) * 100;
          const size = 1 + random(`ss-${i}`) * 2;
          const twinkle = 0.3 + Math.sin((frame / 10) + i * 1.3) * 0.4;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#ffffff',
                opacity: twinkle,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Floor reflection gradient */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '40%',
          background: `linear-gradient(to top, ${background} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 3D card stage */}
      <AbsoluteFill style={{ perspective: 2400, transformStyle: 'preserve-3d', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'relative',
            width: 1300,
            height: 600,
            transformStyle: 'preserve-3d',
            transform: `rotateX(8deg) translateY(${40 * (1 - entry)}px)`,
          }}
        >
          {CARD_POSITIONS.slice(0, Math.min(3, cards.length || 3)).map((pos, i) => {
            const card = (cards && cards[i]) || { icon: '', label: '' };
            const neon = i % 2 === 0 ? accentColor1 : accentColor2;
            const cardSpring = spring({ frame: frame - i * 5, fps, config: { damping: 16, stiffness: 150 } });
            const sway = i === 1 ? driftA : i === 0 ? driftB : -driftB;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 420,
                  height: 480,
                  marginLeft: -210,
                  marginTop: -240,
                  transform: `translate3d(${pos.x * cardSpring}px, ${pos.y + sway}px, ${pos.z * cardSpring}px) rotateY(${pos.rotY}deg) rotateX(${pos.rotX}deg) scale(${0.7 + cardSpring * 0.3})`,
                  opacity: cardSpring,
                  borderRadius: 28,
                  background: 'rgba(255,255,255,0.03)',
                  border: `2px solid ${neon}`,
                  boxShadow: `0 0 60px ${neon}aa, 0 0 120px ${neon}55, inset 0 0 40px ${neon}30, 0 40px 80px rgba(0,0,0,0.8)`,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 40,
                  willChange: 'transform, opacity',
                }}
              >
                {card.icon && (
                  <div
                    style={{
                      fontSize: 110,
                      color: card.color || neon,
                      textShadow: `0 0 30px ${neon}`,
                      marginBottom: 20,
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    {card.icon}
                  </div>
                )}
                {card.label && (
                  <div
                    style={{
                      fontSize: 38,
                      fontFamily,
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      textShadow: `0 0 20px ${neon}88`,
                      textAlign: 'center',
                    }}
                  >
                    {card.label}
                  </div>
                )}

                {/* Inner decorative grid lines */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 20,
                    borderRadius: 20,
                    border: `1px solid ${neon}33`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    left: 24,
                    right: 24,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${neon}aa, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Overlay headline — positioned above the card stack */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 80, pointerEvents: 'none' }}>
        <div
          style={{
            fontSize,
            color,
            fontFamily,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            textAlign: 'center',
            opacity: titleSpring,
            transform: `translateY(${(1 - titleSpring) * 30}px)`,
            textShadow: `0 0 40px ${accentColor2}77, 0 4px 30px rgba(0,0,0,0.6)`,
            maxWidth: 1400,
            padding: '0 60px',
          }}
        >
          {text}
        </div>
        {subtext && (
          <div
            style={{
              fontSize: fontSize * 0.22,
              fontFamily,
              fontWeight: 500,
              color: accentColor2,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginTop: 16,
              opacity: subtitleSpring,
              transform: `translateY(${(1 - subtitleSpring) * 20}px)`,
              textShadow: `0 0 20px ${accentColor2}aa`,
            }}
          >
            {subtext}
          </div>
        )}
      </AbsoluteFill>

      {/* Floating particles between cards */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 25 }).map((_, i) => {
          const x = random(`px-${i}`) * 100;
          const yBase = random(`py-${i}`) * 100;
          const y = (yBase - (frame / 4) * (0.3 + random(`pv-${i}`) * 0.7)) % 110;
          const size = 2 + random(`ps-${i}`) * 4;
          const neon = i % 2 === 0 ? accentColor1 : accentColor2;
          const alpha = 0.3 + random(`pa-${i}`) * 0.4;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: neon,
                opacity: alpha,
                boxShadow: `0 0 ${size * 4}px ${neon}`,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
