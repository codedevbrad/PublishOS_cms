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
        sites: {
          where: { isActive: true },
          take: 1,
          orderBy: { updatedAt: "desc" },
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
        sites: {
          create: {
            name: "Main",
            siteData: defaultSiteData,
            isActive: true,
          },
        },
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
  websiteCreationId: string,
  siteData: Prisma.InputJsonValue
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get website creation and verify user is a member
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

    await prisma.websiteCreation.update({
      where: { id: websiteCreationId },
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
    });

    return creations;
  } catch (error) {
    console.error("Error fetching website creations:", error);
    return null;
  }
}

export async function createWebsiteCreation(
  websiteId: string,
  name?: string,
  siteData?: Prisma.InputJsonValue
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

    // If no siteData provided, use default or copy from active creation
    let creationSiteData = siteData;
    if (!creationSiteData) {
      const activeCreation = await prisma.websiteCreation.findFirst({
        where: { websiteId, isActive: true },
      });

      if (activeCreation) {
        creationSiteData = activeCreation.siteData as Prisma.InputJsonValue;
      } else {
        // Default siteData structure
        creationSiteData = {
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
      }
    }

    // Generate default name if not provided or empty
    let creationName = name?.trim();
    if (!creationName || creationName.length === 0) {
      const creationCount = await prisma.websiteCreation.count({
        where: { websiteId },
      });
      creationName = `Draft ${creationCount + 1}`;
    }

    // Ensure name is never empty (safety check)
    if (!creationName || creationName.trim().length === 0) {
      creationName = "Untitled Draft";
    }

    const creation = await prisma.websiteCreation.create({
      data: {
        websiteId,
        name: creationName.trim(),
        siteData: creationSiteData ?? {
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
        },
        isActive: false,
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
