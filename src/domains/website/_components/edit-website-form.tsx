"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
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

interface EditWebsiteFormProps {
  websiteId: string;
  initialName: string;
  initialDomainNames: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditWebsiteForm({
  websiteId,
  initialName,
  initialDomainNames,
  onSuccess,
  onCancel,
}: EditWebsiteFormProps) {
  const [name, setName] = useState(initialName);
  const [domainNames, setDomainNames] = useState(initialDomainNames);
  const [domainTab, setDomainTab] = useState<"manage" | "add">("manage");
  const [isDomainPopoverOpen, setIsDomainPopoverOpen] = useState(false);
  const [domainName, setDomainName] = useState("");
  const [tld, setTld] = useState("none");
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

  const persistDomains = async (nextDomains: string[]) => {
    const preparedDomains = prepareDomains(nextDomains);
    if (preparedDomains.length === 0) {
      setError("At least one domain name is required");
      return false;
    }

    setIsSavingDomains(true);
    const result = await updateWebsite(
      websiteId,
      name.trim() || initialName,
      preparedDomains
    );
    setIsSavingDomains(false);

    if (!result.success) {
      setError(result.error);
      return false;
    }

    setDomainNames(preparedDomains);
    setError("");
    return true;
  };

  const handleAddDomain = async () => {
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

    const didSave = await persistDomains([...domainNames, normalized]);
    if (!didSave) {
      return;
    }

    setDomainName("");
    setTld("none");
    setDomainTab("manage");
  };

  const handleDomainChange = (index: number, value: string) => {
    setDomainNames((prev) => prev.map((domain, i) => (i === index ? value : domain)));
  };

  const handleDeleteDomain = async (index: number) => {
    await persistDomains(domainNames.filter((_, i) => i !== index));
  };

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
          <Popover
            open={isDomainPopoverOpen}
            onOpenChange={(open) => {
              setIsDomainPopoverOpen(open);
              if (!open) {
                setDomainTab("manage");
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" disabled={isBusy}>
                Manage domains
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[520px] space-y-3">
              <div className="grid grid-cols-2 gap-1 rounded-md border bg-muted p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={domainTab === "manage" ? "secondary" : "ghost"}
                  onClick={() => setDomainTab("manage")}
                  disabled={isBusy}
                >
                  Manage
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={domainTab === "add" ? "secondary" : "ghost"}
                  onClick={() => setDomainTab("add")}
                  disabled={isBusy}
                >
                  Add domain
                </Button>
              </div>

              {domainTab === "manage" ? (
                <div className="space-y-2">
                  {domainNames.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No domains to manage.</p>
                  ) : (
                    domainNames.map((domain, index) => (
                      <div key={`${domain}-${index}`} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={domain}
                          onChange={(e) => handleDomainChange(index, e.target.value)}
                          disabled={isBusy}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => void handleDeleteDomain(index)}
                          disabled={isBusy}
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDomainTab("add")}
                    disabled={isBusy}
                  >
                    Add domain
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">https://</span>
                    <Input
                      type="text"
                      value={domainName}
                      onChange={(e) => setDomainName(e.target.value)}
                      disabled={isBusy}
                      placeholder="example"
                      className="flex-1"
                    />
                    <Select value={tld} onValueChange={setTld} disabled={isBusy}>
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
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDomainTab("manage")}
                      disabled={isBusy}
                    >
                      Back to manage
                    </Button>
                    <Button type="button" onClick={() => void handleAddDomain()} disabled={isBusy}>
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
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
