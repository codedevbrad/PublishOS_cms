"use server";

import { prisma } from "@/src/lib/db";
import { auth } from "@/auth";
import type { Prisma } from "@prisma/client";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

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
      orderBy: {
        createdAt: "desc",
      },
    });

    return websites;
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
  domainUrl: string
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

    if (!domainUrl.trim()) {
      return { success: false, error: "Domain URL is required" };
    }

    // Default siteData structure
    const defaultSiteData = {
      pages: [
        {
          id: "1",
          name: "Home",
          slug: "home",
          blocks: [],
          isActive: true,
        },
      ],
      globalBlocks: [],
    };

    const website = await prisma.website.create({
      data: {
        name: name.trim(),
        domainUrl: domainUrl.trim(),
        domainId,
        organisationId: domain.organisationId,
        siteData: defaultSiteData,
      },
    });

    return { success: true, data: { id: website.id } };
  } catch (error) {
    console.error("Error creating website:", error);
    return { success: false, error: "Failed to create website" };
  }
}

export async function updateWebsite(
  websiteId: string,
  name: string,
  domainUrl: string
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

    if (!name.trim()) {
      return { success: false, error: "Website name is required" };
    }

    if (!domainUrl.trim()) {
      return { success: false, error: "Domain URL is required" };
    }

    await prisma.website.update({
      where: { id: websiteId },
      data: {
        name: name.trim(),
        domainUrl: domainUrl.trim(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating website:", error);
    return { success: false, error: "Failed to update website" };
  }
}

export async function updateWebsiteSiteData(
  websiteId: string,
  siteData: Prisma.InputJsonValue
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

    await prisma.website.update({
      where: { id: websiteId },
      data: {
        siteData: siteData,
      },
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

    await prisma.website.delete({
      where: { id: websiteId },
    });

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
