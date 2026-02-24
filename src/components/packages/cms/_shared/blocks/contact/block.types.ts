import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface ContactBlockProps {
  content: {
    title?: string
    email?: string
    phone?: string
    address?: string
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
