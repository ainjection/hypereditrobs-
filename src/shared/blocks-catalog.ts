// Catalogue of available scene blocks. The AI picks from this list when
// composing a new video. Each entry has a machine-readable schema so the
// LLM knows what props it can set.
const CATALOG: Record<string, any> = {
  GradientBG: {
    category: 'background',
    description: 'Animated colour gradient. Great as a base layer behind text or frames.',
    props: {
      colors: { type: 'array<hex>', default: ['#7e22ce', '#3b0764'], description: '2-4 hex colours' },
      angle: { type: 'number', default: 135, description: 'degrees' },
      animated: { type: 'boolean', default: false },
      animationSpeed: { type: 'number', default: 6 }
    }
  },
  SolidColor: {
    category: 'background',
    description: 'Plain solid background.',
    props: { color: { type: 'hex', default: '#0a0a0a' } }
  },
  ParticleField: {
    category: 'background',
    description: 'Floating coloured particles drifting upward. Tech/cyber vibe.',
    props: {
      color: { type: 'hex', default: '#00e676' },
      count: { type: 'number', default: 40 },
      background: { type: 'hex', default: '#050507' }
    }
  },
  iPadFrame: {
    category: 'frame',
    description: 'iPad tablet mockup with an image or content inside. Good for app/demo reveals.',
    props: {
      image: { type: 'string (static path, e.g. "images/shot.png")', required: true },
      rotation: { type: 'number', default: 0, description: 'tilt in degrees' },
      scale: { type: 'number', default: 0.8 },
      entranceSpring: { type: 'boolean', default: true }
    }
  },
  iPhoneFrame: {
    category: 'frame',
    description: 'iPhone portrait mockup with an image inside. Good for mobile screenshots.',
    props: {
      image: { type: 'string', required: true },
      rotation: { type: 'number', default: 0 },
      scale: { type: 'number', default: 0.8 },
      entranceSpring: { type: 'boolean', default: true }
    }
  },
  BrowserWindow: {
    category: 'frame',
    description: 'Desktop browser window mockup with URL bar and content area.',
    props: {
      image: { type: 'string', required: true },
      url: { type: 'string', default: 'example.com' },
      width: { type: 'number', default: 1400 }
    }
  },
  TypewriterText: {
    category: 'text',
    description: 'Character-by-character typewriter text reveal with blinking cursor.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 84 },
      color: { type: 'hex', default: '#ffffff' },
      charsPerSecond: { type: 'number', default: 20 },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  SpinningText: {
    category: 'text',
    description: 'Text that rotates and scales in. Energetic / attention-grabbing.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 120 },
      color: { type: 'hex', default: '#ffffff' },
      rotationsPerSecond: { type: 'number', default: 0.5 },
      scaleIn: { type: 'boolean', default: true }
    }
  },
  BigHeadline: {
    category: 'text',
    description: 'Large headline with optional subtext, slides in from an edge.',
    props: {
      text: { type: 'string', required: true },
      subtext: { type: 'string', default: '' },
      color: { type: 'hex', default: '#ffffff' },
      fontSize: { type: 'number', default: 140 },
      slideFrom: { type: 'bottom|top|left|right', default: 'bottom' }
    }
  },
  ImageZoom: {
    category: 'media',
    description: 'Full-bleed image with slow scale zoom (Ken Burns style).',
    props: {
      image: { type: 'string', required: true },
      startScale: { type: 'number', default: 1.0 },
      endScale: { type: 'number', default: 1.2 },
      durationFrames: { type: 'number', default: 120 },
      fit: { type: 'cover|contain', default: 'cover' }
    }
  },
  LogoReveal: {
    category: 'effect',
    description: 'Logo + text entrance with spring scale and glow. Use as intro.',
    props: {
      image: { type: 'string (logo path)', default: '' },
      text: { type: 'string', default: '' },
      subtext: { type: 'string', default: '' },
      accentColor: { type: 'hex', default: '#00e676' },
      textColor: { type: 'hex', default: '#ffffff' }
    }
  },
  CallToAction: {
    category: 'overlay',
    description: 'Big CTA: headline, subtext, pulsing button. Use as outro.',
    props: {
      text: { type: 'string', default: 'Ready to ship?' },
      subtext: { type: 'string', default: '' },
      buttonText: { type: 'string', default: 'Subscribe' },
      accentColor: { type: 'hex', default: '#00e676' },
      textColor: { type: 'hex', default: '#ffffff' },
      bgColor: { type: 'hex', default: '#0a0a0a' }
    }
  },
  StatsGrid: {
    category: 'content',
    description: 'Grid of 2-4 stats with big numbers and labels. Use for metrics/features.',
    props: {
      stats: { type: 'array<{value,label,color?}>', default: [{ value: '1M', label: 'Users' }] },
      accentColor: { type: 'hex', default: '#00e676' },
      bgColor: { type: 'hex', default: '#0a0a0a' }
    }
  },
  TextReveal: {
    category: 'text',
    description: 'Clip-path mask reveal — text appears by wiping in from an edge. Cleaner than SpinningText for title reveals.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 120 },
      color: { type: 'hex', default: '#ffffff' },
      direction: { type: 'left|right|up|down', default: 'left' },
      durationInFrames: { type: 'number', default: 30 },
      delay: { type: 'number', default: 0 },
      easing: { type: 'smooth|bounce|linear|inOut|sharp|elastic', default: 'inOut' },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  CodeBlock: {
    category: 'content',
    description: 'Static syntax-highlighted code panel (TS/JS/Python-ish). GitHub Dark palette, line numbers optional.',
    props: {
      code: { type: 'string (multi-line code)', required: true },
      language: { type: 'string', default: 'typescript' },
      fontSize: { type: 'number', default: 28 },
      width: { type: 'number', default: 1100 },
      background: { type: 'hex', default: '#0d1117' },
      showLineNumbers: { type: 'boolean', default: true }
    }
  },
  TypingCode: {
    category: 'content',
    description: 'Code typed out character-by-character with a blinking cursor. Great for AI/dev demos.',
    props: {
      code: { type: 'string (multi-line code)', required: true },
      language: { type: 'string', default: 'typescript' },
      fontSize: { type: 'number', default: 32 },
      width: { type: 'number', default: 1100 },
      charsPerSecond: { type: 'number', default: 35 },
      background: { type: 'hex', default: '#0d1117' },
      accent: { type: 'hex', default: '#79c0ff' }
    }
  },
  CountUp: {
    category: 'text',
    description: 'Animated number that counts from → to with easing. Supports prefix/suffix (e.g. "$", "%").',
    props: {
      from: { type: 'number', default: 0 },
      to: { type: 'number', default: 100 },
      durationInFrames: { type: 'number', default: 60 },
      delay: { type: 'number', default: 0 },
      decimals: { type: 'number', default: 0 },
      prefix: { type: 'string', default: '' },
      suffix: { type: 'string', default: '' },
      fontSize: { type: 'number', default: 200 },
      color: { type: 'hex', default: '#ffffff' },
      easing: { type: 'smooth|bounce|linear|inOut|sharp|elastic', default: 'smooth' },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  TerminalWindow: {
    category: 'frame',
    description: 'macOS-style terminal window with animated typed command output. Complements BrowserWindow.',
    props: {
      lines: { type: 'array<string>', default: ['npm install', 'Done.'] },
      title: { type: 'string', default: 'zsh' },
      width: { type: 'number', default: 1200 },
      fontSize: { type: 'number', default: 26 },
      charsPerSecond: { type: 'number', default: 45 },
      prompt: { type: 'string', default: '$' },
      promptColor: { type: 'hex', default: '#00e676' },
      textColor: { type: 'hex', default: '#e6edf3' },
      background: { type: 'hex', default: '#0b0d10' }
    }
  },
  WordByWord: {
    category: 'text',
    description: 'Headline revealed word-by-word with spring bounce. Every Nth word can be accent-coloured.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 100 },
      color: { type: 'hex', default: '#ffffff' },
      accentColor: { type: 'hex', default: '#00e676' },
      accentEvery: { type: 'number', default: 3 },
      wordsPerSecond: { type: 'number', default: 2.5 },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  BlurIn: {
    category: 'text',
    description: 'Text that starts heavily blurred and comes into focus. Cinematic reveal.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 180 },
      color: { type: 'hex', default: '#ffffff' },
      startBlur: { type: 'number', default: 40 },
      durationInFrames: { type: 'number', default: 30 },
      delay: { type: 'number', default: 0 },
      easing: { type: 'smooth|bounce|linear|inOut|sharp|elastic', default: 'smooth' },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  Glitch: {
    category: 'effect',
    description: 'Text with RGB chromatic aberration and jitter — glitchy/cyber feel.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 200 },
      color: { type: 'hex', default: '#ffffff' },
      accentColor1: { type: 'hex', default: '#ff0080' },
      accentColor2: { type: 'hex', default: '#00ffe0' },
      intensity: { type: 'number', default: 1, description: '0 = static, 2 = chaos' },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  ScrollMarquee: {
    category: 'overlay',
    description: 'Infinite horizontal scrolling ticker — news/breaking-style banner.',
    props: {
      items: { type: 'array<string>', default: ['NEW', 'DROP'] },
      fontSize: { type: 'number', default: 90 },
      color: { type: 'hex', default: '#ffffff' },
      separatorColor: { type: 'hex', default: '#00e676' },
      background: { type: 'hex', default: '#0a0a0a' },
      pixelsPerFrame: { type: 'number', default: 6 },
      separator: { type: 'string', default: '★' },
      position: { type: 'top|middle|bottom', default: 'middle' },
      height: { type: 'number', default: 160 }
    }
  },
  BrandStripe: {
    category: 'overlay',
    description: 'Multi-colour brand stripe that sweeps in along an edge. Good as accent/reveal.',
    props: {
      colors: { type: 'array<hex>', default: ['#00e676', '#ffffff', '#ff0080'] },
      direction: { type: 'horizontal|vertical', default: 'horizontal' },
      position: { type: 'top|bottom|left|right|center', default: 'bottom' },
      thickness: { type: 'number', default: 24 },
      sweepInFromFrame: { type: 'number', default: 0 },
      durationInFrames: { type: 'number', default: 20 },
      easing: { type: 'smooth|bounce|linear|inOut|sharp|elastic', default: 'smooth' }
    }
  },
  VideoFrame: {
    category: 'frame',
    description: 'Mac/phone/clean-chrome video frame for embedding MP4 screen recordings.',
    props: {
      src: { type: 'string (static path or url)', required: true },
      chrome: { type: 'mac|clean|phone', default: 'mac' },
      width: { type: 'number', default: 1400 },
      rotate: { type: 'number', default: 0 },
      shadow: { type: 'boolean', default: true },
      label: { type: 'string', default: '' }
    }
  },
  SplitHeadline: {
    category: 'text',
    description: 'Two-line headline with separate colours/weights. Top wipes in left→right, bottom right→left.',
    props: {
      topText: { type: 'string', default: 'THIS IS' },
      bottomText: { type: 'string', default: 'BIG' },
      topColor: { type: 'hex', default: '#ffffff' },
      bottomColor: { type: 'hex', default: '#00e676' },
      fontSize: { type: 'number', default: 240 },
      topWeight: { type: 'number', default: 700 },
      bottomWeight: { type: 'number', default: 900 },
      durationInFrames: { type: 'number', default: 25 }
    }
  },
  LogoGrid: {
    category: 'content',
    description: 'Grid of logos that pop in staggered. Good for "featured in / trusted by".',
    props: {
      logos: { type: 'array<string (static path or url)>', required: true },
      columns: { type: 'number', default: 4 },
      background: { type: 'hex', default: '#0a0a0a' },
      tileColor: { type: 'hex', default: '#151515' },
      cellHeight: { type: 'number', default: 180 },
      staggerFrames: { type: 'number', default: 4 },
      maxLogoHeight: { type: 'number', default: 80 }
    }
  },
  KineticTypography: {
    category: 'premium',
    description: 'Each word arrives on a different motion path (up/down/left/right/flip/rotate/scale) with spring physics. Premium kinetic feel.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 130 },
      color: { type: 'hex', default: '#ffffff' },
      accentColor: { type: 'hex', default: '#00e676' },
      wordsPerSecond: { type: 'number', default: 2.2 },
      align: { type: 'left|center|right', default: 'center' }
    }
  },
  GlassmorphismCard: {
    category: 'premium',
    description: 'Frosted-glass card with animated colour blobs behind, shimmer sweep, headline + supporting line. Modern depth.',
    props: {
      text: { type: 'string', required: true },
      subtext: { type: 'string', default: '' },
      fontSize: { type: 'number', default: 160 },
      color: { type: 'hex', default: '#ffffff' },
      accentColor: { type: 'hex', default: '#00e676' },
      bgColors: { type: 'array<hex>', default: ['#0f172a', '#3b0764', '#0f172a'] },
      width: { type: 'number', default: 1200 },
      height: { type: 'number', default: 600 }
    }
  },
  ChromaticScanline: {
    category: 'premium',
    description: 'VHS / broadcast treatment — RGB chromatic aberration, scanlines, noise flicker, CRT vignette. Retro-tech intro.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 200 },
      color: { type: 'hex', default: '#ffffff' },
      background: { type: 'hex', default: '#050505' },
      rgbOffset: { type: 'number', default: 8 },
      scanlineOpacity: { type: 'number', default: 0.25 },
      noiseIntensity: { type: 'number', default: 0.15 }
    }
  },
  MatrixRain: {
    category: 'premium',
    description: 'Classic green matrix character rain as a background, with a boxed headline glowing on top. Hacker / access-granted vibe.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 180 },
      color: { type: 'hex', default: '#ffffff' },
      rainColor: { type: 'hex', default: '#00ff41' },
      headColor: { type: 'hex', default: '#aaffaa' },
      background: { type: 'hex', default: '#050505' },
      columns: { type: 'number', default: 60 },
      speed: { type: 'number', default: 1.2 }
    }
  },
  DepthZoom: {
    category: 'premium',
    description: 'Slow 3D zoom with blur racking to focus — like a lens coming into focus. Cinematic cold-open feel.',
    props: {
      text: { type: 'string', required: true },
      subtext: { type: 'string', default: '' },
      fontSize: { type: 'number', default: 220 },
      color: { type: 'hex', default: '#ffffff' },
      background: { type: 'hex', default: '#0a0a0a' },
      zoomFrom: { type: 'number', default: 0.6 },
      zoomTo: { type: 'number', default: 1.05 },
      blurFrom: { type: 'number', default: 30 },
      blurTo: { type: 'number', default: 0 },
      durationInFrames: { type: 'number', default: 60 }
    }
  },
  ShatterReveal: {
    category: 'premium',
    description: 'Text pieces fly in from random directions and assemble into the final headline. Impact / punchline moments.',
    props: {
      text: { type: 'string', required: true },
      fontSize: { type: 'number', default: 260 },
      color: { type: 'hex', default: '#ffffff' },
      shardCount: { type: 'number', default: 24 },
      durationInFrames: { type: 'number', default: 40 }
    }
  },
  CardStack3D: {
    category: 'premium',
    description: 'Three floating glass cards in 3D perspective with glowing neon outlines, orbital particles and starfield. Product-shot feel — good for feature reveals and hero scenes.',
    props: {
      text: { type: 'string', default: 'Built in 3D' },
      subtext: { type: 'string', default: '' },
      cards: { type: 'array<{icon,label,color?}>', default: [{ icon: '◎', label: 'Design' }, { icon: '⚡', label: 'Build' }, { icon: '➤', label: 'Ship' }] },
      accentColor1: { type: 'hex', default: '#ff7a00' },
      accentColor2: { type: 'hex', default: '#00d4ff' },
      background: { type: 'hex', default: '#030614' },
      fontSize: { type: 'number', default: 120 },
      color: { type: 'hex', default: '#ffffff' }
    }
  }
};

export default CATALOG;
export { CATALOG };
