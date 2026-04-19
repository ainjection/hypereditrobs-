// Auto-Edit core — pure logic, no I/O. Consumed by the worker proxy for
// transcription/Claude/polish, or by a future @ffmpeg.wasm browser pipeline.
// Ported from video-agent's dashboard/lib/auto-edit.js.

export type Word = {
  text?: string;
  word?: string;
  start?: number;
  end?: number;
  startTime?: number;
  endTime?: number;
};

export type Range = { start: number; end: number; reason: string };
export type Keep = { start: number; end: number };

// ──────────────────────────────────────────────────────────────────────
// Filler detection — rule-based
// ──────────────────────────────────────────────────────────────────────

const FILLER_SINGLE_WORDS = new Set([
  'um', 'uh', 'er', 'erm', 'ah', 'hmm', 'mm', 'mmm', 'uhh', 'umm', 'uhm', 'like'
]);

const FILLER_PHRASES = [
  ['you', 'know'],
  ['i', 'mean'],
  ['sort', 'of'],
  ['kind', 'of']
];

const wStart = (w: Word) => typeof w.start === 'number' ? w.start : (w.startTime ?? 0);
const wEnd = (w: Word) => typeof w.end === 'number' ? w.end : (w.endTime ?? 0);
const wText = (w: Word) => (w.text ?? w.word ?? '').toLowerCase().replace(/[^a-z']/g, '');

export function rangesFromFillers(words: Word[]): Range[] {
  const ranges: Range[] = [];
  for (let i = 0; i < words.length; i++) {
    const t = wText(words[i]);
    if (FILLER_SINGLE_WORDS.has(t)) {
      ranges.push({ start: wStart(words[i]), end: wEnd(words[i]), reason: 'filler:' + t });
      continue;
    }
    for (const phrase of FILLER_PHRASES) {
      if (phrase.every((p, k) => wText(words[i + k]) === p)) {
        ranges.push({
          start: wStart(words[i]),
          end: wEnd(words[i + phrase.length - 1]),
          reason: 'filler:' + phrase.join(' ')
        });
        i += phrase.length - 1;
        break;
      }
    }
  }
  return ranges;
}

// ──────────────────────────────────────────────────────────────────────
// Silence detection — gap between consecutive words
// ──────────────────────────────────────────────────────────────────────

export function rangesFromSilence(words: Word[], maxGapSeconds = 1.2, trimToSeconds = 0.4): Range[] {
  const ranges: Range[] = [];
  for (let i = 1; i < words.length; i++) {
    const gap = wStart(words[i]) - wEnd(words[i - 1]);
    if (gap > maxGapSeconds) {
      const cutStart = wEnd(words[i - 1]) + trimToSeconds;
      const cutEnd = wStart(words[i]) - trimToSeconds;
      if (cutEnd > cutStart + 0.1) {
        ranges.push({ start: cutStart, end: cutEnd, reason: `silence:${gap.toFixed(1)}s` });
      }
    }
  }
  return ranges;
}

// ──────────────────────────────────────────────────────────────────────
// Merge overlapping ranges + invert to keep list
// ──────────────────────────────────────────────────────────────────────

export function mergeRanges(ranges: Range[]): Range[] {
  if (!ranges.length) return [];
  const sorted = ranges.slice().sort((a, b) => a.start - b.start);
  const merged: Range[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const cur = sorted[i];
    if (cur.start <= last.end + 0.05) {
      last.end = Math.max(last.end, cur.end);
      last.reason = last.reason + '+' + cur.reason;
    } else {
      merged.push(cur);
    }
  }
  return merged;
}

export function buildKeepList(cuts: Range[], totalDuration: number): Keep[] {
  if (!cuts.length) return [{ start: 0, end: totalDuration }];
  const keeps: Keep[] = [];
  let cursor = 0;
  for (const cut of cuts) {
    if (cut.start > cursor + 0.05) keeps.push({ start: cursor, end: cut.start });
    cursor = Math.max(cursor, cut.end);
  }
  if (cursor < totalDuration - 0.05) keeps.push({ start: cursor, end: totalDuration });
  return keeps.filter(k => k.end - k.start > 0.12);
}

// ──────────────────────────────────────────────────────────────────────
// Claude-driven cut-plan response parser (prompt lives server-side; this
// just turns the index-based AI response back into time ranges)
// ──────────────────────────────────────────────────────────────────────

export type AiCutSuggestion = {
  startIndex: number;
  endIndex: number;
  reason: string;
};

export function aiSuggestionsToRanges(words: Word[], suggestions: AiCutSuggestion[]): Range[] {
  const out: Range[] = [];
  for (const item of suggestions) {
    const s = words[item.startIndex];
    const e = words[item.endIndex];
    if (!s || !e) continue;
    const start = wStart(s);
    const end = wEnd(e);
    if (end > start) out.push({ start, end, reason: 'ai:' + (item.reason || 'cut') });
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────
// Captions — SRT generated on the OUTPUT timeline (kept words, re-timed)
// ──────────────────────────────────────────────────────────────────────

function secondsToSrtTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec - Math.floor(sec)) * 1000);
  const pad = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

export function captionsFromKeeps(words: Word[], keeps: Keep[]): string {
  const outWords: { text: string; start: number; end: number }[] = [];
  let outCursor = 0;
  for (const k of keeps) {
    for (const w of words) {
      const s = wStart(w);
      const e = wEnd(w);
      if (s >= k.start && e <= k.end) {
        outWords.push({
          text: ((w.text ?? w.word) || '').trim(),
          start: outCursor + (s - k.start),
          end: outCursor + (e - k.start)
        });
      }
    }
    outCursor += (k.end - k.start);
  }
  const chunks: { start: number; end: number; text: string }[] = [];
  let cur: { start: number | null; end: number; text: string } = { start: null, end: 0, text: '' };
  for (const w of outWords) {
    if (!w.text) continue;
    if (cur.start === null) { cur = { start: w.start, end: w.end, text: w.text }; continue; }
    cur.text += ' ' + w.text;
    cur.end = w.end;
    if (cur.text.split(' ').length >= 8 || w.end - (cur.start as number) > 3) {
      chunks.push({ start: cur.start as number, end: cur.end, text: cur.text });
      cur = { start: null, end: 0, text: '' };
    }
  }
  if (cur.start !== null) chunks.push({ start: cur.start as number, end: cur.end, text: cur.text });
  return chunks.map((c, i) =>
    `${i + 1}\n${secondsToSrtTime(c.start)} --> ${secondsToSrtTime(c.end)}\n${c.text}\n`
  ).join('\n');
}

// ──────────────────────────────────────────────────────────────────────
// Build an FFmpeg filter_complex string from a keep list + style options
// ──────────────────────────────────────────────────────────────────────

export type BuildFilterOpts = {
  keeps: Keep[];
  srtPathForBurn?: string;  // forward-slash, colon-escaped — only if burning
  subtitleStyle?: string;   // force_style string for subtitles filter
  audioPolish?: boolean;    // loudnorm + compressor
};

export function buildFilterComplex({ keeps, srtPathForBurn, subtitleStyle, audioPolish }: BuildFilterOpts): {
  filterComplex: string;
  videoLabel: string;
  audioLabel: string;
} {
  const filters: string[] = [];
  for (let i = 0; i < keeps.length; i++) {
    const { start, end } = keeps[i];
    filters.push(`[0:v]trim=${start.toFixed(3)}:${end.toFixed(3)},setpts=PTS-STARTPTS[v${i}]`);
    filters.push(`[0:a]atrim=${start.toFixed(3)}:${end.toFixed(3)},asetpts=PTS-STARTPTS[a${i}]`);
  }
  const concatIn = keeps.map((_, i) => `[v${i}][a${i}]`).join('');
  filters.push(`${concatIn}concat=n=${keeps.length}:v=1:a=1[vout][aout]`);

  let videoLabel = 'vout';
  if (srtPathForBurn) {
    const style = subtitleStyle ?? 'FontName=Inter,FontSize=26,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=3,Shadow=0,MarginV=80';
    filters.push(`[vout]subtitles='${srtPathForBurn}':force_style='${style}'[vcap]`);
    videoLabel = 'vcap';
  }

  let audioLabel = 'aout';
  if (audioPolish) {
    filters.push(`[aout]loudnorm=I=-16:TP=-1.5:LRA=11,acompressor=threshold=-18dB:ratio=3:attack=5:release=50:makeup=2[apol]`);
    audioLabel = 'apol';
  }

  return { filterComplex: filters.join(';'), videoLabel, audioLabel };
}
