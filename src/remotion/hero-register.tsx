import React from 'react';
import { Composition } from 'remotion';
import { HeroClip } from './HeroClip';
// Manifest is a JSON file — Remotion's bundler (webpack) supports JSON imports.
import manifest from '../../public/hero-library/manifest.json';

type ManifestClip = {
  id: string;
  filename: string;
  name: string;
  description?: string;
  durationSeconds?: number;
};

// Ensure a valid Remotion composition id: letters/digits/hyphens only, must
// start with a letter.
function toCompId(rawId: string): string {
  const cleaned = rawId.replace(/[^A-Za-z0-9-]/g, '-');
  const withLetter = /^[A-Za-z]/.test(cleaned) ? cleaned : 'H-' + cleaned;
  return withLetter.slice(0, 60);
}

export const HeroCompositions: React.FC = () => (
  <>
    {(manifest as { clips: ManifestClip[] }).clips.map((c) => {
      const compId = toCompId(c.id);
      const seconds = c.durationSeconds || 2.5;
      const durationInFrames = Math.max(15, Math.round(seconds * 30));
      return (
        <Composition
          key={compId}
          id={compId}
          component={HeroClip}
          fps={30}
          width={1920}
          height={1080}
          durationInFrames={durationInFrames}
          defaultProps={{
            src: `hero-library/${c.filename}`,
            overlayText: '',
            overlayColor: '#ffffff',
            overlayFontSize: 140,
            overlayAlign: 'bottom' as const,
            darken: 0,
          }}
        />
      );
    })}
  </>
);
