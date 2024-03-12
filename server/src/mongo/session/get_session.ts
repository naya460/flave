import { flvSessionCollection } from "mongo/collections/flave/session";
import { ObjectId } from "mongodb";

export async function getSession(session_id: string) {
  return (
    await flvSessionCollection
      .find(
        { _id: new ObjectId(session_id) },
        { projection: { user_id: true } }
      )
      .toArray()
  )[0];
}
