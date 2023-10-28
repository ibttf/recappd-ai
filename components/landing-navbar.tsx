"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useConvexAuth } from "convex/react";

import { Button } from "@/components/ui/button";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

export const LandingNavbar = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-10 w-10 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className="text-2xl font-bold text-green-50">Recappd</h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isAuthenticated ? "/dashboard" : "/sign-up"}>
          <Button variant="recappd">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
};
