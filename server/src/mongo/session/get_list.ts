import { flvSessionCollection } from "mongo/collections/flave/session";

export async function getSessionList() {
  return await flvSessionCollection
    .find({}, { projection: { user_id: true } })
    .toArray();
}
