'use client'
import React from 'react'
import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'

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

interface ImageBlockProps {
  content: {
    src?: string
    alt?: string
    caption?: string
    backgroundColor?: string
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

export default function ImageBlock({ content, themeColors }: ImageBlockProps) {
  const {
    src = '',
    alt = 'Image description',
    caption = ''
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)

  return (
    <div className="py-8 px-8" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
          {src ? (
            <img src={src} alt={alt} className="max-h-full max-w-full object-cover rounded-lg" />
          ) : (
            <ImageIcon className="w-16 h-16 text-gray-400" />
          )}
        </div>
        {caption && <p className="text-gray-600 italic">{caption}</p>}
      </div>
    </div>
  )
}
