// Visual Brief — analyse a reference image with Gemini Vision and match it
// to one of the 13 moods. Used by both the worker (key stays server-side)
// and the UI (renders the result + routes into the mood library).

import moodsMod from './moods';

export type VisualBriefResult = {
  palette: string;
  typography: string;
  layout: string;
  treatment: string;
  motion: string;
  adjectives: string[];
  matchedMoodId: string;
  matchedReason: string;
  feasibility: 'high' | 'medium' | 'low';
  feasibilityNote?: string;
  mood?: ReturnType<typeof moodsMod.get>;
};

export function buildVisualBriefPrompt(): string {
  const catalog = (moodsMod.list() as Array<{ id: string; name: string; description: string }>)
    .map(m => `- ${m.id}: ${m.name} — ${m.description}`).join('\n');

  return `You're a motion designer looking at a still frame from a video (or a design reference). Analyse the VISUAL STYLE only — ignore subject matter.

Describe it using precise design language. Cover:
- Palette (dominant colours as hex approximations, named accents)
- Typography (serif/sans, weight, letter-spacing, case, size)
- Layout (centred/offset, margins, alignment)
- Treatment (film grain, chromatic aberration, scanlines, glow, depth-of-field, glass blur, solid, glitch, texture)
- Motion cues if implied (zoom, pan, cut, static)
- Mood in 3-5 adjectives

Also assess FEASIBILITY — our moods produce animated text on a stylised background. We CANNOT recreate:
- Full 3D scenes or product renders made in Blender/Cinema4D
- Photographic content, live-action footage, people, real locations
- Custom illustrations, hand-drawn elements, 2D character animation

We CAN produce: animated text, kinetic typography, code/terminal reveals, chromatic VHS, matrix rain, floating 3D glass cards (via CardStack3D), glassmorphism cards, shatter reveals.

Match to ONE of these moods that best fits:
${catalog}

Reply with ONLY valid JSON in this shape, nothing else:
{
  "palette": "hex + name summary",
  "typography": "...",
  "layout": "...",
  "treatment": "...",
  "motion": "...",
  "adjectives": ["...","...","..."],
  "matchedMoodId": "one of the ids above",
  "matchedReason": "one sentence why this mood fits",
  "feasibility": "high" | "medium" | "low",
  "feasibilityNote": "if medium/low, one sentence on what isn't achievable"
}`;
}

// Parse Gemini's response text into a typed result, attaching the matched
// mood object if found.
export function parseVisualBriefResponse(text: string): VisualBriefResult {
  let parsed: Partial<VisualBriefResult>;
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Gemini returned no valid JSON: ' + text.slice(0, 300));
    parsed = JSON.parse(m[0]);
  }
  const mood = parsed.matchedMoodId ? moodsMod.get(parsed.matchedMoodId) : null;
  return { ...(parsed as VisualBriefResult), mood };
}
