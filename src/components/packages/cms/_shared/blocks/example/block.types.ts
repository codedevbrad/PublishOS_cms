import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface ExampleBlockProps {
  content: {
    title?: string
    description?: string
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
