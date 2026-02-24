import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface Service {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  link?: string
}

export interface ServicesBlockProps {
  variant: string
  content: {
    title?: string
    description?: string
    services?: Service[]
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}

export interface ServicesStyleProps {
  content: {
    title?: string
    description?: string
    services?: Service[]
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
