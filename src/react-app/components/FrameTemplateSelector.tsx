import { useState } from 'react';
import { Frame, ChevronDown, Check, Palette, Droplet, Image, Trash2 } from 'lucide-react';
import type { FrameTemplate } from '@/react-app/hooks/useProject';

interface FrameTemplateSelectorProps {
  templates: FrameTemplate[];
  currentTemplateId?: string;
  onSelectTemplate: (template: FrameTemplate) => void;
  onDeleteTemplate?: (id: string) => void;
}

const BACKGROUND_ICONS = {
  solid: Palette,
  gradient: Droplet,
  blur: Image,
  image: Image,
};

export default function FrameTemplateSelector({
  templates,
  currentTemplateId,
  onSelectTemplate,
  onDeleteTemplate,
}: FrameTemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentTemplate = templates.find(t => t.id === currentTemplateId);

  const handleSelect = (template: FrameTemplate) => {
    onSelectTemplate(template);
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteTemplate?.(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
      >
        <Frame className="w-4 h-4 text-zinc-400" />
        <span className="text-zinc-300">{currentTemplate?.name || 'Frame Style'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-zinc-700">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Frame Templates</span>
            </div>

            <div className="max-h-80 overflow-y-auto py-1">
              {templates.map((template) => {
                const Icon = BACKGROUND_ICONS[template.background.type];
                const isSelected = template.id === currentTemplateId;
                const isDefault = template.id.startsWith('default-');

                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template)}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-700/50 transition-colors ${
                      isSelected ? 'bg-orange-500/10' : ''
                    }`}
                  >
                    {/* Preview swatch */}
                    <div
                      className="w-8 h-12 rounded border border-zinc-600 flex-shrink-0 overflow-hidden"
                      style={getSwatchStyle(template)}
                    >
                      {/* Mini video placeholder */}
                      <div className="w-full h-1/3 mt-1/3 bg-zinc-600/50" />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{template.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Icon className="w-3 h-3 text-zinc-500" />
                        <span className="text-xs text-zinc-500 capitalize">{template.background.type}</span>
                        {template.overlays.length > 0 && (
                          <span className="text-xs text-zinc-600">
                            • {template.overlays.length} overlay{template.overlays.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {!isDefault && onDeleteTemplate && (
                      <button
                        onClick={(e) => handleDelete(e, template.id)}
                        className="p-1 hover:bg-zinc-600 rounded text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="px-3 py-2 border-t border-zinc-700 bg-zinc-800/50">
              <p className="text-[10px] text-zinc-600 text-center">
                Customize in Frame panel when in 9:16 mode
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getSwatchStyle(template: FrameTemplate): React.CSSProperties {
  const bg = template.background;

  switch (bg.type) {
    case 'solid':
      return { backgroundColor: bg.color || '#000000' };
    case 'gradient':
      return {
        background: `linear-gradient(${bg.gradientAngle || 180}deg, ${bg.gradientStart || '#1a1a2e'}, ${bg.gradientEnd || '#16213e'})`,
      };
    case 'blur':
      return { backgroundColor: '#333', filter: 'blur(2px)' };
    case 'image':
      return { backgroundColor: '#444' };
    default:
      return { backgroundColor: '#000' };
  }
}
