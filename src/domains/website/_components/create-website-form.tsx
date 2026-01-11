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

    if (!tld) {
      setError("Please select a domain extension");
      return;
    }

    const fullDomainUrl = `www.${domainName.trim()}${tld}`;

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
        <label className="text-sm font-medium">Domain URL *</label>
        <div className="flex items-center gap-0">
          <Input
            type="text"
            value="www"
            disabled
            className="w-20 bg-muted"
            readOnly
          />
          <span className="text-muted-foreground">.</span>
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
            <SelectTrigger className="w-32">
              <SelectValue  />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=".com">.com</SelectItem>
              <SelectItem value=".co.uk">.co.uk</SelectItem>
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
