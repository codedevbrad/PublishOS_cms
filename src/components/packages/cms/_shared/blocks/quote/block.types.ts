import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface QuoteBlockProps {
  variant: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  themeColors?: ThemeColors
}

export interface QuoteStyleProps {
  content: {
    title?: string
    subtitle?: string
    description?: string
    backgroundImage?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formFields?: any
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
