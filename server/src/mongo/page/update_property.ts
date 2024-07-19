import { validate_property } from "flave_types/property_type";
import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function updatePageProperty(
  page_id: ObjectId,
  user_id: ObjectId,
  property: {
    id: string;
    value: object | string | boolean;
  }
) {
  if (
    (await validate_property(
      page_id.toString(),
      property.id,
      property.value
    )) === false
  ) {
    return false;
  }

  // update property
  const result = await flvPageCollection.updateOne(
    { _id: page_id, "properties.id": property.id },
    {
      $set: {
        updated_at: new Date(),
        updated_by: user_id,
        "properties.$.value": property.value,
      },
    }
  );

  // when this property does not exist
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
            id: property.id,
            value: property.value,
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
