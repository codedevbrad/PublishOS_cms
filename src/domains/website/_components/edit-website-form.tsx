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
import { updateWebsite } from "../db";

const TLD_OPTIONS = [
  { value: "none", label: "None" },
  { value: ".co.uk", label: ".co.uk" },
  { value: ".com", label: ".com" },
];

function parseDomainUrl(domainUrl: string): { name: string; tld: string } {
  for (const option of TLD_OPTIONS) {
    if (option.value !== "none" && domainUrl.endsWith(option.value)) {
      return {
        name: domainUrl.slice(0, -option.value.length),
        tld: option.value,
      };
    }
  }
  return { name: domainUrl, tld: "none" };
}

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
  const parsed = parseDomainUrl(initialDomainUrl);
  const [name, setName] = useState(initialName);
  const [domainName, setDomainName] = useState(parsed.name);
  const [tld, setTld] = useState(parsed.tld);
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

    const fullDomainUrl = `${domainName.trim()}${tld === "none" ? "" : tld}`;

    startTransition(async () => {
      const result = await updateWebsite(
        websiteId,
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
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
