import { notFound, redirect } from "next/navigation"
import { getWebsite, getWebsiteCreations } from "@/src/domains/website/db"
import { auth } from "@/auth"
import { WebsiteBuilder } from "@/src/components/packages/builder/WebsiteBuilder"
import { DraftSelectorWrapper } from "./_components/DraftSelectorWrapper"

interface WebsiteEditPageProps {
  params: Promise<{ orgid: string; domainid: string; websiteid: string }>;
  searchParams: Promise<{ draft?: string }>;
}

export default async function WebsiteEditPage({ params, searchParams }: WebsiteEditPageProps) {
  const { orgid, domainid, websiteid } = await params;
  const { draft } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/build/auth/signin");
  }

  const website = await getWebsite(websiteid);

  if (!website) {
    notFound();
  }

  const websiteWithDomain = website as NonNullable<typeof website> & {
    domain: { organisationId: string };
    domainId: string;
  };

  if (websiteWithDomain.domain.organisationId !== orgid) {
    notFound();
  }

  if (websiteWithDomain.domainId !== domainid) {
    notFound();
  }

  // Get all website creations (drafts)
  const creations = await getWebsiteCreations(websiteid);

  if (!creations || creations.length === 0) {
    notFound();
  }

  // Determine which creation to show
  let activeCreation = creations.find((c) => c.isActive);
  if (draft) {
    const selectedCreation = creations.find((c) => c.id === draft);
    if (selectedCreation) {
      activeCreation = selectedCreation;
    }
  }
  
  if (!activeCreation) {
    activeCreation = creations[0];
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const initialSiteData: Parameters<typeof WebsiteBuilder>[0]["initialSiteData"] = {
    pages: activeCreation.pages.map((p) => ({
      id: p.id,
      name: p.title,
      slug: p.slug,
      blocks: (p.blocksJson as any[]) ?? [],
      isActive: false,
    })),
    globalBlocks: (activeCreation.globalBlocks as any[]) ?? [],
    themeColors: (activeCreation.themeColors as any) ?? undefined,
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (initialSiteData.pages.length > 0) {
    initialSiteData.pages[0].isActive = true;
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0">
        <DraftSelectorWrapper
          websiteId={websiteid}
          currentCreationId={activeCreation.id}
          creations={creations}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <WebsiteBuilder
          key={activeCreation.id}
          websiteId={websiteid}
          websiteCreationId={activeCreation.id}
          initialSiteData={initialSiteData}
        />
      </div>
    </div>
  );
}