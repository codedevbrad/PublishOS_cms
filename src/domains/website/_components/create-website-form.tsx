"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { createWebsite } from "../db";

const TLD_OPTIONS = [
  { value: ".co.uk", label: ".co.uk" },
  { value: ".com", label: ".com" },
];

interface CreateWebsiteFormProps {
  domainId: string;
  organisationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateWebsiteForm({
  domainId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  organisationId,
  onSuccess,
  onCancel,
}: CreateWebsiteFormProps) {
  const [name, setName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [tld, setTld] = useState(".co.uk");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Website name is required");
      return;
    }

    if (!domainName.trim()) {
      setError("Domain name is required");
      return;
    }

    const fullDomainUrl = `${domainName.trim()}${tld}`;

    startTransition(async () => {
      const result = await createWebsite(
        domainId,
        name.trim(),
        fullDomainUrl
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
        <label className="text-sm font-medium">Domain *</label>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">https://</span>
          <Input
            type="text"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
            required
            disabled={isPending}
            placeholder="example"
            className="flex-1"
          />
          <Select value={tld} onValueChange={setTld} disabled={isPending}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TLD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
