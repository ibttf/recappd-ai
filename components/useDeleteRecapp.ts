import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export default function useDeleteRecapp() {
  const deleteRecapp = useMutation(api.recapp.deleteRecapp);
  async function deleteRec({ recappId }: { recappId: Id<"recapp"> | null }) {
    const recapp = await deleteRecapp({
      id: recappId!,
    });
    return recapp;
  }
  return deleteRec;
}
