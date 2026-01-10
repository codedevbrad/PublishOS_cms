"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { createOrUpdatePostHogConfig, getPostHogConfig } from "../db";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";

interface PostHogConfigFormProps {
  websiteId: string;
  defaultCollapsed?: boolean;
}

export function PostHogConfigForm({ websiteId, defaultCollapsed = false }: PostHogConfigFormProps) {
  const [host, setHost] = useState("");
  const [projectId, setProjectId] = useState("");
  const [personalKey, setPersonalKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    async function loadConfig() {
      const config = await getPostHogConfig(websiteId);
      if (config) {
        setHost(config.config.host || "");
        setProjectId(config.config.projectId || "");
        setPersonalKey(config.config.personalKey || "");
      }
      setIsLoading(false);
    }
    loadConfig();
  }, [websiteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!host.trim()) {
      setError("Host is required");
      return;
    }

    if (!projectId.trim()) {
      setError("Project ID is required");
      return;
    }

    if (!personalKey.trim()) {
      setError("Personal API Key is required");
      return;
    }

    startTransition(async () => {
      const result = await createOrUpdatePostHogConfig(
        websiteId,
        host.trim(),
        projectId.trim(),
        personalKey.trim()
      );

      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading configuration...</div>;
  }

  const hasConfig = host && projectId && personalKey;

  return (
    <div className="border rounded-lg">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="font-semibold">PostHog Configuration</span>
          {hasConfig && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">
              Configured
            </span>
          )}
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Configure your PostHog analytics settings. You can find your Project ID and Personal API Key in your PostHog project settings.
          </p>

      <div className="space-y-2">
        <label htmlFor="host" className="text-sm font-medium">
          Host *
        </label>
        <Input
          id="host"
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          required
          disabled={isPending}
          placeholder="e.g., https://app.posthog.com"
        />
        <p className="text-xs text-muted-foreground">
          Your PostHog instance URL
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="projectId" className="text-sm font-medium">
          Project ID *
        </label>
        <Input
          id="projectId"
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          disabled={isPending}
          placeholder="e.g., 12345"
        />
        <p className="text-xs text-muted-foreground">
          Your PostHog project ID
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="personalKey" className="text-sm font-medium">
          Personal API Key *
        </label>
        <Input
          id="personalKey"
          type="password"
          value={personalKey}
          onChange={(e) => setPersonalKey(e.target.value)}
          required
          disabled={isPending}
          placeholder="Enter your Personal API Key"
        />
        <p className="text-xs text-muted-foreground">
          Your PostHog Personal API Key (stored securely)
        </p>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
          Configuration saved successfully!
        </div>
      )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
