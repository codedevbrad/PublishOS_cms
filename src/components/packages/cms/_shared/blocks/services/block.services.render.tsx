'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import type { ServicesBlockProps } from './block.types'

const ServicesStyleA = dynamic(() => import('./services_style_a'))
const ServicesStyleB = dynamic(() => import('./services_style_b'))
const ServicesStyleC = dynamic(() => import('./services_style_c'))

export default function ServicesListBlock({ variant, content, themeColors }: ServicesBlockProps) {
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
