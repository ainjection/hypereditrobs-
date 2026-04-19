import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export type iPadFrameProps = {
  image?: string;              // static path, e.g. "images/foo.png"
  rotation?: number;           // tilt in degrees
  scale?: number;              // overall size, default 0.8
  shadow?: boolean;
  entranceSpring?: boolean;    // scales up on entrance
};

export const iPadFrame: React.FC<iPadFrameProps> = ({
  image,
  rotation = 0,
  scale = 0.8,
  shadow = true,
  entranceSpring = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = entranceSpring
    ? spring({ frame, fps, from: 0.85, to: scale, config: { stiffness: 80, damping: 16 } })
    : scale;

  const imgSrc = image ? (image.startsWith('http') ? image : staticFile(image)) : '';

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: 1200,
          height: 840,
          background: '#1a1a1a',
          borderRadius: 50,
          padding: 30,
          transform: `scale(${s}) rotate(${rotation}deg)`,
          boxShadow: shadow ? '0 60px 120px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#000',
            borderRadius: 30,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {imgSrc ? (
            <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          ) : (
            <div style={{ color: '#555', fontSize: 36 }}>[ipad content]</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
