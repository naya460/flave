import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export const recoverPage = async (page_id: ObjectId, user_id: ObjectId) => {
  const result = await flvPageCollection.updateOne(
    { _id: page_id },
    {
      $set: {
        deleted: false,
        updated_at: new Date(),
        updated_by: user_id,
      },
    }
  );

  return result.acknowledged;
};
