import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getWebsiteByHost } from "@/src/domains/website/db";
import { SiteRenderer } from "@/src/components/packages/builder/render/SiteRenderer";
import type { ContentBlock, GlobalBlock, ThemeColors } from "@/src/components/packages/builder/types";

export default async function Page() {
  const host = (await headers()).get("host");
  if (!host) return notFound();

  const data = await getWebsiteByHost(host);
  if (!data) return notFound();

  const homePage = data.pages.find((p) => p.slug === "home") ?? data.pages[0];
  if (!homePage) return notFound();

  const blocks = (homePage.blocksJson ?? []) as unknown as ContentBlock[];
  const globalBlocks = (data.globalBlocks ?? []) as unknown as GlobalBlock[];
  const themeColors = (data.themeColors ?? undefined) as ThemeColors | undefined;

  return (
    <SiteRenderer
      blocks={blocks}
      globalBlocks={globalBlocks}
      themeColors={themeColors}
    />
  );
}
