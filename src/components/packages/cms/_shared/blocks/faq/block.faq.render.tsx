'use client'
import React from 'react'
import { resolveColor } from '../../types'
import type { FAQBlockProps } from './block.types'

export default function FAQBlock({ content, themeColors }: FAQBlockProps) {
  const {
    title = 'Frequently Asked Questions',
    items = [
      { question: 'What services do you offer?', answer: 'We offer comprehensive digital solutions.' },
      { question: 'How can I get started?', answer: 'Simply contact us to discuss your needs.' }
    ]
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div className="py-16 px-8" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm" style={{ color: textColor || undefined }}>
              <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
              <p className="text-gray-600" style={{ color: textColor || undefined }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
