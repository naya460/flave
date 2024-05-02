import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export const createRdb = async (
  title: string,
  workspace: ObjectId,
  user_id: ObjectId
) => {
  const date = new Date();

  const result = await flvRdbCollection.insertOne({
    title,
    workspace,
    properties: [],
    created_at: date,
    created_by: user_id,
    updated_at: date,
    updated_by: user_id,
  });

  if (result.acknowledged === false) {
    return null;
  }
  return result.insertedId;
};
