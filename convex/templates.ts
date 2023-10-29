import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createRecappTemplate = mutation({
  args: {
    category: v.string(),
    podcastLength: v.number(),
    podcastInterval: v.number(),
    user_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    let templateId = "";
    if (args.user_id !== null) {
      templateId = await ctx.db.insert("template", {
        category: args.category,
        length: args.podcastLength,
        interval: args.podcastInterval,
        user_id: args.user_id,
      });
    }

    return templateId;
  },
});
export const deleteRecappTemplate = mutation({
  args: {
    id: v.id("template"),
  },
  handler: async (ctx, args) => {
    if (args.id !== null) {
      await ctx.db.delete(args.id);
    }

    return;
  },
});

export const getRecappTemplates = query({
  args: {
    user_id: v.union(v.id("users"), v.null()),
  },
  handler: async (ctx, args) => {
    // Ensure the user_id argument is provided
    if (!args.user_id) {
      return;
    }

    // Query the templates table for templates where user_id matches the provided user_id
    const templates = await ctx.db
      .query("template")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .order("desc")
      .take(100);

    return templates;
  },
});
