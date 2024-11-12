import {
  flvPageHistoryCollection,
  UpdateData,
} from "mongo/collections/flave/page_history";
import { ObjectId } from "mongodb";

export const createPageHistory = async (
  page_id: ObjectId,
  update_data: UpdateData,
  user_id: ObjectId
): Promise<string | null> => {
  const result = await flvPageHistoryCollection.insertOne({
    page_id,
    update_data,
    edited_at: new Date(),
    edited_by: user_id,
  });

  if (result.acknowledged) {
    return result.insertedId.toString();
  } else {
    return null;
  }
};
