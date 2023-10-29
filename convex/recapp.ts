import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createRecapp = mutation({
  args: {
    storageId: v.string(),
    transcript: v.string(),
    name: v.optional(v.string()),
    template_id: v.id("template"),
  },
  handler: async (ctx, args) => {
    if (args.template_id !== null) {
      const taskId = await ctx.db.insert("recapp", {
        storageId: args.storageId,
        transcript: args.transcript,
        name: args.name,
        template_id: args.template_id,
      });
    }

    return;
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

// export const getRecappTemplates = query({
//   args: {
//     template_id: v.id("template"),
//   },
//   handler: async (ctx, args) => {
//     // Ensure the template_id argument is provided
//     if (!args.template_id) {
//       return;
//     }

//     // Query the recapp table for recapps where template_id matches the provided template_id
//     const templates = await ctx.db
//       .query("recapp")
//       .filter((q) => q.eq(q.field("template_id"), args.template_id))
//       .order("desc")
//       .take(100);

//     return templates;
//   },
// });
