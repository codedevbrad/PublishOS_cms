'use client'
import React, { useState } from 'react'
import { Trash2, GripVertical, Layout } from 'lucide-react'
import { BlockRenderer } from '../blocks/blocks'
import { BlockEditorDrawer } from '../_components/BlockEditorDrawer'
import { GlobalEditorDrawer } from '../_components/GlobalEditorDrawer'
import type { GlobalBlock, Page, ThemeColors } from '../types'

interface PageRendererProps {
  activePage: Page | undefined
  activeHeaderNav: GlobalBlock | undefined
  activeHeader: GlobalBlock | undefined
  activeNav: GlobalBlock | undefined
  isPreviewMode: boolean
  draggedBlockId: string | null
  dragOverIndex: number | null
  openBlockEditorId: string | null
  openGlobalEditorId: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateBlock: (blockId: string, content: any) => void
  onDeleteBlock: (blockId: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateGlobalBlock: (blockId: string, content: any) => void
  onDeleteGlobalBlock: (blockId: string) => void
  onSetOpenBlockEditorId: (id: string | null) => void
  onSetOpenGlobalEditorId: (id: string | null) => void
  onDragStart: (e: React.DragEvent, type: string, blockId?: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, index?: number) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetIndex: number) => void
  themeColors?: ThemeColors
  previewWidth: number
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  activePage,
  activeHeaderNav,
  activeHeader,
  activeNav,
  isPreviewMode,
  draggedBlockId,
  dragOverIndex,
  openBlockEditorId,
  openGlobalEditorId,
  onUpdateBlock,
  onDeleteBlock,
  onUpdateGlobalBlock,
  onDeleteGlobalBlock,
  onSetOpenBlockEditorId,
  onSetOpenGlobalEditorId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  themeColors,
  previewWidth,
}) => {

  const [ isEditingHeader, setIsEditingHeader ] = useState(false)

  if (!activePage) return null

  return (
    <div className="relative">
      {/* Mixed Global Header + Navigation */}
      {activeHeaderNav ? (
        <div className="relative group">
          {!isPreviewMode && (
            <div className="absolute top-2 left-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white rounded shadow-lg border flex">
                <GlobalEditorDrawer
                  block={activeHeaderNav}
                  title="Edit Header + Navigation"
                  isOpen={openGlobalEditorId === activeHeaderNav.id}
                  onOpenChange={(open) => onSetOpenGlobalEditorId(open ? activeHeaderNav.id : null)}
                  onUpdate={(content) => onUpdateGlobalBlock(activeHeaderNav.id, content)}
                  onClose={() => onSetOpenGlobalEditorId(null)}
                  themeColors={themeColors}
                />
                <button onClick={() => onDeleteGlobalBlock(activeHeaderNav.id)} className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <BlockRenderer block={activeHeaderNav} isEditing={false} onUpdate={() => {}} themeColors={themeColors} previewWidth={previewWidth} />
        </div>
      ) : (
        <>
          {/* Separate Global Header */}
          {activeHeader && (
            <div className="relative group">
              {!isPreviewMode && (
                <div className="absolute top-2 left-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded shadow-lg border flex">
                    <GlobalEditorDrawer
                      block={activeHeader}
                      title="Edit Header"
                      isOpen={isEditingHeader}
                      onOpenChange={(open) => setIsEditingHeader(open)}
                      onUpdate={(content) => onUpdateGlobalBlock(activeHeader.id, content)}
                      onClose={() => setIsEditingHeader(false)}
                      themeColors={themeColors}
                    />

                    <button onClick={() => onDeleteGlobalBlock(activeHeader.id)} className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <BlockRenderer block={activeHeader} isEditing={false} onUpdate={() => {}} themeColors={themeColors} previewWidth={previewWidth} />
            </div>
          )}

          {/* Separate Global Navigation */}
          {activeNav && (
            <div className="relative group">
              {!isPreviewMode && (
                <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded shadow-lg border flex">
                    <GlobalEditorDrawer
                      block={activeNav}
                      title="Edit Navigation"
                      isOpen={openGlobalEditorId === activeNav.id}
                      onOpenChange={(open) => onSetOpenGlobalEditorId(open ? activeNav.id : null)}
                      onUpdate={(content) => onUpdateGlobalBlock(activeNav.id, content)}
                      onClose={() => onSetOpenGlobalEditorId(null)}
                      themeColors={themeColors}
                    />

                    <button onClick={() => onDeleteGlobalBlock(activeNav.id)} className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <BlockRenderer block={activeNav} isEditing={false} onUpdate={() => {}} themeColors={themeColors} previewWidth={previewWidth} />
            </div>
          )}
        </>
      )}

      {/* Page Content */}
      {activePage.blocks.length === 0 ? (
        <div
          className={`flex items-center justify-center text-gray-500 border-2 border-dashed rounded-lg m-8 transition-colors ${
            dragOverIndex === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          style={{ minHeight: '300px' }}
          onDragOver={(e) => onDragOver(e, 0)}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, 0)}
        >
          <div className="text-center pointer-events-none">
            <Layout className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Start building your page</p>
            <p className="text-sm">Drag content blocks from the sidebar or click to add</p>
          </div>
        </div>
      ) : (
        <>
          {/* Drop zone at the top */}
          <div
            className={`h-8 transition-all mx-4 ${
              dragOverIndex === 0 ? 'bg-blue-100 border-t-4 border-blue-500 border-dashed' : ''
            }`}
            onDragOver={(e) => onDragOver(e, 0)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, 0)}
          />

          {activePage.blocks.map((block, index) => (
            <div key={block.id}>
              <div className={`relative group ${draggedBlockId === block.id ? 'opacity-50' : ''}`}>
                {!isPreviewMode && (
                  <div className="absolute top-2 left-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white rounded shadow-lg border flex">
                      {/* Drag handle */}
                      <button
                        draggable
                        onDragStart={(e) => onDragStart(e, block.type, block.id)}
                        onDragEnd={onDragEnd}
                        className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>

                      {/* EDIT (Drawer) */}
                      <BlockEditorDrawer
                        block={block}
                        isOpen={openBlockEditorId === block.id}
                        onOpenChange={(open) => onSetOpenBlockEditorId(open ? block.id : null)}
                        onUpdate={(content) => onUpdateBlock(block.id, content)}
                        onClose={() => onSetOpenBlockEditorId(null)}
                        themeColors={themeColors}
                      />

                      {/* DELETE */}
                      <button onClick={() => onDeleteBlock(block.id)} className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Canvas shows non-editing render */}
                <BlockRenderer
                  block={block}
                  isEditing={false}
                  onUpdate={() => {}}
                  themeColors={themeColors}
                  previewWidth={previewWidth}
                />
              </div>

              {/* Drop zone between blocks */}
              <div
                className={`h-8 transition-all mx-4 ${
                  dragOverIndex === index + 1 ? 'bg-blue-100 border-t-4 border-blue-500 border-dashed' : ''
                }`}
                onDragOver={(e) => onDragOver(e, index + 1)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, index + 1)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
