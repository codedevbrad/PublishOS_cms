"use client";

import { useDomains } from "../contexts/useDomain";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { CreateDomainForm } from "./create-domain-form";
import { EditDomainForm } from "./edit-domain-form";
import { deleteDomain } from "../db";
import { useTransition } from "react";
import { mutate } from "swr";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface DomainListProps {
  organisationId: string;
}

export function DomainList({ organisationId }: DomainListProps) {
  const { data: domains, isLoading, error, mutate } = useDomains(organisationId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (domainId: string) => {
    if (!confirm("Are you sure you want to delete this domain?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteDomain(domainId);
      if (result.success) {
        await mutate();
      } else {
        alert(result.error);
      }
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading domains...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error loading domains</div>;
  }

  if (!domains || domains.length === 0) {
    return (
      <div className="space-y-4">
        {!showCreateForm && (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">No domains yet</p>
            <Button onClick={() => setShowCreateForm(true)}>Create Domain</Button>
          </div>
        )}
        {showCreateForm && (
          <CreateDomainForm
            organisationId={organisationId}
            onSuccess={() => {
              setShowCreateForm(false);
              mutate();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Domains</h2>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>Create Domain</Button>
        )}
      </div>

      {showCreateForm && (
        <CreateDomainForm
          organisationId={organisationId}
          onSuccess={() => {
            setShowCreateForm(false);
            mutate();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="space-y-2">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            {editingDomainId === domain.id ? (
              <EditDomainForm
                domainId={domain.id}
                initialName={domain.name}
                initialDescription={domain.description || ""}
                onSuccess={() => {
                  setEditingDomainId(null);
                  mutate();
                }}
                onCancel={() => setEditingDomainId(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/org/${organisationId}/domain/${domain.id}`}
                      className="font-medium hover:underline flex items-center gap-1"
                    >
                      {domain.name}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  {domain.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {domain.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {domain._count.websites} website(s) • Created{" "}
                    {new Date(domain.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDomainId(domain.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(domain.id)}
                    disabled={isPending || domain._count.websites > 0}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
