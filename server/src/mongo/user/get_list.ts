import { flvUserCollection } from "mongo/collections/flave/user";

export async function getUserList() {
  return await flvUserCollection
    .find({}, { projection: { name: true, auth_id: true, admin: true } })
    .toArray();
}
