'use client'
import React from 'react'
import { resolveColor } from '../../types'
import type { ExampleBlockProps } from './block.types'

export default function ExampleBlock({ content, themeColors }: ExampleBlockProps) {
  const {
    title = 'Example Block',
    description = 'This is an example block template.'
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div className="py-16 px-8" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  )
}
