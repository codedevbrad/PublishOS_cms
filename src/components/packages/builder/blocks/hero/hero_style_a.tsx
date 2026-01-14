'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

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

interface HeroStyleAProps {
  content: {
    title?: string
    subtitle?: string
    description?: string
    buttonText?: string
    backgroundImage?: string
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

export default function HeroStyleA({ content, themeColors }: HeroStyleAProps) {
  const {
    title = 'Welcome to Our Website',
    subtitle = 'Building amazing experiences together',
    description = 'We create exceptional digital experiences',
    buttonText = 'Get Started',
    backgroundImage = ''
  } = content

  const backgroundColor = resolveColor(content.backgroundColor, themeColors)
  const textColor = resolveColor(content.textColor, themeColors)

  return (
    <section className="relative w-full min-h-[90vh] flex items-center px-8 py-24 overflow-hidden" style={{ backgroundColor }}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover object-center opacity-80"
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/95" />

      {/* Content */}
      <div className="relative w-full space-y-8 flex items-center flex-col" style={{ color: textColor }}>
        <div className="text-center flex flex-col space-y-6 justify-center items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-none">
            {title}
            {subtitle && (
              <span className="block text-muted-foreground mt-3" style={{ color: textColor || undefined }}>
                {subtitle}
              </span>
            )}
          </h1>

          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl text-center" style={{ color: textColor || undefined }}>
              {description}
            </p>
          )}

          {buttonText && (
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-md shadow-md"
            >
              {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
