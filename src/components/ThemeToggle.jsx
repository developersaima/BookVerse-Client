"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl border border-base-content/10 bg-base-200/50 hover:bg-base-200 hover:border-primary/30 text-base-content/80 hover:text-primary transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <FiSun className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100" />
      ) : (
        <FiMoon className="w-4 h-4 transition-transform duration-500 rotate-0 scale-100" />
      )}
    </button>
  );
}