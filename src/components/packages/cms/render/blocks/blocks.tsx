'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const HeroBlock = dynamic(() => import('../../_shared/blocks/hero/block.hero.render'))
const QuoteBlock = dynamic(() => import('../../_shared/blocks/quote/block.quote.render'))
const AboutBlock = dynamic(() => import('../../_shared/blocks/about/block.about.render'))
const ImageBlock = dynamic(() => import('../../_shared/blocks/image/block.image.render'))
const FAQBlock = dynamic(() => import('../../_shared/blocks/faq/block.faq.render'))
const GalleryBlock = dynamic(() => import('../../_shared/blocks/gallery/block.gallery.render'))
const ServicesListBlock = dynamic(() => import('../../_shared/blocks/services/block.services.render'))
const ContactBlock = dynamic(() => import('../../_shared/blocks/contact/block.contact.render'))
const TeamBlock = dynamic(() => import('../../_shared/blocks/team/block.team.render'))

import { HeaderBlock } from '../globalblocks/header/headerBlock'
import { NavigationBlock } from '../globalblocks/navigation/navigationBlock'

import type { ContentBlock, GlobalBlock, ThemeColors } from '../types'

export const BlockRenderer: React.FC<{
  block: ContentBlock | GlobalBlock
  themeColors?: ThemeColors
}> = ({ block, themeColors }) => {
  const { type, content } = block

  switch (type) {
    case 'header':
      return <HeaderBlock content={content} themeColors={themeColors} />

    case 'nav':
      return <NavigationBlock content={content} themeColors={themeColors} />

    case 'hero':
      return <HeroBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />

    case 'quote':
      return <QuoteBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />

    case 'gallery':
      return <GalleryBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />

    case 'services':
      return <ServicesListBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />

    case 'about':
      return <AboutBlock content={content} themeColors={themeColors} />

    case 'image':
      return <ImageBlock content={content} themeColors={themeColors} />

    case 'faq':
      return <FAQBlock content={content} themeColors={themeColors} />

    case 'contact':
      return <ContactBlock content={content} themeColors={themeColors} />

    case 'team':
      return <TeamBlock content={content} themeColors={themeColors} />

    default:
      return <div className="p-4 bg-gray-100 text-center">Unknown block type: {type}</div>
  }
}
