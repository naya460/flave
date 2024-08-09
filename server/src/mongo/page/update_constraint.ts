import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function updatePageConstraint(
  page_id: ObjectId,
  user_id: ObjectId,
  constraint: {
    id: string;
    result: boolean;
  }
) {
  // update property
  const result = await flvPageCollection.updateOne(
    { _id: page_id, "constraints.id": constraint.id },
    {
      $set: {
        updated_at: new Date(),
        updated_by: user_id,
        "constraints.$.result": constraint.result,
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
          constraints: {
            id: constraint.id,
            result: constraint.result,
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
