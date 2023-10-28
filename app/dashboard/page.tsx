"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
const DashboardPage = () => {
  const [category, setCategory] = useState<string>("technology");
  const [podcastLength, setPodcastLength] = useState<number>(10);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmitForm() {
    setLoading(true);
    try {
      const response = await fetch("/api/recap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          podcastLength: podcastLength,
        }),
      });

      if (!response.ok) {
        throw new Error("Response from server was not ok");
      }

      const data = await response.json();
      setResponse(data); // Set the response data to the state variable
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false when form submission ends, whether it's a success or failure
    }
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Custom News For You
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Select a few features and listen to news that interests you.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        <div className="w-full max-w-md mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
          <form>
            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="top">General</option>
                <option value="business">Business</option>
                <option value="entertainment">Entertainment</option>
                <option value="environment">Environment</option>
                <option value="food">Food</option>
                <option value="health">Health</option>
                <option value="politics">Politics</option>
                <option value="science">Science</option>
                <option value="sports">Sports</option>
                <option value="technology">Technology</option>
                <option value="tourism">Tourism</option>
                <option value="world">World</option>
              </select>
            </div>

            {/* Podcast Length */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Podcast Length: {podcastLength} minutes
              </label>
              <input
                type="range"
                min="5"
                max="15"
                value={podcastLength}
                onChange={(e) => setPodcastLength(Number(e.target.value))}
                className="w-full text-green-50"
              />
            </div>
            <Button
              variant="recappd"
              disabled={loading} // Button is disabled when loading is true
              onClick={(e) => {
                e.preventDefault();
                handleSubmitForm();
              }}
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
            >
              {loading ? "Loading..." : "Get My Podcast"}
            </Button>
          </form>
          {/* Display the OpenAI response below the form */}
          {response && <p className="mt-5">{response}</p>}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
