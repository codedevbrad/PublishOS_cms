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

interface NavigationBlockProps {
  content: {
    items?: Array<{
      label?: string
      link?: string
      pageId?: string | null
    }>
    backgroundColor?: string
    textColor?: string
    hoverColor?: string
    alignment?: 'left' | 'center' | 'right'
    autoSync?: boolean
  }
  themeColors?: ThemeColors
}

const resolveColor = (color: string | undefined, themeColors?: ThemeColors): string | undefined => {
  if (!color) return undefined
  if (themeColors && color in themeColors) {
    return themeColors[color]
  }
  return color
}

export const NavigationBlock: React.FC<NavigationBlockProps> = ({ content, themeColors }) => {
  const isSiteMode = useIsSiteMode()
  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)
  const hoverColor = resolveColor(content.hoverColor, themeColors)

  const siteBasePath = process.env.NODE_ENV === 'development' ? '/site' : ''

  const resolveHref = (link: string | undefined) => {
    const path = link || '/'
    return `${siteBasePath}${path}`
  }

  const itemClassName = (hasPageId: boolean) =>
    `hover:opacity-75 transition-opacity ${hasPageId ? 'font-medium' : ''}`

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (hoverColor) e.currentTarget.style.color = hoverColor
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (textColor) e.currentTarget.style.color = textColor
    },
  }

  return (
    <nav 
      className="px-8 py-3 border-b"
      style={{ backgroundColor, color: textColor }}
    >
      <ul className={`flex space-x-6 ${content.alignment === 'center' ? 'justify-center' : content.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(content.items || []).map((item: any, index: number) => (
          <li key={index}>
            {isSiteMode ? (
              <Link
                href={resolveHref(item.link)}
                className={itemClassName(!!item.pageId)}
                style={{ color: textColor }}
                {...hoverHandlers}
              >
                {item.label || ''}
              </Link>
            ) : (
              <span
                className={`${itemClassName(!!item.pageId)} cursor-default`}
                style={{ color: textColor }}
                {...hoverHandlers}
              >
                {item.label || ''}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
