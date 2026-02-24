import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface FAQBlockProps {
  content: {
    title?: string
    items?: Array<{ question: string; answer: string }>
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
