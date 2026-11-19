"use client";

import { useMantineColorScheme } from "@mantine/core";
import { flushSync } from "react-dom";

interface ThemeToggleProps {
  size?: number;
  color?: string;
}

export function ThemeToggle({ size = 36, color }: ThemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Read current theme directly from the DOM attribute for instant, reliable state
    const currentScheme =
      document.documentElement.getAttribute("data-mantine-color-scheme") ||
      "light";
    const nextScheme = currentScheme === "dark" ? "light" : "dark";

    // Fallback if View Transitions API is not supported in the browser
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setColorScheme(nextScheme);
      document.documentElement.setAttribute(
        "data-mantine-color-scheme",
        nextScheme
      );
      return;
    }

    // Determine the exact center of the button as the ripple origin
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const doc = document as any;

    // Use flushSync so React immediately re-renders the DOM before the transition snapshot is captured
    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setColorScheme(nextScheme);
      });
      document.documentElement.setAttribute(
        "data-mantine-color-scheme",
        nextScheme
      );
    });

    // Animate the incoming theme (::view-transition-new) as an expanding circular ripple
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme color scheme"
      title="Toggle light/dark mode"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--surface-subtle, rgba(0, 0, 0, 0.04))",
        border: "1px solid var(--border-contrast, rgba(0, 0, 0, 0.1))",
        borderRadius: "8px",
        cursor: "pointer",
        color: color || "var(--text-primary, #1A2225)",
        padding: 0,
        flexShrink: 0,
        transition:
          "background-color 150ms ease, color 150ms ease, transform 150ms ease, border-color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--surface-card, rgba(0, 0, 0, 0.08))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--surface-subtle, rgba(0, 0, 0, 0.04))";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.92)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Radiant Sun Icon (Visible in Dark Mode via CSS, Switches to Light) */}
      <svg
        className="theme-toggle-icon-sun"
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "none" }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>

      {/* Crescent Moon Icon (Visible in Light Mode via CSS, Switches to Dark) */}
      <svg
        className="theme-toggle-icon-moon"
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "block" }}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  );
}
