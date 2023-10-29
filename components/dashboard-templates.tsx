"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import useDeleteTemplate from "./useDeleteTemplate";
// import useDeleteRecapp from "./useDeleteRecapp";
import { api } from "../convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Check, XCircle } from "lucide-react";
export default function DashboardTemplates({
  userId,
}: {
  userId: Id<"users"> | null;
}) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string>("");
  const templates = useQuery(api.templates.getRecappTemplates, {
    user_id: userId!,
  });
  //   const deleteRecapp = useDeleteRecapp();
  const deleteTemplate = useDeleteTemplate();

  const handleUnsubscribe = (templateId: Id<"template"> | null) => {
    deleteTemplate({ templateId: templateId });
  };
  //   const handleDeleteRecapp = (recappId: Id<"recapp"> | null) => {
  //     deleteRecapp({ recappId: recappId });
  //   };

  if (!userId) {
    return <div className="spinner text-green-400">Loading...</div>; // Replace with an appropriate spinner component or style
  }

  return (
    <div className="text-white p-4 space-y-4 h-full">
      <h3 className="text-2xl md:text-3xl font-bold text-center text-green-400">
        Subscribed Recapps
      </h3>
      {templates?.map((template) => (
        <a
          href="/dashboard/recappd"
          key={template._creationTime}
          className="block relative"
        >
          <div className="bg-gray-700 p-4 rounded-md border-l-4 border-green-600 shadow-md transition hover:bg-gray-600">
            <h2 className="font-semibold text-lg mb-2">
              {template.category.toUpperCase()}
            </h2>
            <p className="text-gray-400">
              Duration: <span className="text-white">{template.length}</span>{" "}
              minutes
            </p>
            <p className="text-gray-400">
              Frequency: Every{" "}
              <span className="text-white">{template.interval}</span> days
            </p>
            <p className="text-gray-400 mt-2">
              Subscribed since:{" "}
              <span className="text-white">
                {new Date(template._creationTime).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div
            onMouseEnter={() => setHoveredTemplate(template._id)}
            onMouseLeave={() => setHoveredTemplate("")}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleUnsubscribe(template._id);
            }}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
          >
            {hoveredTemplate === template._id ? (
              <XCircle className="w-10 h-10 text-red-500 border-red-500" />
            ) : (
              <Check className="border-2 p-1.5 rounded-full w-10 h-10 text-green-600 border-green-600" />
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
