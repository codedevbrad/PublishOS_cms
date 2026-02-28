"use server";

import { prisma } from "@/src/lib/db";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import {
  addDomainToVercelProject,
  getVercelProjectDomains,
  removeDomainFromVercelProject,
  verifyVercelProjectDomainConfiguration,
} from "@/src/services/vercel/domains";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const VERCEL_DOMAIN_CONFIG_CACHE_REVALIDATE_SECONDS = 60 * 3;
const vercelDomainFreshMarker = new Map<string, number>();

function isLocalDevelopmentHost(domain: string) {
  const normalized = normalizeHostOrDomain(domain);
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "127.0.0.1" ||
    normalized === "::1"
  );
}

async function syncDomainsToVercel(domains: string[]): Promise<ActionResult> {
  try {
    for (const domain of domains) {
      if (isLocalDevelopmentHost(domain)) {
        console.log("[website:syncDomainsToVercel] skipping local domain", { domain });
        continue;
      }
      const result = await addDomainToVercelProject(domain);
      if (!result.verified) {
        return {
          success: false,
          error: `Domain ${domain} added to Vercel but is not verified yet. Configure DNS and retry.`,
        };
      }
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to add domain to Vercel",
    };
  }
}

async function removeDomainsFromVercel(domains: string[]): Promise<ActionResult> {
  try {
    for (const domain of domains) {
      if (isLocalDevelopmentHost(domain)) {
        console.log("[website:removeDomainsFromVercel] skipping local domain", { domain });
        continue;
      }
      await removeDomainFromVercelProject(domain);
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove domain from Vercel",
    };
  }
}


function getVercelDomainConfigTag(domain: string) {
  return `vercel-domain-config:${normalizeHostOrDomain(domain)}`;
}

function revalidateVercelDomainConfigCache(domains: string[]) {
  const uniqueDomains = Array.from(
    new Set(domains.map((domain) => normalizeHostOrDomain(domain)).filter(Boolean))
  );

  for (const domain of uniqueDomains) {
    const tag = getVercelDomainConfigTag(domain);
    revalidateTag(tag, "max");
    console.log("[website:vercel-config-cache] revalidated", {
      domain,
      tag,
    });
  }
}

async function getCachedVercelDomainConfiguration(domain: string): Promise<boolean> {
  const normalizedDomain = normalizeHostOrDomain(domain);
  if (!normalizedDomain) return false;
  if (isLocalDevelopmentHost(normalizedDomain)) return true;

  const previousMarker = vercelDomainFreshMarker.get(normalizedDomain) ?? null;
  const verifyCached = unstable_cache(
    async () => {
      const fetchedAt = Date.now();
      vercelDomainFreshMarker.set(normalizedDomain, fetchedAt);
      const configured = await verifyVercelProjectDomainConfiguration(normalizedDomain);
      console.log("[website:vercel-config-cache] source=fresh", {
        domain: normalizedDomain,
        configured,
        fetchedAt,
      });
      return configured;
    },
    ["vercel-domain-config", normalizedDomain],
    {
      revalidate: VERCEL_DOMAIN_CONFIG_CACHE_REVALIDATE_SECONDS,
      tags: [getVercelDomainConfigTag(normalizedDomain)],
    }
  );

  const configured = await verifyCached();
  const latestMarker = vercelDomainFreshMarker.get(normalizedDomain) ?? null;
  const source = latestMarker !== null && latestMarker !== previousMarker ? "fresh" : "cached";

  console.log("[website:vercel-config-cache] source", {
    source,
    domain: normalizedDomain,
    configured,
    revalidateSeconds: VERCEL_DOMAIN_CONFIG_CACHE_REVALIDATE_SECONDS,
  });

  return configured;
}

async function getVercelDomainVerificationMap(matchedDomains: string[]) {
  try {
    
    const projectDomains = await getVercelProjectDomains();
    console.log("[website:getVercelDomainVerificationMap] projectDomains", projectDomains);
    const projectDomainSet = new Set(
      projectDomains.map((domain) => normalizeHostOrDomain(domain.name))
    );
    const uniqueMatchedDomains = Array.from(
      new Set(matchedDomains.map((domain) => normalizeHostOrDomain(domain)).filter(Boolean))
    );
    console.log("[website:getVercelDomainVerificationMap] matchedDomains", {
      input: matchedDomains,
      normalizedUnique: uniqueMatchedDomains,
    });
    const verificationMap = new Map<string, boolean>();
    for (const domain of uniqueMatchedDomains) {
      console.log("[website:getVercelDomainVerificationMap] checking-domain", {
        domain,
        presentOnProject: projectDomainSet.has(domain),
      });
      if (!projectDomainSet.has(domain)) {
        verificationMap.set(domain, false);
        console.log("[website:getVercelDomainVerificationMap] domain-not-on-project", {
          domain,
          configured: false,
        });
        continue;
      }

      try {
        const isValidConfiguration = await getCachedVercelDomainConfiguration(domain);
        verificationMap.set(domain, isValidConfiguration);
        console.log("[website:getVercelDomainVerificationMap] domain-config-result", {
          domain,
          configured: isValidConfiguration,
        });
      } catch (verifyError) {
        console.error("[website:getVercelDomainVerificationMap] verify failed", {
          domain,
          error: verifyError instanceof Error ? verifyError.message : verifyError,
        });
        verificationMap.set(domain, false);
      }
    }
    console.log(
      "[website:getVercelDomainVerificationMap] map",
      Array.from(verificationMap.entries())
    );
    return verificationMap;
  } catch (error) {
    console.error("Error fetching Vercel domain list:", error);
    return new Map<string, boolean>();
  }
}


function normalizeHostOrDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .split(",")[0]
    .trim()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .replace(/\.$/, "")
    .replace(/:\d+$/, "");
}

export async function getWebsitesByDomain(domainId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        organisation: true,
      },
    });

    if (!domain) {
      return null;
    }

    // Verify user is a member of the organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== domain.organisationId) {
      return null;
    }

    const websites = await prisma.website.findMany({
      where: { domainId },
      include: {
        domainNames: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const matchedDomains = websites.flatMap((website) =>
      website.domainNames.map((domainName) => domainName.name)
    );
    const vercelVerificationMap = await getVercelDomainVerificationMap(matchedDomains);
    const withVerification = websites.map((website) => ({
      ...website,
      domainNames: website.domainNames.map((domainName) => ({
        ...domainName,
        verified: vercelVerificationMap.get(normalizeHostOrDomain(domainName.name)) ?? false,
      })),
    }));
    console.log(
      "[website:getWebsitesByDomain] matched-verification",
      withVerification.map((website) => ({
        websiteId: website.id,
        websiteName: website.name,
        domains: website.domainNames.map((domain) => ({
          name: domain.name,
          normalized: normalizeHostOrDomain(domain.name),
          verified: domain.verified,
        })),
      }))
    );
    return withVerification;
  } catch (error) {
    console.error("Error fetching websites:", error);
    return null;
  }
}

export async function getWebsite(websiteId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
        sites: {
          where: { isActive: true },
          take: 1,
          orderBy: { updatedAt: "desc" },
          include: { pages: true },
        },
        domainNames: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!website) {
      return null;
    }

    // Verify user is a member of the organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return null;
    }

    return website;
  } catch (error) {
    console.error("Error fetching website:", error);
    return null;
  }
}

export async function createWebsite(
  domainId: string,
  name: string,
  domainNames: string[]
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get domain and verify user is a member
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        organisation: true,
      },
    });

    if (!domain) {
      return { success: false, error: "Domain not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, error: "Website name is required" };
    }

    if (!domainNames.length) {
      return { success: false, error: "At least one domain name is required" };
    }

    const cleanedDomainNames = Array.from(
      new Set(domainNames.map(normalizeHostOrDomain).filter(Boolean))
    );
    if (!cleanedDomainNames.length) {
      return { success: false, error: "At least one valid domain name is required" };
    }

    const vercelSyncResult = await syncDomainsToVercel(cleanedDomainNames);
    if (!vercelSyncResult.success) {
      return vercelSyncResult;
    }

    const website = await prisma.website.create({
      data: {
        name: name.trim(),
        domainId,
        organisationId: domain.organisationId,
        domainNames: {
          createMany: {
            data: cleanedDomainNames.map((nameValue) => ({ name: nameValue })),
          },
        },
        sites: {
          create: {
            name: "Main",
            globalBlocks: [],
            isActive: true,
            pages: {
              create: {
                title: "Home",
                slug: "home",
                blocksJson: [],
              },
            },
          },
        },
      },
    });

    return { success: true, data: { id: website.id } };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "One or more domain names are already in use",
      };
    }
    console.error("Error creating website:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create website",
    };
  }
}

export async function updateWebsite(
  websiteId: string,
  name: string,
  domainNames: string[]
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
        domainNames: true,
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, error: "Website name is required" };
    }

    if (!domainNames.length) {
      return { success: false, error: "At least one domain name is required" };
    }

    const cleanedDomainNames = Array.from(
      new Set(domainNames.map(normalizeHostOrDomain).filter(Boolean))
    );
    if (!cleanedDomainNames.length) {
      return { success: false, error: "At least one valid domain name is required" };
    }

    const existingDomainSet = new Set(
      website.domainNames.map((item) => normalizeHostOrDomain(item.name))
    );
    const addedDomains = cleanedDomainNames.filter(
      (domainName) => !existingDomainSet.has(domainName)
    );
    const removedDomains = website.domainNames
      .map((item) => normalizeHostOrDomain(item.name))
      .filter((domainName) => !cleanedDomainNames.includes(domainName));

    const vercelSyncResult = await syncDomainsToVercel(addedDomains);
    if (!vercelSyncResult.success) {
      return vercelSyncResult;
    }

    const vercelRemoveResult = await removeDomainsFromVercel(removedDomains);
    if (!vercelRemoveResult.success) {
      return vercelRemoveResult;
    }

    await prisma.$transaction(async (tx) => {
      await tx.website.update({
        where: { id: websiteId },
        data: {
          name: name.trim(),
        },
      });

      await tx.domainName.deleteMany({
        where: { websiteId },
      });

      await tx.domainName.createMany({
        data: cleanedDomainNames.map((nameValue) => ({
          name: nameValue,
          websiteId,
        })),
      });
    });

    revalidateVercelDomainConfigCache([
      ...website.domainNames.map((item) => item.name),
      ...cleanedDomainNames,
    ]);

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "One or more domain names are already in use",
      };
    }
    console.error("Error updating website:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update website",
    };
  }
}

interface SavePageData {
  title: string;
  slug: string;
  blocksJson: Prisma.InputJsonValue;
}

interface SaveSiteData {
  pages: SavePageData[];
  globalBlocks: Prisma.InputJsonValue;
  themeColors?: Prisma.InputJsonValue;
}

export async function updateWebsiteSiteData(
  websiteCreationId: string,
  siteData: SaveSiteData
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const websiteCreation = await prisma.websiteCreation.findUnique({
      where: { id: websiteCreationId },
      include: {
        website: {
          include: {
            domain: {
              include: {
                organisation: true,
              },
            },
          },
        },
      },
    });

    if (!websiteCreation) {
      return { success: false, error: "Website creation not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== websiteCreation.website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.page.deleteMany({
        where: { websiteCreationId },
      });

      if (siteData.pages.length > 0) {
        await tx.page.createMany({
          data: siteData.pages.map((page) => ({
            title: page.title,
            slug: page.slug,
            blocksJson: page.blocksJson,
            websiteCreationId,
          })),
        });
      }

      await tx.websiteCreation.update({
        where: { id: websiteCreationId },
        data: {
          globalBlocks: siteData.globalBlocks,
          themeColors: siteData.themeColors ?? undefined,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating website site data:", error);
    return { success: false, error: "Failed to update website data" };
  }
}

export async function deleteWebsite(websiteId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
        domainNames: true,
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.domainName.deleteMany({
        where: { websiteId },
      });

      await tx.website.delete({
        where: { id: websiteId },
      });
    });

    revalidateVercelDomainConfigCache(website.domainNames.map((item) => item.name));

    return { success: true };
  } catch (error) {
    console.error("Error deleting website:", error);
    return { success: false, error: "Failed to delete website" };
  }
}

export async function toggleWebsiteActive(websiteId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.website.update({
      where: { id: websiteId },
      data: {
        isActive: !website.isActive,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error toggling website active:", error);
    return { success: false, error: "Failed to toggle website status" };
  }
}

export async function refreshWebsiteDomainConfig(websiteId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
        domainNames: true,
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    revalidateVercelDomainConfigCache(website.domainNames.map((item) => item.name));

    return { success: true };
  } catch (error) {
    console.error("Error refreshing website domain config:", error);
    return { success: false, error: "Failed to refresh domain configuration" };
  }
}

export async function getPostHogConfig(websiteId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!website) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return null;
    }

    // Get PostHog config for this website
    const postHogConfig = await prisma.serviceConfig.findFirst({
      where: {
        websiteId: websiteId,
        type: "POSTHOG",
      },
    });

    if (!postHogConfig) {
      return null;
    }

    return {
      id: postHogConfig.id,
      name: postHogConfig.name,
      config: postHogConfig.config as {
        host: string;
        projectId: string;
        personalKey: string;
      },
    };
  } catch (error) {
    console.error("Error fetching PostHog config:", error);
    return null;
  }
}

export async function createOrUpdatePostHogConfig(
  websiteId: string,
  host: string,
  projectId: string,
  personalKey: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!host.trim()) {
      return { success: false, error: "Host is required" };
    }

    if (!projectId.trim()) {
      return { success: false, error: "Project ID is required" };
    }

    if (!personalKey.trim()) {
      return { success: false, error: "Personal API Key is required" };
    }

    // Check if config already exists
    const existingConfig = await prisma.serviceConfig.findFirst({
      where: {
        websiteId: websiteId,
        type: "POSTHOG",
      },
    });

    const configData = {
      host: host.trim(),
      projectId: projectId.trim(),
      personalKey: personalKey.trim(),
    };

    if (existingConfig) {
      // Update existing config
      await prisma.serviceConfig.update({
        where: { id: existingConfig.id },
        data: {
          name: "PostHog Analytics",
          config: configData,
        },
      });

      return { success: true, data: { id: existingConfig.id } };
    } else {
      // Create new config
      const newConfig = await prisma.serviceConfig.create({
        data: {
          name: "PostHog Analytics",
          type: "POSTHOG",
          config: configData,
          websiteId: websiteId,
        },
      });

      return { success: true, data: { id: newConfig.id } };
    }
  } catch (error) {
    console.error("Error creating/updating PostHog config:", error);
    return { success: false, error: "Failed to save PostHog configuration" };
  }
}

export async function getWebsiteByHost(host: string) {
  try {
    const normalizedHost = normalizeHostOrDomain(host);
    if (!normalizedHost) return null;

    const domainMatch = await prisma.domainName.findUnique({
      where: {
        name: normalizedHost,
      },
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
    if (!website) return null;
    if (!website.isActive) return null;

    const activeCreation = website.sites[0];
    if (!activeCreation) return null;

    return {
      website,
      creation: activeCreation,
      pages: activeCreation.pages,
      globalBlocks: activeCreation.globalBlocks,
      themeColors: activeCreation.themeColors,
    };
  } catch (error) {
    console.error("Error fetching website by host:", error);
    return null;
  }
}

// WebsiteCreation (draft) management functions

export async function getWebsiteCreations(websiteId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!website) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return null;
    }

    const creations = await prisma.websiteCreation.findMany({
      where: { websiteId },
      orderBy: { updatedAt: "desc" },
      include: { pages: true },
    });

    return creations;
  } catch (error) {
    console.error("Error fetching website creations:", error);
    return null;
  }
}

export async function createWebsiteCreation(
  websiteId: string,
  name?: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    let creationName = name?.trim();
    if (!creationName || creationName.length === 0) {
      const creationCount = await prisma.websiteCreation.count({
        where: { websiteId },
      });
      creationName = `Draft ${creationCount + 1}`;
    }

    if (!creationName || creationName.trim().length === 0) {
      creationName = "Untitled Draft";
    }

    const activeCreation = await prisma.websiteCreation.findFirst({
      where: { websiteId, isActive: true },
      include: { pages: true },
    });

    const creation = await prisma.websiteCreation.create({
      data: {
        websiteId,
        name: creationName.trim(),
        globalBlocks: activeCreation?.globalBlocks ?? [],
        themeColors: activeCreation?.themeColors ?? undefined,
        isActive: false,
        pages: {
          create: activeCreation?.pages?.length
            ? activeCreation.pages.map((p) => ({
                title: p.title,
                slug: p.slug,
                blocksJson: p.blocksJson as Prisma.InputJsonValue ?? [],
              }))
            : [{ title: "Home", slug: "home", blocksJson: [] }],
        },
      },
    });

    return { success: true, data: { id: creation.id } };
  } catch (error) {
    console.error("Error creating website creation:", error);
    return { success: false, error: "Failed to create website creation" };
  }
}

export async function setActiveWebsiteCreation(
  websiteId: string,
  websiteCreationId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get website and verify user is a member
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
      include: {
        domain: {
          include: {
            organisation: true,
          },
        },
      },
    });

    if (!website) {
      return { success: false, error: "Website not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify the creation belongs to this website
    const creation = await prisma.websiteCreation.findUnique({
      where: { id: websiteCreationId },
    });

    if (!creation || creation.websiteId !== websiteId) {
      return { success: false, error: "Website creation not found" };
    }

    // Use transaction to ensure only one active creation
    await prisma.$transaction([
      // Deactivate all creations for this website
      prisma.websiteCreation.updateMany({
        where: { websiteId, isActive: true },
        data: { isActive: false },
      }),
      // Activate the selected creation
      prisma.websiteCreation.update({
        where: { id: websiteCreationId },
        data: { isActive: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error setting active website creation:", error);
    return { success: false, error: "Failed to set active website creation" };
  }
}

export async function updateWebsiteCreationName(
  websiteCreationId: string,
  name: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get creation and verify user is a member
    const creation = await prisma.websiteCreation.findUnique({
      where: { id: websiteCreationId },
      include: {
        website: {
          include: {
            domain: {
              include: {
                organisation: true,
              },
            },
          },
        },
      },
    });

    if (!creation) {
      return { success: false, error: "Website creation not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== creation.website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, error: "Name is required" };
    }

    await prisma.websiteCreation.update({
      where: { id: websiteCreationId },
      data: {
        name: name.trim(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating website creation name:", error);
    return { success: false, error: "Failed to update website creation name" };
  }
}

export async function deleteWebsiteCreation(
  websiteCreationId: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get creation and verify user is a member
    const creation = await prisma.websiteCreation.findUnique({
      where: { id: websiteCreationId },
      include: {
        website: {
          include: {
            domain: {
              include: {
                organisation: true,
              },
            },
          },
        },
      },
    });

    if (!creation) {
      return { success: false, error: "Website creation not found" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== creation.website.domain.organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    // Don't allow deleting the last creation
    const creationCount = await prisma.websiteCreation.count({
      where: { websiteId: creation.websiteId },
    });

    if (creationCount <= 1) {
      return { success: false, error: "Cannot delete the last website creation" };
    }

    await prisma.websiteCreation.delete({
      where: { id: websiteCreationId },
    });

    // If we deleted the active one, activate the most recent one
    if (creation.isActive) {
      const mostRecent = await prisma.websiteCreation.findFirst({
        where: { websiteId: creation.websiteId },
        orderBy: { updatedAt: "desc" },
      });

      if (mostRecent) {
        await prisma.websiteCreation.update({
          where: { id: mostRecent.id },
          data: { isActive: true },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting website creation:", error);
    return { success: false, error: "Failed to delete website creation" };
  }
}
