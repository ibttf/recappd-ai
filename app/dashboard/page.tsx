"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
const DashboardPage = () => {
  const [category, setCategory] = useState<string>("Technology");
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
        <h2 className="text-2xl md:text-4xl font-bold text-center text-green-400">
          Create a Podcast
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Select the news you want to listen to and generate a podcast now.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        <div className="w-full h-full mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
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
                  onClick={() => setCategory(cat)}
                  className={`p-2 border rounded-md ${
                    category === cat ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>
          {/* Podcast Length */}
          <div className="w-full flex justify-center flex-col items-center gap-y-4 my-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Podcast Length: {podcastLength} minutes
            </label>
            <input
              type="range"
              min="5"
              max="15"
              value={podcastLength}
              onChange={(e) => setPodcastLength(Number(e.target.value))}
              className="w-1/2 mx-auto h-5 text-green-50 appearance-none bg-green-200 thumb:bg-green-200 thumb:rounded-md"
              style={{
                height: "10px",
                borderRadius: "5px",
                outline: "none",
                opacity: "0.7",
                transition: "opacity .2s",
              }}
            />
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
              {loading ? "Loading..." : "Get My Podcast"}
            </Button>
          </div>

          {/* Display the OpenAI response below the form */}
          {response && <p className="mt-5">{response}</p>}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
