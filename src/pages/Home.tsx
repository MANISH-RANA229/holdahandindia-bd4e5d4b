/**
 * Home page — composed from section components in src/components/home/.
 * Each section is a standalone component to keep files under 600 lines.
 */
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactStats } from "@/components/home/ImpactStats";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MissionSection } from "@/components/home/MissionSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { StoriesSection } from "@/components/home/StoriesSection";
import { SupportSection } from "@/components/home/SupportSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HomeNavbar />
      <HeroSection />
      <ImpactStats />
      <FeaturesSection />
      <MissionSection />
      <HowItWorksSection />
      <StoriesSection />
      <SupportSection />
      <CtaBanner />
      <HomeFooter />
    </div>
  );
}
