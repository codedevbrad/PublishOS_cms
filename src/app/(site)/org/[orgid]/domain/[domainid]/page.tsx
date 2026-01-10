import { notFound, redirect } from "next/navigation";
import { getDomain } from "@/src/domains/domain/db";
import { auth } from "@/auth";
import { WebsiteList } from "@/src/domains/website/_components/website-list";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DomainPageProps {
  params: Promise<{ orgid: string; domainid: string }>;
}

export default async function DomainPage({ params }: DomainPageProps) {
  const { orgid, domainid } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const domain = await getDomain(domainid);

  if (!domain) {
    notFound();
  }

  // Verify the domain belongs to the organisation
  if (domain.organisationId !== orgid) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href={`/org/${orgid}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organisation
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{domain.name}</h1>
          {domain.description && (
            <p className="text-muted-foreground mt-2">{domain.description}</p>
          )}
        </div>

        <WebsiteList domainId={domainid} organisationId={orgid} />
      </div>
    </div>
  );
}
