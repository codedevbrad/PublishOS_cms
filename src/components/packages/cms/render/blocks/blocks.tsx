'use client'
import React from 'react'
import { Phone, MapPin, Users } from 'lucide-react'
import dynamic from 'next/dynamic'

const HeroBlock = dynamic(() => import('./hero/HeroBlock'))
const QuoteBlock = dynamic(() => import('./quote/QuoteBlock'))
const AboutBlock = dynamic(() => import('./about/AboutBlock'))
const ImageBlock = dynamic(() => import('./image/ImageBlock'))
const FAQBlock = dynamic(() => import('./faq/FAQBlock'))
const GalleryBlock = dynamic(() => import('./gallery/GalleryBlock'))
const ServicesListBlock = dynamic(() => import('./services/ServicesListBlock'))

import { HeaderBlock } from '../globalblocks/header/headerBlock'
import { NavigationBlock } from '../globalblocks/navigation/navigationBlock'

import type { ContentBlock, GlobalBlock, ThemeColors } from '../types'

export const BlockRenderer: React.FC<{
  block: ContentBlock | GlobalBlock
  themeColors?: ThemeColors
}> = ({ block, themeColors }) => {
  const { type, content } = block

  const resolveColor = (color: string | undefined): string | undefined => {
    if (!color) return undefined
    if (themeColors && color in themeColors) {
      return themeColors[color]
    }
    return color
  }

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
      return (
        <div className="py-16 px-8" style={{ backgroundColor: resolveColor(content.backgroundColor) || '#1f2937', color: resolveColor(content.textColor) || '#ffffff' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">{content.title}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>{content.phone}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>@</span>
                <span>{content.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{content.address}</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'team':
      return (
        <div className="py-16 px-8" style={{ backgroundColor: resolveColor(content.backgroundColor), color: resolveColor(content.textColor) }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">{content.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {content.members.map((member: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {member.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Users className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-blue-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    default:
      return <div className="p-4 bg-gray-100 text-center">Unknown block type: {type}</div>
  }
}
