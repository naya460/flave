import { flvSessionCollection } from "mongo/collections/flave/session";
import { ObjectId } from "mongodb";
import { v4 } from "uuid";

export const createSession = async (user_id: ObjectId) => {
  const session_id = v4();

  const result = await flvSessionCollection.insertOne({
    session_id,
    user_id,
    created_at: new Date(),
  });

  if (result.acknowledged) {
    return session_id;
  } else {
    return null;
  }
};
