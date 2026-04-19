import { Easing } from 'remotion';

export const easings = {
  smooth: Easing.out(Easing.cubic),
  bounce: Easing.out(Easing.back(1.5)),
  linear: Easing.linear,
  inOut: Easing.inOut(Easing.cubic),
  sharp: Easing.out(Easing.quad),
  elastic: Easing.out(Easing.elastic(1)),
} as const;

export type EasingName = keyof typeof easings;

export const resolveEasing = (name?: EasingName) => easings[name ?? 'smooth'];

export const framesToSeconds = (frames: number, fps = 30) => frames / fps;
export const secondsToFrames = (seconds: number, fps = 30) => Math.round(seconds * fps);
