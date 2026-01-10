import { notFound, redirect } from "next/navigation"
import { getWebsite, getPostHogConfig } from "@/src/domains/website/db"
import { auth } from "@/auth"
import { PostHogConfigForm } from "@/src/domains/website/_components/posthog-config-form"
import { AnalyticsDisplay } from "@/src/domains/website/_components/analytics-display"

interface AnalyticsPageProps {
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { orgid, domainid, websiteid } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const website = await getWebsite(websiteid)

  if (!website) notFound()
  if (website.domain.organisationId !== orgid) notFound()
  if (website.domainId !== domainid) notFound()

  const postHogConfig = await getPostHogConfig(websiteid)

  return (
    <div className="flex w-full flex-col h-full min-h-0">
      <div className="flex flex-col flex-1 min-h-0  mx-auto w-full">
        {/* Page header */}
        <div className="shrink-0 mb-6">
          <h2 className="text-2xl font-bold">Analytics</h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-auto">
          {!postHogConfig ? (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Configure your PostHog analytics to view website statistics and insights.
                </p>
              </div>

              <PostHogConfigForm websiteId={websiteid} />
            </div>
          ) : (
            <div className="space-y-6 pr-4">
              <PostHogConfigForm
                websiteId={websiteid}
                defaultCollapsed={true}
              />
              <AnalyticsDisplay websiteId={websiteid} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
