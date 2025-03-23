"use client";
import { useTheme } from "next-themes";

export default function ThemeTest() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current Theme: {theme || "Loading..."}</p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
    </div>
  );
}
