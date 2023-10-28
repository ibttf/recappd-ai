import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const instructionMessage: CreateChatCompletionRequestMessage = {
  role: "system",
  content: "Only provide a 100-word summary of the text you're given.",
};

export async function POST(req: Request) {
  const baseUrl = "https://newsdata.io/api/1/news";
  const body = await req.json();
  const { category, podcastLength } = body;
  const params = new URLSearchParams({
    apikey: process.env.NEWS_API_KEY as string,
    timeframe: "48",
    category: category,
    full_content: "1",
    size: podcastLength,
    language: "en",
  });
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    let arr = [] as any;
    console.log(data.results[0].content);
    data.results.map((result: any) => {
      //result.content is what we want to work with in open ai.
    });
    return NextResponse.json(arr);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Failed to fetch news", { status: 500 });
  }
}
