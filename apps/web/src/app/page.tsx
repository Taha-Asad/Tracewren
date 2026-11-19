"use client";

import { Box } from "@mantine/core";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { EvidenceBannerSection } from "@/components/landing/EvidenceBannerSection";
import { ToolsetSection } from "@/components/landing/ToolsetSection";
import { CvssShowcaseSection } from "@/components/landing/CvssShowcaseSection";
import { CheckpointSection } from "@/components/landing/CheckpointSection";
import { WorkBehindSection } from "@/components/landing/WorkBehindSection";
import { VideoGuideSection } from "@/components/landing/VideoGuideSection";
import { BothSidesSection } from "@/components/landing/BothSidesSection";
import { CtaBannerSection } from "@/components/landing/CtaBannerSection";

export default function HomePage() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--canvas-bg)",
      }}
    >
      {/* 1. Decoupled Glassmorphic Navbar */}
      <Navbar />

      {/* 2. Main Page Content (Max Width 1600px Containers) */}
      <Box component="main" style={{ flex: 1 }}>
        {/* Section 1: Hero Section */}
        <HeroSection />

        {/* Section 2: Dark Green Evidence Continuity Card */}
        <EvidenceBannerSection />

        {/* Section 3: 4 Toolset Feature Cards (Alternating Background) */}
        <ToolsetSection />

        {/* Section 3b: CVSS 3.1 Severity & Automated SLA Showcase */}
        <CvssShowcaseSection />

        {/* Section 4: A Deployed Fix is a Checkpoint (Gradient Card with Dotting Timeline & Image) */}
        <CheckpointSection />

        {/* Section 5: See the Work Behind Every Outcome (Bar Graph + Pie Chart + Subcards - Alternating Background) */}
        <WorkBehindSection />

        {/* Section 6: See How Caulvyn Works (Full-Width Video Walkthrough & Guides Below) */}
        <VideoGuideSection />

        {/* Section 7: Built for Both Sides of the Report (Teams & Researchers + Interactive FAQ - Alternating Background) */}
        <BothSidesSection />

        {/* Section 8: Give Your Next Report a Clear Path Forward (Pre-Footer Ambient Gradient CTA Banner) */}
        <CtaBannerSection />
      </Box>

      {/* 3. Decoupled Responsive Footer (Max Width 1600px) */}
      <Footer />
    </Box>
  );
}
