import { flvSessionCollection } from "mongo/collections/flave/session";

export async function getSession(session_id: string) {
  return (
    await flvSessionCollection
      .find({ session_id }, { projection: { user_id: true } })
      .toArray()
  )[0];
}
