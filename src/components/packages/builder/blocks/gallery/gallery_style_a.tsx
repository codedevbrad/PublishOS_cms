'use client'
import React from 'react'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  [key: string]: string
}

interface GalleryStyleAProps {
  content: {
    title?: string
    description?: string
    images?: Array<{ id: string; src: string; alt: string; caption?: string }>
    backgroundColor?: string
    textColor?: string
  }
  themeColors?: ThemeColors
}

// Helper function to resolve color - if it's a key in themeColors, return the value, otherwise return as-is
const resolveColor = (color: string | undefined, themeColors?: ThemeColors): string | undefined => {
  if (!color) return undefined
  if (themeColors && color in themeColors) {
    return themeColors[color]
  }
  return color
}

export default function GalleryStyleA({ content, themeColors }: GalleryStyleAProps) {
  const {
    title = 'Our Gallery',
    description = 'A collection of our best work',
    images = []
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <div className="py-16 px-8" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto">
        {(title || description) && (
          <div className="text-center mb-12" style={{ color: textColor }}>
            {title && (
              <h2 className="text-4xl font-bold mb-4">{title}</h2>
            )}
            {description && (
              <p className="text-lg max-w-2xl mx-auto" style={{ color: textColor || undefined }}>
                {description}
              </p>
            )}
          </div>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-center px-4 font-medium">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={{ color: textColor || undefined }}>
            <p>No images in gallery. Add images to see them here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
