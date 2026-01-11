'use client'
import React from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  [key: string]: string
}

interface ThemeEditorProps {
  themeColors: ThemeColors
  onUpdate: (colors: ThemeColors) => void
}

const COLOR_LABELS: Record<string, { label: string; description: string }> = {
  primary: { label: 'Primary', description: 'Main brand color for buttons, links, and highlights' },
  secondary: { label: 'Secondary', description: 'Secondary brand color for complementary elements' },
  accent: { label: 'Accent', description: 'Accent color for special emphasis and call-to-action elements' },
  background: { label: 'Background', description: 'Main background color of the page' },
  foreground: { label: 'Foreground', description: 'Main text color' },
  muted: { label: 'Muted', description: 'Muted background color for subtle sections' },
  mutedForeground: { label: 'Muted Foreground', description: 'Muted text color for secondary content' },
  border: { label: 'Border', description: 'Border color for dividers and containers' },
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ themeColors, onUpdate }) => {
  const handleColorChange = (key: string, value: string) => {
    // Allow partial input while typing, but ensure it starts with #
    if (value && !value.startsWith('#') && value.length > 0) {
      // Auto-add # if user types without it
      value = '#' + value
    }
    onUpdate({ ...themeColors, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Color Palette</h4>
        
        {Object.entries(COLOR_LABELS).map(([key, { label, description }]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="color"
                  value={themeColors[key] || '#000000'}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={themeColors[key] || ''}
                onChange={(e) => handleColorChange(key, e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              />
              <div
                className="w-12 h-10 rounded border border-gray-300"
                style={{ backgroundColor: themeColors[key] || '#000000' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="text-xs font-semibold text-gray-700 mb-2">Color Preview</h5>
          <div className="grid grid-cols-3 gap-2">
            <div
              className="h-16 rounded flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: themeColors.primary }}
            >
              Primary
            </div>
            <div
              className="h-16 rounded flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: themeColors.secondary }}
            >
              Secondary
            </div>
            <div
              className="h-16 rounded flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: themeColors.accent }}
            >
              Accent
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
