"use client";
import { UserProfile } from "@clerk/clerk-react";

export default function Settings() {
  return (
    <div className="w-fit mx-auto">
      <UserProfile />
    </div>
  );
}
