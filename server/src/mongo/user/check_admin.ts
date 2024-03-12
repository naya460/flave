import { flvUserCollection } from "mongo/collections/flave/user";
import { ObjectId } from "mongodb";

export async function checkAdminUser(user_id: ObjectId) {
  return (
    (
      await flvUserCollection
        .find({ _id: user_id }, { projection: { admin: true } })
        .toArray()
    )[0].admin === true
  );
}
