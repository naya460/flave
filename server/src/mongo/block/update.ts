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
  const target = await flvBlockCollection.findOneAndUpdate(
    { _id: new ObjectId(block_id) },
    {
      $set: {
        ...data,
        updated_at: new Date(),
        updated_by: user_id,
      },
    }
  );

  if (target !== null && data.next_of !== undefined) {
    // Reconnect the extracted locations
    await flvBlockCollection.updateOne(
      { page: target.page, next_of: new ObjectId(block_id) },
      { $set: { next_of: target.next_of } }
    );

    // Reconnect the inserted locations
    await flvBlockCollection.updateOne(
      {
        $and: [
          { page: target.page },
          { next_of: data.next_of },
          { _id: { $ne: new ObjectId(block_id) } },
        ],
      },
      { $set: { next_of: new ObjectId(block_id) } }
    );
  }

  return target !== null;
}
