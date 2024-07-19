import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export async function updateRdbProperty(
  rdb_id: ObjectId,
  user_id: ObjectId,
  data: {
    property: {
      id: string;
      name?: string;
      option?: object;
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
  } & {
    $set: {
      [key in `properties.$.option.${string}`]?: unknown;
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

  if (data.property.option !== undefined) {
    for (const [key, value] of Object.entries(data.property.option)) {
      doc.$set[`properties.$.option.${key}`] = value;
    }
  }

  const result = await flvRdbCollection.updateOne(
    { _id: rdb_id, "properties.id": data.property.id },
    doc
  );

  return result.acknowledged;
}
