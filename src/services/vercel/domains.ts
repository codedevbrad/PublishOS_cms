type VercelVerificationChallenge = {
  type: string;
  domain: string;
  value: string;
  reason: string;
};

type VercelAddDomainResponse = {
  name: string;
  verified: boolean;
  verification?: VercelVerificationChallenge[];
};

type VercelVerifyDomainResponse = {
  verified: boolean;
  verification?: VercelVerificationChallenge[];
};

type VercelDomainConfigResponse = {
  misconfigured?: boolean;
  configuredBy?: string | null;
  serviceType?: string | null;
  nameservers?: string[];
};

type VercelErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

type VercelProjectDomain = {
  name: string;
  verified: boolean;
};

function getVercelConfig() {
  const token =
    process.env.VERCEL_TOKEN?.trim() || process.env.VERCEL_API_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim();

  if (!token || !projectId) {
    throw new Error("Missing VERCEL_TOKEN (or VERCEL_API_TOKEN) / VERCEL_PROJECT_ID.");
  }

  return { token, projectId, teamId };
}

function buildProjectDomainsUrl(projectId: string, teamId?: string) {
  const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/domains`);
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  return url;
}

function buildProjectDomainsListUrl(projectId: string, teamId?: string) {
  const url = new URL(`https://api.vercel.com/v9/projects/${projectId}/domains`);
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  return url;
}

function buildProjectDomainItemUrl(projectId: string, domain: string, teamId?: string) {
  const url = new URL(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`
  );
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  return url;
}

function buildVerifyDomainUrl(projectId: string, domain: string, teamId?: string) {
  const url = new URL(
    `https://api.vercel.com/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}/verify`
  );
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  return url;
}

function buildDomainConfigUrl(domain: string, teamId?: string) {
  const url = new URL(`https://api.vercel.com/v6/domains/${encodeURIComponent(domain)}/config`);
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  return url;
}

export async function addDomainToVercelProject(domain: string) {
  const normalizedDomain = domain.trim().toLowerCase();
  if (!normalizedDomain) {
    throw new Error("Domain is required.");
  }

  const { token, projectId, teamId } = getVercelConfig();
  const addUrl = buildProjectDomainsUrl(projectId, teamId);

  const addResponse = await fetch(addUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: normalizedDomain }),
    cache: "no-store",
  });

  if (!addResponse.ok) {
    const errorBody = (await addResponse.json().catch(() => ({}))) as VercelErrorResponse;
    const message = errorBody.error?.message || addResponse.statusText;
    const lowerMessage = message.toLowerCase();

    // Per Vercel API docs, existing domains can return 400.
    if (
      addResponse.status === 400 &&
      (lowerMessage.includes("already exists") || lowerMessage.includes("already assigned"))
    ) {
      return { domain: normalizedDomain, verified: true };
    }

    throw new Error(`Vercel domain add failed: ${message}`);
  }

  const added = (await addResponse.json()) as VercelAddDomainResponse;
  if (added.verified) {
    return { domain: normalizedDomain, verified: true };
  }

  // Domain exists on project but DNS might not be verified yet.
  const verifyUrl = buildVerifyDomainUrl(projectId, normalizedDomain, teamId);
  const verifyResponse = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!verifyResponse.ok) {
    const errorBody = (await verifyResponse.json().catch(() => ({}))) as VercelErrorResponse;
    const message = errorBody.error?.message || verifyResponse.statusText;
    throw new Error(`Vercel domain verification failed: ${message}`);
  }

  const verifiedData = (await verifyResponse.json()) as VercelVerifyDomainResponse;
  return {
    domain: normalizedDomain,
    verified: Boolean(verifiedData.verified),
    verification: verifiedData.verification ?? added.verification ?? [],
  };
}

export async function removeDomainFromVercelProject(domain: string) {
  const normalizedDomain = domain.trim().toLowerCase();
  if (!normalizedDomain) {
    throw new Error("Domain is required.");
  }

  const { token, projectId, teamId } = getVercelConfig();
  const removeUrl = buildProjectDomainItemUrl(projectId, normalizedDomain, teamId);
  const response = await fetch(removeUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.ok) return;

  const errorBody = (await response.json().catch(() => ({}))) as VercelErrorResponse;
  const message = errorBody.error?.message || response.statusText;
  const lowerMessage = message.toLowerCase();

  // Treat already-missing/not-assigned domain as a no-op.
  if (
    response.status === 404 ||
    lowerMessage.includes("not found") ||
    lowerMessage.includes("does not exist")
  ) {
    return;
  }

  throw new Error(`Vercel domain remove failed: ${message}`);
}

export async function verifyVercelProjectDomainConfiguration(
  domain: string
): Promise<boolean> {
  const normalizedDomain = domain.trim().toLowerCase();
  if (!normalizedDomain) return false;

  const { token, teamId } = getVercelConfig();
  const configUrl = buildDomainConfigUrl(normalizedDomain, teamId);
  console.log("[vercel:verifyVercelProjectDomainConfiguration] checking", {
    domain: normalizedDomain,
    endpoint: configUrl.toString(),
  });

  const response = await fetch(configUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as VercelErrorResponse;
    const message = errorBody.error?.message || response.statusText;
    throw new Error(`Vercel config check failed for ${normalizedDomain}: ${message}`);
  }

  const config = (await response.json()) as VercelDomainConfigResponse;
  const isConfigured =
    typeof config.misconfigured === "boolean"
      ? !config.misconfigured
      : Boolean(config.configuredBy || config.serviceType);

  console.log("[vercel:verifyVercelProjectDomainConfiguration] result", {
    domain: normalizedDomain,
    misconfigured: config.misconfigured,
    configuredBy: config.configuredBy ?? null,
    serviceType: config.serviceType ?? null,
    nameservers: config.nameservers ?? [],
    isConfigured,
  });

  return isConfigured;
}

export async function getVercelProjectDomains(): Promise<VercelProjectDomain[]> {
  const { token, projectId, teamId } = getVercelConfig();
  const url = buildProjectDomainsListUrl(projectId, teamId);
  console.log("[vercel:getVercelProjectDomains] fetching", {
    projectId,
    teamId: teamId ?? null,
    endpoint: url.toString(),
  });
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as VercelErrorResponse;
    const message = errorBody.error?.message || response.statusText;
    throw new Error(`Vercel domain list failed: ${message}`);
  }

  const raw = (await response.json()) as
    | { domains?: Array<{ name?: string; verified?: boolean }> }
    | Array<{ name?: string; verified?: boolean }>;
  const domains = Array.isArray(raw) ? raw : raw.domains ?? [];
  console.log("[vercel:getVercelProjectDomains] raw-count", domains.length);

  const normalized = domains
    .map((item) => ({
      name: item.name?.trim().toLowerCase() ?? "",
      verified: Boolean(item.verified),
    }))
    .filter((item) => Boolean(item.name));

  console.log("[vercel:getVercelProjectDomains] normalized", normalized);
  return normalized;
}
