"use client";

import useSWR from "swr";
import { getWebsitesByDomain } from "../db";

export function useWebsites(domainId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    domainId ? [`websites`, domainId] : null,
    ([, id]) => getWebsitesByDomain(id)
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
