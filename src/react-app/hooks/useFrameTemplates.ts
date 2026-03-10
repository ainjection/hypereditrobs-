import { useState, useCallback, useEffect } from 'react';
import type { FrameTemplate, FrameTemplateBackground, FrameTemplateOverlay } from './useProject';

const STORAGE_KEY = 'clipwise-frame-templates';

// Default templates that come with the app
function getDefaultTemplates(): FrameTemplate[] {
  const now = Date.now();
  return [
    {
      id: 'default-black',
      name: 'Classic Black',
      createdAt: now,
      updatedAt: now,
      background: { type: 'solid', color: '#000000' },
      overlays: [],
    },
    {
      id: 'default-blur',
      name: 'Blurred Background',
      createdAt: now,
      updatedAt: now,
      background: { type: 'blur', blurAmount: 20 },
      overlays: [],
    },
    {
      id: 'default-gradient-purple',
      name: 'Purple Gradient',
      createdAt: now,
      updatedAt: now,
      background: {
        type: 'gradient',
        gradientStart: '#1a1a2e',
        gradientEnd: '#16213e',
        gradientAngle: 180,
      },
      overlays: [],
    },
    {
      id: 'default-gradient-orange',
      name: 'Sunset Gradient',
      createdAt: now,
      updatedAt: now,
      background: {
        type: 'gradient',
        gradientStart: '#ff6b35',
        gradientEnd: '#f7931e',
        gradientAngle: 135,
      },
      overlays: [],
    },
  ];
}

// Create a blank template for editing
export function createBlankTemplate(): FrameTemplate {
  const now = Date.now();
  return {
    id: `template-${now}`,
    name: 'New Template',
    createdAt: now,
    updatedAt: now,
    background: { type: 'solid', color: '#000000' },
    overlays: [],
  };
}

// Create a new overlay
export function createOverlay(type: 'logo' | 'text' | 'video', zone: 'top' | 'bottom'): FrameTemplateOverlay {
  return {
    id: `overlay-${Date.now()}`,
    type,
    zone,
    x: 50, // Centered
    y: 50, // Center of zone
    scale: type === 'video' ? 0.4 : 0.3, // Videos slightly larger by default
    opacity: 1,
    text: type === 'text' ? 'Your Text' : undefined,
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    loop: type === 'video' ? true : undefined, // Videos loop by default
  };
}

export function useFrameTemplates() {
  const [templates, setTemplates] = useState<FrameTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure built-in templates exist
        const defaults = getDefaultTemplates();
        const defaultIds = new Set(defaults.map(d => d.id));
        const userTemplates = parsed.filter((t: FrameTemplate) => !defaultIds.has(t.id));
        return [...defaults, ...userTemplates];
      }
      return getDefaultTemplates();
    } catch {
      return getDefaultTemplates();
    }
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const saveTemplate = useCallback((template: FrameTemplate) => {
    setTemplates(prev => {
      const existing = prev.findIndex(t => t.id === template.id);
      if (existing >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existing] = { ...template, updatedAt: Date.now() };
        return updated;
      }
      // Add new
      return [...prev, { ...template, createdAt: Date.now(), updatedAt: Date.now() }];
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    // Don't delete default templates
    if (id.startsWith('default-')) return;
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<FrameTemplate>) => {
    setTemplates(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
      )
    );
  }, []);

  const duplicateTemplate = useCallback((id: string) => {
    setTemplates(prev => {
      const source = prev.find(t => t.id === id);
      if (!source) return prev;
      const now = Date.now();
      const newTemplate: FrameTemplate = {
        ...source,
        id: `template-${now}`,
        name: `${source.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      return [...prev, newTemplate];
    });
  }, []);

  const getTemplate = useCallback((id: string): FrameTemplate | undefined => {
    return templates.find(t => t.id === id);
  }, [templates]);

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    updateTemplate,
    duplicateTemplate,
    getTemplate,
  };
}
