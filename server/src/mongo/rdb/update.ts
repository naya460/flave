import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export async function updateRdb(
  rdb_id: ObjectId,
  title: string,
  user_id: ObjectId
) {
  const result = await flvRdbCollection.updateOne(
    { _id: rdb_id },
    {
      $set: {
        title,
        updated_at: new Date(),
        updated_by: user_id,
      },
    }
  );

  return result.acknowledged;
}
