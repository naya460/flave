import { flvUserCollection } from "mongo/collections/flave/user";

export async function createUser(
  auth_id: string,
  hash: string,
  admin: boolean = false
) {
  const doc = {
    auth_id: auth_id,
    name: auth_id,
    hash: hash,
    admin: admin,
  };

  const result = await flvUserCollection.insertOne(doc);

  if (result.acknowledged === false) {
    return null;
  } else {
    return doc;
  }
}
