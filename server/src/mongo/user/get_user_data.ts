import { flvUserCollection } from "mongo/collections/flave/user";
import { ObjectId } from "mongodb";

export async function getUserData(user_id: string) {
  return await flvUserCollection.findOne(
    { _id: new ObjectId(user_id) },
    { projection: { name: true } }
  );
}
