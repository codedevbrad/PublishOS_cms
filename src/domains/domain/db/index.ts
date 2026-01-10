"use server";

import { prisma } from "@/src/lib/db";
import { auth } from "@/auth";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getDomainsByOrganisation(organisationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Verify user is a member of this organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== organisationId) {
      return null;
    }

    const domains = await prisma.domain.findMany({
      where: { organisationId },
      include: {
        _count: {
          select: {
            websites: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return domains;
  } catch (error) {
    console.error("Error fetching domains:", error);
    return null;
  }
}

export async function getDomain(domainId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        organisation: {
          select: {
            id: true,
            name: true,
          },
        },
        websites: {
          select: {
            id: true,
            name: true,
            domainUrl: true,
            isActive: true,
          },
        },
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

    return domain;
  } catch (error) {
    console.error("Error fetching domain:", error);
    return null;
  }
}

export async function createDomain(
  organisationId: string,
  name: string,
  description?: string
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user is a member
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
    });

    if (!user || user.organisationId !== organisationId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, error: "Domain name is required" };
    }

    const domain = await prisma.domain.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        organisationId,
      },
    });

    return { success: true, data: { id: domain.id } };
  } catch (error) {
    console.error("Error creating domain:", error);
    return { success: false, error: "Failed to create domain" };
  }
}

export async function updateDomain(
  domainId: string,
  name: string,
  description?: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get domain and verify user is a member of the organisation
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
      return { success: false, error: "Domain name is required" };
    }

    await prisma.domain.update({
      where: { id: domainId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating domain:", error);
    return { success: false, error: "Failed to update domain" };
  }
}

export async function deleteDomain(domainId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get domain and verify user is a member of the organisation
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

    // Check if domain has websites
    const websiteCount = await prisma.website.count({
      where: { domainId },
    });

    if (websiteCount > 0) {
      return {
        success: false,
        error: "Cannot delete domain with existing websites",
      };
    }

    await prisma.domain.delete({
      where: { id: domainId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting domain:", error);
    return { success: false, error: "Failed to delete domain" };
  }
}
