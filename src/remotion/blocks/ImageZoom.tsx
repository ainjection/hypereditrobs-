import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate } from 'remotion';

export type ImageZoomProps = {
  image?: string;
  startScale?: number;
  endScale?: number;
  durationFrames?: number;   // zoom completes over this many frames
  fit?: 'cover' | 'contain';
  overlayTint?: string;
};

export const ImageZoom: React.FC<ImageZoomProps> = ({
  image,
  startScale = 1.0,
  endScale = 1.2,
  durationFrames = 120,
  fit = 'cover',
  overlayTint,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationFrames], [startScale, endScale], { extrapolateRight: 'clamp' });
  const imgSrc = image ? (image.startsWith('http') ? image : staticFile(image)) : '';
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#000' }}>
      {imgSrc ? (
        <img
          src={imgSrc}
          style={{ width: '100%', height: '100%', objectFit: fit, transform: `scale(${scale})`, transformOrigin: 'center' }}
          alt=""
        />
      ) : null}
      {overlayTint ? <AbsoluteFill style={{ background: overlayTint }} /> : null}
    </AbsoluteFill>
  );
};
