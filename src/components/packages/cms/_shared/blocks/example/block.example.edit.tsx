'use client'
import React from 'react'
import type { ThemeColors } from '../../types'

interface ExampleBlockEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export default function ExampleBlockEdit({ content, onUpdate }: ExampleBlockEditProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
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
        />
      </div>
    </div>
  )
}
