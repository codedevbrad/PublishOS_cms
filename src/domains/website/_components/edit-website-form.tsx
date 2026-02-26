"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { updateWebsite } from "../db";
import { ManageDomainsModal } from "./manage-domains-modal";

interface EditWebsiteFormProps {
  websiteId: string;
  initialName: string;
  initialDomainNames: string[];
  initialDomainVerifiedMap?: Record<string, boolean>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditWebsiteForm({
  websiteId,
  initialName,
  initialDomainNames,
  initialDomainVerifiedMap = {},
  onSuccess,
  onCancel,
}: EditWebsiteFormProps) {
  const [name, setName] = useState(initialName);
  const [domainNames, setDomainNames] = useState(initialDomainNames);
  const [error, setError] = useState("");
  const [isSavingDomains, setIsSavingDomains] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isBusy = isPending || isSavingDomains;

  const normalizeDomain = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/:\d+$/, "");

  const prepareDomains = (domains: string[]) =>
    Array.from(new Set(domains.map((d) => normalizeDomain(d)).filter(Boolean)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Website name is required");
      return;
    }

    const preparedDomains = prepareDomains(domainNames);
    if (preparedDomains.length === 0) {
      setError("At least one domain name is required");
      return;
    }

    startTransition(async () => {
      const result = await updateWebsite(
        websiteId,
        name.trim(),
        preparedDomains
      );

      if (!result.success) {
        setError(result.error);
      } else {
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Website Name *
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isBusy}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Domains *</label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {domainNames.length === 0 ? (
              <p className="text-sm text-muted-foreground">No domains added yet.</p>
            ) : (
              domainNames.map((domain, index) => (
                <span
                  key={`${domain}-${index}`}
                  className="rounded-md border bg-muted px-2 py-1 text-sm"
                >
                  {domain}
                </span>
              ))
            )}
          </div>
          <ManageDomainsModal
            websiteId={websiteId}
            websiteName={name}
            initialName={initialName}
            domainNames={domainNames}
            initialDomainVerifiedMap={initialDomainVerifiedMap}
            isBusy={isBusy}
            onSetSavingDomains={setIsSavingDomains}
            onSetDomainNames={setDomainNames}
            onSetError={setError}
          />
        </div>
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isBusy}>
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isBusy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
