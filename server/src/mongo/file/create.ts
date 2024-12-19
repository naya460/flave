import { flvFileCollection } from "mongo/collections/flave/file";
import { ObjectId } from "mongodb";

export const createFile = async (
  workspace_id: ObjectId,
  type: "image",
  data: string
) => {
  const result = await flvFileCollection.insertOne({
    workspace: workspace_id,
    type,
    data,
  });

  if (result.acknowledged) {
    return result.insertedId.toString();
  }
  return null;
};
