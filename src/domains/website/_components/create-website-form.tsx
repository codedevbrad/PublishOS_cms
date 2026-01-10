"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { createWebsite } from "../db";

interface CreateWebsiteFormProps {
  domainId: string;
  organisationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateWebsiteForm({
  domainId,
  organisationId,
  onSuccess,
  onCancel,
}: CreateWebsiteFormProps) {
  const [name, setName] = useState("");
  const [domainUrl, setDomainUrl] = useState("");
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
      const result = await createWebsite(
        domainId,
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
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
      <h3 className="font-semibold">Create New Website</h3>
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
          placeholder="e.g., Main Website"
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
          placeholder="e.g., www.example.com"
        />
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Website"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
