'use client'
import React from 'react'
import { ColorPaletteSelector } from '../../../builder/_components/ColorPaletteSelector'
import type { ThemeColors } from '../../types'

interface TeamBlockEditProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export default function TeamBlockEdit({ content, onUpdate, themeColors }: TeamBlockEditProps) {
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
        <label className="block text-sm font-medium mb-2">Team Members</label>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.members.map((member: any, index: number) => (
          <div key={index} className="border p-3 rounded-md space-y-2 mb-2">
            <input
              type="text"
              value={member.name}
              onChange={(e) => handleArrayChange('members', index, 'name', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Name"
            />
            <input
              type="text"
              value={member.role}
              onChange={(e) => handleArrayChange('members', index, 'role', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Role"
            />
            <textarea
              value={member.bio}
              onChange={(e) => handleArrayChange('members', index, 'bio', e.target.value)}
              className="w-full p-2 border rounded-md text-sm h-16"
              placeholder="Bio"
            />
            <button
              onClick={() => removeArrayItem('members', index)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => addArrayItem('members', { name: '', role: '', image: '', bio: '' })}
          className="text-blue-500 text-sm hover:text-blue-700"
        >
          + Add Team Member
        </button>
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
