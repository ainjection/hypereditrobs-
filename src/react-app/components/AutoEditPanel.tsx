// Self-contained Auto-Edit panel. Drop anywhere in the React tree.
// All deps: ./hooks/useAutoEdit, shared/auto-edit-core types.

import { useState } from 'react';
import { useAutoEdit } from '../hooks/useAutoEdit';
import type { AutoEditResult } from '../hooks/useAutoEdit';

export function AutoEditPanel() {
  const { run, stage, progress, log, error, setError, ffmpegStatus } = useAutoEdit();
  const [file, setFile] = useState<File | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AutoEditResult | null>(null);

  const [doFillers, setDoFillers] = useState(true);
  const [doAiCuts, setDoAiCuts] = useState(true);
  const [doSilence, setDoSilence] = useState(true);
  const [doAudioPolish, setDoAudioPolish] = useState(true);
  const [silenceGap, setSilenceGap] = useState(1.2);

  const handleRun = async () => {
    if (!file) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const r = await run(file, { doFillers, doAiCuts, doSilence, doAudioPolish, silenceGapSeconds: silenceGap });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ padding: 16, background: '#0f172a', color: '#e6edf3', borderRadius: 10, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h3 style={{ margin: '0 0 4px 0', fontSize: 18 }}>Auto-Edit</h3>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
        Transcribe → detect fillers + retakes + silences → cut + concat → audio polish. Runs in your browser (or via your local FFmpeg server if it's up on :3333).
      </div>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Raw video (MP4)</div>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ fontSize: 12 }}
        />
        {file && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</div>}
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, marginBottom: 12 }}>
        <label><input type="checkbox" checked={doFillers} onChange={(e) => setDoFillers(e.target.checked)} /> Remove fillers</label>
        <label><input type="checkbox" checked={doAiCuts} onChange={(e) => setDoAiCuts(e.target.checked)} /> AI cuts (Claude)</label>
        <label><input type="checkbox" checked={doSilence} onChange={(e) => setDoSilence(e.target.checked)} /> Trim silences</label>
        <label><input type="checkbox" checked={doAudioPolish} onChange={(e) => setDoAudioPolish(e.target.checked)} /> Audio polish</label>
        <label>Silence gap (s): <input type="number" step={0.1} min={0.6} max={5} value={silenceGap} onChange={(e) => setSilenceGap(parseFloat(e.target.value) || 1.2)} style={{ width: 60, fontSize: 12 }} /></label>
      </div>

      <button
        onClick={handleRun}
        disabled={!file || running}
        style={{
          background: '#10b981',
          color: '#062e22',
          border: 'none',
          padding: '8px 18px',
          borderRadius: 6,
          fontWeight: 700,
          cursor: file && !running ? 'pointer' : 'not-allowed',
          opacity: file && !running ? 1 : 0.5,
        }}
      >
        {running ? '⏳ Running...' : '▶ Run Auto-Edit'}
      </button>

      {(running || stage !== 'idle') && (
        <div style={{ marginTop: 14, background: '#1e293b', padding: 10, borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span>{stage}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 4, background: '#334155', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#10b981', width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
          {log && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, fontFamily: 'monospace' }}>{log}</div>}
          {ffmpegStatus && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{ffmpegStatus}</div>}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 14, padding: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
          ✗ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
            Trimmed <b style={{ color: '#10b981' }}>{result.trimmedPct}%</b> · {result.originalSeconds.toFixed(1)}s → {result.keptSeconds.toFixed(1)}s · {result.cuts.length} removed ranges
          </div>
          <video src={result.outputUrl} controls style={{ width: '100%', borderRadius: 6, background: '#000' }} />
          <a
            href={result.outputUrl}
            download="auto-edit.mp4"
            style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: '#10b981', textDecoration: 'none' }}
          >
            ⬇ Download MP4
          </a>
          <details style={{ marginTop: 10, background: '#1e293b', borderRadius: 6, padding: '8px 12px' }}>
            <summary style={{ cursor: 'pointer', fontSize: 12, color: '#94a3b8' }}>Cut list ({result.cuts.length})</summary>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 8, fontFamily: 'monospace' }}>
              <tbody>
                {result.cuts.slice(0, 120).map((c, i) => (
                  <tr key={i}>
                    <td style={{ padding: '2px 6px', color: '#94a3b8' }}>{c.start.toFixed(2)}–{c.end.toFixed(2)}s</td>
                    <td style={{ padding: '2px 6px' }}>{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
    </div>
  );
}
