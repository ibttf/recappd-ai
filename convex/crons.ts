import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { db } from "./templates"; // Replace this with actual import
import { api } from "./_generated/api";
import httpClient from "./httpClient";

const crons = cronJobs();

// Utility to handle the logic for each interval
const handleIntervalLogic = async (interval) => {
  // Fetch templates with the specified interval from the database
  const templates = await db
    .table("templates")
    .where("interval", interval);

  // Loop through each template and run your specific function
  templates.forEach((template : any) => {
    const { id, category, length } = template;
    // Replace `yourSpecificFunction` with the actual function you want to run
    createRecapp(id, category, length);
  });
};

// Define cron jobs for each interval from 1 day to 7 days
for (let i = 1; i <= 7; i++) {
  crons.interval(`handle templates for ${i} day interval`, { days: i }, () =>
    handleIntervalLogic(i)
  );
}

const createRecapp = (templateId :any, category:any, length:any) => {
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
      throw new Error("Network response was not ok");
    }

    const data = await respo.json();
    let res = "";

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
    return;

};

export default crons;
