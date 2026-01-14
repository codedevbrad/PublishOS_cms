'use client'
import React from 'react'
import dynamic from 'next/dynamic'

// Import hero variants
const HeroStyleA = dynamic(() => import('./hero_style_a'))
const HeroStyleB = dynamic(() => import('./hero_style_b'))
const HeroStyleC = dynamic(() => import('./hero_style_c'))

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

interface HeroBlockProps {
  variant: string
  content: any
  themeColors?: ThemeColors
}

export default function HeroBlock({ variant, content, themeColors }: HeroBlockProps) {
  switch (variant) {
    case 'style_a':
      return <HeroStyleA content={content} themeColors={themeColors} />
    case 'style_b':
      return <HeroStyleB content={content} themeColors={themeColors} />
    case 'style_c':
      return <HeroStyleC content={content} themeColors={themeColors} />
    default:
      return <HeroStyleA content={content} themeColors={themeColors} />
  }
}
