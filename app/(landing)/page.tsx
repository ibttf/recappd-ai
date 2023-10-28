import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";

export default function Page() {
  return (
    <main className="h-screen">
      <LandingNavbar />
      <LandingHero />
    </main>
  );
}
