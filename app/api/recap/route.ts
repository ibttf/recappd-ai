import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import util from "util";

// HTTP client
const httpClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log("beginning of function");

  const baseUrl = "https://newsdata.io/api/1/news";
  const body = await req.json();
  const { category, podcastLength, name, templateId } = body;
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
      "Provide a 100-word summary or analysis of the text you're given in an informational way.",
  };
  try {
    const respo = await fetch(`${baseUrl}?${params.toString()}`);

    if (!respo.ok) {
      throw new Error("Network response from newsdata api was not ok");
    }

    const data = await respo.json();
    let res = "";

    console.log(
      "network response from newsdata api was okay and came back as a json."
    );

    let combined_content = "";
    for (const result of data.results) {
      combined_content += result.content;
    }

    // Split the combined content into three roughly equal chunks
    const totalLength = combined_content.length;
    const chunkLength = Math.ceil(totalLength / 4);
    const chunks = [
      combined_content.slice(0, chunkLength),
      combined_content.slice(chunkLength, chunkLength * 2),
      combined_content.slice(chunkLength * 2, chunkLength * 3),
      combined_content.slice(chunkLength * 3, totalLength), // this ensures that we get everything remaining in the last chunk
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
    const client: any = new TextToSpeechClient();
    const request: any = {
      input: { text: res },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };
    console.log("request is good");

    const [response] = await client.synthesizeSpeech(request);
    console.log("response", response);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile("./output.mp3", response.audioContent, "binary");

    console.log("Audio content written to file: output.mp3");

    const postUrl = await httpClient.mutation(api.recapp.generateUploadUrl);
    console.log("post url", postUrl);
    console.log(response.audioContent.slice(0, 50));

    const mpresult = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "audio/mpeg" },
      body: response.audioContent,
    });
    console.log("mpresult is good", mpresult);
    const { storageId } = await mpresult.json();
    console.log("storageid is good", storageId);

    const newRecapp = await httpClient.mutation(
      api.recapp.createRecappFunction,
      {
        name: name,
        storageId,
        transcript: res,
        template_id: templateId,
      }
    );
    // return NextResponse.json("hi");
    return NextResponse.json(newRecapp);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Failed to fetch news", { status: 500 });
  }
}
