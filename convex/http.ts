import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/getAudio",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);

    const storageId = searchParams.get("storageId")!;
    console.log("getting storage id", storageId);
    const byteArray = await ctx.storage.get(storageId);

    if (byteArray === null) {
      return new Response("Audio not found", {
        status: 404,
      });
    }

    return new Response(byteArray);
  }),
});

export default http;
