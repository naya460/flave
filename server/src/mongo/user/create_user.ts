import { mongoClient } from "lib/mongo";

export async function createUser(auth_id: string, name: string) {
  await mongoClient.db("flave").collection("user").insertOne({
    auth_id,
    name,
  });
}
