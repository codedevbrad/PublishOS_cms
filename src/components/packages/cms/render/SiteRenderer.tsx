'use client'

import React from 'react'
import { BlockRenderer } from './blocks/blocks'
import { SiteModeProvider } from './SiteModeContext'
import type { ContentBlock, GlobalBlock, ThemeColors } from './types'

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
  const activeHeaderNav = globalBlocks.find((b) => b.type === 'headerNav' && b.isActive)
  const activeHeader = globalBlocks.find((b) => b.type === 'header' && b.isActive)
  const activeNav = globalBlocks.find((b) => b.type === 'nav' && b.isActive)
  const inferredLayout = activeNav?.content?.layout === 'inline' ? 'inline' : 'stacked'

  // Backward compatibility: if layout is set on separate nav/header content,
  // synthesize a headerNav render model so inline/stacked works in site render.
  const synthesizedHeaderNav = !activeHeaderNav && activeHeader && activeNav
    ? ({
        id: 'synth-header-nav',
        type: 'headerNav',
        isActive: true,
        content: {
          title: activeHeader.content?.title,
          layout: inferredLayout,
          items: activeNav.content?.items || [],
          styles: {
            header: {
              backgroundColor: activeHeader.content?.backgroundColor,
              textColor: activeHeader.content?.textColor,
              height: activeHeader.content?.height,
            },
            nav: {
              backgroundColor: activeNav.content?.backgroundColor,
              textColor: activeNav.content?.textColor,
              hoverColor: activeNav.content?.hoverColor,
              alignment: activeNav.content?.alignment,
            },
            stacked: {
              divider: true,
            },
            inline: {
              gap: 'gap-8',
            },
          },
        },
      } as GlobalBlock)
    : null

  return (
    <SiteModeProvider value={true}>
      <div>
        {activeHeaderNav ? (
          <BlockRenderer block={activeHeaderNav} themeColors={themeColors} />
        ) : synthesizedHeaderNav ? (
          <BlockRenderer block={synthesizedHeaderNav} themeColors={themeColors} />
        ) : (
          <>
            {activeHeader && (
              <BlockRenderer block={activeHeader} themeColors={themeColors} />
            )}
            {activeNav && (
              <BlockRenderer block={activeNav} themeColors={themeColors} />
            )}
          </>
        )}
        {children
          ? children
          : blocks?.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                themeColors={themeColors}
              />
            ))
        }
      </div>
    </SiteModeProvider>
  )
}
