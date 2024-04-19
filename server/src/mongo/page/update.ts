import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export const updatePage = async (
  page_id: string,
  title: string,
  user_id: ObjectId
) => {
  const result = await flvPageCollection.updateOne(
    { _id: new ObjectId(page_id) },
    {
      $set: {
        title,
        updated_at: new Date(),
        updated_by: user_id,
      },
    }
  );

  return result.acknowledged;
};
