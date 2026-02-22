'use client'

import React from 'react'
import { BlockRenderer } from '../blocks/blocks'
import { SiteModeProvider } from './SiteModeContext'
import type { ContentBlock, GlobalBlock, ThemeColors } from '../types'

interface SiteRendererProps {
  blocks?: ContentBlock[]
  globalBlocks: GlobalBlock[]
  themeColors?: ThemeColors
  children?: React.ReactNode
}

export const SiteRenderer: React.FC<SiteRendererProps> = ({
  blocks,
  globalBlocks,
  themeColors,
  children,
}) => {
  const activeHeader = globalBlocks.find((b) => b.type === 'header' && b.isActive)
  const activeNav = globalBlocks.find((b) => b.type === 'nav' && b.isActive)

  return (
    <SiteModeProvider value={true}>
      <div>
        {activeHeader && (
          <BlockRenderer block={activeHeader} isEditing={false} onUpdate={() => {}} themeColors={themeColors} />
        )}
        {activeNav && (
          <BlockRenderer block={activeNav} isEditing={false} onUpdate={() => {}} themeColors={themeColors} />
        )}
        {children
          ? children
          : blocks?.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                isEditing={false}
                onUpdate={() => {}}
                themeColors={themeColors}
              />
            ))
        }
      </div>
    </SiteModeProvider>
  )
}
