"use client";
import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
export const LandingHero = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <div className="flex">
      <div className="w-full text-green-50 dark:text-white font-bold py-36 pt-80 text-center space-y-5 ">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold ">
          <h1>Get Your News</h1>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 pb-4">
            <TypewriterComponent
              options={{
                strings: ["Recappd."],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
        <div>
          <Link href={isAuthenticated ? "/dashboard" : "/sign-up"}>
            <Button
              variant="recappd"
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
            >
              Start Listening Today.
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-3/4 flex flex-col justify-center items-end pt-60 pr-10 space-y-4">
        <div className="rounded-xl transform -rotate-3">
          <img src="/home1.png" className="rounded-xl shadow-lg"></img>
        </div>
        <div className="rounded-xl transform rotate-3 -mt-10">
          <img src="/home2.png" className="rounded-xl shadow-lg"></img>
        </div>
      </div>
    </div>
  );
};
