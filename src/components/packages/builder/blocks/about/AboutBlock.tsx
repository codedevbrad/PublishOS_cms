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

interface AboutBlockProps {
  content: {
    title?: string
    content?: string
    image?: string
    backgroundColor?: string
    textColor?: string
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

export default function AboutBlock({ content, themeColors }: AboutBlockProps) {
  const {
    title = 'About Us',
    content: aboutContent = 'We are passionate about creating exceptional digital experiences that help businesses grow and succeed.',
    image = ''
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div className="py-16 px-8" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
        <p className="text-lg text-center leading-relaxed" style={{ color: textColor || undefined }}>{aboutContent}</p>
        {image && (
          <div className="mt-8 flex justify-center">
            <img src={image} alt={title} className="max-w-full h-auto rounded-lg" />
          </div>
        )}
      </div>
    </div>
  )
}
