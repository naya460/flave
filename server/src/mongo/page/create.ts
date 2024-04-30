import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export const createPage = async (data: {
  workspace_id: string;
  user_id: ObjectId;
  parent?: string;
  rdb_id?: string;
}) => {
  const date = new Date();

  const doc: {
    title: string;
    workspace: ObjectId;
    created_at: Date;
    created_by: ObjectId;
    updated_at: Date;
    updated_by: ObjectId;
    parent?: ObjectId;
    rdb?: ObjectId;
  } = {
    title: "New Page",
    workspace: new ObjectId(data.workspace_id),
    created_at: date,
    created_by: data.user_id,
    updated_at: date,
    updated_by: data.user_id,
  };
  if (data.parent !== undefined) {
    doc.parent = new ObjectId(data.parent);
  }
  if (data.rdb_id !== undefined) {
    doc.rdb = new ObjectId(data.rdb_id);
  }

  const result = await flvPageCollection.insertOne(doc);

  if (result.acknowledged) {
    return result.insertedId;
  } else {
    return null;
  }
};
