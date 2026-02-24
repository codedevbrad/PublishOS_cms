'use client'
import React from 'react'

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
    backgroundColor?: string
    textColor?: string
    height?: string
  }
  themeColors?: ThemeColors
}

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
