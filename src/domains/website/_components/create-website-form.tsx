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
  { value: "none", label: "None" },
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
  const [domainNames, setDomainNames] = useState<string[]>([]);
  const [tld, setTld] = useState(".co.uk");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const normalizeDomain = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/:\d+$/, "");

  const handleAddDomain = () => {
    const fullDomainUrl = `${domainName.trim()}${tld === "none" ? "" : tld}`;
    const normalized = normalizeDomain(fullDomainUrl);

    if (!normalized) {
      setError("Domain name is required");
      return;
    }

    if (domainNames.some((d) => d.toLowerCase() === normalized)) {
      setError("Domain already added");
      return;
    }

    setDomainNames((prev) => [...prev, normalized]);
    setDomainName("");
    setError("");
  };

  const handleDomainChange = (index: number, value: string) => {
    setDomainNames((prev) => prev.map((domain, i) => (i === index ? value : domain)));
  };

  const handleDeleteDomain = (index: number) => {
    setDomainNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Website name is required");
      return;
    }

    const draftDomain = normalizeDomain(
      `${domainName.trim()}${tld === "none" ? "" : tld}`
    );
    const preparedDomains = Array.from(
      new Set(
        [...domainNames, draftDomain]
          .map((d) => normalizeDomain(d))
          .filter(Boolean)
      )
    );
    if (preparedDomains.length === 0) {
      setError("At least one domain name is required");
      return;
    }

    startTransition(async () => {
      const result = await createWebsite(
        domainId,
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
        <label className="text-sm font-medium">Domains *</label>
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
          <Button type="button" variant="outline" onClick={handleAddDomain} disabled={isPending}>
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {domainNames.length === 0 && (
            <p className="text-xs text-muted-foreground">Add one or more domains for this website.</p>
          )}
          {domainNames.map((domain, index) => (
            <div key={`${domain}-${index}`} className="flex items-center gap-2">
              <Input
                type="text"
                value={domain}
                onChange={(e) => handleDomainChange(index, e.target.value)}
                disabled={isPending}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDeleteDomain(index)}
                disabled={isPending}
              >
                Delete
              </Button>
            </div>
          ))}
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
