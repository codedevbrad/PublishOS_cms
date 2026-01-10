import Link from "next/link"
import { EditTabs } from "./_components/edit-tabs"

interface WebsiteEditLayoutProps {
  children: React.ReactNode
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>
}

export default async function WebsiteEditLayout({ children, params }: WebsiteEditLayoutProps) {
  const { orgid, domainid, websiteid } = await params
  const basePath = `/org/${orgid}/domain/${domainid}/website/${websiteid}/edit`

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Navigation tabs */}
      <div className="shrink-0 border-b">
        <EditTabs basePath={basePath} />
      </div>

      {/* Content area fills remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}