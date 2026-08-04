"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    const fullText = args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" ");

    if (
      fullText.includes("Encountered a script tag") ||
      fullText.includes("fdprocessedid") ||
      (fullText.includes("hydration") && fullText.includes("fdprocessedid"))
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
