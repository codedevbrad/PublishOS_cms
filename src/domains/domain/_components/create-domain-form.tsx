"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { createDomain } from "../db";

interface CreateDomainFormProps {
  organisationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateDomainForm({
  organisationId,
  onSuccess,
  onCancel,
}: CreateDomainFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Domain name is required");
      return;
    }

    startTransition(async () => {
      const result = await createDomain(
        organisationId,
        name.trim(),
        description.trim() || undefined
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
      <h3 className="font-semibold">Create New Domain</h3>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Domain Name *
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
          placeholder="e.g., example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
          placeholder="Optional description"
        />
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Domain"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
