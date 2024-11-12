import { flvBlockCollection } from "mongo/collections/flave/block";
import { createPageHistory } from "mongo/page_history/create";
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
    const tmp = await flvBlockCollection.updateOne(
      {
        $and: [
          { page: new ObjectId(page) },
          { next_of: next_of === null ? null : new ObjectId(next_of) },
          { _id: { $ne: result.insertedId } },
        ],
      },
      { $set: { next_of: result.insertedId } }
    );

    createPageHistory(
      new ObjectId(page),
      {
        type: "create_block",
        data: {
          block_id: result.insertedId,
          next_of: next_of === null ? null : new ObjectId(next_of),
          type,
          data,
        },
      },
      user_id
    );

    if (tmp.upsertedId !== null) {
      createPageHistory(
        new ObjectId(page),
        {
          type: "edit_block",
          data: {
            block_id: tmp.upsertedId,
            next_of: result.insertedId,
          },
        },
        user_id
      );
    }

    return result.insertedId;
  } else {
    return null;
  }
}
