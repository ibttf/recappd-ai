import OpenAI from "openai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { CreateChatCompletionRequestMessage } from "openai/resources/chat/index.mjs";

// HTTP client
const httpClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//body needs to take in data from prev post requst, name ,and templateId
export async function POST(req: Request) {
  console.log("starting gpt route");

  let instructionMessage: CreateChatCompletionRequestMessage = {
    role: "system",
    content:
      "Provide a 100-word summary or analysis of the text you're given in an informational way.",
  };
  let combined_content = "";
  const body = await req.json();
  let { data, name, templateId }: any = body;
  console.log(data, name, templateId);
  console.log("data", data);
  for (const result of data) {
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
  let res = "";
  for (const chunk of chunks) {
    try {
      console.log("creating open ai response.");
      const openaiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [instructionMessage, { role: "user", content: chunk }],
      });
      console.log("finished collecting open ai response");

      res += openaiResponse.choices[0].message.content;
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await delay(1000);
      }
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

  const newRecapp = await httpClient.mutation(api.recapp.createRecappFunction, {
    name: name,
    storageId,
    transcript: res,
    template_id: templateId,
  });

  return NextResponse.json(newRecapp);
}
