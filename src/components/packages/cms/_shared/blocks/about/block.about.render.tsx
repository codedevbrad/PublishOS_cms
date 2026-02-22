'use client'
import React from 'react'
import { resolveColor } from '../../types'
import type { AboutBlockProps } from './block.types'

export default function AboutBlock({ content, themeColors }: AboutBlockProps) {
  const {
    title = 'About Us',
    content: aboutContent = 'We are passionate about creating exceptional digital experiences that help businesses grow and succeed.',
    image = ''
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div className="py-16 px-8" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
        <p className="text-lg text-center leading-relaxed" style={{ color: textColor || undefined }}>{aboutContent}</p>
        {image && (
          <div className="mt-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="max-w-full h-auto rounded-lg" />
          </div>
        )}
      </div>
    </div>
  )
}
