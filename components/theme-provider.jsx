"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  const { theme } = useTheme(); 

  React.useEffect(() => {
    console.log("✅ ThemeProvider Loaded!");
    console.log("🎨 Current Theme:", theme);
  }, [theme]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
