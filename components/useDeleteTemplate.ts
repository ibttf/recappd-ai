import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export default function useDeleteTemplate() {
  const deleteRecappTemplate = useMutation(api.templates.deleteRecappTemplate);
  async function deleteTemplate({
    templateId,
  }: {
    templateId: Id<"template"> | null;
  }) {
    const template = await deleteRecappTemplate({
      id: templateId!,
    });
  }
  return deleteTemplate;
}
