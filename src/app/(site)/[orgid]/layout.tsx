import { BreadcrumbView } from "@/src/components/custom/breadcrumb-view";

interface OrganisationLayoutProps {
  children: React.ReactNode;
  params: Promise<{ orgid: string }>;
}

export default async function OrganisationLayout({
  children,
  params,
}: OrganisationLayoutProps) {
  const { orgid } = await params;

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb – natural height */}
      <div className="shrink-0 p-3">
        <BreadcrumbView orgid={orgid} />
      </div>

      {/* Page content – fills remaining space */}
      <div className="flex-1 overflow-hidden p-3">
        {children}
      </div>
    </div>
  );
}
