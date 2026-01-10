"use client";

import { useWebsites } from "../contexts/useWebsite";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { CreateWebsiteForm } from "./create-website-form";
import { EditWebsiteForm } from "./edit-website-form";
import { deleteWebsite, toggleWebsiteActive } from "../db";
import { useTransition } from "react";
import { mutate } from "swr";
import Link from "next/link";
import { Edit, Trash2, Power, PowerOff, ExternalLink } from "lucide-react";

interface WebsiteListProps {
  domainId: string;
  organisationId: string;
}

export function WebsiteList({ domainId, organisationId }: WebsiteListProps) {
  const { data: websites, isLoading, error, mutate } = useWebsites(domainId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteWebsite(websiteId);
      if (result.success) {
        await mutate();
      } else {
        alert(result.error);
      }
    });
  };

  const handleToggleActive = async (websiteId: string) => {
    startTransition(async () => {
      const result = await toggleWebsiteActive(websiteId);
      if (result.success) {
        await mutate();
      } else {
        alert(result.error);
      }
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading websites...</div>;
  }

  if (error) {
    return <div className="text-destructive">Error loading websites</div>;
  }

  if (!websites || websites.length === 0) {
    return (
      <div className="space-y-4">
        {!showCreateForm && (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">No websites yet</p>
            <Button onClick={() => setShowCreateForm(true)}>Create Website</Button>
          </div>
        )}
        {showCreateForm && (
          <CreateWebsiteForm
            domainId={domainId}
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
        <h2 className="text-xl font-semibold">Websites</h2>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>Create Website</Button>
        )}
      </div>

      {showCreateForm && (
        <CreateWebsiteForm
          domainId={domainId}
          organisationId={organisationId}
          onSuccess={() => {
            setShowCreateForm(false);
            mutate();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="space-y-2">
        {websites.map((website) => (
          <div
            key={website.id}
            className={`border rounded-lg p-4 hover:bg-accent/50 transition-colors ${
              !website.isActive ? "opacity-60" : ""
            }`}
          >
            {editingWebsiteId === website.id ? (
              <EditWebsiteForm
                websiteId={website.id}
                initialName={website.name}
                initialDomainUrl={website.domainUrl}
                onSuccess={() => {
                  setEditingWebsiteId(null);
                  mutate();
                }}
                onCancel={() => setEditingWebsiteId(null)}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{website.name}</h3>
                    {website.isActive ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {website.domainUrl}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(website.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link href={`/org/${organisationId}/domain/${domainId}/website/${website.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingWebsiteId(website.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(website.id)}
                    disabled={isPending}
                    title={website.isActive ? "Deactivate" : "Activate"}
                  >
                    {website.isActive ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(website.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
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
