import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export async function updateRdb(
  rdb_id: ObjectId,
  user_id: ObjectId,
  data: {
    title?: string;
    properties?: {
      id: string;
      type: string;
      name: string;
    };
  }
) {
  const doc: {
    $set: {
      title?: string;
      updated_at: Date;
      updated_by: ObjectId;
    };
    $push?: {
      properties?: {
        id: string;
        type: string;
        name: string;
      };
    };
  } = {
    $set: {
      updated_at: new Date(),
      updated_by: user_id,
    },
  };

  if (data.title !== undefined) {
    doc.$set.title = data.title;
  }

  if (data.properties !== undefined) {
    if (doc.$push === undefined) doc.$push = {};
    doc.$push.properties = data.properties;
  }

  const result = await flvRdbCollection.updateOne({ _id: rdb_id }, { ...doc });

  return result.acknowledged;
}
