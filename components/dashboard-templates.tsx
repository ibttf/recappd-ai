import React from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
export default function DashboardTemplates({
  userId,
}: {
  userId: Id<"users"> | null;
}) {
  const templates = useQuery(api.templates.getRecappTemplates, {
    user_id: userId!,
  });
  return (
    <div>
      {templates?.map((template) => (
        <div key={template._creationTime}>{template.category}</div>
      ))}
    </div>
  );
}
