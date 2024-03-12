import { flvSessionCollection } from "mongo/collections/flave/session";
import { ObjectId } from "mongodb";

export const createSession = async (user_id: ObjectId) => {
  const result = await flvSessionCollection.insertOne({ user_id });

  if (result.acknowledged) {
    return result.insertedId;
  } else {
    return null;
  }
};
