import "@mantine/core/styles.css";
import "./globals.css";

import type { ReactNode } from "react";
import {
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import project from "../../../../project.json";

const forestPalette = [
  "#EAF0E8",
  "#DCE2DC",
  "#C2D4C8",
  "#9EBAA8",
  "#6B997C",
  "#436A4E",
  "#16654C",
  "#0B2E22",
  "#072118",
  "#051610",
] as const;

const theme = createTheme({
  primaryColor: "forest",
  colors: {
    forest: forestPalette,
    teal: forestPalette,
  },
});

export const metadata = {
  title: `${project.displayName} — ${project.tagline}`,
  description: project.portalTitle,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>

      <body suppressHydrationWarning>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
