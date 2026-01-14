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

interface NavigationBlockProps {
  content: {
    items?: Array<{
      label?: string
      link?: string
      pageId?: string | null
    }>
    backgroundColor?: string // Can be a color key (e.g., 'primary') or hex value
    textColor?: string // Can be a color key (e.g., 'foreground') or hex value
    hoverColor?: string // Can be a color key (e.g., 'accent') or hex value
    alignment?: 'left' | 'center' | 'right'
    autoSync?: boolean
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

export const NavigationBlock: React.FC<NavigationBlockProps> = ({ content, themeColors }) => {
  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)
  const hoverColor = resolveColor(content.hoverColor, themeColors)

  return (
    <nav 
      className="px-8 py-3 border-b"
      style={{ backgroundColor, color: textColor }}
    >
      <ul className={`flex space-x-6 ${content.alignment === 'center' ? 'justify-center' : content.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
        {(content.items || []).map((item: any, index: number) => (
          <li key={index}>
            <button
              onClick={() => {
                // If this nav item is connected to a page, switch to that page
                if (item.pageId) {
                  // In a real app, you'd handle routing here
                  if (typeof window !== 'undefined') {
                    console.log(`Navigate to page: ${item.pageId}`)
                  }
                }
              }}
              className={`hover:opacity-75 transition-opacity cursor-pointer ${
                item.pageId ? 'font-medium' : ''
              }`}
              style={{ color: textColor }}
              onMouseEnter={(e) => {
                if (hoverColor) {
                  e.currentTarget.style.color = hoverColor
                }
              }}
              onMouseLeave={(e) => {
                if (textColor) {
                  e.currentTarget.style.color = textColor
                }
              }}
            >
              {item.label || ''}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

interface NavigationBlockEditorProps {
  content: {
    items?: Array<{
      label?: string
      link?: string
      pageId?: string | null
    }>
    backgroundColor?: string // Can be a color key (e.g., 'primary') or hex value
    textColor?: string // Can be a color key (e.g., 'foreground') or hex value
    hoverColor?: string // Can be a color key (e.g., 'accent') or hex value
    alignment?: 'left' | 'center' | 'right'
    autoSync?: boolean
  }
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export const NavigationBlockEditor: React.FC<NavigationBlockEditorProps> = ({ content, onUpdate, themeColors }) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  const handleArrayChange = (field: string, index: number, subField: string, value: any) => {
    const newArray = [...(content[field as keyof typeof content] as any[])]
    newArray[index] = { ...newArray[index], [subField]: value }
    onUpdate({ ...content, [field]: newArray })
  }

  const addArrayItem = (field: string, defaultItem: any) => {
    onUpdate({ ...content, [field]: [...(content[field as keyof typeof content] as any[]), defaultItem] })
  }

  const removeArrayItem = (field: string, index: number) => {
    const newArray = (content[field as keyof typeof content] as any[]).filter((_: any, i: number) => i !== index)
    onUpdate({ ...content, [field]: newArray })
  }

  if (!themeColors) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-500">
          Theme colors not available. Please configure theme colors first.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="autoSync"
          checked={content.autoSync || false}
          onChange={(e) => handleInputChange('autoSync', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="autoSync" className="text-sm font-medium">
          Auto-sync with pages
        </label>
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
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.hoverColor}
        onSelect={(colorKey) => handleInputChange('hoverColor', colorKey)}
        label="Hover Color"
      />
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={content.alignment}
          onChange={(e) => handleInputChange('alignment', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      
      {!content.autoSync && (
        <div>
          <label className="block text-sm font-medium mb-2">Navigation Items</label>
          {(content.items || []).map((item: any, index: number) => (
            <div key={index} className="border p-3 rounded-md space-y-2 mb-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleArrayChange('items', index, 'label', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Label"
              />
              <input
                type="text"
                value={item.link}
                onChange={(e) => handleArrayChange('items', index, 'link', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Link (e.g., /about)"
              />
              <button
                onClick={() => removeArrayItem('items', index)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('items', { label: '', link: '', pageId: null })}
            className="text-blue-500 text-sm hover:text-blue-700"
          >
            + Add Nav Item
          </button>
        </div>
      )}
      
      {content.autoSync && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            Navigation items are automatically synchronized with your pages. 
            Create, rename, or delete pages to update the navigation.
          </p>
        </div>
      )}
    </div>
  )
}
