import { notFound, redirect } from "next/navigation";
import { getOrganisation } from "@/src/domains/organisation/db";
import { auth } from "@/auth";
import { DomainList } from "@/src/domains/domain/_components/domain-list";

interface OrganisationPageProps {
  params: Promise<{ orgid: string }>;
}

export default async function OrganisationPage({ params }: OrganisationPageProps) {
  const { orgid } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const organisation = await getOrganisation(orgid);

  if (!organisation) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{organisation.name}</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organisation and domains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Members</div>
            <div className="text-2xl font-bold mt-1">{organisation._count.members}</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Domains</div>
            <div className="text-2xl font-bold mt-1">{organisation._count.domains}</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Websites</div>
            <div className="text-2xl font-bold mt-1">{organisation._count.sites}</div>
          </div>
        </div>

        <DomainList organisationId={orgid} />
      </div>
    </div>
  );
}
