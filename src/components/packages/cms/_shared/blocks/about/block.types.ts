import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface AboutBlockProps {
  content: {
    title?: string
    content?: string
    image?: string
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
