import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export const createPage = async (
  workspace_id: string,
  user_id: ObjectId,
  parent?: string
) => {
  const date = new Date();

  const doc: {
    title: string;
    workspace: ObjectId;
    created_at: Date;
    created_by: ObjectId;
    updated_at: Date;
    updated_by: ObjectId;
    parent?: ObjectId;
  } = {
    title: "New Page",
    workspace: new ObjectId(workspace_id),
    created_at: date,
    created_by: user_id,
    updated_at: date,
    updated_by: user_id,
  };
  if (parent !== undefined) {
    doc.parent = new ObjectId(parent);
  }

  const result = await flvPageCollection.insertOne(doc);

  if (result.acknowledged) {
    return result.insertedId;
  } else {
    return null;
  }
};
