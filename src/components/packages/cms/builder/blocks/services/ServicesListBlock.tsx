'use client'
import React from 'react'
import dynamic from 'next/dynamic'

// Import services variants
const ServicesStyleA = dynamic(() => import('./services_style_a'))
const ServicesStyleB = dynamic(() => import('./services_style_b'))
const ServicesStyleC = dynamic(() => import('./services_style_c'))

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

interface Service {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  link?: string
}

interface ServicesListBlockProps {
  variant: string
  content: {
    title?: string
    description?: string
    services?: Service[]
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}

export default function ServicesListBlock({ variant, content, themeColors }: ServicesListBlockProps) {
  switch (variant) {
    case 'style_a':
      return <ServicesStyleA content={content} themeColors={themeColors} />
    case 'style_b':
      return <ServicesStyleB content={content} themeColors={themeColors} />
    case 'style_c':
      return <ServicesStyleC content={content} themeColors={themeColors} />
    default:
      return <ServicesStyleA content={content} themeColors={themeColors} />
  }
}
