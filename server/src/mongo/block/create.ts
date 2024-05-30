import { flvBlockCollection } from "mongo/collections/flave/block";
import { ObjectId } from "mongodb";

export async function createBlock(
  page: string,
  next_of: string | null,
  type: string,
  data: unknown,
  user_id: ObjectId
) {
  const date = new Date();

  const doc: {
    page: ObjectId;
    next_of: ObjectId | null;
    type: string;
    data: unknown;
    created_at: Date;
    created_by: ObjectId;
    updated_at: Date;
    updated_by: ObjectId;
  } = {
    page: new ObjectId(page),
    next_of: next_of === null ? null : new ObjectId(next_of),
    type: type,
    data: data,
    created_at: date,
    created_by: user_id,
    updated_at: date,
    updated_by: user_id,
  };

  const result = await flvBlockCollection.insertOne(doc);

  if (result.acknowledged) {
    await flvBlockCollection.updateOne(
      {
        $and: [
          { page: new ObjectId(page) },
          { next_of: next_of === null ? null : new ObjectId(next_of) },
          { _id: { $ne: result.insertedId } },
        ],
      },
      { $set: { next_of: result.insertedId } }
    );

    return result.insertedId;
  } else {
    return null;
  }
}
