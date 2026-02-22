'use client'

import { createContext, useContext } from 'react'

const SiteModeContext = createContext(false)

export const SiteModeProvider = SiteModeContext.Provider

export function useIsSiteMode() {
  return useContext(SiteModeContext)
}
