import { useState, useCallback, useEffect } from 'react';

export interface OverlayAsset {
  id: string;
  type: 'image' | 'video';
  filename: string;
  url: string; // Server URL for the asset
  thumbnailUrl?: string;
  createdAt: number;
}

const LOCAL_FFMPEG_URL = 'http://localhost:3333';
const STORAGE_KEY = 'clipwise-overlay-asset-refs'; // Just store IDs, not data

export function useOverlayAssets(sessionId?: string) {
  const [overlayAssets, setOverlayAssets] = useState<OverlayAsset[]>(() => {
    // Clear old localStorage data that was causing quota issues
    try {
      const oldData = localStorage.getItem('clipwise-overlay-assets');
      if (oldData) {
        localStorage.removeItem('clipwise-overlay-assets');
        console.log('Cleared old overlay assets from localStorage');
      }
    } catch {
      // Ignore
    }

    // Load asset references (just IDs, not base64 data)
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('[useOverlayAssets] Loaded from localStorage:', parsed.length, 'assets', parsed);
        return parsed;
      }
      console.log('[useOverlayAssets] No stored assets in localStorage');
      return [];
    } catch (e) {
      console.error('[useOverlayAssets] Error loading from localStorage:', e);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  const [uploading, setUploading] = useState(false);

  // Persist asset references to localStorage (lightweight - just metadata)
  useEffect(() => {
    try {
      // Only store minimal metadata, not the actual data
      const refs = overlayAssets.map(a => ({
        id: a.id,
        type: a.type,
        filename: a.filename,
        url: a.url,
        thumbnailUrl: a.thumbnailUrl,
        createdAt: a.createdAt,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(refs));
    } catch (e) {
      console.warn('Failed to save overlay asset refs:', e);
    }
  }, [overlayAssets]);

  // Upload an overlay asset to the server (like regular assets)
  const uploadOverlayAsset = useCallback(async (file: File, currentSessionId?: string): Promise<OverlayAsset | null> => {
    const sid = currentSessionId || sessionId;
    if (!sid) {
      alert('No active session. Please load a video first.');
      return null;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${LOCAL_FFMPEG_URL}/session/${sid}/assets`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();

      // Server returns { success: true, asset: { id, type, filename, ... } }
      const uploadedAsset = result.asset;

      const asset: OverlayAsset = {
        id: uploadedAsset.id,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        filename: file.name,
        url: `${LOCAL_FFMPEG_URL}/session/${sid}/assets/${uploadedAsset.id}/stream`,
        thumbnailUrl: uploadedAsset.thumbnailUrl ? `${LOCAL_FFMPEG_URL}${uploadedAsset.thumbnailUrl}` : undefined,
        createdAt: Date.now(),
      };

      console.log('[useOverlayAssets] Uploaded asset:', asset);
      setOverlayAssets(prev => {
        const updated = [...prev, asset];
        console.log('[useOverlayAssets] Total overlay assets now:', updated.length);
        return updated;
      });
      return asset;
    } catch (e) {
      console.error('Failed to upload overlay asset:', e);
      alert(`Upload failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      return null;
    } finally {
      setUploading(false);
    }
  }, [sessionId]);

  // Delete an overlay asset
  const deleteOverlayAsset = useCallback((id: string) => {
    setOverlayAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  // Get asset by ID
  const getOverlayAsset = useCallback((id: string): OverlayAsset | undefined => {
    return overlayAssets.find(a => a.id === id);
  }, [overlayAssets]);

  // Clear all overlay assets
  const clearAllOverlayAssets = useCallback(() => {
    setOverlayAssets([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('clipwise-overlay-assets'); // Clear old key too
  }, []);

  return {
    overlayAssets,
    uploading,
    uploadOverlayAsset,
    deleteOverlayAsset,
    getOverlayAsset,
    clearAllOverlayAssets,
    imageAssets: overlayAssets.filter(a => a.type === 'image'),
    videoAssets: overlayAssets.filter(a => a.type === 'video'),
  };
}
