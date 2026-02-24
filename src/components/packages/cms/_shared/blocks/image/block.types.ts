import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface ImageBlockProps {
  content: {
    src?: string
    alt?: string
    caption?: string
    backgroundColor?: string
  }
  themeColors?: ThemeColors
}
