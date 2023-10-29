"use client";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// HTTP client
console.log("next public convex url", process.env.NEXT_PUBLIC_CONVEX_URL!);
const httpClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log("beginning of function");

  const baseUrl = "https://newsdata.io/api/1/news";
  const body = await req.json();
  const { category, podcastLength, templateId } = body;
  const params = new URLSearchParams({
    apikey: process.env.NEWS_API_KEY as string,
    timeframe: "48",
    category: category,
    full_content: "1",
    size: podcastLength,
    language: "en",
  });
  console.log("params is good");

  let instructionMessage: CreateChatCompletionRequestMessage = {
    role: "system",
    content:
      "Provide a " +
      Math.ceil(podcastLength / 3) +
      "00-word summary or analysis of the text you're given in an informational way.",
  };
  try {
    // const respo = await fetch(`${baseUrl}?${params.toString()}`);

    // if (!respo.ok) {
    //   throw new Error("Network response was not ok");
    // }

    // const data = await respo.json();
    // let res = "";

    // let combined_content = "";
    // for (const result of data.results) {
    //   combined_content += result.content;
    // }

    // // Split the combined content into three roughly equal chunks
    // const chunkLength = Math.ceil(combined_content.length / 3);
    // const chunks = [
    //   combined_content.slice(0, chunkLength),
    //   combined_content.slice(chunkLength, chunkLength * 2),
    //   combined_content.slice(chunkLength * 2),
    // ];

    // // Send each chunk to OpenAI
    // for (const chunk of chunks) {
    //   try {
    //     const openaiResponse = await openai.chat.completions.create({
    //       model: "gpt-3.5-turbo",
    //       messages: [instructionMessage, { role: "user", content: chunk }],
    //     });

    //     res += openaiResponse.choices[0].message.content;
    //   } catch (error) {
    //     console.error("Error calling OpenAI:", error);
    //   }
    // }
    let res = "this is a fake audio file that i'm testing.";
    const client: any = new TextToSpeechClient();
    const request: any = {
      input: { text: res },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };
    console.log("request is good");

    const [response] = await client.synthesizeSpeech(request);
    const blob = new Blob(response.audioContent, { type: "audio/mp3" });
    const postUrl = await httpClient.mutation(api.recapp.generateUploadUrl);
    const mpresult = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": blob!.type },
      body: blob,
    });
    console.log("mpresult is good");
    const { storageId } = await mpresult.json();
    console.log("storageid is good");
    // createRecapp({
    //   name: "test",
    //   storageId,
    //   transcript: res,
    //   templateId,
    // });
    // console.log("createrecapp is good");
    return NextResponse.json({ file: blob, text: res });
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Failed to fetch news", { status: 500 });
  }
}
