import { redirect } from "next/navigation"

interface WebsiteEditPageProps {
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>
}

export default async function WebsiteEditPage({ params }: WebsiteEditPageProps) {
  const { orgid, domainid, websiteid } = await params
  
  // Redirect to design page by default
  redirect(`/${orgid}/domain/${domainid}/website/${websiteid}/edit/design`)
}