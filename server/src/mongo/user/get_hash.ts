import { flvUserCollection } from "mongo/collections/flave/user";

export async function getUserHash(auth_id: string) {
  const result = await flvUserCollection
    .find({ auth_id: auth_id }, { projection: { hash: true } })
    .toArray();

  if (result.length === 0) {
    return null;
  }

  return {
    id: result[0]._id,
    hash: result[0].hash,
  };
}
