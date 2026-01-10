"use client";

import useSWR from "swr";
import { getDomainsByOrganisation, getDomain } from "../db";

export function useDomains(organisationId: string | null) {
  const fetcher = () => {
    if (!organisationId) return null;
    return getDomainsByOrganisation(organisationId);
  };
  const { data, error, isLoading, mutate } = useSWR(
    organisationId ? `domains-${organisationId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export function useDomain(domainId: string | null) {
  const fetcher = () => {
    if (!domainId) return null;
    return getDomain(domainId);
  };
  const { data, error, isLoading, mutate } = useSWR(
    domainId ? `domain-${domainId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
}
