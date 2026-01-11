'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { DraftSelector } from './DraftSelector'

interface WebsiteCreation {
  id: string
  name: string
  siteData: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface DraftSelectorWrapperProps {
  websiteId: string
  currentCreationId: string
  creations: WebsiteCreation[]
}

export function DraftSelectorWrapper({ 
  websiteId, 
  currentCreationId, 
  creations 
}: DraftSelectorWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCreationChange = (creationId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('draft', creationId)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <DraftSelector
      websiteId={websiteId}
      currentCreationId={currentCreationId}
      creations={creations}
      onCreationChange={handleCreationChange}
    />
  )
}
