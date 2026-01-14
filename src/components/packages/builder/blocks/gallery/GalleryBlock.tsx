'use client'
import React from 'react'
import dynamic from 'next/dynamic'

// Import gallery variants
const GalleryStyleA = dynamic(() => import('./gallery_style_a'))
const GalleryStyleB = dynamic(() => import('./gallery_style_b'))
const GalleryStyleC = dynamic(() => import('./gallery_style_c'))

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

interface GalleryBlockProps {
  variant: string
  content: {
    title?: string
    description?: string
    images?: Array<{ id: string; src: string; alt: string; caption?: string }>
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}

export default function GalleryBlock({ variant, content, themeColors }: GalleryBlockProps) {
  switch (variant) {
    case 'style_a':
      return <GalleryStyleA content={content} themeColors={themeColors} />
    case 'style_b':
      return <GalleryStyleB content={content} themeColors={themeColors} />
    case 'style_c':
      return <GalleryStyleC content={content} themeColors={themeColors} />
    default:
      return <GalleryStyleA content={content} themeColors={themeColors} />
  }
}
