import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createRecappFunction = mutation({
  args: {
    name: v.string(),
    storageId: v.string(),
    transcript: v.string(),
    template_id: v.id("template"),
  },
  handler: async (ctx, args) => {
    let recap_id = "";
    if (args.template_id !== null) {
      recap_id = await ctx.db.insert("recapp", {
        name: args.name,
        storageId: args.storageId,
        transcript: args.transcript,
        template_id: args.template_id,
      });
    }

    return recap_id;
  },
});
export const deleteRecapp = mutation({
  args: {
    id: v.id("recapp"),
  },
  handler: async (ctx, args) => {
    if (args.id !== null) {
      await ctx.db.delete(args.id);
    }

    return;
  },
});

export const getRecapps = query({
  args: {
    template_ids: v.array(v.union(v.id("template"), v.null())),
  },
  handler: async (ctx, args) => {
    // Ensure the template_id argument is provided
    if (!args.template_ids) {
      return;
    }
    // console.log(args.template_ids);
    let recapps = [] as any[];
    for (const template_id of args.template_ids) {
      // console.log(template_id);
      recapps = recapps.concat(
        await ctx.db
          .query("recapp")
          .filter((q) => q.eq(q.field("template_id"), template_id))
          .collect()
      );
    }
    // Query the recapps table for recapps where template_id matches the provided template_id
    // console.log(recapps);
    return recapps;
  },
});
