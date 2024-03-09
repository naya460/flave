import { mongoClient } from "lib/mongo";

export async function getUserList() {
  return await mongoClient.db("flave").collection("user").find({}).toArray();
}
