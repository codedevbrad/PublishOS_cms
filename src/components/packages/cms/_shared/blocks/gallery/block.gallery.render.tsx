'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import type { GalleryBlockProps } from './block.types'

const GalleryStyleA = dynamic(() => import('./gallery_style_a'))
const GalleryStyleB = dynamic(() => import('./gallery_style_b'))
const GalleryStyleC = dynamic(() => import('./gallery_style_c'))

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
