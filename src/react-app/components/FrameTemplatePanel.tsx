import { useState, useCallback, useRef, useEffect } from 'react';
import { Palette, Image, Droplet, Plus, Trash2, Save, Type, ImageIcon, Upload, Clock, Film } from 'lucide-react';
import type { FrameTemplate, FrameTemplateBackground, FrameTemplateOverlay } from '@/react-app/hooks/useProject';
import { createOverlay } from '@/react-app/hooks/useFrameTemplates';
import type { OverlayAsset } from '@/react-app/hooks/useOverlayAssets';

interface FrameTemplatePanelProps {
  template: FrameTemplate;
  savedTemplates?: FrameTemplate[];
  projectDuration?: number; // Total project duration in seconds
  sessionId?: string; // Session ID for uploading assets to server
  onUpdateTemplate: (updates: Partial<FrameTemplate>) => void;
  onSaveTemplate: () => void;
  onDeleteTemplate?: (id: string) => void;
  // Shared overlay assets state from parent
  overlayAssets: OverlayAsset[];
  uploading: boolean;
  onUploadAsset: (file: File, sessionId?: string) => Promise<OverlayAsset | null>;
  onDeleteAsset: (id: string) => void;
}

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Parse MM:SS to seconds (returns null if invalid/incomplete)
function parseTime(timeStr: string): number | null {
  const trimmed = timeStr.trim();

  // Handle MM:SS format
  const parts = trimmed.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0]);
    const secs = parseInt(parts[1]);
    if (!isNaN(mins) && !isNaN(secs) && secs >= 0 && secs < 60) {
      return mins * 60 + secs;
    }
    return null; // Incomplete or invalid
  }

  // Handle plain number (seconds)
  const num = parseFloat(trimmed);
  if (!isNaN(num) && num >= 0) {
    return num;
  }

  return null;
}

// Time input component that allows free typing and commits on blur
function TimeInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  placeholder = '0:00',
}: {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  const [localValue, setLocalValue] = useState(formatTime(value));
  const [isFocused, setIsFocused] = useState(false);

  // Update local value when prop changes (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(formatTime(value));
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseTime(localValue);
    if (parsed !== null && parsed >= min && parsed <= max) {
      onChange(parsed);
    } else {
      // Reset to current value if invalid
      setLocalValue(formatTime(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="w-full px-1.5 py-1 bg-zinc-700 border border-zinc-600 rounded text-[10px] text-center font-mono"
    />
  );
}

// Color input component with local state for smooth typing
function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sync local value when prop changes (and not focused)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    // Validate and commit the color
    const trimmed = localValue.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(trimmed) || /^#[0-9A-Fa-f]{3}$/.test(trimmed)) {
      onChange(trimmed);
    } else {
      // Reset to current value if invalid
      setLocalValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-zinc-500">Color:</label>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
      />
      <input
        type="text"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-20 px-1.5 py-1 bg-zinc-700 border border-zinc-600 rounded text-[10px] text-white font-mono"
        placeholder="#ffffff"
      />
      {/* Color preview swatch */}
      <div
        className="w-6 h-6 rounded border border-zinc-600"
        style={{ backgroundColor: value }}
        title={`Preview: ${value}`}
      />
    </div>
  );
}

const BACKGROUND_TYPES: { type: FrameTemplateBackground['type']; label: string; icon: typeof Palette }[] = [
  { type: 'solid', label: 'Solid', icon: Palette },
  { type: 'gradient', label: 'Gradient', icon: Droplet },
  { type: 'blur', label: 'Blur', icon: Image },
  { type: 'image', label: 'Image', icon: ImageIcon },
];

export default function FrameTemplatePanel({
  template,
  savedTemplates = [],
  projectDuration = 60,
  sessionId,
  onUpdateTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  // Shared overlay assets from parent
  overlayAssets,
  uploading,
  onUploadAsset,
  onDeleteAsset,
}: FrameTemplatePanelProps) {
  const [templateName, setTemplateName] = useState(template.name);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Derived: filter assets by type
  const imageAssets = overlayAssets.filter(a => a.type === 'image');
  const videoAssets = overlayAssets.filter(a => a.type === 'video');

  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await onUploadAsset(file, sessionId);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, [onUploadAsset, sessionId]);

  const handleVideoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await onUploadAsset(file, sessionId);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  }, [onUploadAsset, sessionId]);

  const updateBackground = useCallback((updates: Partial<FrameTemplateBackground>) => {
    onUpdateTemplate({
      background: { ...template.background, ...updates },
    });
  }, [template.background, onUpdateTemplate]);

  const addOverlay = useCallback((type: 'logo' | 'text' | 'video', zone: 'top' | 'bottom') => {
    const newOverlay = createOverlay(type, zone);
    onUpdateTemplate({
      overlays: [...template.overlays, newOverlay],
    });
  }, [template.overlays, onUpdateTemplate]);

  const removeOverlay = useCallback((id: string) => {
    onUpdateTemplate({
      overlays: template.overlays.filter(o => o.id !== id),
    });
  }, [template.overlays, onUpdateTemplate]);

  const updateOverlay = useCallback((id: string, updates: Partial<FrameTemplateOverlay>) => {
    onUpdateTemplate({
      overlays: template.overlays.map(o =>
        o.id === id ? { ...o, ...updates } : o
      ),
    });
  }, [template.overlays, onUpdateTemplate]);

  const handleSave = useCallback(() => {
    onUpdateTemplate({ name: templateName });
    onSaveTemplate();
  }, [templateName, onUpdateTemplate, onSaveTemplate]);

  // Handle deleting overlay assets (only affects overlay storage, not project assets)
  const handleDeleteOverlayAsset = useCallback((e: React.MouseEvent, assetId: string) => {
    e.stopPropagation();
    // If this image is used in background, clear the reference
    if (template.background.imageAssetId === assetId) {
      updateBackground({ imageAssetId: undefined });
    }
    // Clear from any overlays using it
    const updatedOverlays = template.overlays.map(o =>
      o.assetId === assetId ? { ...o, assetId: undefined } : o
    );
    if (updatedOverlays.some((o, i) => o.assetId !== template.overlays[i]?.assetId)) {
      onUpdateTemplate({ overlays: updatedOverlays });
    }
    // Delete from overlay assets only (not project assets)
    onDeleteAsset(assetId);
  }, [template.background.imageAssetId, template.overlays, updateBackground, onUpdateTemplate, onDeleteAsset]);

  // Helper to get asset URL (for overlay assets uploaded to server)
  const getOverlayAssetUrl = useCallback((assetId: string): string => {
    const asset = overlayAssets.find(a => a.id === assetId);
    return asset?.url || '';
  }, [overlayAssets]);

  const getOverlayAssetThumbnail = useCallback((assetId: string): string => {
    const asset = overlayAssets.find(a => a.id === assetId);
    return asset?.thumbnailUrl || asset?.url || '';
  }, [overlayAssets]);

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file inputs - always rendered so they're available */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/50">
        <span className="text-xs font-medium text-zinc-400">Frame Template</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Template Name */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            className="w-full px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Background Type */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
            Background
          </label>
          <div className="grid grid-cols-4 gap-1">
            {BACKGROUND_TYPES.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => updateBackground({ type })}
                className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${
                  template.background.type === type
                    ? 'bg-orange-500/20 border border-orange-500'
                    : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Config */}
        <div className="space-y-3">
          {template.background.type === 'solid' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={template.background.color || '#000000'}
                  onChange={e => updateBackground({ color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={template.background.color || '#000000'}
                  onChange={e => updateBackground({ color: e.target.value })}
                  className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {template.background.type === 'gradient' && (
            <>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    Start
                  </label>
                  <input
                    type="color"
                    value={template.background.gradientStart || '#1a1a2e'}
                    onChange={e => updateBackground({ gradientStart: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                    End
                  </label>
                  <input
                    type="color"
                    value={template.background.gradientEnd || '#16213e'}
                    onChange={e => updateBackground({ gradientEnd: e.target.value })}
                    className="w-full h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                  Angle: {template.background.gradientAngle || 180}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={template.background.gradientAngle || 180}
                  onChange={e => updateBackground({ gradientAngle: parseInt(e.target.value) })}
                  className="w-full accent-orange-500"
                />
              </div>
            </>
          )}

          {template.background.type === 'blur' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                Blur Amount: {template.background.blurAmount || 20}px
              </label>
              <input
                type="range"
                min={5}
                max={50}
                value={template.background.blurAmount || 20}
                onChange={e => updateBackground({ blurAmount: parseInt(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </div>
          )}

          {template.background.type === 'image' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Select Image
                </label>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1 px-2 py-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded text-[10px] font-medium transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {imageAssets.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">No images yet. Upload one above.</p>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {imageAssets.map(asset => (
                    <div key={asset.id} className="relative group">
                      <button
                        onClick={() => updateBackground({ imageAssetId: asset.id })}
                        className={`w-full aspect-video rounded overflow-hidden border-2 ${
                          template.background.imageAssetId === asset.id
                            ? 'border-orange-500'
                            : 'border-transparent hover:border-zinc-600'
                        }`}
                      >
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <button
                        onClick={(e) => handleDeleteOverlayAsset(e, asset.id)}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Overlays */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
            Overlays ({template.overlays.length})
          </label>

          {/* Add overlay buttons - always visible */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              onClick={() => addOverlay('logo', 'bottom')}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-xs text-purple-300 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>+ Logo</span>
            </button>
            <button
              onClick={() => addOverlay('text', 'bottom')}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 rounded-lg text-xs text-pink-300 transition-colors"
            >
              <Type className="w-3.5 h-3.5" />
              <span>+ Text</span>
            </button>
            <button
              onClick={() => addOverlay('video', 'bottom')}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-xs text-cyan-300 transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
              <span>+ Video</span>
            </button>
          </div>

          {template.overlays.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-2">
              No overlays yet. Click above to add logos or text at different times.
            </p>
          ) : (
            <div className="space-y-2">
              {template.overlays.map(overlay => (
                <div
                  key={overlay.id}
                  className="p-2 bg-zinc-800 rounded border border-zinc-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium capitalize">
                      {overlay.type} ({overlay.zone})
                    </span>
                    <button
                      onClick={() => removeOverlay(overlay.id)}
                      className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Zone selector */}
                  <div className="flex gap-1 mb-2">
                    <button
                      onClick={() => updateOverlay(overlay.id, { zone: 'top' })}
                      className={`flex-1 py-1 text-[10px] rounded ${
                        overlay.zone === 'top'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      Top
                    </button>
                    <button
                      onClick={() => updateOverlay(overlay.id, { zone: 'bottom' })}
                      className={`flex-1 py-1 text-[10px] rounded ${
                        overlay.zone === 'bottom'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      Bottom
                    </button>
                  </div>

                  {overlay.type === 'logo' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-zinc-500">Image</label>
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 rounded text-[10px] transition-colors"
                        >
                          <Upload className="w-2.5 h-2.5" />
                          Upload
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {imageAssets.map(asset => (
                          <div key={asset.id} className="relative group">
                            <button
                              onClick={() => updateOverlay(overlay.id, { assetId: asset.id })}
                              className={`w-full aspect-square rounded overflow-hidden border-2 ${
                                overlay.assetId === asset.id
                                  ? 'border-orange-500'
                                  : 'border-transparent hover:border-zinc-600'
                              }`}
                            >
                              <img
                                src={asset.url}
                                alt={asset.filename}
                                className="w-full h-full object-cover"
                              />
                            </button>
                            <button
                              onClick={(e) => handleDeleteOverlayAsset(e, asset.id)}
                              className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete image"
                            >
                              <Trash2 className="w-2 h-2 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <label className="block text-[10px] text-zinc-500 mb-1">
                          Scale: {Math.round((overlay.scale || 0.3) * 100)}%
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={(overlay.scale || 0.3) * 100}
                          onChange={e => updateOverlay(overlay.id, { scale: parseInt(e.target.value) / 100 })}
                          className="w-full accent-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {overlay.type === 'text' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={overlay.text || ''}
                        onChange={e => updateOverlay(overlay.id, { text: e.target.value })}
                        placeholder="Enter text..."
                        className="w-full px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs"
                      />
                      <ColorInput
                        value={overlay.color || '#ffffff'}
                        onChange={(color) => updateOverlay(overlay.id, { color })}
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-zinc-500">Size:</label>
                        <input
                          type="number"
                          value={overlay.fontSize || 32}
                          onChange={e => updateOverlay(overlay.id, { fontSize: parseInt(e.target.value) })}
                          className="w-16 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs"
                          min={12}
                          max={100}
                        />
                        <span className="text-[10px] text-zinc-500">px</span>
                      </div>
                    </div>
                  )}

                  {overlay.type === 'video' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-zinc-500">Video (max 10MB)</label>
                        <button
                          onClick={() => videoInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/30 hover:bg-cyan-500/50 disabled:opacity-50 rounded text-[10px] text-cyan-300 transition-colors"
                        >
                          <Upload className="w-2.5 h-2.5" />
                          Upload
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {videoAssets.map(asset => (
                          <div key={asset.id} className="relative group">
                            <button
                              onClick={() => updateOverlay(overlay.id, { assetId: asset.id })}
                              className={`w-full aspect-square rounded overflow-hidden border-2 ${
                                overlay.assetId === asset.id
                                  ? 'border-cyan-500'
                                  : 'border-transparent hover:border-zinc-600'
                              }`}
                            >
                              <img
                                src={asset.thumbnailUrl || asset.url}
                                alt={asset.filename}
                                className="w-full h-full object-cover"
                              />
                              <Film className="absolute bottom-0.5 right-0.5 w-3 h-3 text-white drop-shadow" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteOverlayAsset(e, asset.id)}
                              className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-2 h-2 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {videoAssets.length === 0 && (
                        <p className="text-[10px] text-zinc-500 text-center py-2">No videos yet. Upload one above.</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-[10px] text-zinc-500">Loop:</label>
                        <button
                          onClick={() => updateOverlay(overlay.id, { loop: !overlay.loop })}
                          className={`px-2 py-1 rounded text-[10px] transition-colors ${
                            overlay.loop
                              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                              : 'bg-zinc-700 text-zinc-400 border border-zinc-600'
                          }`}
                        >
                          {overlay.loop ? 'On' : 'Off'}
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">
                          Scale: {Math.round((overlay.scale || 0.4) * 100)}%
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={(overlay.scale || 0.4) * 100}
                          onChange={e => updateOverlay(overlay.id, { scale: parseInt(e.target.value) / 100 })}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Position */}
                  <div className="flex gap-2 mt-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-500">X: {overlay.x}%</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={overlay.x}
                        onChange={e => updateOverlay(overlay.id, { x: parseInt(e.target.value) })}
                        className="w-full accent-orange-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-500">Y: {overlay.y}%</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={overlay.y}
                        onChange={e => updateOverlay(overlay.id, { y: parseInt(e.target.value) })}
                        className="w-full accent-orange-500"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-2 pt-2 border-t border-zinc-700">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <label className="text-[10px] text-zinc-500">Timeline</label>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] text-zinc-600 mb-0.5">Start</label>
                        <TimeInput
                          value={overlay.startTime ?? 0}
                          onChange={time => updateOverlay(overlay.id, { startTime: time })}
                          min={0}
                          max={(overlay.endTime ?? projectDuration) - 1}
                          placeholder="0:00"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-zinc-600 mb-0.5">End</label>
                        <TimeInput
                          value={overlay.endTime ?? projectDuration}
                          onChange={time => updateOverlay(overlay.id, { endTime: time })}
                          min={(overlay.startTime ?? 0) + 1}
                          max={projectDuration}
                          placeholder={formatTime(projectDuration)}
                        />
                      </div>
                      <button
                        onClick={() => updateOverlay(overlay.id, { startTime: 0, endTime: undefined })}
                        className="px-1.5 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-[10px] text-zinc-400 whitespace-nowrap"
                        title="Reset to full duration"
                      >
                        Full
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved Templates Management */}
      {savedTemplates.length > 0 && (
        <div className="p-3 border-t border-zinc-800/50">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500">
              Saved Templates ({savedTemplates.filter(t => !t.id.startsWith('default-')).length})
            </label>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {savedTemplates
              .filter(t => !t.id.startsWith('default-'))
              .map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-2 py-1.5 bg-zinc-800 rounded text-xs"
                >
                  <span className="text-zinc-300 truncate flex-1">{t.name}</span>
                  <button
                    onClick={() => onDeleteTemplate?.(t.id)}
                    className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete template"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="p-3 border-t border-zinc-800/50 space-y-2">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          Save as Template
        </button>
        {/* Clear cache button - helps fix broken images */}
        <button
          onClick={() => {
            if (confirm('This will clear cached overlay assets and refresh. You will need to re-upload images/videos. Continue?')) {
              localStorage.removeItem('clipwise-overlay-asset-refs');
              localStorage.removeItem('clipwise-overlay-assets');
              window.location.reload();
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-xs text-zinc-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear Cache & Refresh
        </button>
      </div>
    </div>
  );
}
