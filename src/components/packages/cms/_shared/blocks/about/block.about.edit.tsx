'use client'
import React from 'react'
import { ColorPaletteSelector } from '../../../builder/_components/ColorPaletteSelector'
import type { ThemeColors } from '../../types'

interface AboutBlockEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export default function AboutBlockEdit({ content, onUpdate, themeColors }: AboutBlockEditProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            value={content.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-2 border rounded-md"
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
          value={content.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={content.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full p-2 border rounded-md h-24"
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
