import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("beginning of function");

  //body doesn't have name and templateId anymore.
  //body returns articles data from newsdata api
  const baseUrl = "https://newsdata.io/api/1/news";
  const body = await req.json();
  const { category, podcastLength } = body;
  console.log(process.env.NEXT_PUBLIC_NEWS_API_KEY);
  const params = new URLSearchParams({
    apikey: process.env.NEXT_PUBLIC_NEWS_API_KEY as string,
    timeframe: "48",
    category: category as string,
    full_content: "1",
    size: podcastLength as string,
    language: "en",
  });
  console.log("params is good");

  try {
    console.log(params);
    const respo = await fetch(`${baseUrl}?${params.toString()}`);

    if (!respo.ok) {
      throw new Error(
        `Network response from newsdata api was not ok. Response body:`
      );
    }

    const data = await respo.json();

    console.log(
      "network response from newsdata was okay and came back as a json."
    );

    return NextResponse.json(data);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Failed to fetch news", { status: 500 });
  }
}
