import { notFound, redirect } from "next/navigation"
import { getWebsite } from "@/src/domains/website/db"
import { auth } from "@/auth"
import { WebsiteBuilder } from "@/src/components/packages/builder/WebsiteBuilder"

interface WebsiteEditPageProps {
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>;
}

export default async function WebsiteEditPage({ params }: WebsiteEditPageProps) {
  const { orgid, domainid, websiteid } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const website = await getWebsite(websiteid);

  if (!website) {
    notFound();
  }

  // Verify the website belongs to the organisation
  if (website.domain.organisationId !== orgid) {
    notFound();
  }

  // Verify the website belongs to the domain
  if (website.domainId !== domainid) {
    notFound();
  }

  return (
      <WebsiteBuilder websiteId={websiteid} initialSiteData={website.siteData as any} />
  );
}