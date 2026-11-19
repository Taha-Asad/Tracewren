import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { ProgramItem, ReportItem } from "../types";
import { ArrowRightIcon } from "../icons";

interface InHouseProgramsViewProps {
  programsList: ProgramItem[];
  reportsList?: ReportItem[];
  setCreateProgOpen: (open: boolean) => void;
  setViewMode: (mode: any) => void;
  onSelectProgramReports?: (programSlug: string) => void;
}

export const InHouseProgramsView: React.FC<InHouseProgramsViewProps> = ({
  programsList,
  reportsList = [],
  setCreateProgOpen,
  setViewMode,
  onSelectProgramReports,
}) => {
  const getScopeCount = (slug: string, activeCount?: number) => {
    const fromList = reportsList?.filter((r) => r.programSlug === slug).length || 0;
    return Math.max(fromList, activeCount || 0);
  };
  return (
    <Box px={{ base: "md", md: 32 }} py={{ base: "md", md: 28 }}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Box>
            <Text component="h1" style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
              In-House Disclosure Programs
            </Text>
            <Text size="sm" c="dimmed">
              Define target perimeters, rules of engagement, and cryptographically signed RFC 9116 security.txt policies.
            </Text>
          </Box>
          <Button color="teal" size="sm" onClick={() => setCreateProgOpen(true)}>
            + Create New Program
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {programsList.map((prog) => (
            <Card key={prog.id} p="xl" radius="md" style={{ backgroundColor: "var(--surface-card)", border: "1px solid var(--border-contrast)" }}>
              <Group justify="space-between" align="flex-start" mb="sm">
                <Box>
                  <Text fw={700} size="md" style={{ color: "var(--text-primary)" }}>{prog.name}</Text>
                  <Text size="xs" ff="monospace" c="dimmed">{prog.slug}</Text>
                </Box>
                <Badge color={prog.visibility === "PUBLIC" ? "teal" : "gray"}>
                  {prog.visibility}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="md">
                {prog.safeHarborPolicy}
              </Text>

              <Box mb="md">
                <Text size="xs" fw={700} c="dimmed" mb={4}>IN-SCOPE TARGETS</Text>
                <Group gap={6}>
                  {prog.inScope.map((target) => (
                    <Badge key={target} size="xs" variant="outline" color="gray" style={{ textTransform: "none" }}>
                      {target}
                    </Badge>
                  ))}
                </Group>
              </Box>

              <Box mb="md">
                <Text size="xs" fw={700} c="dimmed" mb={4}>EXCLUDED OUT-OF-SCOPE ASSETS</Text>
                <Group gap={6}>
                  {prog.outOfScope.map((item) => (
                    <Badge key={item} size="xs" variant="light" color="red" style={{ textTransform: "none" }}>
                      {item}
                    </Badge>
                  ))}
                </Group>
              </Box>

              <Group justify="space-between" align="center" pt="sm" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <Group gap="md">
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (onSelectProgramReports) {
                        onSelectProgramReports(prog.slug);
                      }
                    }}
                  >
                    Active reports: <strong>{getScopeCount(prog.slug, prog.activeReportsCount)}</strong>
                  </Text>
                  <Text size="xs" c="dimmed">Designated defenders: <strong>{prog.defendersCount}</strong></Text>
                </Group>
                <Button
                  size="xs"
                  variant="light"
                  color="teal"
                  onClick={() => {
                    if (onSelectProgramReports) {
                      onSelectProgramReports(prog.slug);
                    } else {
                      setViewMode("reports");
                    }
                  }}
                  rightSection={<ArrowRightIcon size={12} />}
                >
                  View Scope Reports ({getScopeCount(prog.slug, prog.activeReportsCount)})
                </Button>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};
