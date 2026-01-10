"use client";

import useSWR from "swr";
import { getOrganisation, getCurrentUserOrganisation } from "../db";

export function useOrganisation(organisationId: string | null) {
  const fetcher = () => {
    if (!organisationId) return null;
    return getOrganisation(organisationId);
  };
  const { data, error, isLoading, mutate } = useSWR(
    organisationId ? `organisation-${organisationId}` : null,
    fetcher
  );
  return { data, error, isLoading, mutate };
}

export function useCurrentUserOrganisation() {
  const fetcher = () => getCurrentUserOrganisation();
  const { data, error, isLoading, mutate } = useSWR("current-user-organisation", fetcher);
  return { data, error, isLoading, mutate };
}
