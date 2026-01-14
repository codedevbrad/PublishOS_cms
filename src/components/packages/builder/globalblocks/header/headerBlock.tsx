'use client'
import React from 'react'
import { ColorPaletteSelector } from '../../_components/ColorPaletteSelector'

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

interface HeaderBlockProps {
  content: {
    title?: string
    backgroundColor?: string // Can be a color key (e.g., 'primary') or hex value
    textColor?: string // Can be a color key (e.g., 'foreground') or hex value
    height?: string
  }
  themeColors?: ThemeColors
}

// Helper function to resolve color - if it's a key in themeColors, return the value, otherwise return as-is
const resolveColor = (color: string | undefined, themeColors?: ThemeColors): string | undefined => {
  if (!color) return undefined
  if (themeColors && color in themeColors) {
    return themeColors[color]
  }
  return color
}

export const HeaderBlock: React.FC<HeaderBlockProps> = ({ content, themeColors }) => {
  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div 
      className={`px-8 py-4 flex items-center justify-between border-b ${content.height || 'h-16'}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="flex items-center space-x-3">
        <div className="text-xl font-bold">{content.title || 'Your Site Title'}</div>
      </div>
    </div>
  )
}

interface HeaderBlockEditorProps {
  content: {
    title?: string
    backgroundColor?: string // Can be a color key (e.g., 'primary') or hex value
    textColor?: string // Can be a color key (e.g., 'foreground') or hex value
    height?: string
  }
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export const HeaderBlockEditor: React.FC<HeaderBlockEditorProps> = ({ content, onUpdate, themeColors }) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  if (!themeColors) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Your Site Title"
          />
        </div>
        <div className="text-sm text-gray-500">
          Theme colors not available. Please configure theme colors first.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Your Site Title"
        />
      </div>
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.backgroundColor}
        onSelect={(colorKey) => handleInputChange('backgroundColor', colorKey)}
        label="Background Color"
      />
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.textColor}
        onSelect={(colorKey) => handleInputChange('textColor', colorKey)}
        label="Text Color"
      />
    </div>
  )
}
