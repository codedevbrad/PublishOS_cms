import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface GalleryBlockProps {
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

export interface GalleryStyleProps {
  content: {
    title?: string
    description?: string
    images?: Array<{ id: string; src: string; alt: string; caption?: string }>
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
