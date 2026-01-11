'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Plus, Check, Trash2, Edit2, X, Save } from 'lucide-react'
import { 
  getWebsiteCreations, 
  createWebsiteCreation, 
  setActiveWebsiteCreation,
  deleteWebsiteCreation,
  updateWebsiteCreationName
} from '@/src/domains/website/db'
import { useRouter } from 'next/navigation'

interface WebsiteCreation {
  id: string
  name: string
  siteData: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface DraftSelectorProps {
  websiteId: string
  currentCreationId: string | null
  creations: WebsiteCreation[]
  onCreationChange: (creationId: string) => void
}

export function DraftSelector({ 
  websiteId, 
  currentCreationId, 
  creations, 
  onCreationChange 
}: DraftSelectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newDraftName, setNewDraftName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleCreateDraft = async () => {
    if (showCreateForm) {
      if (!newDraftName.trim()) {
        alert('Please enter a name for the draft')
        return
      }
      startTransition(async () => {
        const result = await createWebsiteCreation(websiteId, newDraftName.trim())
        if (result.success && result.data) {
          setShowCreateForm(false)
          setNewDraftName('')
          router.refresh()
          onCreationChange(result.data.id)
        } else {
          alert(result.error || 'Failed to create draft')
        }
      })
    } else {
      setShowCreateForm(true)
    }
  }

  const handleStartEdit = (creation: WebsiteCreation) => {
    setEditingId(creation.id)
    setEditingName(creation.name)
  }

  const handleSaveEdit = async (creationId: string) => {
    if (!editingName.trim()) {
      alert('Name cannot be empty')
      return
    }
    startTransition(async () => {
      const result = await updateWebsiteCreationName(creationId, editingName.trim())
      if (result.success) {
        setEditingId(null)
        setEditingName('')
        router.refresh()
      } else {
        alert(result.error || 'Failed to update name')
      }
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleSetActive = async (creationId: string) => {
    startTransition(async () => {
      const result = await setActiveWebsiteCreation(websiteId, creationId)
      if (result.success) {
        router.refresh()
        onCreationChange(creationId)
      } else {
        alert(result.error || 'Failed to set active draft')
      }
    })
  }

  const handleDelete = async (creationId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) {
      return
    }

    startTransition(async () => {
      const result = await deleteWebsiteCreation(creationId)
      if (result.success) {
        router.refresh()
        // If we deleted the current one, switch to the active one
        if (creationId === currentCreationId) {
          const active = creations.find(c => c.id !== creationId && c.isActive)
          if (active) {
            onCreationChange(active.id)
          } else {
            const remaining = creations.find(c => c.id !== creationId)
            if (remaining) {
              onCreationChange(remaining.id)
            }
          }
        }
      } else {
        alert(result.error || 'Failed to delete draft')
      }
    })
  }

  const currentCreation = creations.find(c => c.id === currentCreationId)

  return (
    <div className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Draft:
          </label>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <select
              value={currentCreationId || ''}
              onChange={(e) => onCreationChange(e.target.value)}
              disabled={isPending}
              className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creations.map((creation) => (
                <option key={creation.id} value={creation.id}>
                  {creation.isActive ? '✓ ' : ''}
                  {creation.name}
                  {creation.isActive ? ' (Active)' : ''}
                </option>
              ))}
            </select>
            {currentCreation && (
              <div className="flex items-center gap-1">
                {editingId === currentCreation.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(currentCreation.id)
                        } else if (e.key === 'Escape') {
                          handleCancelEdit()
                        }
                      }}
                      className="h-7 px-2 text-xs w-32"
                      autoFocus
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveEdit(currentCreation.id)}
                      disabled={isPending}
                      className="h-7 px-2 text-xs"
                      title="Save name"
                    >
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isPending}
                      className="h-7 px-2 text-xs"
                      title="Cancel"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(currentCreation)}
                      disabled={isPending}
                      className="h-7 px-2 text-xs"
                      title="Edit name"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    {!currentCreation.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetActive(currentCreation.id)}
                        disabled={isPending}
                        className="h-7 px-2 text-xs"
                        title="Set as active"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    {creations.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(currentCreation.id)}
                        disabled={isPending}
                        className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {showCreateForm ? (
          <div className="flex items-center gap-2">
            <Input
              value={newDraftName}
              onChange={(e) => setNewDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateDraft()
                } else if (e.key === 'Escape') {
                  setShowCreateForm(false)
                  setNewDraftName('')
                }
              }}
              placeholder="Draft name..."
              className="h-9 px-3 text-sm w-40"
              autoFocus
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateDraft}
              disabled={isPending || !newDraftName.trim()}
              className="whitespace-nowrap"
            >
              <Save className="w-4 h-4 mr-1" />
              Create
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCreateForm(false)
                setNewDraftName('')
              }}
              disabled={isPending}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateDraft}
            disabled={isPending}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Draft
          </Button>
        )}
      </div>
    </div>
  )
}
