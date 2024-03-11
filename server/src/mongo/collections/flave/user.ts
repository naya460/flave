import { mongoClient } from "lib/mongo";

type flvUserType = {
  name: string;
  auth_id: string;
  hash: string;
  admin?: boolean;
};

export const flvUserCollection = mongoClient
  .db("flave")
  .collection<flvUserType>("user");
