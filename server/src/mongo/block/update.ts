import { flvBlockCollection } from "mongo/collections/flave/block";
import { ObjectId } from "mongodb";

export async function updateBlock(
  block_id: string,
  user_id: ObjectId,
  data: {
    next_of?: ObjectId | null;
    data?: unknown;
  }
) {
  const result = await flvBlockCollection.updateOne(
    { _id: new ObjectId(block_id) },
    {
      $set: {
        ...data,
        updated_at: new Date(),
        updated_by: user_id,
      },
    }
  );

  return result.acknowledged;
}
