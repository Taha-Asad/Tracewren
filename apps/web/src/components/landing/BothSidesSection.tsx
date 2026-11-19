"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  badges: string[];
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "who-is-caulvyn-for",
    number: "01",
    question: "Who is Caulvyn for?",
    answer:
      "Software teams that run a private vulnerability disclosure or bug bounty program, and security researchers who report high-quality vulnerabilities. It gives both sides a shared, structured space to review evidence and confirm fixes.",
    badges: ["Engineering Teams", "Bug Bounty Programs", "Security Researchers"],
  },
  {
    id: "how-do-researchers-submit",
    number: "02",
    question: "How do researchers submit reports?",
    answer:
      "Researchers submit through a scoped, authenticated portal with structured CVSS scoring, reproduction steps, and encrypted evidence attachments. Clear disclosure guidelines ensure every report stays within agreed program boundaries.",
    badges: ["Scoped Submission", "CVSS v3.1 Scoring", "AES-256 Attachments"],
  },
  {
    id: "what-happens-after-fix",
    number: "03",
    question: "What happens after a fix is deployed?",
    answer:
      "The engineering team registers a deployment checkpoint and dispatches a formal retest request to the researcher. The researcher confirms the remediation in staging or production before the report is officially resolved and closed.",
    badges: ["Deployment Checkpoint", "Retest Dispatch", "Verified Remediation"],
  },
  {
    id: "how-is-data-protected",
    number: "04",
    question: "How does Caulvyn protect sensitive disclosure data?",
    answer:
      "All disclosures, proof files, and team discussions remain isolated within tenant cryptographic boundaries using AES-256-GCM encryption, authenticated access controls, and strict RFC 9116 security policies.",
    badges: ["AES-256-GCM", "Tenant Isolation", "RFC 9116 Compliant"],
  },
];

export function BothSidesSection() {
  const [openId, setOpenId] = useState<string | null>("who-is-caulvyn-for");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <Box
      component="section"
      id="both-sides"
      aria-labelledby="both-sides-heading"
      style={{
        width: "100%",
        backgroundColor: "var(--section-alt-bg, #F4EFE6)",
        color: "var(--text-primary, #181C19)",
        borderTop: "1px solid var(--section-alt-border, #E8E3D8)",
        borderBottom: "1px solid var(--section-alt-border, #E8E3D8)",
        paddingTop: "clamp(3.5rem, 5.5vw, 5rem)",
        paddingBottom: "clamp(4rem, 6vw, 5.5rem)",
        transition: "background-color 200ms ease, border-color 200ms ease",
      }}
    >
      <Container
        size="1600px"
        px={{ base: "md", md: "xl" }}
        style={{ maxWidth: "1600px", width: "100%" }}
      >
        {/* Section Top Header */}
        <Box mb={{ base: "xl", md: 36 }}>
          <Title
            id="both-sides-heading"
            order={2}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--type-h2)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Built for both sides of the report.
          </Title>
          <Text
            style={{
              fontSize: "var(--type-lead)",
              color: "var(--text-secondary)",
              marginTop: "10px",
              maxWidth: "60ch",
              lineHeight: 1.6,
            }}
          >
            Clear boundaries for security researchers. High-assurance verification workflows for software engineering teams.
          </Text>
        </Box>

        {/* 2-Column Responsive Grid: Persona Cards on Left + Custom Accordion on Right */}
        <Grid gap={{ base: "lg", md: "xl", lg: 32 }} align="flex-start">
          {/* Left Column: Two Persona Cards (Teams & Researchers) */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Stack gap="md">
              {/* Card 1: For Teams */}
              <Paper
                className="standard-card-padding landing-interactive-card"
                withBorder
                style={{
                  padding:
                    "clamp(16px, 2.5vw, 22px) clamp(14px, 2.5vw, 22px) 18px clamp(14px, 2.5vw, 22px)",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface-card)",
                  borderColor: "var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 1px 3px rgba(24, 28, 25, 0.04)",
                  cursor: "default",
                  flex: 1,
                }}
              >
                <Stack gap="sm">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap" align="center">
                      {/* Illuminated Team Icon */}
                      <Box
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "10px",
                          backgroundColor:
                            "var(--card-icon-bg, rgba(11, 46, 34, 0.07))",
                          border:
                            "1px solid var(--card-icon-border, rgba(11, 46, 34, 0.12))",
                          color: "var(--card-icon-color, #0B2E22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </Box>
                      <Box>
                        <Text
                          fw={700}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.12rem",
                            color: "var(--text-primary)",
                            lineHeight: 1.2,
                          }}
                        >
                          For teams
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                            marginTop: 1,
                          }}
                        >
                          Engineering & Security Operations
                        </Text>
                      </Box>
                    </Group>

                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        backgroundColor: "var(--card-icon-bg)",
                        color: "var(--card-icon-color)",
                        border: "1px solid var(--card-icon-border)",
                      }}
                    >
                      DEFENDER
                    </span>
                  </Group>

                  <Text
                    size="sm"
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      marginTop: 4,
                      fontSize: "0.92rem",
                    }}
                  >
                    Review reports, coordinate fixes, and keep a clear record from intake to verification.
                  </Text>

                  {/* Highlights Grid */}
                  <Box
                    pt="xs"
                    style={{
                      borderTop: "1px solid var(--border-subtle)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "8px",
                      marginTop: "6px",
                    }}
                  >
                    {[
                      "Structured CVSS triage",
                      "Remediation tracking",
                      "Retest checkpoint dispatch",
                    ].map((feature) => (
                      <Group key={feature} gap={6} wrap="nowrap" align="center">
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "var(--heading-accent)",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        />
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {feature}
                        </Text>
                      </Group>
                    ))}
                  </Box>
                </Stack>
              </Paper>

              {/* Card 2: For Researchers */}
              <Paper
                className="standard-card-padding landing-interactive-card"
                withBorder
                style={{
                  padding:
                    "clamp(16px, 2.5vw, 22px) clamp(14px, 2.5vw, 22px) 18px clamp(14px, 2.5vw, 22px)",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface-card)",
                  borderColor: "var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 1px 3px rgba(24, 28, 25, 0.04)",
                  cursor: "default",
                  flex: 1,
                }}
              >
                <Stack gap="sm">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap" align="center">
                      {/* Illuminated Researcher Icon */}
                      <Box
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "10px",
                          backgroundColor:
                            "var(--card-icon-bg, rgba(11, 46, 34, 0.07))",
                          border:
                            "1px solid var(--card-icon-border, rgba(11, 46, 34, 0.12))",
                          color: "var(--card-icon-color, #0B2E22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="4 17 10 11 4 5" />
                          <line x1="12" y1="19" x2="20" y2="19" />
                        </svg>
                      </Box>
                      <Box>
                        <Text
                          fw={700}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.12rem",
                            color: "var(--text-primary)",
                            lineHeight: 1.2,
                          }}
                        >
                          For researchers
                        </Text>
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                            marginTop: 1,
                          }}
                        >
                          Security Researchers & Bug Hunters
                        </Text>
                      </Box>
                    </Group>

                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        backgroundColor: "var(--card-icon-bg)",
                        color: "var(--card-icon-color)",
                        border: "1px solid var(--card-icon-border)",
                      }}
                    >
                      RESEARCHER
                    </span>
                  </Group>

                  <Text
                    size="sm"
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      marginTop: 4,
                      fontSize: "0.92rem",
                    }}
                  >
                    Submit reports with evidence, track the response, and confirm the fix before closure.
                  </Text>

                  {/* Highlights Grid */}
                  <Box
                    pt="xs"
                    style={{
                      borderTop: "1px solid var(--border-subtle)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "8px",
                      marginTop: "6px",
                    }}
                  >
                    {[
                      "Scoped disclosure portal",
                      "Evidence proof attachments",
                      "Remediation retest confirmation",
                    ].map((feature) => (
                      <Group key={feature} gap={6} wrap="nowrap" align="center">
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "var(--heading-accent)",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        />
                        <Text
                          size="xs"
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                          }}
                        >
                          {feature}
                        </Text>
                      </Group>
                    ))}
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>

          {/* Right Column: Custom Interactive High-Craft Accordion / FAQ */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Box
              role="region"
              aria-label="Frequently Asked Questions"
              style={{ width: "100%" }}
            >
              <Stack gap={12}>
                {FAQ_ITEMS.map((item) => {
                  const isOpen = openId === item.id;
                  return (
                    <Box
                      key={item.id}
                      className={`custom-faq-item ${isOpen ? "is-open" : ""}`}
                    >
                      <button
                        type="button"
                        className="custom-faq-trigger"
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${item.id}`}
                        id={`faq-trigger-${item.id}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              color: isOpen
                                ? "var(--heading-accent)"
                                : "var(--text-muted)",
                              backgroundColor: isOpen
                                ? "var(--card-icon-bg)"
                                : "var(--surface-subtle)",
                              border: "1px solid",
                              borderColor: isOpen
                                ? "var(--card-icon-border)"
                                : "var(--border-subtle)",
                              padding: "2px 7px",
                              borderRadius: "5px",
                              lineHeight: 1.2,
                              flexShrink: 0,
                              transition: "all 180ms ease",
                            }}
                          >
                            {item.number}
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "clamp(0.96rem, 1.6vw, 1.08rem)",
                              fontWeight: 700,
                              letterSpacing: "-0.015em",
                              color: "var(--text-primary)",
                              lineHeight: 1.3,
                            }}
                          >
                            {item.question}
                          </span>
                        </div>

                        <div className="custom-faq-chevron" aria-hidden="true">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </button>

                      <div
                        id={`faq-answer-${item.id}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${item.id}`}
                        className={`custom-faq-body ${isOpen ? "is-open" : ""}`}
                      >
                        <div className="custom-faq-content">
                          <div className="custom-faq-inner">
                            <Text
                              style={{
                                color: "var(--text-secondary)",
                                lineHeight: 1.65,
                                fontSize: "var(--type-body)",
                                margin: 0,
                              }}
                            >
                              {item.answer}
                            </Text>

                            {item.badges && item.badges.length > 0 && (
                              <Group gap={6} mt="xs" wrap="wrap">
                                {item.badges.map((badge) => (
                                  <span
                                    key={badge}
                                    style={{
                                      fontSize: "0.7rem",
                                      fontFamily: "var(--font-mono)",
                                      fontWeight: 600,
                                      padding: "2px 8px",
                                      borderRadius: "4px",
                                      backgroundColor: "var(--surface-subtle)",
                                      color: "var(--text-secondary)",
                                      border: "1px solid var(--border-subtle)",
                                    }}
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </Group>
                            )}
                          </div>
                        </div>
                      </div>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
