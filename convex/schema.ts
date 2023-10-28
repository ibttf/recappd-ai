import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_name", ["name"]),

  template: defineTable({
    category: v.string(),
    length: v.number(),
    interval: v.number(),
    user_id: v.id("users"), // This correlates with the ids of the 'users' table.
  })
    .index("by_category", ["category"])
    .index("by_length", ["length"])
    .index("by_user", ["user_id"]),

  recapp: defineTable({
    storageId: v.string(),
    transcript: v.string(),
    template_id: v.id("template"), // This correlates with the ids of the 'template' table.
  }).index("by_template", ["template_id"]),
});
