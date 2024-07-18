import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export async function updateRdbProperty(
  rdb_id: ObjectId,
  user_id: ObjectId,
  data: {
    property: {
      id: string;
      name?: string;
    };
  }
) {
  const doc: {
    $set: {
      updated_at: Date;
      updated_by: ObjectId;
      "properties.$.id": string;
      "properties.$.name"?: string;
    };
  } = {
    $set: {
      updated_at: new Date(),
      updated_by: user_id,
      "properties.$.id": data.property.id,
    },
  };

  if (data.property.name !== undefined) {
    doc.$set["properties.$.name"] = data.property.name;
  }

  const result = await flvRdbCollection.updateOne(
    { _id: rdb_id, "properties.id": data.property.id },
    doc
  );

  return result.acknowledged;
}
