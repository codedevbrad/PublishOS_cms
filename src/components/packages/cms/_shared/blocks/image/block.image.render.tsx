'use client'
import React from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { resolveColor } from '../../types'
import type { ImageBlockProps } from './block.types'

export default function ImageBlock({ content, themeColors }: ImageBlockProps) {
  const {
    src = '',
    alt = 'Image description',
    caption = ''
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)

  return (
    <div className="py-8 px-8" style={{ backgroundColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
          {src ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="max-h-full max-w-full object-cover rounded-lg" />
            </>
          ) : (
            <ImageIcon className="w-16 h-16 text-gray-400" />
          )}
        </div>
        {caption && <p className="text-gray-600 italic">{caption}</p>}
      </div>
    </div>
  )
}
