'use client'
import React, { useState } from 'react'
import { Plus, Trash2, Edit2, ChevronDown, ChevronUp, Palette } from 'lucide-react'
import {
  BLOCK_TYPES,
} from '../../blocks/blocks'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from '@/src/components/ui/drawer'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { ThemeEditor } from './ThemeEditor'
import { Save, X } from 'lucide-react'
import type { GlobalBlock, Page, ThemeColors } from '../../types'

interface SidebarProps {
  globalBlocks: GlobalBlock[]
  pages: Page[]
  activePageId: string
  globalHeaderNavLayout: 'stacked' | 'inline'
  globalHeaderNavResponsiveBreakpoint: 'sm' | 'md' | 'lg' | 'xl'
  newPageName: string
  draggedBlockType: string | null
  openGlobalEditorId: string | null
  themeColors: ThemeColors
  onAddGlobalBlock: (blockType: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdateGlobalBlock: (blockId: string, content: any) => void
  onDeleteGlobalBlock: (blockId: string) => void
  onSetActivePageId: (pageId: string) => void
  onDeletePage: (pageId: string) => void
  onSetNewPageName: (name: string) => void
  onCreateNewPage: () => void
  onHeaderNavLayoutChange: (layout: 'stacked' | 'inline') => void
  onHeaderNavResponsiveBreakpointChange: (breakpoint: 'sm' | 'md' | 'lg' | 'xl') => void
  onSetOpenGlobalEditorId: (id: string | null) => void
  onDragStart: (e: React.DragEvent, type: string, blockId?: string) => void
  onDragEnd: () => void
  onAddBlockFromSidebar: (blockType: string) => void
  onUpdateThemeColors: (colors: ThemeColors) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  globalBlocks,
  pages,
  activePageId,
  globalHeaderNavLayout,
  globalHeaderNavResponsiveBreakpoint,
  newPageName,
  draggedBlockType,
  themeColors,
  onSetActivePageId,
  onDeletePage,
  onSetNewPageName,
  onCreateNewPage,
  onHeaderNavLayoutChange,
  onHeaderNavResponsiveBreakpointChange,
  onDragStart,
  onDragEnd,
  onAddBlockFromSidebar,
  onUpdateThemeColors,
}) => {
  const [isPagesExpanded, setIsPagesExpanded] = useState(true)
  const [isContentBlocksExpanded, setIsContentBlocksExpanded] = useState(true)
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false)

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col min-h-0 overflow-y-auto">
      {/* Theme Colors Section */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Theme Colors</h3>
          <Drawer open={isThemeEditorOpen} onOpenChange={setIsThemeEditorOpen} direction="bottom">
            <DrawerTrigger asChild>
              <button
                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
                  isThemeEditorOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Edit theme colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="w-full h-[500px]">
              <DrawerHeader className="border-b">
                <DrawerTitle>Edit Theme Colors</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 overflow-y-auto">
                <ThemeEditor themeColors={themeColors} onUpdate={onUpdateThemeColors} />
              </div>
              <DrawerFooter className="border-t">
                <div className="flex items-center gap-2 justify-end">
                  <DrawerClose asChild>
                    <button
                      onClick={() => setIsThemeEditorOpen(false)}
                      className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                      Close
                    </button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <button
                      onClick={() => setIsThemeEditorOpen(false)}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 rounded-lg border bg-white">
            <div className="p-1.5 rounded bg-gradient-to-br from-blue-500 to-purple-500">
              <Palette className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">Color Palette</span>
              <div className="flex items-center space-x-1 mt-1">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: themeColors.primary }}
                  title="Primary"
                />
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: themeColors.secondary }}
                  title="Secondary"
                />
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: themeColors.accent }}
                  title="Accent"
                />
                <span className="text-xs text-gray-500 ml-1">+{Object.keys(themeColors).length - 3} more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header / Nav Layout Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Header / Nav Layout</h3>
        <Select
          value={globalHeaderNavLayout}
          onValueChange={(value) => onHeaderNavLayoutChange(value as 'stacked' | 'inline')}
        >
          <SelectTrigger className="w-full bg-white" aria-label="Select header and navigation layout">
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stacked">Stacked</SelectItem>
            <SelectItem value="inline">Inline</SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Responsive Breakpoint</label>
          <Select
            value={globalHeaderNavResponsiveBreakpoint}
            onValueChange={(value) => onHeaderNavResponsiveBreakpointChange(value as 'sm' | 'md' | 'lg' | 'xl')}
          >
            <SelectTrigger className="w-full bg-white" aria-label="Select responsive breakpoint">
              <SelectValue placeholder="Select breakpoint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">sm (640px)</SelectItem>
              <SelectItem value="md">md (768px)</SelectItem>
              <SelectItem value="lg">lg (1024px)</SelectItem>
              <SelectItem value="xl">xl (1280px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pages Section */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => setIsPagesExpanded(!isPagesExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-sm font-semibold text-gray-700">Pages</h3>
          {isPagesExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isPagesExpanded && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {pages.map((page) => {
                const navBlock = globalBlocks.find((b) => b.type === 'nav' && b.isActive)
                const headerNavBlock = globalBlocks.find((b) => b.type === 'headerNav' && b.isActive)
                const isInNav =
                  navBlock?.content?.autoSync ||
                  navBlock?.content?.items?.some((item: { pageId?: string | null }) => item.pageId === page.id) ||
                  headerNavBlock?.content?.autoSync ||
                  headerNavBlock?.content?.items?.some((item: { pageId?: string | null }) => item.pageId === page.id)

                return (
                  <div key={page.id} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <button
                        onClick={() => onSetActivePageId(page.id)}
                        className={`flex-1 text-left px-3 py-2 rounded text-sm ${
                          page.id === activePageId ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page.name}
                      </button>
                      {isInNav && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">in nav</span>}
                    </div>
                    {pages.length > 1 && (
                      <button onClick={() => onDeletePage(page.id)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex space-x-2">
              <input
                type="text"
                value={newPageName}
                onChange={(e) => onSetNewPageName(e.target.value)}
                placeholder="Page name"
                className="flex-1 px-2 py-1 text-sm border rounded"
                onKeyDown={(e) => e.key === 'Enter' && onCreateNewPage()}
              />
              <button onClick={onCreateNewPage} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {(globalBlocks.find((b) => b.type === 'nav' && b.isActive)?.content?.autoSync ||
              globalBlocks.find((b) => b.type === 'headerNav' && b.isActive)?.content?.autoSync) && (
              <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Navigation auto-synced with pages</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Block Types */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setIsContentBlocksExpanded(!isContentBlocksExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          <h3 className="text-sm font-semibold text-gray-700">Content Blocks</h3>
          {isContentBlocksExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {isContentBlocksExpanded && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {BLOCK_TYPES.map((blockType) => (
                <div
                  key={blockType.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, blockType.type)}
                  onDragEnd={onDragEnd}
                  onClick={() => onAddBlockFromSidebar(blockType.type)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing hover:shadow-md transition-all bg-white ${
                    draggedBlockType === blockType.type ? 'opacity-50' : ''
                  }`}
                >
                  <div className={`p-2 rounded ${blockType.color}`}>
                    <blockType.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{blockType.name}</span>
                  {blockType.hasVariants && (
                    <span className="ml-auto text-xs text-gray-400">Multiple styles</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
