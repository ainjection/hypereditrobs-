// Visual Brief panel — drop a reference image, get design-language
// analysis + matched mood from your library. Calls /api/visual-brief
// (worker proxy) so the Gemini key stays off the client.

import { useState, useRef } from 'react';
import { buildVisualBriefPrompt, parseVisualBriefResponse, type VisualBriefResult } from '../../shared/visual-brief';

export function VisualBriefPanel({ onApplyMood }: { onApplyMood?: (moodId: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisualBriefResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (!f.type.startsWith('image/')) return setError('Please drop an image file.');
    setError(null);
    setResult(null);
    setRunning(true);

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(f);
    });
    setPreview(dataUrl);
    const base64 = dataUrl.split(',')[1];

    try {
      const res = await fetch('/api/visual-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: f.type,
          prompt: buildVisualBriefPrompt(),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
      const parsed = parseVisualBriefResponse(body.raw || '');
      setResult(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  };

  const feasColor: Record<string, string> = { high: '#10b981', medium: '#f59e0b', low: '#ef4444' };

  return (
    <div style={{ padding: 16, background: '#0f172a', color: '#e6edf3', borderRadius: 10, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h3 style={{ margin: '0 0 4px 0', fontSize: 18 }}>Visual Brief</h3>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
        Drop a reference image (a still from a video you love). Gemini Vision describes the style and matches it to one of your 13 moods.
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLDivElement).style.borderColor = '#10b981';
        }}
        onDragLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#334155')}
        onDrop={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLDivElement).style.borderColor = '#334155';
          if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: '2px dashed #334155',
          borderRadius: 10,
          padding: 30,
          textAlign: 'center',
          cursor: 'pointer',
          background: '#1e293b',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 6 }}>🎨</div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Drop an image or click to browse</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>JPEG / PNG / WebP</div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {preview && (
        <div style={{ marginTop: 12 }}>
          <img src={preview} alt="reference" style={{ maxWidth: '100%', borderRadius: 6, border: '1px solid #334155' }} />
        </div>
      )}

      {running && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
          ⏳ Analysing with Gemini Vision...
        </div>
      )}

      {error && (
        <div style={{ marginTop: 12, padding: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 6, fontFamily: 'monospace', fontSize: 12 }}>
          ✗ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 14 }}>
          {result.feasibility && result.feasibility !== 'high' && (
            <div style={{ padding: 10, background: 'rgba(245,158,11,0.08)', border: `1px solid ${feasColor[result.feasibility]}`, borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: feasColor[result.feasibility] }}>
                {result.feasibility === 'low' ? '✗ Out of scope' : '⚠ Partial match'}
              </div>
              <div style={{ marginTop: 4 }}>{result.feasibilityNote}</div>
            </div>
          )}

          {result.mood && (
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 12, marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 60, height: 60, borderRadius: 6, flexShrink: 0,
                background: `linear-gradient(135deg, ${result.mood.palette.bg1} 0%, ${result.mood.palette.accent} 60%, ${result.mood.palette.text} 100%)`
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#10b981', fontWeight: 700 }}>MATCHED MOOD</div>
                <div style={{ fontSize: 15, fontWeight: 700, margin: '2px 0' }}>{result.mood.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{result.matchedReason || result.mood.description}</div>
              </div>
              {onApplyMood && (
                <button
                  onClick={() => onApplyMood(result.mood!.id)}
                  style={{ background: '#10b981', color: '#062e22', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                >
                  Apply →
                </button>
              )}
            </div>
          )}

          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: '0.15em', fontWeight: 700, marginBottom: 10 }}>DESIGN ANALYSIS</div>
            {[
              ['Palette', result.palette],
              ['Typography', result.typography],
              ['Layout', result.layout],
              ['Treatment', result.treatment],
              ['Motion', result.motion],
            ].map(([label, value]) => value ? (
              <div key={label} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#10b981', letterSpacing: '0.12em', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, lineHeight: 1.4 }}>{value}</div>
              </div>
            ) : null)}
            {result.adjectives && result.adjectives.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                {result.adjectives.map((a, i) => (
                  <span key={i} style={{ background: '#334155', padding: '2px 8px', borderRadius: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
