import { headers } from "next/headers";
import { prisma } from "@/src/lib/db";

export default async function Page({
  params
}: {
  params: { domain: string; slug?: string[] }
}) {
  const host = (await headers()).get("host");

  if (!host) {
    return <div>Site not found</div>;
  }

  const site = await prisma.website.findFirst({
    where: { domainUrl: host }
  });

  if (!site) {
    return <div>Site not found</div>;
  }

  const slugPath = params.slug?.join("/") ?? "";

  const page = await db.page.findFirst({
    where: {
      siteId: site.id,
      slug: slugPath
    }
  });

  if (!page) {
    return <div>404</div>;
  }

  return <div>{page.title}</div>;
}