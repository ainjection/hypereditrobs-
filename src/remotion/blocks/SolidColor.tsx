import React from 'react';
import { AbsoluteFill } from 'remotion';

export type SolidColorProps = { color?: string };

export const SolidColor: React.FC<SolidColorProps> = ({ color = '#0a0a0a' }) => (
  <AbsoluteFill style={{ background: color }} />
);
