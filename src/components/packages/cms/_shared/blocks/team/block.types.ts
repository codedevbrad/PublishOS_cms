import type { ThemeColors } from '../../types'

export type { ThemeColors }

export interface TeamBlockProps {
  content: {
    title?: string
    members?: Array<{ name: string; role: string; image?: string; bio?: string }>
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}
