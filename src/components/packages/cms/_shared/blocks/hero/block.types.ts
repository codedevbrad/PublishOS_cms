import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface HeroBlockProps {
  variant: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  themeColors?: ThemeColors
}

export interface HeroStyleProps {
  content: {
    title?: string
    subtitle?: string
    description?: string
    buttonText?: string
    backgroundImage?: string
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
