import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

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

  let instructionMessage: CreateChatCompletionRequestMessage = {
    role: "system",
    content:
      "Provide a " +
      Math.ceil(podcastLength / 3) +
      "00-word summary or analysis of the text you're given in an informational way.",
  };
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    let res = "";

    let combined_content = "";
    for (const result of data.results) {
      combined_content += result.content;
    }

    // Split the combined content into three roughly equal chunks
    const chunkLength = Math.ceil(combined_content.length / 3);
    const chunks = [
      combined_content.slice(0, chunkLength),
      combined_content.slice(chunkLength, chunkLength * 2),
      combined_content.slice(chunkLength * 2),
    ];

    // Send each chunk to OpenAI
    for (const chunk of chunks) {
      try {
        const openaiResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [instructionMessage, { role: "user", content: chunk }],
        });

        res += openaiResponse.choices[0].message.content;
      } catch (error) {
        console.error("Error calling OpenAI:", error);
      }
    }

    return NextResponse.json(res);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Failed to fetch news", { status: 500 });
  }
}
