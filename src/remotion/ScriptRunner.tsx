import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import {
  BigHeadline,
  TextReveal,
  WordByWord,
  BlurIn,
  Glitch,
  SplitHeadline,
  TypewriterText,
  TypingCode,
  CountUp,
  GradientBG,
  ParticleField,
  SolidColor,
  KineticTypography,
  GlassmorphismCard,
  ChromaticScanline,
  MatrixRain,
  DepthZoom,
  ShatterReveal,
  TerminalWindow,
  CardStack3D,
} from './blocks';

const BLOCK_MAP: Record<string, React.ComponentType<any>> = {
  BigHeadline,
  TextReveal,
  WordByWord,
  BlurIn,
  Glitch,
  SplitHeadline,
  TypewriterText,
  TypingCode,
  CountUp,
  KineticTypography,
  GlassmorphismCard,
  ChromaticScanline,
  MatrixRain,
  DepthZoom,
  ShatterReveal,
  TerminalWindow,
  CardStack3D,
};

const BG_MAP: Record<string, React.ComponentType<any>> = {
  GradientBG,
  ParticleField,
  SolidColor,
};

export type ScriptScene = {
  text: string;
  audio: string;
  durationInFrames: number;
  block?: string;
  blockProps?: Record<string, unknown>;
  bg?: string;
  bgProps?: Record<string, unknown>;
};

export type ScriptRunnerProps = {
  scenes?: ScriptScene[];
  fontSize?: number;
  textColor?: string;
  bgColors?: string[];
  defaultBlock?: string;
};

export const ScriptRunner: React.FC<ScriptRunnerProps> = ({
  scenes = [],
  fontSize = 140,
  textColor = '#ffffff',
  bgColors = ['#0f172a', '#1e293b'],
  defaultBlock = 'BigHeadline',
}) => {
  let frameCursor = 0;
  // If any scene specifies its own bg, we skip the default top-level gradient
  // so the scene bg has a clean canvas to draw on.
  const anyMoodBg = scenes.some(s => s.bg);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {!anyMoodBg && <GradientBG colors={bgColors} angle={135} animated={true} />}
      {scenes.map((s, i) => {
        const from = frameCursor;
        frameCursor += s.durationInFrames;
        const Block = BLOCK_MAP[s.block || defaultBlock] || BigHeadline;
        const blockProps = { text: s.text, fontSize, color: textColor, ...(s.blockProps || {}) };
        const Bg = s.bg ? BG_MAP[s.bg] : null;
        return (
          <Sequence key={i} from={from} durationInFrames={s.durationInFrames}>
            {Bg ? <Bg {...(s.bgProps || {})} /> : null}
            <Block {...blockProps} />
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
