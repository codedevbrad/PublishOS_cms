'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import type { HeroBlockProps } from './block.types'

const HeroStyleA = dynamic(() => import('./hero_style_a'))
const HeroStyleB = dynamic(() => import('./hero_style_b'))
const HeroStyleC = dynamic(() => import('./hero_style_c'))

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
