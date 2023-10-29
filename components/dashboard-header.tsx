"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Plus, Library, Clock, Calendar, Pencil, Check } from "lucide-react";

import useCreateTemplateEffect from "./useCreateTemplateEffect";

const DashboardHeader = ({ userId }: { userId: Id<"users"> | null }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [podcastName, setPodcastName] = useState<string>("");
  const categories = [
    "Top",
    "Business",
    "Entertainment",
    "Food",
    "Health",
    "Politics",
    "Science",
    "Sports",
    "Technology",
    "Tourism",
    "World",
  ];
  function goToLeftTab() {
    if (activeTab > 0) {
      setActiveTab((prevTab) => prevTab - 1);
    }
  }

  function goToRightTab() {
    if (activeTab < categories.length - 1) {
      setActiveTab((prevTab) => prevTab + 1);
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const createTemplate = useCreateTemplateEffect();

  const [name, setName] = useState<string>("Technology");
  const [category, setCategory] = useState<string>("Technology");
  const [podcastLength, setPodcastLength] = useState(4); // Initial value set to 0

  const [podcastInterval, setPodcastInterval] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);

  function incrementLength() {
    if (podcastLength < 10) {
      setPodcastLength((prevLength) => prevLength + 1);
    }
  }

  function decrementLength() {
    if (podcastLength > 2) {
      setPodcastLength((prevLength) => prevLength - 1);
    }
  }

  function incrementInterval() {
    if (podcastInterval < 7) {
      setPodcastInterval((prevInterval) => prevInterval + 1);
    }
  }

  function decrementInterval() {
    if (podcastInterval > 1) {
      setPodcastInterval((prevInterval) => prevInterval - 1);
    }
  }
  async function handleSubmitForm() {
    setLoading(true);
    try {
      let finalName = "";
      if (!name) {
        finalName = `${category} for ${podcastLength} minutes every ${podcastInterval} days`;
      } else {
        finalName = name;
      }
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
          name: finalName,
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
      closeModal();
    }
  }
  // Assuming category, podcastLength, and podcastInterval are available in this component's state or props:
  const defaultPlaceholder = `${category} for ${podcastLength} minutes every ${podcastInterval} days`;

  const panels = [
    <div key={1}>
      <Dialog.Title
        as="h3"
        className="text-4xl leading-8 text-green-900 py-16 text-center font-extrabold "
      >
        I want to follow this category of news.
      </Dialog.Title>
      <form>
        <div className="flex space-y-2 space-x-2 flex-wrap justify-center">
          {categories.map((cat, index) => (
            <button
              key={cat}
              onClick={(e) => {
                e.preventDefault();
                setCategory(cat);
              }}
              className={`justify-center w-fit h-fit rounded-md border border-transparent px-8 py-6 text-xl font-medium ${
                category === cat
                  ? "bg-green-100 text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </form>
    </div>,
    <div key={2}>
      <Dialog.Title
        as="h3"
        className="text-4xl leading-8 text-green-900 py-16 text-center font-extrabold"
      >
        I want my podcasts to be __ minutes long.
      </Dialog.Title>
      <div className="w-1/3 mx-auto">
        {/* Increment Button */}
        <button
          onClick={incrementLength}
          className="bg-green-500 w-full text-white font-bold py-2 rounded-t-md"
        >
          ↑
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={podcastLength}
          readOnly
          className="w-full text-center text-black font-extrabold text-7xl py-16 border-t border-b border-green-500 bg-white rounded-sm"
        />

        {/* Decrement Button */}
        <button
          onClick={decrementLength}
          className="bg-red-500 w-full text-white font-bold py-2 rounded-b-md"
        >
          ↓
        </button>
      </div>
    </div>,
    <div key={3}>
      <Dialog.Title
        as="h3"
        className="text-4xl leading-8 text-green-900 py-16 text-center font-extrabold"
      >
        I want to listen to this podcast every __ days
      </Dialog.Title>
      <div className="w-1/3 mx-auto">
        {/* Increment Button */}
        <button
          onClick={incrementInterval}
          className="bg-green-500 w-full text-white font-bold py-2 rounded-t-md"
        >
          ↑
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={podcastInterval}
          readOnly
          className="w-full text-center text-black font-extrabold text-7xl py-16 border-t border-b border-green-500 bg-white rounded-sm"
        />

        {/* Decrement Button */}
        <button
          onClick={decrementInterval}
          className="bg-red-500 w-full text-white font-bold py-2 rounded-b-md"
        >
          ↓
        </button>
      </div>
    </div>,
    <div key={4}>
      <Dialog.Title
        as="h3"
        className="text-4xl leading-8 text-green-900 py-16 text-center font-extrabold"
      >
        I&apos;d like to name this podcast ___. (Optional)
      </Dialog.Title>
      {/* Large TextInput */}
      <input
        type="text"
        value={podcastName}
        onChange={(e) => setPodcastName(e.target.value)}
        placeholder={defaultPlaceholder}
        className="w-full text-black font-extrabold text-4xl border-none outline-none focus:ring-0 bg-transparent border-b-2 border-green-500 focus:border-green-700"
      />
    </div>,
    <div key={5}>
      <Dialog.Title
        as="h3"
        className="text-4xl leading-8 text-green-900 py-16 text-center font-extrabold"
      >
        Are you ready to submit?
      </Dialog.Title>

      <div className="mt-8 flex flex-col items-center">
        {/* Generate My Template Button */}
        <button
          onClick={handleSubmitForm}
          className={`${
            loading
              ? "hover:cursor-disabled opacity-80"
              : "bg-green-500 hover:bg-green-600 opacity-100"
          } w-full md:w-2/3 lg:w-1/2 px-6 py-4 rounded-xl  text-white text-2xl font-bold focus:outline-none  transition-colors`}
        >
          {loading ? "Generating..." : "Recapp My News"}
        </button>

        {/* Warning */}
        <p className="mt-4 text-green-500 font-semibold text-center">
          This will take around 1-2 minutes, so hold tight!
        </p>
      </div>
    </div>,
  ];

  return (
    <div>
      <div className="mb-8 space-y-4 flex justify-between mx-12 items-center">
        <h2 className="text-2xl md:text-4xl font-bold  text-green-400">
          Following Recapps
        </h2>
        <div className="flex items-center flex-col justify-center mr-24 space-y-4">
          <button type="button" onClick={openModal} className="">
            <Plus className="text-white bg-green-400 rounded-full h-12 w-12 p-2 hover:bg-green-600 duration-200 hover:cursor-pointer"></Plus>
          </button>
        </div>
      </div>

      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-12 text-center ">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-12 text-left align-middle shadow-xl transition-all">
                    <div>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-grow space-x-4 bg-green-200 rounded-xl p-1">
                          <div
                            className={
                              activeTab === 0
                                ? "flex-grow flex justify-center items-center bg-green-600 text-white rounded-lg"
                                : "flex-grow flex justify-center items-center bg-green-200 text-white rounded-lg"
                            }
                          >
                            <Library size={32} className="my-4" />{" "}
                            {/* Lucide library icon */}
                          </div>
                          <div
                            className={
                              activeTab === 1
                                ? "flex-grow flex justify-center items-center bg-green-600 text-white rounded-lg"
                                : "flex-grow flex justify-center items-center bg-green-200 text-white rounded-lg"
                            }
                          >
                            <Clock size={32} className="my-4" />
                          </div>
                          <div
                            className={
                              activeTab === 2
                                ? "flex-grow flex justify-center items-center bg-green-600 text-white rounded-lg"
                                : "flex-grow flex justify-center items-center bg-green-200 text-white rounded-lg"
                            }
                          >
                            <Calendar size={32} className="my-4" />
                          </div>
                          <div
                            className={
                              activeTab === 3
                                ? "flex-grow flex justify-center items-center bg-green-600 text-white rounded-lg"
                                : "flex-grow flex justify-center items-center bg-green-200 text-white rounded-lg"
                            }
                          >
                            <Pencil size={32} className="my-4" />
                          </div>
                          <div
                            className={
                              activeTab === 4
                                ? "flex-grow flex justify-center items-center bg-green-600 text-white rounded-lg"
                                : "flex-grow flex justify-center items-center bg-green-200 text-white rounded-lg"
                            }
                          >
                            <Check size={32} className="my-4" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <div>
                          {panels[activeTab]}

                          <div className="flex justify-between mt-6">
                            <button
                              onClick={goToLeftTab}
                              disabled={activeTab === 0}
                              className={`px-4 py-2 rounded-l-md ${
                                activeTab === 0
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              ←
                            </button>

                            <button
                              onClick={goToRightTab}
                              disabled={activeTab === panels.length - 1}
                              className={`px-4 py-2 rounded-r-md ${
                                activeTab === panels.length - 1
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </div>
  );
};
export default DashboardHeader;
