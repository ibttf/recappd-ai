import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function useCreateTemplateEffect() {
  const createRecappTemplate = useMutation(api.templates.createRecappTemplate);
  async function createTemplate({
    category,
    podcastLength,
    podcastInterval,
    userId,
  }: {
    category: string;
    podcastLength: number;
    podcastInterval: number;
    userId: Id<"users"> | null;
  }) {
    const template = await createRecappTemplate({
      category,
      podcastLength,
      podcastInterval,
      user_id: userId!,
    });
    return template;
  }
  return createTemplate;
}
