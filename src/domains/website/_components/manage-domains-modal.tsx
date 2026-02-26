"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
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

const VERCEL_DNS_GUIDE_ROWS = [
  { type: "A", name: "@", value: "76.76.21.21" },
  { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
];

interface ManageDomainsModalProps {
  websiteId: string;
  websiteName: string;
  initialName: string;
  domainNames: string[];
  initialDomainVerifiedMap: Record<string, boolean>;
  isBusy: boolean;
  onSetSavingDomains: (isSaving: boolean) => void;
  onSetDomainNames: (nextDomains: string[]) => void;
  onSetError: (error: string) => void;
}

export function ManageDomainsModal({
  websiteId,
  websiteName,
  initialName,
  domainNames,
  initialDomainVerifiedMap,
  isBusy,
  onSetSavingDomains,
  onSetDomainNames,
  onSetError,
}: ManageDomainsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [domainTab, setDomainTab] = useState<"manage" | "add" | "added">("manage");
  const [domainName, setDomainName] = useState("");
  const [tld, setTld] = useState("none");
  const [lastAddedDomain, setLastAddedDomain] = useState("");

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
      onSetError("At least one domain name is required");
      return false;
    }

    onSetSavingDomains(true);
    const result = await updateWebsite(
      websiteId,
      websiteName.trim() || initialName,
      preparedDomains
    );
    onSetSavingDomains(false);

    if (!result.success) {
      onSetError(result.error);
      return false;
    }

    onSetDomainNames(preparedDomains);
    onSetError("");
    return true;
  };

  const handleDomainChange = (index: number, value: string) => {
    onSetDomainNames(domainNames.map((domain, i) => (i === index ? value : domain)));
  };

  const handleDeleteDomain = async (index: number) => {
    await persistDomains(domainNames.filter((_, i) => i !== index));
  };

  const handleAddDomain = async () => {
    const fullDomainUrl = `${domainName.trim()}${tld === "none" ? "" : tld}`;
    const normalized = normalizeDomain(fullDomainUrl);

    if (!normalized) {
      onSetError("Domain name is required");
      return;
    }

    if (domainNames.some((d) => d.toLowerCase() === normalized)) {
      onSetError("Domain already added");
      return;
    }

    const didSave = await persistDomains([...domainNames, normalized]);
    if (!didSave) {
      return;
    }

    setDomainName("");
    setTld("none");
    setLastAddedDomain(normalized);
    setDomainTab("added");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setDomainTab("manage");
          setLastAddedDomain("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" disabled={isBusy}>
          Manage domains
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage domains</DialogTitle>
          <DialogDescription>
            Add, edit, and verify the domains connected to this website.
          </DialogDescription>
        </DialogHeader>

        {domainTab === "manage" ? (
          <div className="space-y-2">
            {domainNames.length === 0 ? (
              <p className="text-sm text-muted-foreground">No domains to manage.</p>
            ) : (
              domainNames.map((domain, index) => (
                <div key={`${domain}-${index}`} className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full animate-pulse ${
                      initialDomainVerifiedMap[normalizeDomain(domain)] ? "bg-blue-500" : "bg-red-500"
                    }`}
                    title={
                      initialDomainVerifiedMap[normalizeDomain(domain)]
                        ? "Verified on Vercel"
                        : "Not verified on Vercel"
                    }
                  />
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
        ) : domainTab === "add" ? (
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
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border bg-blue-50 p-3 text-blue-900">
              <p className="text-sm font-semibold">Domain added</p>
              <p className="mt-1 text-xs">
                {lastAddedDomain || "Domain"} was added and set on Vercel.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Configure DNS in GoDaddy</p>
              <p className="text-xs text-muted-foreground">
                Add these DNS records for your domain in GoDaddy.
              </p>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left font-medium">Type</th>
                      <th className="p-2 text-left font-medium">Name</th>
                      <th className="p-2 text-left font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VERCEL_DNS_GUIDE_ROWS.map((row) => (
                      <tr key={`${row.type}-${row.name}`} className="border-t">
                        <td className="p-2">{row.type}</td>
                        <td className="p-2">{row.name}</td>
                        <td className="p-2 font-mono text-xs">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <Button
                type="button"
                onClick={() => {
                  setDomainTab("add");
                  setLastAddedDomain("");
                }}
                disabled={isBusy}
              >
                Add another domain
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
