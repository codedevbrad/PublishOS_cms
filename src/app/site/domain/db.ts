import { unstable_cache } from "next/cache";
import { prisma } from "@/src/lib/db";
import { normalizeHostOrDomain } from "@/src/lib/utils";

async function getWebsiteByHostUncached(normalizedHost: string) {
  const domainMatch = await prisma.domainName.findUnique({
    where: { name: normalizedHost },
    include: {
      website: {
        include: {
          sites: {
            where: { isActive: true },
            take: 1,
            include: { pages: true },
          },
          domainNames: true,
        },
      },
    },
  });

  const website = domainMatch?.website;
  if (!website || !website.isActive) return null;

  const activeCreation = website.sites[0];
  if (!activeCreation) return null;

  return {
    website,
    creation: activeCreation,
    pages: activeCreation.pages,
    globalBlocks: activeCreation.globalBlocks,
    themeColors: activeCreation.themeColors,
  };
}

export async function getWebsiteByHost(host: string) {
  const normalizedHost = normalizeHostOrDomain(host);
  if (!normalizedHost) return null;

  return unstable_cache(
    async () => getWebsiteByHostUncached(normalizedHost),
    ["website-by-host", normalizedHost],
    { revalidate: 300, tags: [`website-host:${normalizedHost}`] } // 5 min
  )();
}