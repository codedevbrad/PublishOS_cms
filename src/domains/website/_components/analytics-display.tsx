"use client";

import { useState } from "react";
import { useAnalytics } from "../contexts/useAnalytics";

interface AnalyticsDisplayProps {
  websiteId: string;
}

type TimeRange = "1d" | "7d" | "30d" | "all";

export function AnalyticsDisplay({ websiteId }: AnalyticsDisplayProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7d");
  const { analytics, loading, error } = useAnalytics(websiteId, selectedRange);

  const ranges: { value: TimeRange; label: string }[] = [
    { value: "1d", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "all", label: "All Time" },
  ];

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
        <p className="font-semibold">Error loading analytics</p>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : "Failed to fetch analytics data"}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2 border-b">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedRange(range.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedRange === range.value
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Row 1: Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Pageviews" value={analytics.pageviews.toLocaleString()} />
        <StatCard title="Unique Visitors" value={analytics.uniqueVisitors.toLocaleString()} />
      </div>


      {/* Row 3: Top Pages and Top Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.topPages.length > 0 && (
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
            <div className="space-y-2">
              {analytics.topPages.map((page, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{page.url}</span>
                  <span className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.topSources.length > 0 && (
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Sources</h3>
            <div className="space-y-2">
              {analytics.topSources.map((source, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{source.source || "Direct"}</span>
                  <span className="text-sm text-muted-foreground">{source.visits.toLocaleString()} visits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 4: Devices and Top Cities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.devices.length > 0 && (
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Devices</h3>
            <div className="space-y-2">
              {analytics.devices.map((device, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{device.device || "Unknown"}</span>
                  <span className="text-sm text-muted-foreground">{device.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.cities.length > 0 && (
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Cities</h3>
            <div className="space-y-2">
              {analytics.cities.map((city, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{city.city}</span>
                  <span className="text-sm text-muted-foreground">{city.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
