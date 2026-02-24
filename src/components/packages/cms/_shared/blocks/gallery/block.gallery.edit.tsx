'use client'
import React from 'react'
import { ColorPaletteSelector } from '../../../builder/_components/ColorPaletteSelector'
import type { ThemeColors } from '../../types'

interface GalleryBlockEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export default function GalleryBlockEdit({ content, onUpdate, themeColors }: GalleryBlockEditProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleArrayChange = (field: string, index: number, subField: string, value: any) => {
    const newArray = [...content[field]]
    newArray[index] = { ...newArray[index], [subField]: value }
    onUpdate({ ...content, [field]: newArray })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addArrayItem = (field: string, defaultItem: any) => {
    onUpdate({ ...content, [field]: [...content[field], defaultItem] })
  }

  const removeArrayItem = (field: string, index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArray = content[field].filter((_: any, i: number) => i !== index)
    onUpdate({ ...content, [field]: newArray })
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
            placeholder="Gallery Title"
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
          placeholder="Gallery Title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-2 border rounded-md h-20"
          placeholder="Gallery description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(content.images || []).map((image: any, index: number) => (
          <div key={image.id || index} className="border p-3 rounded-md space-y-2 mb-2">
            <div className="flex gap-2">
              {image.src && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={image.src} alt={image.alt || ''} className="w-20 h-20 object-cover rounded" />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={image.src || ''}
                  onChange={(e) => handleArrayChange('images', index, 'src', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleArrayChange('images', index, 'alt', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Alt text"
                />
                <input
                  type="text"
                  value={image.caption || ''}
                  onChange={(e) => handleArrayChange('images', index, 'caption', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Caption (optional)"
                />
              </div>
            </div>
            <button
              onClick={() => removeArrayItem('images', index)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Remove Image
            </button>
          </div>
        ))}
        <button
          onClick={() => addArrayItem('images', { 
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
            src: '', 
            alt: '', 
            caption: '' 
          })}
          className="text-blue-500 text-sm hover:text-blue-700"
        >
          + Add Image
        </button>
      </div>
      {themeColors && (
        <>
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
        </>
      )}
    </div>
  )
}
