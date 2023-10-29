"use client";
import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import DashboardTemplates from "@/components/dashboard-templates";
import useStoreUserEffect from "./useStoreUserEffect";
export default function Page() {
  const userId = useStoreUserEffect();
  return (
    <div>
      <DashboardHeader userId={userId} />
      <DashboardTemplates userId={userId} />
    </div>
  );
}
