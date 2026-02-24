'use client'
import React from 'react'
import { ColorPaletteSelector } from '../../../builder/_components/ColorPaletteSelector'
import type { ThemeColors } from '../../types'

interface ImageBlockEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export default function ImageBlockEdit({ content, onUpdate, themeColors }: ImageBlockEditProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  if (!themeColors) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={content.src}
            onChange={(e) => handleInputChange('src', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="https://example.com/image.jpg"
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
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="text"
          value={content.src}
          onChange={(e) => handleInputChange('src', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Alt Text</label>
        <input
          type="text"
          value={content.alt}
          onChange={(e) => handleInputChange('alt', e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Caption</label>
        <input
          type="text"
          value={content.caption}
          onChange={(e) => handleInputChange('caption', e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.backgroundColor}
        onSelect={(colorKey) => handleInputChange('backgroundColor', colorKey)}
        label="Background Color"
      />
    </div>
  )
}
