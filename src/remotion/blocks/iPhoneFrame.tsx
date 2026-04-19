import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, spring, useVideoConfig } from 'remotion';

export type iPhoneFrameProps = {
  image?: string;
  rotation?: number;
  scale?: number;
  entranceSpring?: boolean;
};

export const iPhoneFrame: React.FC<iPhoneFrameProps> = ({
  image,
  rotation = 0,
  scale = 0.8,
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
          width: 520,
          height: 1040,
          background: '#1a1a1a',
          borderRadius: 60,
          padding: 14,
          transform: `scale(${s}) rotate(${rotation}deg)`,
          boxShadow: '0 60px 120px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 180,
            height: 30,
            background: '#000',
            borderRadius: 15,
            zIndex: 10,
          }}
        />
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#000',
            borderRadius: 48,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {imgSrc ? (
            <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          ) : (
            <div style={{ color: '#555', fontSize: 24 }}>[phone content]</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
