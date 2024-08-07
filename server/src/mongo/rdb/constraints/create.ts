import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";
import { v4 as uuid_v4 } from "uuid";

export async function createRdbConstrant(
  rdb_id: ObjectId,
  user_id: ObjectId,
  data: {
    constraint: {
      type: "unique" | "not null" | "check";
      option: object;
    };
  }
) {
  const constraint_id = uuid_v4();

  const result = await flvRdbCollection.updateOne(
    { _id: rdb_id },
    {
      $set: {
        updated_at: new Date(),
        updated_by: user_id,
      },
      $push: {
        constraints: {
          id: constraint_id,
          ...data.constraint,
        },
      },
    }
  );

  if (result.acknowledged === false) {
    return null;
  }
  return constraint_id;
}
