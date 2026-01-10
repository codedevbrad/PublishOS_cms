"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { updateDomain } from "../db";

interface EditDomainFormProps {
  domainId: string;
  initialName: string;
  initialDescription: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditDomainForm({
  domainId,
  initialName,
  initialDescription,
  onSuccess,
  onCancel,
}: EditDomainFormProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
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
      const result = await updateDomain(
        domainId,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="edit-name" className="text-sm font-medium">
          Domain Name *
        </label>
        <Input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="edit-description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="edit-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
        />
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} size="sm">
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
