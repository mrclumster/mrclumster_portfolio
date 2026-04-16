"use client";

import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";

export function GithubCalendarClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-24" />;

  return (
    <GitHubCalendar
      username="mrclumster"
      blockSize={10}
      blockMargin={3}
      fontSize={10}
      colorScheme="dark"
      theme={{
        dark: ["#1e1e2e", "#3730a3", "#4f46e5", "#6366f1", "#818cf8"],
      }}
    />
  );
}
