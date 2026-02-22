'use client'
import React from 'react'
import { Phone, MapPin } from 'lucide-react'
import { resolveColor } from '../../types'
import type { ContactBlockProps } from './block.types'

export default function ContactBlock({ content, themeColors }: ContactBlockProps) {
  const backgroundColor = resolveColor(content.backgroundColor, themeColors) || '#1f2937'
  const textColor = resolveColor(content.textColor, themeColors) || '#ffffff'

  return (
    <div className="py-16 px-8" style={{ backgroundColor, color: textColor }}>
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
}
