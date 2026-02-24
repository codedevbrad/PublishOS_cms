import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getWebsiteByHost } from "@/src/domains/website/db";
import { SiteRenderer } from "@/src/components/packages/cms/render/SiteRenderer";
import { NotFoundContent } from "../_components/NotFoundContent";
import type { ContentBlock, GlobalBlock, ThemeColors } from "@/src/components/packages/cms/render/types";

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host");
  if (!host) return notFound();

  const data = await getWebsiteByHost(host);
  if (!data) return notFound();

  const globalBlocks = (data.globalBlocks ?? []) as unknown as GlobalBlock[];
  const themeColors = (data.themeColors ?? undefined) as ThemeColors | undefined;

  const pageSlug = slug.join("/");
  const page = data.pages.find((p) => p.slug === pageSlug);

  if (!page) {
    return (
      <SiteRenderer globalBlocks={globalBlocks} themeColors={themeColors}>
        <NotFoundContent />
      </SiteRenderer>
    );
  }

  const blocks = (page.blocksJson ?? []) as unknown as ContentBlock[];

  return (
    <SiteRenderer
      blocks={blocks}
      globalBlocks={globalBlocks}
      themeColors={themeColors}
    />
  );
}
