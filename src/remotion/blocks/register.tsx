import React from 'react';
import { Composition } from 'remotion';
import {
  GradientBG,
  SolidColor,
  ParticleField,
  iPadFrame,
  iPhoneFrame,
  BrowserWindow,
  TypewriterText,
  SpinningText,
  BigHeadline,
  ImageZoom,
  LogoReveal,
  CallToAction,
  StatsGrid,
  TextReveal,
  CodeBlock,
  TypingCode,
  CountUp,
  TerminalWindow,
  WordByWord,
  BlurIn,
  Glitch,
  ScrollMarquee,
  BrandStripe,
  VideoFrame,
  SplitHeadline,
  LogoGrid,
  KineticTypography,
  GlassmorphismCard,
  ChromaticScanline,
  MatrixRain,
  DepthZoom,
  ShatterReveal,
  CardStack3D,
} from './index';

type BlockDef = {
  id: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  duration?: number;
};

const BLOCKS: BlockDef[] = [
  { id: 'Block-GradientBG', component: GradientBG, defaultProps: { colors: ['#7e22ce', '#3b0764'], angle: 135, animated: true } },
  { id: 'Block-SolidColor', component: SolidColor, defaultProps: { color: '#111827' } },
  { id: 'Block-ParticleField', component: ParticleField, defaultProps: { color: '#00e676', count: 40, background: '#050507' } },
  { id: 'Block-iPadFrame', component: iPadFrame, defaultProps: { image: '', rotation: 0, scale: 0.8 } },
  { id: 'Block-iPhoneFrame', component: iPhoneFrame, defaultProps: { image: '', rotation: 0, scale: 0.8 } },
  { id: 'Block-BrowserWindow', component: BrowserWindow, defaultProps: { url: 'video-agent.local', width: 1400, shadow: true } },
  { id: 'Block-TypewriterText', component: TypewriterText, defaultProps: { text: 'Typing...', fontSize: 140, color: '#ffffff', charsPerSecond: 20 } },
  { id: 'Block-SpinningText', component: SpinningText, defaultProps: { text: 'Spin', fontSize: 180, color: '#ffffff' } },
  { id: 'Block-BigHeadline', component: BigHeadline, defaultProps: { text: 'Big Headline', subtext: 'Supporting copy', fontSize: 180 } },
  { id: 'Block-ImageZoom', component: ImageZoom, defaultProps: {
      "image": "",
      "startScale": 27,
      "endScale": 1.2,
      "durationFrames": 120
    } },
  { id: 'Block-LogoReveal', component: LogoReveal, defaultProps: { text: 'VIDEO AGENT', subtext: 'localhost', accentColor: '#00e676' } },
  { id: 'Block-CallToAction', component: CallToAction, defaultProps: { text: 'Ready to ship?', buttonText: 'Subscribe', accentColor: '#00e676' } },
  { id: 'Block-StatsGrid', component: StatsGrid, defaultProps: { stats: [{ value: '20', label: 'Blocks' }, { value: '40+', label: 'Compositions' }, { value: '1', label: 'Weekend' }], accentColor: '#00e676' } },
  { id: 'Block-TextReveal', component: TextReveal, defaultProps: { text: 'Reveal', fontSize: 220, color: '#ffffff', direction: 'left', durationInFrames: 30 } },
  { id: 'Block-CodeBlock', component: CodeBlock, defaultProps: { code: "const video = new VideoAgent();\nvideo.render('demo.mp4');\n// done in 2s", language: 'typescript', fontSize: 32 } },
  { id: 'Block-TypingCode', component: TypingCode, defaultProps: { code: "const agent = new VideoAgent();\nagent.render('demo.mp4');", language: 'typescript', charsPerSecond: 35 } },
  { id: 'Block-CountUp', component: CountUp, defaultProps: {
      "from": 0,
      "to": 100,
      "durationInFrames": 60,
      "suffix": "%",
      "fontSize": 280,
      "color": "#462a2b"
    } },
  { id: 'Block-TerminalWindow', component: TerminalWindow, defaultProps: { lines: ['npm install video-agent', 'Installing dependencies...', '✓ Done in 2.3s'], title: 'zsh', charsPerSecond: 30 } },
  { id: 'Block-WordByWord', component: WordByWord, defaultProps: { text: 'This is how we make videos now', fontSize: 120, accentColor: '#00e676', accentEvery: 3 } },
  { id: 'Block-BlurIn', component: BlurIn, defaultProps: { text: 'Focus', fontSize: 220, color: '#ffffff', startBlur: 40, durationInFrames: 30 } },
  { id: 'Block-Glitch', component: Glitch, defaultProps: {
      "text": "GLIT",
      "fontSize": 240,
      "intensity": 1
    } },
  { id: 'Block-ScrollMarquee', component: ScrollMarquee, defaultProps: { items: ['NEW DROP', 'OUT NOW', "DON'T MISS", 'TAP IN'], fontSize: 90, position: 'middle' } },
  { id: 'Block-BrandStripe', component: BrandStripe, defaultProps: { colors: ['#00e676', '#ffffff', '#ff0080'], direction: 'horizontal', position: 'bottom', thickness: 32 } },
  { id: 'Block-VideoFrame', component: VideoFrame, defaultProps: { src: '', chrome: 'mac', width: 1400, label: 'demo.mp4' } },
  { id: 'Block-SplitHeadline', component: SplitHeadline, defaultProps: { topText: 'THIS IS', bottomText: 'BIG', topColor: '#ffffff', bottomColor: '#00e676', fontSize: 260 } },
  { id: 'Block-LogoGrid', component: LogoGrid, defaultProps: { logos: [], columns: 4, cellHeight: 180 } },
  { id: 'Block-KineticTypography', component: KineticTypography, defaultProps: { text: 'Every word moves differently', fontSize: 130, accentColor: '#00e676', wordsPerSecond: 2.2 } },
  { id: 'Block-GlassmorphismCard', component: GlassmorphismCard, defaultProps: { text: 'Frosted Glass', subtext: 'with depth and light', fontSize: 160, accentColor: '#00e676' } },
  { id: 'Block-ChromaticScanline', component: ChromaticScanline, defaultProps: { text: 'VHS TRANSMISSION', fontSize: 200, rgbOffset: 8 } },
  { id: 'Block-MatrixRain', component: MatrixRain, defaultProps: {
      "text": "ACCESS ",
      "fontSize": 180,
      "rainColor": "#3e1f42",
      "columns": 60
    } },
  { id: 'Block-DepthZoom', component: DepthZoom, defaultProps: { text: 'Come closer', subtext: 'INTO FOCUS', fontSize: 220, durationInFrames: 60 } },
  { id: 'Block-ShatterReveal', component: ShatterReveal, defaultProps: { text: 'Impact', fontSize: 260, shardCount: 24 } },
  { id: 'Block-CardStack3D', component: CardStack3D, defaultProps: { text: 'Built in 3D', subtext: 'PRODUCT SHOT', accentColor1: '#ff7a00', accentColor2: '#00d4ff' } },
];

export const BlockCompositions: React.FC = () => (
  <>
    {BLOCKS.map((b) => (
      <Composition
        key={b.id}
        id={b.id}
        component={b.component}
        durationInFrames={b.duration ?? 90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={b.defaultProps}
      />
    ))}
  </>
);
