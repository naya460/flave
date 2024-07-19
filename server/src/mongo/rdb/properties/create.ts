import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";
import { v4 as uuid_v4 } from "uuid";

export async function createRdbProperty(
  rdb_id: ObjectId,
  user_id: ObjectId,
  data: {
    property: {
      type: string;
      name: string;
      option?: object;
    };
  }
) {
  const property_id = uuid_v4();

  const result = await flvRdbCollection.updateOne(
    { _id: rdb_id },
    {
      $set: {
        updated_at: new Date(),
        updated_by: user_id,
      },
      $push: {
        properties: {
          id: property_id,
          ...data.property,
        },
      },
    }
  );

  if (result.acknowledged === false) {
    return null;
  }
  return property_id;
}
