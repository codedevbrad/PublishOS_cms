'use client'
import React from 'react'
import Link from 'next/link'
import { useIsSiteMode } from '../../SiteModeContext'

interface ThemeColors {
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

type HeaderStyle = {
  backgroundColor?: string
  textColor?: string
  height?: string
}

type NavStyle = {
  backgroundColor?: string
  textColor?: string
  hoverColor?: string
  alignment?: 'left' | 'center' | 'right'
}

type LayoutStyles = {
  header?: HeaderStyle
  nav?: NavStyle
  gap?: string
  divider?: boolean
}

interface HeaderNavBlockContent {
  title?: string
  layout?: 'inline' | 'stacked'
  items?: Array<{
    label?: string
    link?: string
    pageId?: string | null
  }>
  styles?: {
    header?: HeaderStyle
    nav?: NavStyle
    inline?: LayoutStyles
    stacked?: LayoutStyles
  }
}

interface HeaderNavBlockProps {
  content: HeaderNavBlockContent
  themeColors?: ThemeColors
}

const resolveColor = (color: string | undefined, themeColors?: ThemeColors): string | undefined => {
  if (!color) return undefined
  if (themeColors && color in themeColors) {
    return themeColors[color]
  }
  return color
}

const resolveHeaderStyles = (content: HeaderNavBlockContent, themeColors?: ThemeColors) => {
  const layout = content.layout || 'inline'
  const merged = { ...(content.styles?.header || {}), ...(content.styles?.[layout]?.header || {}) }
  return {
    backgroundColor: resolveColor(merged.backgroundColor, themeColors),
    textColor: resolveColor(merged.textColor, themeColors),
    height: merged.height || 'h-16',
  }
}

const resolveNavStyles = (content: HeaderNavBlockContent, themeColors?: ThemeColors) => {
  const layout = content.layout || 'inline'
  const merged = { ...(content.styles?.nav || {}), ...(content.styles?.[layout]?.nav || {}) }
  return {
    backgroundColor: resolveColor(merged.backgroundColor, themeColors),
    textColor: resolveColor(merged.textColor, themeColors),
    hoverColor: resolveColor(merged.hoverColor, themeColors),
    alignment: merged.alignment || 'left',
  }
}

const navAlignmentClasses: Record<'left' | 'center' | 'right', string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const HeaderNavBlock: React.FC<HeaderNavBlockProps> = ({ content, themeColors }) => {
  const isSiteMode = useIsSiteMode()
  const layout = content.layout || 'inline'
  const headerStyles = resolveHeaderStyles(content, themeColors)
  const navStyles = resolveNavStyles(content, themeColors)
  const inlineGap = content.styles?.inline?.gap || 'gap-8'
  const hasDivider = content.styles?.stacked?.divider ?? true

  const siteBasePath = process.env.NODE_ENV === 'development' ? '/site' : ''
  const resolveHref = (link: string | undefined) => `${siteBasePath}${link || '/'}`

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (navStyles.hoverColor) e.currentTarget.style.color = navStyles.hoverColor
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (navStyles.textColor) e.currentTarget.style.color = navStyles.textColor
    },
  }

  const navItems = (
    <ul className={`flex space-x-6 ${navAlignmentClasses[navStyles.alignment]}`}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(content.items || []).map((item: any, index: number) => (
        <li key={index}>
          {isSiteMode ? (
            <Link
              href={resolveHref(item.link)}
              className={`hover:opacity-75 transition-opacity ${item.pageId ? 'font-medium' : ''}`}
              style={{ color: navStyles.textColor }}
              {...hoverHandlers}
            >
              {item.label || ''}
            </Link>
          ) : (
            <span
              className={`hover:opacity-75 transition-opacity ${item.pageId ? 'font-medium' : ''} cursor-default`}
              style={{ color: navStyles.textColor }}
              {...hoverHandlers}
            >
              {item.label || ''}
            </span>
          )}
        </li>
      ))}
    </ul>
  )

  if (layout === 'stacked') {
    return (
      <div className={hasDivider ? 'border-b' : ''}>
        <div
          className={`px-8 py-4 flex items-center ${headerStyles.height}`}
          style={{ backgroundColor: headerStyles.backgroundColor, color: headerStyles.textColor }}
        >
          <div className="text-xl font-bold">{content.title || 'Your Site Title'}</div>
        </div>
        <nav
          className="px-8 py-3"
          style={{ backgroundColor: navStyles.backgroundColor, color: navStyles.textColor }}
        >
          {navItems}
        </nav>
      </div>
    )
  }

  return (
    <div
      className={`px-8 py-4 border-b flex items-center justify-between ${headerStyles.height} ${inlineGap}`}
      style={{ backgroundColor: headerStyles.backgroundColor, color: headerStyles.textColor }}
    >
      <div className="text-xl font-bold shrink-0">{content.title || 'Your Site Title'}</div>
      <nav className="flex-1" style={{ backgroundColor: navStyles.backgroundColor }}>
        {navItems}
      </nav>
    </div>
  )
}
