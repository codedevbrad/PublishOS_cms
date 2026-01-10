"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { updateWebsite } from "../db";

interface EditWebsiteFormProps {
  websiteId: string;
  initialName: string;
  initialDomainUrl: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditWebsiteForm({
  websiteId,
  initialName,
  initialDomainUrl,
  onSuccess,
  onCancel,
}: EditWebsiteFormProps) {
  const [name, setName] = useState(initialName);
  const [domainUrl, setDomainUrl] = useState(initialDomainUrl);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Website name is required");
      return;
    }

    if (!domainUrl.trim()) {
      setError("Domain URL is required");
      return;
    }

    startTransition(async () => {
      const result = await updateWebsite(
        websiteId,
        name.trim(),
        domainUrl.trim()
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
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="domainUrl" className="text-sm font-medium">
          Domain URL *
        </label>
        <Input
          id="domainUrl"
          type="text"
          value={domainUrl}
          onChange={(e) => setDomainUrl(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
