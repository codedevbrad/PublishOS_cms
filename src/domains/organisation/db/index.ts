"use server";

import { prisma } from "@/src/lib/db";
import { auth } from "@/auth";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function getOrganisation(organisationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
      include: {
        members: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
        domains: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            domains: true,
            sites: true,
            members: true,
          },
        },
      },
    });

    // Verify user is a member of this organisation
    if (organisation && !organisation.members.some((m) => m.id === session.user.id)) {
      return null;
    }

    return organisation;
  } catch (error) {
    console.error("Error fetching organisation:", error);
    return null;
  }
}

export async function getCurrentUserOrganisation() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: {
        organisation: {
          include: {
            _count: {
              select: {
                domains: true,
                sites: true,
                members: true,
              },
            },
          },
        },
      },
    });

    return user?.organisation || null;
  } catch (error) {
    console.error("Error fetching user organisation:", error);
    return null;
  }
}

export async function createOrganisationForCurrentUser(
  name: string
): Promise<ActionResult<{ organisationId: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!name.trim()) {
      return { success: false, error: "Organisation name is required" };
    }

    // Check if user already has an organisation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { organisation: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.organisationId) {
      return { success: false, error: "User already has an organisation" };
    }

    // Create organisation and link to user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organisation
      const organisation = await tx.organisation.create({
        data: {
          name: name.trim(),
        },
      });

      // Update user's organisationId
      await tx.user.update({
        where: { id: user.id },
        data: {
          organisationId: organisation.id,
        },
      });

      return organisation;
    });

    return { success: true, data: { organisationId: result.id } };
  } catch (error) {
    console.error("Error creating organisation:", error);
    return { success: false, error: "Failed to create organisation" };
  }
}

export async function updateOrganisationName(
  organisationId: string,
  name: string
): Promise<ActionResult> {
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
      return { success: false, error: "Organisation name is required" };
    }

    await prisma.organisation.update({
      where: { id: organisationId },
      data: { name },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating organisation:", error);
    return { success: false, error: "Failed to update organisation" };
  }
}
