"use client";

import useSWR from "swr";
import { getAnalytics_all } from "@/src/services/posthog/data.all/query.all";

const fetcher = async ([websiteId, range]: [string, "1d" | "7d" | "30d" | "all"]) => {
  return await getAnalytics_all(websiteId, range);
};

export function useAnalytics(websiteId: string, range: "1d" | "7d" | "30d" | "all" = "7d") {
  const { data, error, isLoading } = useSWR(
    websiteId ? ["analytics", websiteId, range] : null,
    () => fetcher([websiteId, range]),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 5, // 5 min dedupe cache
    }
  );

  return {
    analytics: data,
    loading: isLoading,
    error,
  };
}
