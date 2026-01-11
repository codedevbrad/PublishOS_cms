"use client";

import { useState, useTransition, useMemo } from "react";
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
  // Parse initial domain URL to extract domain name and TLD
  const { domainName: initialDomainName, tld: initialTld } = useMemo(() => {
    let domain = initialDomainUrl;
    // Remove www. prefix if present
    if (domain.startsWith("www.")) {
      domain = domain.slice(4);
    }
    
    // Extract TLD (.co.uk or .com)
    if (domain.endsWith(".co.uk")) {
      return {
        domainName: domain.slice(0, -6), // Remove .co.uk
        tld: ".co.uk",
      };
    } else if (domain.endsWith(".com")) {
      return {
        domainName: domain.slice(0, -4), // Remove .com
        tld: ".com",
      };
    }
    
    // Default fallback
    return {
      domainName: domain,
      tld: ".co.uk",
    };
  }, [initialDomainUrl]);

  const [name, setName] = useState(initialName);
  const [domainName, setDomainName] = useState(initialDomainName);
  const [tld, setTld] = useState(initialTld);
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
              <SelectValue />
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
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
