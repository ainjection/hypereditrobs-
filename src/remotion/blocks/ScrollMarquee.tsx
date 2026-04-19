import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export type ScrollMarqueeProps = {
  items?: string[];
  fontSize?: number;
  color?: string;
  separatorColor?: string;
  background?: string;
  pixelsPerFrame?: number;
  separator?: string;
  fontFamily?: string;
  position?: 'top' | 'middle' | 'bottom';
  height?: number;
};

export const ScrollMarquee: React.FC<ScrollMarqueeProps> = ({
  items = ['NEW DROP', 'OUT NOW', 'DON\'T MISS', 'TAP IN'],
  fontSize = 90,
  color = '#ffffff',
  separatorColor = '#00e676',
  background = '#0a0a0a',
  pixelsPerFrame = 6,
  separator = '★',
  fontFamily = 'Inter, system-ui, sans-serif',
  position = 'middle',
  height = 160,
}) => {
  const frame = useCurrentFrame();
  const content = items.flatMap((item, i) => [
    <span key={`i-${i}`} style={{ color }}>{item}</span>,
    <span key={`s-${i}`} style={{ color: separatorColor, margin: '0 40px' }}>{separator}</span>,
  ]);
  const doubled = [...content, ...content, ...content];
  const offset = -(frame * pixelsPerFrame) % 99999;
  const alignItems = position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center';
  return (
    <AbsoluteFill style={{ alignItems, justifyContent: 'stretch' }}>
      <div
        style={{
          width: '100%',
          height,
          background,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          fontFamily,
          fontWeight: 900,
          fontSize,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ transform: `translateX(${offset}px)`, display: 'flex', alignItems: 'center', paddingLeft: 40 }}>
          {doubled}
        </div>
      </div>
    </AbsoluteFill>
  );
};
