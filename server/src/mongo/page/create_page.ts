import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export const createPage = async (workspace_id: string, user_id: ObjectId) => {
  const date = new Date();

  const result = await flvPageCollection.insertOne({
    title: "New Page",
    workspace: new ObjectId(workspace_id),
    created_at: date,
    created_by: user_id,
    updated_at: date,
    updated_by: user_id,
  });

  if (result.acknowledged) {
    return result.insertedId;
  } else {
    return null;
  }
};
