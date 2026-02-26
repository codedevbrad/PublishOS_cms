'use client'
import React from 'react'
import Link from 'next/link'
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
  autoSync?: boolean
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
  const sharedHeader = content.styles?.header || {}
  const layoutHeader = content.styles?.[layout]?.header || {}
  const merged = { ...sharedHeader, ...layoutHeader }
  return {
    backgroundColor: resolveColor(merged.backgroundColor, themeColors),
    textColor: resolveColor(merged.textColor, themeColors),
    height: merged.height || 'h-16',
  }
}

const resolveNavStyles = (content: HeaderNavBlockContent, themeColors?: ThemeColors) => {
  const layout = content.layout || 'inline'
  const sharedNav = content.styles?.nav || {}
  const layoutNav = content.styles?.[layout]?.nav || {}
  const merged = { ...sharedNav, ...layoutNav }
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

  const items = content.items || []

  const navItems = (
    <ul className={`flex space-x-6 ${navAlignmentClasses[navStyles.alignment]}`}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {items.map((item: any, index: number) => (
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

interface HeaderNavBlockEditorProps {
  content: HeaderNavBlockContent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void
  themeColors?: ThemeColors
}

export const HeaderNavBlockEditor: React.FC<HeaderNavBlockEditorProps> = ({ content, onUpdate, themeColors }) => {
  const layout = content.layout || 'inline'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value })
  }

  const updateStyle = (scope: 'header' | 'nav', field: string, value: string) => {
    const styles = content.styles || {}
    const scopeStyles = styles[scope] || {}
    onUpdate({
      ...content,
      styles: {
        ...styles,
        [scope]: {
          ...scopeStyles,
          [field]: value,
        },
      },
    })
  }

  const updateLayoutStyle = (
    layoutKey: 'inline' | 'stacked',
    scope: 'header' | 'nav',
    field: string,
    value: string
  ) => {
    const styles = content.styles || {}
    const layoutStyles = styles[layoutKey] || {}
    const scopeStyles = layoutStyles[scope] || {}
    onUpdate({
      ...content,
      styles: {
        ...styles,
        [layoutKey]: {
          ...layoutStyles,
          [scope]: {
            ...scopeStyles,
            [field]: value,
          },
        },
      },
    })
  }

  const updateLayoutMeta = (layoutKey: 'inline' | 'stacked', field: 'gap' | 'divider', value: string | boolean) => {
    const styles = content.styles || {}
    const layoutStyles = styles[layoutKey] || {}
    onUpdate({
      ...content,
      styles: {
        ...styles,
        [layoutKey]: {
          ...layoutStyles,
          [field]: value,
        },
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleArrayChange = (index: number, subField: string, value: any) => {
    const items = [...(content.items || [])]
    items[index] = { ...items[index], [subField]: value }
    onUpdate({ ...content, items })
  }

  const removeNavItem = (index: number) => {
    const items = (content.items || []).filter((_, i) => i !== index)
    onUpdate({ ...content, items })
  }

  const addNavItem = () => {
    onUpdate({
      ...content,
      items: [...(content.items || []), { label: '', link: '', pageId: null }],
    })
  }

  if (!themeColors) {
    return <div className="text-sm text-gray-500">Theme colors not available. Please configure theme colors first.</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Site Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Your Site Title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Layout</label>
        <select
          value={layout}
          onChange={(e) => handleInputChange('layout', e.target.value as 'inline' | 'stacked')}
          className="w-full p-2 border rounded-md"
        >
          <option value="inline">Inline (title + nav same row)</option>
          <option value="stacked">Stacked (title row + nav row)</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="headerNavAutoSync"
          checked={content.autoSync || false}
          onChange={(e) => handleInputChange('autoSync', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="headerNavAutoSync" className="text-sm font-medium">
          Auto-sync nav items with pages
        </label>
      </div>

      <div className="rounded-md border p-3 space-y-3">
        <p className="text-sm font-medium">Shared Styles (both layouts)</p>
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.header?.backgroundColor}
          onSelect={(colorKey) => updateStyle('header', 'backgroundColor', colorKey)}
          label="Header Background"
        />
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.header?.textColor}
          onSelect={(colorKey) => updateStyle('header', 'textColor', colorKey)}
          label="Header Text"
        />
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.nav?.backgroundColor}
          onSelect={(colorKey) => updateStyle('nav', 'backgroundColor', colorKey)}
          label="Nav Background"
        />
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.nav?.textColor}
          onSelect={(colorKey) => updateStyle('nav', 'textColor', colorKey)}
          label="Nav Text"
        />
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.nav?.hoverColor}
          onSelect={(colorKey) => updateStyle('nav', 'hoverColor', colorKey)}
          label="Nav Hover"
        />
      </div>

      <div className="rounded-md border p-3 space-y-3">
        <p className="text-sm font-medium">Inline Overrides</p>
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.inline?.header?.backgroundColor}
          onSelect={(colorKey) => updateLayoutStyle('inline', 'header', 'backgroundColor', colorKey)}
          label="Inline Header Background"
        />
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.inline?.nav?.textColor}
          onSelect={(colorKey) => updateLayoutStyle('inline', 'nav', 'textColor', colorKey)}
          label="Inline Nav Text"
        />
        <div>
          <label className="block text-sm font-medium mb-1">Inline Gap Utility Class</label>
          <input
            type="text"
            value={content.styles?.inline?.gap || ''}
            onChange={(e) => updateLayoutMeta('inline', 'gap', e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
            placeholder="e.g. gap-8"
          />
        </div>
      </div>

      <div className="rounded-md border p-3 space-y-3">
        <p className="text-sm font-medium">Stacked Overrides</p>
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.stacked?.header?.backgroundColor}
          onSelect={(colorKey) => updateLayoutStyle('stacked', 'header', 'backgroundColor', colorKey)}
          label="Stacked Header Background"
        />
        <ColorPaletteSelector
          themeColors={themeColors}
          selectedColor={content.styles?.stacked?.nav?.backgroundColor}
          onSelect={(colorKey) => updateLayoutStyle('stacked', 'nav', 'backgroundColor', colorKey)}
          label="Stacked Nav Background"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="headerNavStackedDivider"
            checked={content.styles?.stacked?.divider ?? true}
            onChange={(e) => updateLayoutMeta('stacked', 'divider', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="headerNavStackedDivider" className="text-sm">
            Show bottom divider
          </label>
        </div>
      </div>

      {!content.autoSync && (
        <div>
          <label className="block text-sm font-medium mb-2">Navigation Items</label>
          {(content.items || []).map((item, index) => (
            <div key={index} className="border p-3 rounded-md space-y-2 mb-2">
              <input
                type="text"
                value={item.label || ''}
                onChange={(e) => handleArrayChange(index, 'label', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Label"
              />
              <input
                type="text"
                value={item.link || ''}
                onChange={(e) => handleArrayChange(index, 'link', e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Link (e.g., /about)"
              />
              <button onClick={() => removeNavItem(index)} className="text-red-500 text-sm hover:text-red-700">
                Remove
              </button>
            </div>
          ))}
          <button onClick={addNavItem} className="text-blue-500 text-sm hover:text-blue-700">
            + Add Nav Item
          </button>
        </div>
      )}

      {content.autoSync && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            Navigation items are synchronized with your pages. Rename or add pages to update nav labels.
          </p>
        </div>
      )}
    </div>
  )
}
