'use client'
import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useIsSiteMode } from '../../render/SiteModeContext'
import { ColorPaletteSelector } from '../../_components/ColorPaletteSelector'

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
    backgroundColor?: string // Can be a color key (e.g., 'primary') or hex value
    textColor?: string // Can be a color key (e.g., 'foreground') or hex value
    hoverColor?: string // Can be a color key (e.g., 'accent') or hex value
    alignment?: 'left' | 'center' | 'right'
    autoSync?: boolean
    responsiveBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  }
  themeColors?: ThemeColors
  previewWidth?: number
}

const BREAKPOINT_PX: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

// Helper function to resolve color - if it's a key in themeColors, return the value, otherwise return as-is
const resolveColor = (color: string | undefined, themeColors?: ThemeColors): string | undefined => {
  if (!color) return undefined
  if (themeColors && color in themeColors) {
    return themeColors[color]
  }
  return color
}

export const NavigationBlock: React.FC<NavigationBlockProps> = ({ content, themeColors, previewWidth }) => {
  const isSiteMode = useIsSiteMode()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const responsiveBreakpoint = content.responsiveBreakpoint || 'md'
  const isMobileViewport = (previewWidth ?? Number.MAX_SAFE_INTEGER) < BREAKPOINT_PX[responsiveBreakpoint]
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

  React.useEffect(() => {
    if (!isMobileViewport && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isMobileViewport, isMenuOpen])

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
      {isMobileViewport ? (
        <div className="flex justify-end">
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
      ) : (
        <ul className={`flex space-x-6 ${content.alignment === 'center' ? 'justify-center' : content.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
          {renderNavItems()}
        </ul>
      )}

      {isMobileViewport && isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
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

interface NavigationBlockEditorProps {
  content: {
    items?: Array<{
      label?: string
      link?: string
      pageId?: string | null
    }>
    backgroundColor?: string // Can be a color key (e.g., 'primary') or hex value
    textColor?: string // Can be a color key (e.g., 'foreground') or hex value
    hoverColor?: string // Can be a color key (e.g., 'accent') or hex value
    alignment?: 'left' | 'center' | 'right'
    autoSync?: boolean
    responsiveBreakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export const NavigationBlockEditor: React.FC<NavigationBlockEditorProps> = ({ content, onUpdate, themeColors }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleArrayChange = (field: string, index: number, subField: string, value: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArray = [...(content[field as keyof typeof content] as any[])]
    newArray[index] = { ...newArray[index], [subField]: value }
    onUpdate({ ...content, [field]: newArray })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addArrayItem = (field: string, defaultItem: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate({ ...content, [field]: [...(content[field as keyof typeof content] as any[]), defaultItem] })
  }

  const removeArrayItem = (field: string, index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newArray = (content[field as keyof typeof content] as any[]).filter((_: any, i: number) => i !== index)
    onUpdate({ ...content, [field]: newArray })
  }

  if (!themeColors) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-500">
          Theme colors not available. Please configure theme colors first.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="autoSync"
          checked={content.autoSync || false}
          onChange={(e) => handleInputChange('autoSync', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="autoSync" className="text-sm font-medium">
          Auto-sync with pages
        </label>
      </div>
      
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.backgroundColor}
        onSelect={(colorKey) => handleInputChange('backgroundColor', colorKey)}
        label="Background Color"
      />
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.textColor}
        onSelect={(colorKey) => handleInputChange('textColor', colorKey)}
        label="Text Color"
      />
      <ColorPaletteSelector
        themeColors={themeColors}
        selectedColor={content.hoverColor}
        onSelect={(colorKey) => handleInputChange('hoverColor', colorKey)}
        label="Hover Color"
      />
      <div>
        <label className="block text-sm font-medium mb-1">Alignment</label>
        <select
          value={content.alignment}
          onChange={(e) => handleInputChange('alignment', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Responsive Breakpoint</label>
        <select
          value={content.responsiveBreakpoint || 'md'}
          onChange={(e) => handleInputChange('responsiveBreakpoint', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="sm">sm (640px)</option>
          <option value="md">md (768px)</option>
          <option value="lg">lg (1024px)</option>
          <option value="xl">xl (1280px)</option>
        </select>
      </div>
      
      {!content.autoSync && (
        <div>
          <label className="block text-sm font-medium mb-2">Navigation Items</label>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(content.items || []).map((item: any, index: number) => (
            <div key={index} className="border p-3 rounded-md space-y-2 mb-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleArrayChange('items', index, 'label', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Label"
              />
              <input
                type="text"
                value={item.link}
                onChange={(e) => handleArrayChange('items', index, 'link', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Link (e.g., /about)"
              />
              <button
                onClick={() => removeArrayItem('items', index)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('items', { label: '', link: '', pageId: null })}
            className="text-blue-500 text-sm hover:text-blue-700"
          >
            + Add Nav Item
          </button>
        </div>
      )}
      
      {content.autoSync && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            Navigation items are automatically synchronized with your pages. 
            Create, rename, or delete pages to update the navigation.
          </p>
        </div>
      )}
    </div>
  )
}
