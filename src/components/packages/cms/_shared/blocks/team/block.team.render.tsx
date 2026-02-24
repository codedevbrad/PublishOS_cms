'use client'
import React from 'react'
import { Users } from 'lucide-react'
import { resolveColor } from '../../types'
import type { TeamBlockProps } from './block.types'

export default function TeamBlock({ content, themeColors }: TeamBlockProps) {
  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div className="py-16 px-8" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">{content.title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {content.members?.map((member: any, index: number) => (
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
}
