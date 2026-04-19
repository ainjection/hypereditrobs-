// Mood Library — curated visual styles. Each mood locks in palette,
// block rotation, background, font weight/size, and pacing. User picks
// one and the script-to-video engine does the rest.
//
// Shape:
//   { id, name, description, palette: {text, accent, bg1, bg2},
//     blockRotation: [...], accentRotation: [...], fontSize, pacing,
//     bgBlock: 'GradientBG' | 'SolidColor' | 'ParticleField',
//     textTransform: 'none' | 'uppercase' }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MoodDef = any;
const MOODS: MoodDef[] = [
  {
    id: 'apple-keynote',
    name: 'Apple Keynote Elegance',
    description: 'Black canvas, huge white display type, slow blur-to-focus reveals. Product-launch whisper.',
    palette: { text: '#ffffff', accent: '#0066ff', bg1: '#000000', bg2: '#0a0a0a' },
    blockRotation: ['DepthZoom', 'BlurIn', 'BigHeadline', 'TextReveal'],
    accentRotation: ['#0066ff', '#ffffff', '#0066ff'],
    fontSize: 220,
    pacing: 1.25,
    bgBlock: 'SolidColor',
    bgProps: { color: '#000000' },
    textTransform: 'none'
  },
  {
    id: 'mkbhd-tech',
    name: 'MKBHD Tech Hype',
    description: 'Dark bg, bold punchy type, kinetic cuts, cyan + orange accents. Tech-reviewer energy.',
    palette: { text: '#ffffff', accent: '#00b0ff', bg1: '#0b0b0f', bg2: '#1a1a24' },
    blockRotation: ['KineticTypography', 'WordByWord', 'SplitHeadline', 'DepthZoom'],
    accentRotation: ['#00b0ff', '#ff6b00', '#00b0ff'],
    fontSize: 150,
    pacing: 0.85,
    bgBlock: 'GradientBG',
    bgProps: { colors: ['#0b0b0f', '#1a1a24'], angle: 135, animated: true },
    textTransform: 'none'
  },
  {
    id: 'neon-tiktok',
    name: 'Neon Brutalist TikTok',
    description: 'Black bg, screaming neon chunks of text, every word a different motion. Built for shorts.',
    palette: { text: '#ffffff', accent: '#00ff88', bg1: '#050505', bg2: '#0f0f0f' },
    blockRotation: ['WordByWord', 'SplitHeadline', 'KineticTypography', 'Glitch'],
    accentRotation: ['#00ff88', '#ff0080', '#ffe600', '#00e0ff'],
    fontSize: 180,
    pacing: 0.75,
    bgBlock: 'SolidColor',
    bgProps: { color: '#050505' },
    textTransform: 'uppercase'
  },
  {
    id: 'cyberpunk-glitch',
    name: 'Cyberpunk Glitch',
    description: 'Chromatic aberration, scanlines, glitchy transitions. Blade Runner 2049 meets 90s hacker.',
    palette: { text: '#ffffff', accent: '#ff0080', bg1: '#050505', bg2: '#1a0020' },
    blockRotation: ['ChromaticScanline', 'Glitch', 'KineticTypography', 'MatrixRain'],
    accentRotation: ['#ff0080', '#00e0ff', '#ffe600'],
    fontSize: 180,
    pacing: 0.9,
    bgBlock: 'SolidColor',
    bgProps: { color: '#050505' },
    textTransform: 'uppercase'
  },
  {
    id: 'netflix-prestige',
    name: 'Netflix Prestige',
    description: 'Deep black, centred sans, long slow blur-in. Dropping on November 14th.',
    palette: { text: '#ffffff', accent: '#e50914', bg1: '#000000', bg2: '#000000' },
    blockRotation: ['BlurIn', 'DepthZoom', 'BlurIn', 'TextReveal'],
    accentRotation: ['#ffffff', '#e50914', '#ffffff'],
    fontSize: 200,
    pacing: 1.5,
    bgBlock: 'SolidColor',
    bgProps: { color: '#000000' },
    textTransform: 'none'
  },
  {
    id: 'matrix-hacker',
    name: 'Matrix Hacker',
    description: 'Green code rain, terminal windows, typing-code panels. Access granted.',
    palette: { text: '#00ff41', accent: '#aaffaa', bg1: '#000000', bg2: '#001a00' },
    blockRotation: ['MatrixRain', 'TypingCode', 'TerminalWindow', 'Glitch'],
    accentRotation: ['#00ff41', '#aaffaa'],
    fontSize: 150,
    pacing: 1.0,
    bgBlock: 'SolidColor',
    bgProps: { color: '#000000' },
    textTransform: 'uppercase'
  },
  {
    id: 'cinematic-cold-open',
    name: 'Cinematic Cold Open',
    description: 'Moody deep blues, depth-of-field, words emerging from focus. Trailer cold open.',
    palette: { text: '#ffffff', accent: '#94a3b8', bg1: '#0a1224', bg2: '#1e2939' },
    blockRotation: ['DepthZoom', 'BlurIn', 'TextReveal', 'BlurIn'],
    accentRotation: ['#94a3b8', '#ffffff', '#94a3b8'],
    fontSize: 200,
    pacing: 1.3,
    bgBlock: 'GradientBG',
    bgProps: { colors: ['#0a1224', '#1e2939'], angle: 180, animated: true },
    textTransform: 'none'
  },
  {
    id: 'motion-studio',
    name: 'Motion Graphics Studio',
    description: 'Gradient base, glass cards, bright pops of neon. Agency reel energy.',
    palette: { text: '#ffffff', accent: '#00e676', bg1: '#3b0764', bg2: '#0f172a' },
    blockRotation: ['KineticTypography', 'GlassmorphismCard', 'TextReveal', 'SplitHeadline'],
    accentRotation: ['#00e676', '#ff0080', '#00b0ff', '#ffe600'],
    fontSize: 170,
    pacing: 1.0,
    bgBlock: 'GradientBG',
    bgProps: { colors: ['#3b0764', '#0f172a'], angle: 135, animated: true },
    textTransform: 'none'
  },
  {
    id: 'product-shot-3d',
    name: '3D Product Shot',
    description: 'Floating glass cards in deep space with glowing neon outlines (orange + cyan), starfield, orbital particles. Feature-reveal product-launch feel.',
    palette: { text: '#ffffff', accent: '#00d4ff', bg1: '#030614', bg2: '#0a0a1f' },
    blockRotation: ['CardStack3D', 'CardStack3D', 'DepthZoom', 'CardStack3D'],
    accentRotation: ['#ff7a00', '#00d4ff', '#ff0080'],
    fontSize: 120,
    pacing: 1.2,
    bgBlock: 'SolidColor',
    bgProps: { color: '#030614' },
    textTransform: 'none'
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave Nostalgic',
    description: 'Pink + teal palette, VHS scanlines, dreamy chromatic aberration. A E S T H E T I C.',
    palette: { text: '#ffffff', accent: '#ff71ce', bg1: '#1a0033', bg2: '#3d0066' },
    blockRotation: ['ChromaticScanline', 'TextReveal', 'WordByWord', 'Glitch'],
    accentRotation: ['#ff71ce', '#01cdfe', '#b967ff'],
    fontSize: 200,
    pacing: 1.1,
    bgBlock: 'GradientBG',
    bgProps: { colors: ['#1a0033', '#3d0066'], angle: 180, animated: true },
    textTransform: 'uppercase'
  },
  {
    id: 'youtube-punchy',
    name: 'YouTube Creator Punchy',
    description: 'Bright bg, chunky bold type, snappy word-by-word, stats pop in. Hook-and-retain.',
    palette: { text: '#ffffff', accent: '#ff3366', bg1: '#111827', bg2: '#1f2937' },
    blockRotation: ['WordByWord', 'SplitHeadline', 'CountUp', 'KineticTypography'],
    accentRotation: ['#ff3366', '#ffe600', '#00e676', '#00b0ff'],
    fontSize: 160,
    pacing: 0.7,
    bgBlock: 'GradientBG',
    bgProps: { colors: ['#111827', '#1f2937'], angle: 135, animated: true },
    textTransform: 'none'
  },
  {
    id: 'dark-thriller',
    name: 'Dark Thriller Trailer',
    description: 'Black void, text shatters into place, slow blood-red accents. Mystery-box tension.',
    palette: { text: '#ffffff', accent: '#dc2626', bg1: '#000000', bg2: '#0a0a0a' },
    blockRotation: ['ShatterReveal', 'BlurIn', 'DepthZoom', 'TextReveal'],
    accentRotation: ['#dc2626', '#ffffff', '#dc2626'],
    fontSize: 240,
    pacing: 1.3,
    bgBlock: 'SolidColor',
    bgProps: { color: '#000000' },
    textTransform: 'uppercase'
  },
  {
    id: 'minimalist-editorial',
    name: 'Minimalist Editorial',
    description: 'Off-white canvas, black display serif, generous breathing room. New Yorker cover.',
    palette: { text: '#0f0f0f', accent: '#6b7280', bg1: '#f5f2ea', bg2: '#ece7db' },
    blockRotation: ['BigHeadline', 'BlurIn', 'TextReveal', 'BigHeadline'],
    accentRotation: ['#6b7280', '#0f0f0f'],
    fontSize: 180,
    pacing: 1.2,
    bgBlock: 'SolidColor',
    bgProps: { color: '#f5f2ea' },
    textTransform: 'none'
  }
];

function list() {
  return MOODS.map(m => ({
    id: m.id,
    name: m.name,
    description: m.description,
    palette: m.palette,
    fontSize: m.fontSize,
    pacing: m.pacing,
    bgBlock: m.bgBlock,
    textTransform: m.textTransform
  }));
}

function get(id: string) {
  return MOODS.find(m => m.id === id) || null;
}

// Produce per-scene picks for a list of sentences, using the mood's
// block rotation + accent rotation.
function applyMoodToSentences({ sentences, mood }: { sentences: string[]; mood: any }) {
  if (!mood) throw new Error('mood required');
  return sentences.map((text: string, i: number) => {
    const block = mood.blockRotation[i % mood.blockRotation.length];
    const accent = mood.accentRotation[i % mood.accentRotation.length];
    const displayText = mood.textTransform === 'uppercase' ? text.toUpperCase() : text;
    const base = { color: mood.palette.text, fontSize: mood.fontSize };

    const blockProps: Record<string, any> = { ...base, text: displayText };
    switch (block) {
      case 'Glitch':
        blockProps.accentColor1 = accent;
        blockProps.accentColor2 = mood.palette.accent;
        blockProps.intensity = 1.2;
        break;
      case 'WordByWord':
        blockProps.accentColor = accent;
        blockProps.accentEvery = 3;
        break;
      case 'SplitHeadline': {
        const words = displayText.split(/\s+/);
        const mid = Math.floor(words.length / 2);
        blockProps.topText = words.slice(0, mid).join(' ');
        blockProps.bottomText = words.slice(mid).join(' ');
        blockProps.topColor = mood.palette.text;
        blockProps.bottomColor = accent;
        delete blockProps.text;
        break;
      }
      case 'TextReveal':
        blockProps.direction = ['left', 'right', 'up'][i % 3];
        blockProps.easing = 'inOut';
        break;
      case 'BlurIn':
        blockProps.startBlur = 40;
        blockProps.durationInFrames = 40;
        break;
      case 'DepthZoom':
        blockProps.durationInFrames = 70;
        blockProps.zoomFrom = 0.55;
        blockProps.zoomTo = 1.08;
        break;
      case 'BigHeadline':
        // uses defaults
        break;
      case 'KineticTypography':
        blockProps.accentColor = accent;
        blockProps.wordsPerSecond = mood.pacing < 1 ? 2.6 : 1.8;
        break;
      case 'TypewriterText':
        blockProps.charsPerSecond = 22;
        break;
      case 'TypingCode':
        blockProps.code = displayText;
        blockProps.language = 'markdown';
        blockProps.charsPerSecond = 35;
        delete blockProps.text;
        break;
      case 'ChromaticScanline':
        blockProps.background = mood.palette.bg1;
        blockProps.rgbOffset = 10;
        break;
      case 'MatrixRain':
        blockProps.rainColor = mood.palette.accent || '#00ff41';
        blockProps.columns = 50;
        break;
      case 'GlassmorphismCard':
        blockProps.accentColor = accent;
        blockProps.bgColors = [mood.palette.bg1, mood.palette.bg2, mood.palette.bg1];
        blockProps.subtext = '';
        break;
      case 'ShatterReveal':
        blockProps.durationInFrames = 50;
        break;
      case 'CardStack3D':
        blockProps.accentColor1 = '#ff7a00';
        blockProps.accentColor2 = '#00d4ff';
        blockProps.background = mood.palette.bg1;
        blockProps.subtext = '';
        break;
      case 'TerminalWindow':
        blockProps.lines = [displayText];
        delete blockProps.text;
        break;
      case 'CountUp':
        // If sentence has a number, extract it; else hide
        const numMatch = displayText.match(/(\d+(?:\.\d+)?)/);
        if (numMatch) {
          blockProps.from = 0;
          blockProps.to = parseFloat(numMatch[1]);
          delete blockProps.text;
        }
        break;
    }
    return { block, blockProps };
  });
}

export { list, get, applyMoodToSentences };
export default { list, get, applyMoodToSentences };
