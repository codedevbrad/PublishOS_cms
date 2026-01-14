'use client'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import { ChevronDown } from 'lucide-react'

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

const COLOR_LABELS: Record<string, { label: string }> = {
  primary: { label: 'Primary' },
  secondary: { label: 'Secondary' },
  accent: { label: 'Accent' },
  background: { label: 'Background' },
  foreground: { label: 'Foreground' },
  muted: { label: 'Muted' },
  mutedForeground: { label: 'Muted Foreground' },
  border: { label: 'Border' },
}

interface ColorPaletteSelectorProps {
  themeColors: ThemeColors
  selectedColor?: string // The color key (e.g., 'primary', 'background') or hex value
  onSelect: (colorKey: string) => void
  label?: string
}

export const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({
  themeColors,
  selectedColor,
  onSelect,
  label,
}) => {
  const [open, setOpen] = useState(false)
  
  // Check if selectedColor is a color key (exists in themeColors) or a hex value
  const isColorKey = selectedColor && selectedColor in themeColors
  const selectedKey = isColorKey ? selectedColor : undefined
  
  // Get the display color value
  const displayColor = selectedKey 
    ? themeColors[selectedKey] 
    : selectedColor || '#000000'
  
  // Get the display label
  const displayLabel = selectedKey 
    ? COLOR_LABELS[selectedKey]?.label 
    : 'Custom'

  const handleSelect = (key: string) => {
    onSelect(key)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 w-full p-2 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            <div
              className="w-8 h-8 rounded border border-gray-300 shrink-0"
              style={{ backgroundColor: displayColor }}
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-700">{displayLabel}</div>
              <div className="text-xs text-gray-500 font-mono">{displayColor}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <h5 className="text-xs font-semibold text-gray-700 mb-3">Select Color</h5>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(COLOR_LABELS).map(([key, { label: colorLabel }]) => {
              const colorValue = themeColors[key] || '#000000'
              const isSelected = selectedKey === key
              
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`h-20 rounded flex flex-col items-center justify-center text-white text-xs font-medium shadow-sm transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                  style={{ backgroundColor: colorValue }}
                  title={`${colorLabel}: ${colorValue}`}
                >
                  {isSelected && (
                    <span className="text-xs mt-1">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
