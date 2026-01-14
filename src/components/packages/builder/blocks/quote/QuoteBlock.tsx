'use client'
import React from 'react'
import dynamic from 'next/dynamic'

// Import quote variants
const QuoteStyleA = dynamic(() => import('./quote_style_a'))
const QuoteStyleB = dynamic(() => import('./quote_style_b'))
const QuoteStyleC = dynamic(() => import('./quote_style_c'))
const QuoteStyleD = dynamic(() => import('./quote_style_d'))

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

interface QuoteBlockProps {
  variant: string
  content: any
  themeColors?: ThemeColors
}

export default function QuoteBlock({ variant, content, themeColors }: QuoteBlockProps) {
  switch (variant) {
    case 'style_a':
      return <QuoteStyleA content={content} themeColors={themeColors} />
    case 'style_b':
      return <QuoteStyleB content={content} themeColors={themeColors} />
    case 'style_c':
      return <QuoteStyleC content={content} themeColors={themeColors} />
    case 'style_d':
      return <QuoteStyleD content={content} themeColors={themeColors} />
    default:
      return <QuoteStyleA content={content} themeColors={themeColors} />
  }
}
