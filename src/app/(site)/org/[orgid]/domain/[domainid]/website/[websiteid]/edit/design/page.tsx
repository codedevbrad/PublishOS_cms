import { notFound, redirect } from "next/navigation"
import { getWebsite, getWebsiteCreations } from "@/src/domains/website/db"
import { auth } from "@/auth"
import { WebsiteBuilder } from "@/src/components/packages/builder/WebsiteBuilder"
import { DraftSelectorWrapper } from "./_components/DraftSelectorWrapper"
import type { Prisma } from "@prisma/client"

interface WebsiteEditPageProps {
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>;
  searchParams: Promise<{ draft?: string }>;
}

export default async function WebsiteEditPage({ params, searchParams }: WebsiteEditPageProps) {
  const { orgid, domainid, websiteid } = await params;
  const { draft } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const website = await getWebsite(websiteid);

  if (!website) {
    notFound();
  }

  // Type assertion for website with domain relation
  const websiteWithDomain = website as Prisma.WebsiteGetPayload<{
    include: {
      domain: {
        include: {
          organisation: true;
        };
      };
      sites: true;
    };
  }>;

  // Verify the website belongs to the organisation
  if (websiteWithDomain.domain.organisationId !== orgid) {
    notFound();
  }

  // Verify the website belongs to the domain
  if (websiteWithDomain.domainId !== domainid) {
    notFound();
  }

  // Get all website creations (drafts)
  const creations = await getWebsiteCreations(websiteid);

  if (!creations || creations.length === 0) {
    notFound();
  }

  // Type assertion to include name field (Prisma returns all fields but TypeScript may not infer it)
  const creationsWithName = creations as unknown as Array<{
    id: string;
    name: string;
    siteData: unknown;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;

  // Determine which creation to show
  let activeCreation = creationsWithName.find((c) => c.isActive);
  if (draft) {
    const selectedCreation = creationsWithName.find((c) => c.id === draft);
    if (selectedCreation) {
      activeCreation = selectedCreation;
    }
  }
  
  // Fallback to first creation if no active one
  if (!activeCreation) {
    activeCreation = creationsWithName[0];
  }

  return (
    <div className="flex flex-col h-screen">
      <DraftSelectorWrapper 
        websiteId={websiteid}
        currentCreationId={activeCreation.id}
        creations={creationsWithName}
      />
      <div className="flex-1 overflow-hidden">
        <WebsiteBuilder 
          key={activeCreation.id}
          websiteId={websiteid}
          websiteCreationId={activeCreation.id}
          initialSiteData={activeCreation.siteData as unknown as Parameters<typeof WebsiteBuilder>[0]['initialSiteData']} 
        />
      </div>
    </div>
  );
}