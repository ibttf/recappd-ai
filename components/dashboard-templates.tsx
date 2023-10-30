"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import useDeleteTemplate from "./useDeleteTemplate";
import { api } from "../convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, PlayIcon } from "lucide-react";
import DashboardPlay from "./dashboard-play";
import Loading from "./Loading";
export default function DashboardTemplates({
  userId,
}: {
  userId: Id<"users"> | null;
}) {
  const templates = useQuery(api.templates.getRecappTemplates, {
    user_id: userId!,
  });
  let templateIds = templates?.map((template) => {
    return template._id;
  });
  const recapps = useQuery(api.recapp.getRecapps, {
    template_ids: templateIds! || [],
  });

  const deleteTemplate = useDeleteTemplate();

  const handleUnsubscribe =
    (templateId: Id<"template"> | null) => (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent event from bubbling up
      console.log("hello");
      console.log(templateId);
      deleteTemplate({ templateId: templateId });
    };

  const [currentAudio, setCurrentAudio] = useState<string>("");

  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

  if (!userId) {
    return (
      <div className="spinner text-green-400">
        <Loading />
      </div>
    );
  }
  if (!templates || templates.length == 0) {
    return (
      <div className="text-red-400 md:text-3xl text-2xl font-semibold p-8 space-y-4 h-full bg-gray-700 text-center">
        No recapps found.
      </div>
    );
  }
  return (
    <div className="text-white p-4 space-y-4 h-full bg-gray-700">
      {templates?.map((template) => (
        <div
          key={template._creationTime}
          className="mb-4 p-4 rounded-md bg-gray-800 shadow-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              {/* Template Information */}
              <h2 className="font-semibold text-2xl mb-2">{template.name!}</h2>
              <div className="flex space-x-12">
                <p className="text-gray-400 mb-4">
                  Subscribed since:{" "}
                  <span className="text-white">
                    {new Date(template._creationTime).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-400 ml-4">
                  Category:{" "}
                  <span className="text-white">{template.category}</span>
                </p>
                <p className="text-gray-400 ml-4">
                  Average length:{" "}
                  <span className="text-white">{template.length}</span> minutes
                </p>
                <p className="text-gray-400 ml-4">
                  Every <span className="text-white">{template.interval}</span>{" "}
                  day(s)
                </p>
              </div>
            </div>

            <div
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                handleUnsubscribe(template._id)(e);
              }}
              className="text-right cursor-pointer"
            >
              <X className="w-10 h-10 text-red-500 rounded-full " />
            </div>
          </div>

          {/* Recapps */}
          <div className="flex mx-4 space-x-12">
            {recapps?.map((recapp) => {
              if (recapp.template_id === template._id) {
                return (
                  <div
                    key={recapp._creationTime}
                    className="flex flex-col items-center"
                  >
                    {/* Square Icon */}
                    <div
                      className="relative w-32 h-32 bg-gray-900 p-4 hover:bg-gray-700 transition-colors cursor-pointer mb-2"
                      onClick={() => {
                        const getAudio = new URL(`${convexSiteUrl}/getAudio`);
                        getAudio.searchParams.set(
                          "storageId",
                          recapp.storageId
                        );
                        setCurrentAudio(getAudio.href);
                      }}
                    >
                      {/* Play icon */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 opacity-70 ">
                        <PlayIcon className="w-10 h-10 text-white" />
                      </div>

                      {/* MM/DD Date */}
                      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-white font-bold">
                        {new Date(recapp._creationTime).toLocaleDateString(
                          "en-US",
                          { month: "2-digit", day: "2-digit" }
                        )}
                      </div>
                    </div>

                    {/* Transcript Title */}
                    <div className="text-white">
                      {recapp.transcript.substring(0, 15) + "..."}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
      {currentAudio ? <DashboardPlay audioUrl={currentAudio} /> : <></>}
    </div>
  );
}
