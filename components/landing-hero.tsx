"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const LandingHero = () => {
  return (
    <div className="text-green-950 dark:text-white font-bold py-36 pt-80 text-center space-y-5 ">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold ">
        <h1>Recappd</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r dark:from-green-400 dark:to-green-600 from-green-700 to-green-900 pb-4">
          <TypewriterComponent
            options={{
              strings: ["Keep up with the news."],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div>
        <Link href="dashboard">
          <Button
            variant="recappd"
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            Start Listening Today.
          </Button>
        </Link>
      </div>
    </div>
  );
};
