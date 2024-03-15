import { flvSessionCollection } from "mongo/collections/flave/session";

export async function getSession(session_id: string) {
  console.log("get session");

  const result = await flvSessionCollection
    .find({ session_id }, { projection: { user_id: true } })
    .toArray();

  if (result.length === 0) {
    return null;
  }
  return result[0];
}
