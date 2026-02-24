'use client'
import React from 'react'
import { ColorPaletteSelector } from '../../../builder/_components/ColorPaletteSelector'
import type { ThemeColors } from '../../types'

interface ServicesBlockEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export default function ServicesBlockEdit({ content, onUpdate, themeColors }: ServicesBlockEditProps) {
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
            placeholder="Services Title"
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
          placeholder="Services Title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-2 border rounded-md h-20"
          placeholder="Services description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Services</label>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(content.services || []).map((service: any, index: number) => (
          <div key={service.id || index} className="border p-3 rounded-md space-y-2 mb-2">
            <div className="flex gap-2">
              {service.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={service.image} alt={service.title || ''} className="w-20 h-20 object-cover rounded" />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={service.title || ''}
                  onChange={(e) => handleArrayChange('services', index, 'title', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Service Title"
                />
                <input
                  type="text"
                  value={service.subtitle || ''}
                  onChange={(e) => handleArrayChange('services', index, 'subtitle', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Subtitle (optional)"
                />
                <input
                  type="text"
                  value={service.image || ''}
                  onChange={(e) => handleArrayChange('services', index, 'image', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Image URL"
                />
                <textarea
                  value={service.description || ''}
                  onChange={(e) => handleArrayChange('services', index, 'description', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm h-16"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={service.link || ''}
                  onChange={(e) => handleArrayChange('services', index, 'link', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Link URL (optional)"
                />
              </div>
            </div>
            <button
              onClick={() => removeArrayItem('services', index)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Remove Service
            </button>
          </div>
        ))}
        <button
          onClick={() => addArrayItem('services', { 
            id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
            title: '', 
            subtitle: '', 
            description: '', 
            image: '', 
            link: '' 
          })}
          className="text-blue-500 text-sm hover:text-blue-700"
        >
          + Add Service
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
