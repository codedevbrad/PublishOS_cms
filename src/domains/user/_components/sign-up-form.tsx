"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { signUpAction } from "@/src/domains/user/db";
import { createOrganisationForCurrentUser } from "@/src/domains/organisation/db";
import { mutate } from "swr";

type Step = 1 | 2;

export function SignUpForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  
  // Step 1: User credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Step 2: Organisation
  const [organisationName, setOrganisationName] = useState("");
  
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    startTransition(async () => {
      const result = await signUpAction(username, password);

      if (!result.success) {
        setError(result.error);
      } else {
        // User created and signed in, move to step 2
        await mutate("user");
        setStep(2);
        setError("");
      }
    });
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!organisationName.trim()) {
      setError("Organisation name is required");
      return;
    }

    startTransition(async () => {
      const result = await createOrganisationForCurrentUser(organisationName.trim());

      if (!result.success) {
        setError(result.error);
      } else {
        // Organisation created, redirect to organisation page
        await mutate("user");
        await mutate("current-user-organisation");
        if (result.data?.organisationId) {
          router.push(`/${result.data.organisationId}`);
        } else {
          router.push("/");
        }
        router.refresh();
      }
    });
  };

  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="w-16 h-0.5 bg-muted"></div>
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
          </div>
        </div>
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isPending}
            placeholder="Choose a username"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isPending}
            placeholder="Choose a password (min. 6 characters)"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isPending}
            placeholder="Confirm your password"
          />
        </div>
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating account..." : "Continue"}
        </Button>
      </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-0.5 bg-primary"></div>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            2
          </div>
        </div>
      </div>
      <form onSubmit={handleStep2Submit} className="space-y-4">
        <div className="space-y-2">
        <label htmlFor="organisationName" className="text-sm font-medium">
          Organisation Name
        </label>
        <Input
          id="organisationName"
          type="text"
          value={organisationName}
          onChange={(e) => setOrganisationName(e.target.value)}
          required
          disabled={isPending}
          placeholder="Enter your organisation name"
        />
        <p className="text-xs text-muted-foreground">
          This will be the name of your organisation. You can change it later.
        </p>
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          disabled={isPending}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Creating organisation..." : "Complete Sign Up"}
        </Button>
      </div>
      </form>
    </div>
  );
}
