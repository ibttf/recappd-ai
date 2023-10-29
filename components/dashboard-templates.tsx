"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useQuery } from "convex/react";
import useDeleteTemplate from "./useDeleteTemplate";
import useDeleteRecapp from "./useDeleteRecapp";
import { api } from "../convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, PlayIcon } from "lucide-react";
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

  const deleteRecapp = useDeleteRecapp();
  const deleteTemplate = useDeleteTemplate();

  const handleUnsubscribe = (templateId: Id<"template"> | null) => {
    deleteTemplate({ templateId: templateId });
  };

  const [isRecappDialogOpen, setRecappDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<Id<"template"> | null>(null);

  const openTemplateDialog = (id: Id<"template">) => {
    setSelectedTemplateId(id);
    setTemplateDialogOpen(true);
  };

  const closeTemplateDialog = () => {
    setSelectedTemplateId(null);
    setTemplateDialogOpen(false);
  };

  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

  if (!userId) {
    return <div className="spinner text-green-400">Loading...</div>; // Replace with an appropriate spinner component or style
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
              <h2 className="font-semibold text-2xl mb-2">
                {template.category.toUpperCase()}
              </h2>
              <div className="flex space-x-12">
                <p className="text-gray-400 mb-4">
                  Subscribed since:{" "}
                  <span className="text-white">
                    {new Date(template._creationTime).toLocaleDateString()}
                  </span>
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

            {/* Dialog for Template Deletion */}
            <Transition show={isTemplateDialogOpen} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
                onClose={closeTemplateDialog}
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                {/* Main Dialog Container */}
                <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-lg w-full mx-4">
                  {/* Dialog Title */}
                  <Dialog.Title className="text-2xl font-extrabold mb-4">
                    Are you sure you want to unsubscribe from this podcast?
                  </Dialog.Title>

                  {/* Buttons */}
                  <div className="flex justify-between mt-6">
                    {/* Yes Button */}
                    <button
                      onClick={() => handleUnsubscribe(selectedTemplateId)}
                      className="px-6 py-2 bg-green-500 text-white rounded-full font-bold text-xl hover:bg-green-600"
                    >
                      Yes
                    </button>

                    {/* No Button */}
                    <button
                      onClick={closeTemplateDialog}
                      className="px-6 py-2 bg-red-500 text-white rounded-full font-bold text-xl hover:bg-red-600"
                    >
                      No
                    </button>
                  </div>
                </div>
              </Dialog>
            </Transition>
            <div
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                openTemplateDialog(template._id);
              }}
              className="text-right cursor-pointer"
            >
              <X className="w-10 h-10 text-red-500 rounded-full " />
            </div>
          </div>

          {/* Recapps */}
          <div className="flex mx-4">
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
    </div>
  );
}
