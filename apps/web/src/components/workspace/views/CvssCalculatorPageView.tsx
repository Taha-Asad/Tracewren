import React from "react";
import { Box, Stack, Text } from "@mantine/core";
import { CvssCalculatorWidget } from "../CvssCalculatorWidget";

export function CvssCalculatorPageView() {
  return (
    <Box px={{ base: "md", md: 32 }} py={{ base: "md", md: 28 }}>
      <Stack gap="xl">
        <Box>
          <Text
            component="h1"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            FIRST.org CVSS 3.1 &amp; SLA Policy Calculator
          </Text>
          <Text size="sm" c="dimmed">
            Domain calculation engine executing official FIRST.org base metric equations and severity-driven SLA countdown windows.
          </Text>
        </Box>
        <Box style={{ maxWidth: 980 }}>
          <CvssCalculatorWidget />
        </Box>
      </Stack>
    </Box>
  );
}
