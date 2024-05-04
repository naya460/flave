import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function updatePageProperty(
  page_id: ObjectId,
  user_id: ObjectId,
  data: {
    property: {
      id: string;
      value: unknown;
    };
  }
) {
  const result = await flvPageCollection.updateOne(
    { _id: page_id, "properties.id": data.property.id },
    {
      $set: {
        updated_at: new Date(),
        updated_by: user_id,
        "properties.$.value": data.property.value,
      },
    }
  );

  if (result.modifiedCount === 0) {
    const result = await flvPageCollection.updateOne(
      { _id: page_id },
      {
        $set: {
          updated_at: new Date(),
          updated_by: user_id,
        },
        $push: {
          properties: {
            id: data.property.id,
            value: data.property.value,
          },
        },
      }
    );

    if (result.acknowledged === false) {
      return false;
    }
  }

  return result.acknowledged;
}
