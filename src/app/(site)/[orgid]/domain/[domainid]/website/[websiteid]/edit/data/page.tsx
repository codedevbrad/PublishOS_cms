import { notFound, redirect } from "next/navigation"
import { getWebsite } from "@/src/domains/website/db"
import { auth } from "@/auth"

interface DataPageProps {
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>
}

export default async function DataPage({ params }: DataPageProps) {
  const { orgid, domainid, websiteid } = await params
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const website = await getWebsite(websiteid)

  if (!website) {
    notFound()
  }

  // Verify the website belongs to the organisation
  if (website.domain.organisationId !== orgid) {
    notFound()
  }

  // Verify the website belongs to the domain
  if (website.domainId !== domainid) {
    notFound()
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Data</h2>
        <div className="bg-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Data management coming soon...</p>
        </div>
      </div>
    </div>
  )
}
