"use client";
import React, { useState } from "react";

const NewsForm: React.FC = () => {
  const [category, setCategory] = useState<string>("technology");
  const [podcastLength, setPodcastLength] = useState<number>(10);
  const [response, setResponse] = useState<string>("");

  async function handleSubmitForm() {
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
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <main className="h-screen">
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
              className="w-full"
            />
          </div>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmitForm();
            }}
          >
            Get my podcast
          </button>
        </form>
      </div>
    </main>
  );
};

export default NewsForm;
