import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvSessionType = {
  session_id: string;
  user_id: ObjectId;
  created_at: Date;
};

export const flvSessionCollection = mongoClient
  .db("flave")
  .collection<flvSessionType>("session");

flvSessionCollection.createIndex(
  { created_at: 1 },
  { expireAfterSeconds: 3600 }
);
