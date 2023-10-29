"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import useStoreUserEffect from "./useStoreUserEffect";
import useCreateTemplateEffect from "./useCreateTemplateEffect";

const DashboardPage = () => {
  const userId = useStoreUserEffect();

  const createTemplate = useCreateTemplateEffect();
  interface ResponseProps {
    text: string;
    file: string;
  }
  const [category, setCategory] = useState<string>("Technology");
  const [podcastLength, setPodcastLength] = useState<number>(10);
  const [podcastInterval, setPodcastInterval] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmitForm() {
    setLoading(true);
    try {
      console.log("very beginning of handle submit form is working");
      const templateId = await createTemplate({
        category: category.toLowerCase(),
        podcastLength: podcastLength,
        podcastInterval: podcastInterval,
        userId: userId,
      });
      console.log("template id created", templateId);
      const response = await fetch("/api/recap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category.toLowerCase(),
          podcastLength: podcastLength,
          podcastInterval: podcastInterval,
          templateId,
        }),
      });
      console.log("response recieved", response);

      if (!response.ok) {
        throw new Error("Response from server was not ok");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false when form submission ends, whether it's a success or failure
    }
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-green-400">
          Create a Recapp Template
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Select the news you want to listen to and generate a Recapp now.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        <div className="w-full h-full mx-auto mt-10 border-green-200 border-4 p-6 rounded-md shadow-md">
          <label className="block text-lg font-bold text-green-600 mb-2 text-center">
            Category:
          </label>
          <form>
            {/* Categories as buttons */}
            <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                "Top",
                "Business",
                "Entertainment",
                "Environment",
                "Food",
                "Health",
                "Politics",
                "Science",
                "Sports",
                "Technology",
                "Tourism",
                "World",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={(e) => {
                    e.preventDefault();
                    setCategory(cat);
                  }}
                  className={`p-2 border rounded-md ${
                    category === cat ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>
          {/* Podcast Length */}
          <div className="grid grid-cols-2">
            <div className="w-full flex justify-center flex-col items-center mt-4 mb-3">
              <label className="block text-lg font-bold text-green-600 mb-2">
                Podcast Length (min):
              </label>
              <input
                type="number"
                min="5"
                max="15"
                value={podcastLength}
                onChange={(e) => setPodcastLength(Number(e.target.value))}
                className="w-fit mx-auto p-2 text-lg text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-600"
                style={{
                  appearance: "none",
                  transition: "opacity .2s",
                }}
              />
            </div>
            <div className="w-full flex justify-center flex-col items-center mt-4 mb-3">
              <label className="block text-lg font-bold text-green-600 mb-2">
                Make a Podcast Every (days):
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={podcastInterval}
                onChange={(e) => setPodcastInterval(Number(e.target.value))}
                className="w-fit mx-auto p-2 text-lg text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:border-green-600"
                style={{
                  appearance: "none",
                  transition: "opacity .2s",
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 mb-4">
            <Button
              variant="recappd"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
            >
              {loading ? "Loading..." : "Create My Template"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
