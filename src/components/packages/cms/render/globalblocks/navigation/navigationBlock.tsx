'use client'
import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
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
    responsiveBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  }
  themeColors?: ThemeColors
}

const desktopNavVisibilityClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
  xl: 'hidden xl:flex',
}

const mobileVisibilityClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const responsiveBreakpoint = content.responsiveBreakpoint || 'md'
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

  React.useEffect(() => {
    if (!isMenuOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMenuOpen])

  const renderNavItems = (mobile = false) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (content.items || []).map((item: any, index: number) => (
      <li key={index}>
        {isSiteMode ? (
          <Link
            href={resolveHref(item.link)}
            className={itemClassName(!!item.pageId)}
            style={{ color: textColor }}
            {...hoverHandlers}
            onClick={() => {
              if (mobile) setIsMenuOpen(false)
            }}
          >
            {item.label || ''}
          </Link>
        ) : (
          <span
            className={`${itemClassName(!!item.pageId)} cursor-default`}
            style={{ color: textColor }}
            {...hoverHandlers}
            onClick={() => {
              if (mobile) setIsMenuOpen(false)
            }}
          >
            {item.label || ''}
          </span>
        )}
      </li>
    ))

  return (
    <nav
      className="px-8 py-3 border-b relative"
      style={{ backgroundColor, color: textColor }}
    >
      <div className={`flex justify-end ${mobileVisibilityClasses[responsiveBreakpoint]}`}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <ul className={`${desktopNavVisibilityClasses[responsiveBreakpoint]} space-x-6 ${content.alignment === 'center' ? 'justify-center' : content.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
        {renderNavItems()}
      </ul>

      {isMenuOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${mobileVisibilityClasses[responsiveBreakpoint]}`}
          style={{ backgroundColor: backgroundColor || 'rgba(17, 24, 39, 0.95)', color: textColor }}
        >
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center rounded-md border"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
          <ul className="flex flex-col items-center justify-center gap-8 text-2xl">
            {renderNavItems(true)}
          </ul>
        </div>
      )}
    </nav>
  )
}
