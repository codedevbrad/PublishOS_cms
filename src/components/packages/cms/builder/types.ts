export interface ContentBlock {
  id: string
  type: 'hero' | 'about' | 'image' | 'faq' | 'contact' | 'team' | 'quote' | 'gallery' | 'services'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  order: number
  variant?: string
}

export interface GlobalBlock {
  id: string
  type: 'header' | 'nav'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  isActive: boolean
}

export interface Page {
  id: string
  name: string
  slug: string
  blocks: ContentBlock[]
  isActive: boolean
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  [key: string]: string
}

export interface SiteData {
  pages: Page[]
  globalBlocks: GlobalBlock[]
  themeColors?: ThemeColors
}
